import { Component, OnDestroy } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Member } from '../models/Member';
import { Rank } from '../models/Rank';
import { Subscription } from 'rxjs';
import { RankService } from '../services/rank.service';
import { RosterComponent } from '../roster/roster.component';

interface PromoteMember {
    daysActive: number;
    promoteTo?: Rank;
    demoteTo?: Rank;
    remove: boolean;
    period: number;
    member: Member;
    lastChange: Date;
}

interface Threshold {
    required: number;
    rank: Rank;
}

@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnDestroy {

    members: PromoteMember[] = [];
    ranks: Rank[] = [];
    thresholds: Threshold[] = [];
    private allMembers: Member[] = [];
    private membersSubscription: Subscription;
    private rankSubscription: Subscription;

    constructor(private memberService: MemberService, rankService: RankService) {
        // for each member
        // - calculate days since joined
        // - see if no days since join makes eligible for promotion from current rank
        this.rankSubscription = rankService.ranks.subscribe(ranks => {
            this.ranks = ranks;
            this.calculateTresholds();
            if (this.allMembers.length) {
                this.updateRanks();
                this.members = this.filter(this.allMembers);
            }
        });
        this.membersSubscription = memberService.members.subscribe(members => {
            this.allMembers = members;
            if (this.ranks.length) {
                this.updateRanks();
                this.members = this.filter(members);
            }
        });
    }

    ngOnDestroy() {
        if (this.membersSubscription) {
            this.membersSubscription.unsubscribe();
            this.membersSubscription = null;
        }
        if (this.rankSubscription) {
            this.rankSubscription.unsubscribe();
            this.rankSubscription = null;
        }
    }

    promote(pm: PromoteMember) {
        const member = pm.member;
        const rank = pm.promoteTo;
        if (confirm(`Promote '${member.character}' to ${rank.name}?`)) {
            member.rank = rank;
            member.rankId = rank.id;
            member.rankUpdated = new Date();
            this.memberService.save(member);
        }
    }

    demote(pm: PromoteMember) {
        const member = pm.member;
        const rank = pm.demoteTo;
        if (confirm(`Demote '${member.character}' to ${rank.name} due to inactivity?`)) {
            member.rank = rank;
            member.rankId = rank.id;
            member.rankUpdated = new Date();
            this.memberService.save(member);
        }
    }

    remove(pm: PromoteMember) {
        const member = pm.member;
        if (confirm(`Remove '${member.character}' from guild for being inactive?`)) {
            member.left = true;
            member.leftDate = new Date();
            member.notes = `Removed from guild due to inactivity. ${member.notes || ''}`.trim();
            this.memberService.save(member);
        }
    }

    hide(pm: PromoteMember) {
        const member = pm.member;
        if (confirm(`Hide '${member.character}' for ${pm.period} days?`)) {
            member.rankUpdated = new Date();
            this.memberService.save(member);
        }
    }

    private calculateTresholds() {
        let required = 0;
        for (const rank of this.ranks) {
            if (required > 0) {
                this.thresholds.unshift({required, rank});
            }
            if (typeof rank.promoteAfter !== 'number') {
                break;
            }
            required += rank.promoteAfter;
        }
    }

    private filter(members: Member[]): PromoteMember[] {
        const result: PromoteMember[] = [];
        const today = new Date();
        // if promotion no longer possible show button "hide" (updates the date)
        // demote by 1 rank if daysActive >= demoteAfter
        // for acolyte offer option to remove from guild instead of demote
        for (const member of members) {
            if (member.left === true) {
                continue;
            }

            const rank = member.rank;
            let demoteTo = null;
            let promoteTo = null;
            const lastChange = member.rankUpdated || member.joined;
            const daysActive = this.daysBetween(today, lastChange);
            let include = false;
            let removable = false;
            let period = 0;
            if (typeof rank.promoteAfter === 'number') {
                const next = this.thresholds.find(t => t.required <= daysActive);
                if (next && next.rank.index > rank.index) {
                    promoteTo = next.rank;
                    include = true;
                    period = rank.promoteAfter;
                }
            }

            if (typeof rank.demoteAfter === 'number') {
                if (daysActive >= rank.demoteAfter) {
                    demoteTo = rank.index > 0 ? this.ranks[rank.index - 1] : null;
                    include = true;
                    removable = demoteTo === null;
                    period = rank.demoteAfter;
                }
            }
            if (include) {
                result.push({
                    daysActive: daysActive,
                    promoteTo: promoteTo,
                    demoteTo: demoteTo,
                    period: period,
                    remove: removable,
                    member: member,
                    lastChange: lastChange
                });
            }
        }
        return result;
    }

    private daysBetween(date1: Date, date2: Date): number {
        const diff = Math.abs(date1.valueOf() - date2.valueOf());
        return Math.round(diff / (1000 * 3600 * 24));
    }

    private updateRanks() {
        for (const member of this.allMembers) {
            member.rank = this.ranks.find(rank => rank.id === member.rankId) || RosterComponent.defaultRank;
        }
    }
}
