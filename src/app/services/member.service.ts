import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member } from '../models/Member';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

    private membersCollection: AngularFirestoreCollection<Member>;

    members: Observable<Member[]>;

    constructor(private db: AngularFirestore) {
        this.membersCollection = db.collection<Member>('members');
        this.members = this.membersCollection.snapshotChanges().pipe(
            map(actions => {
                const members = actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    const joinedTimestamp = <firestore.Timestamp><any>data.joined;
                    data.joined = joinedTimestamp.toDate();
                    if (data.leftDate) {
                        const leftDate = <firestore.Timestamp><any>data.leftDate;
                        data.leftDate = leftDate.toDate();
                    }
                    if (data.rankUpdated) {
                        const rankChanged = <firestore.Timestamp><any>data.rankUpdated;
                        data.rankUpdated = rankChanged.toDate();
                    }
                    return {id, ...data};
                });
                return members.sort((a, b) => {
                    const aN = a.character.toLowerCase();
                    const bN = b.character.toLowerCase();
                    return aN.localeCompare(bN);
                });
            })
        );
    }

    save(member: Member) {
        const copy = <any>Object.assign({}, member);
        copy.joined = firestore.Timestamp.fromDate(copy.joined);
        if (copy.leftDate) {
            copy.leftDate = firestore.Timestamp.fromDate(copy.leftDate);
        }
        if (copy.rankChanged) {
            copy.rankChanged = firestore.Timestamp.fromDate(copy.rankChanged);
        }
        delete copy.id;
        delete copy.rank;
        if (member.id) {
            this.membersCollection.doc(member.id).update(copy);
        } else {
            const id = this.db.createId();
            this.membersCollection.doc(id).set(copy);
        }
    }

    delete(member: Member) {
        this.membersCollection.doc(member.id).delete();
    }
}
