import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Message } from '../models/Message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    messageCollection: AngularFirestoreCollection<Message>;
    messages: Observable<Message[]>;

    constructor(public afs: AngularFirestore) {
        this.messageCollection = afs.collection<Message>('messages', ref => ref.orderBy('title', 'asc'));
        this.messages = this.messageCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }


    save(message: Message) {
        const copy = <any>Object.assign({}, message);
        const id = message.id || this.afs.createId();
        delete copy.id;
        this.messageCollection.doc(id).set(copy);
    }

    delete(message: Message) {
        this.messageCollection.doc(message.id).delete();
    }
}
