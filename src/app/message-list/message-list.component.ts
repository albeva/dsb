import { Component } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Message } from '../models/Message';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {

    editMessage?: Message;
    addNew: boolean;
    formGroup: FormGroup;



    constructor(public messageService: MessageService, private modalService: NgbModal) {}

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

    onNew(content) {
        this.editMessage = null;
        this.addNew = true;
        this.formGroup = this.createFormGroup({});
        this.open(content);
    }

    onEdit(content, message: Message) {
        this.addNew = false;
        this.editMessage = message;
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
                this.messageService.save(this.formGroup.value);
            }
        }, () => {});
    }

    onDelete(message: Message) {
        this.messageService.delete(message);
    }

}
