import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../models/Message';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent {

    @Input() message: Message;
    @Output() edit = new EventEmitter<Message>();
    @Output() delete = new EventEmitter<Message>();

    constructor() { }

    onCopy() {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.message.text;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }


    onEdit() {
        this.edit.emit(this.message);
    }


    onDelete() {
        if (confirm(`Delete "${this.message.title}"?`)) {
            this.delete.emit(this.message);
        }
    }

}
