import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-access-denied',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnDestroy {

    private isAdminsubscription: Subscription;

    constructor(private userService: UserService, private router: Router) {
        this.isAdminsubscription = userService.isAdmin.subscribe(isAdmin => {
            if (isAdmin) {
                this.router.navigate(['/']);
            }
        });
    }


    ngOnDestroy() {
        if (this.isAdminsubscription) {
            this.isAdminsubscription.unsubscribe();
            this.isAdminsubscription = null;
        }
    }
}
