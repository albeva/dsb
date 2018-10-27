import { Component } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Message } from '../models/Message';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {

    addNew: boolean;
    formGroup: FormGroup;
    activeIds: string[];

    constructor(public messageService: MessageService, private modalService: NgbModal) {
        const ids = localStorage.getItem('MessageListComponent.activeIds');
        if (ids) {
            this.activeIds = JSON.parse(ids);
        } else {
            this.activeIds = [];
        }
    }

    // UI state handling

    panelChange(event: NgbPanelChangeEvent) {
        if (event.nextState) {
            this.stateOpen(event.panelId);
        } else {
            this.stateClose(event.panelId);
        }
    }

    private stateOpen(panelId: string) {
        this.activeIds.push(panelId);
        this.saveState();
    }

    private stateClose(panelId: string) {
        this.activeIds = this.activeIds.filter(id => id !== panelId);
        this.saveState();
    }

    private saveState() {
        const json = JSON.stringify(this.activeIds);
        localStorage.setItem('MessageListComponent.activeIds', json);
    }

    // edit / new form

    createFormGroup(msg: Message|any) {
        return new FormGroup({
            'id': new FormControl(msg.id),
            'title': new FormControl(msg.title, Validators.required),
            'text': new FormControl(msg.text, Validators.required)
        });
    }

    get title(): any {
        return this.formGroup.controls.title;
    }

    get text(): any {
        return this.formGroup.controls.text;
    }

    // handle new / edit

    onNew(content) {
        this.addNew = true;
        this.formGroup = this.createFormGroup({});
        this.open(content);
    }

    onEdit(content, message: Message) {
        this.addNew = false;
        this.formGroup = this.createFormGroup(message);
        this.open(content);
    }

    private open(content) {
        const config: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            centered: true
        };
        this.modalService.open(content, config).result.then((result) => {
            if (this.formGroup && this.formGroup.valid) {
                const id = this.messageService.save(this.formGroup.value);
                this.stateOpen(id);
            }
        }, () => {});
    }

    onDelete(message: Message) {
        this.messageService.delete(message);
        this.stateClose(message.id);
    }

}
