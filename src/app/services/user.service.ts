import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userDoc: AngularFirestoreDocument<User>;

    user: Observable<User>;
    isAdmin: Observable<boolean>;

    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
        this.user = this.afAuth.authState.pipe(switchMap(user => {
            if (user) {
                return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            }
            return of(null);
        }));

        this.isAdmin = this.user.pipe(map(user => {
            if (user) {
                return user.admin;
            }
            return false;
        }));
    }

    login() {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(() => {
            this.router.navigate(['/']);
        });
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}
