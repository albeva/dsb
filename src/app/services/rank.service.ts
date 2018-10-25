import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Rank } from '../models/Rank';

@Injectable({
    providedIn: 'root'
})
export class RankService {

    rankCollection: AngularFirestoreCollection<Rank>;
    ranks: Observable<Rank[]>;

    constructor(public afs: AngularFirestore) {
        this.rankCollection = afs.collection<Rank>('rank', ref => ref.orderBy('index', 'asc'));
        this.ranks = this.rankCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

}
