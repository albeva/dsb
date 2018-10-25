import { Component, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { Rank } from '../models/Rank';
import { Member } from '../models/Member';
import { RankService } from '../services/rank.service';
import { MemberService } from '../services/member.service';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, GridComponent  } from '@progress/kendo-angular-grid';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

// Form for editing the row

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
    selector: 'app-roster',
    templateUrl: './roster.component.html',
    styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit, OnDestroy {

    static defaultRank: Rank = {
        color: 'black',
        name: 'Member',
        id: ''
    };

    gridView: GridDataResult;
    sortDesc: SortDescriptor[];
    skip = 0;
    pageSize = 10;
    ranks: Rank[] = [];
    isNew: boolean;
    formGroup: FormGroup;
    activeMembers = true;

    @ViewChild(GridComponent)
    private grid: GridComponent;

    private members: Member[] = [];
    private allMembers: Member[] = [];
    private membersSubscription: Subscription;
    private rankSubscription: Subscription;
    private search = '';

    private editedRowIndex: number;
    private docClickSubscription: any;
    private isAdminSubscription: any;

    constructor(private memberService: MemberService, private rankService: RankService,
                private renderer: Renderer2, private userService: UserService,
                private router: Router) {
        this.isAdminSubscription = userService.isAdmin.subscribe(isAdmin => {
            if (!isAdmin) {
                window.location.reload(true);
            }
        });
        this.rankSubscription = rankService.ranks.subscribe(ranks => {
            this.ranks = ranks;
            this.updateRanks();
            this.loadItems();
        });
        this.membersSubscription = memberService.members.subscribe(members => {
            this.allMembers = members;
            this.updateRanks();
            this.members = this.sort(this.filter(this.allMembers));
            this.loadItems();
        });
    }

    ngOnInit() {
        this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    }

    ngOnDestroy() {
        if (this.rankSubscription) {
            this.rankSubscription.unsubscribe();
            this.rankSubscription = null;
        }

        if (this.membersSubscription) {
            this.membersSubscription.unsubscribe();
            this.membersSubscription = null;
        }

        if (this.docClickSubscription) {
            this.docClickSubscription();
            this.docClickSubscription = null;
        }

        if (this.isAdminSubscription) {
            this.isAdminSubscription.unsubscribe();
            this.isAdminSubscription = null;
        }
    }

    // ----- show active / inactive members

    toggleActiveMembers() {
        this.closeEditor();
        this.activeMembers = !this.activeMembers;
        this.skip = 0;
        this.members = this.sort(this.filter(this.allMembers));
        this.loadItems();
    }

    quitGuildHandler() {
        const index = this.editedRowIndex;
        this.closeEditor();
        const member = this.members[index];
        if (confirm(`Member '${member.character}' quit the guild?`)) {
            member.left = true;
            this.memberService.save(member);
        }
    }

    rejoinGuildHandler() {
        const index = this.editedRowIndex;
        this.closeEditor();
        const member = this.members[index];
        if (confirm(`Member '${member.character}' rejoined the guild?`)) {
            member.left = false;
            this.memberService.save(member);
        }
    }

    // ----- Editing

    createFormGroup(dataItem: Member|any) {
        return new FormGroup({
            'id': new FormControl(dataItem.id),
            'character': new FormControl(dataItem.character, [Validators.required, (control: AbstractControl) => {
                const value = (control.value || '').toLowerCase();
                const id = dataItem.id;

                if (this.allMembers.find(member => member.character.toLowerCase() === value && member.id !== id)) {
                    return {
                        'custom': 'Member with this character already exists'
                    };
                }
                return null;
            }]),
            'legacy': new FormControl(dataItem.legacy),
            'website': new FormControl(dataItem.website),
            'discordId': new FormControl(dataItem.discordId),
            'rankId': new FormControl(dataItem.rankId, Validators.required),
            'joined': new FormControl(dataItem.joined, Validators.required),
            'notes':  new FormControl(dataItem.notes)
        });
    }

    addNewMemberHandler() {
        this.isNew = true;
        this.formGroup = this.createFormGroup({
            rankId: this.ranks[0].id,
            joined: new Date()
        });
        this.grid.addRow(this.formGroup);
    }

    saveHandler() {
        if (this.formGroup && this.formGroup.valid) {
            this.saveCurrent();
        }
    }

    cancelHandler() {
        this.closeEditor();
    }

    deleteHandler() {
        const index = this.editedRowIndex;
        this.closeEditor();
        const member = this.members[index];
        if (confirm(`Delete ${member.character}?`)) {
            this.memberService.delete(member);
        }
    }

    cellClickHandler({isEdited, columnIndex, dataItem, rowIndex}) {
        if (isEdited || this.isNew || (this.formGroup && (!this.formGroup.valid || !this.formGroup.pristine))) {
            return;
        }

        this.closeEditor();

        this.formGroup = this.createFormGroup(dataItem);
        this.editedRowIndex = rowIndex;
        this.grid.editRow(rowIndex, this.formGroup);

        setTimeout(() => {
            const el = document.querySelector(`.k-grid-edit-row > td:nth-child(${columnIndex + 1})`);
            const input = el.querySelector('input');
            if (input) {
                input.focus();
                return;
            }
        });
    }

    private saveCurrent() {
        if (this.formGroup && this.formGroup.valid) {
            this.memberService.save(this.formGroup.value);
        }
        this.closeEditor();
    }

    private closeEditor() {
        this.grid.closeRow(this.editedRowIndex);
        this.isNew = false;
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    private onDocumentClick(e: any) {
        if (!this.isNew
            && this.formGroup
            && this.formGroup.valid
            && this.formGroup.pristine
            && !matches(e.target, '#membersGrid tbody *, #membersGrid .k-grid-toolbar .k-button')) {
            this.closeEditor();
        }
    }

    // ----- Sorting & filtering callbacks

    sortChange(sortDesc: SortDescriptor[]) {
        this.sortDesc = sortDesc;
        this.skip = 0;
        this.members = this.sort(this.members);
        this.loadItems();
    }

    pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.loadItems();
    }

    filterChanged(s: string) {
        this.search = s;
        this.skip = 0;
        this.members = this.sort(this.filter(this.allMembers));
        this.loadItems();
    }

    // ----- Filter & sort

    private loadItems() {
        this.gridView = {
            data: this.members.slice(this.skip, this.skip + this.pageSize),
            total: this.members.length
        };
    }

    private filter(members: Member[]): Member[] {
        const s = this.search.trim().toLowerCase();
        return members.filter(member => {
            if (this.activeMembers && member.left === true) {
                return false;
            } else if (!this.activeMembers && member.left !== true) {
                return false;
            }
            if (s.length === 0) {
                return true;
            }
            return member.character.toLowerCase().indexOf(s) !== -1
                || (member.legacy && member.legacy.toLowerCase().indexOf(s) !== -1)
                || member.rank.name.toLowerCase().indexOf(s) !== -1
                || (member.notes && member.notes.toLowerCase().indexOf(s) !== -1)
                || (member.discordId && member.discordId.toLowerCase().indexOf(s) !== -1)
                || (member.website && member.website.toLowerCase().indexOf(s) !== -1);
        });
    }

    private sort(members: Member[]): Member[] {
        if (!this.sortDesc || this.sortDesc.length === 0) {
            return members;
        }
        return orderBy(members, this.sortDesc);
    }

    // ----- Update member ranks

    private updateRanks() {
        for (const member of this.allMembers) {
            member.rank = this.ranks.find(rank => rank.id === member.rankId) || RosterComponent.defaultRank;
        }
    }
}
