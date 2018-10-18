import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // return this.userService.isAdmin.pipe(map(isAdmin => {
        //     console.log("isAdmin = ${isAdmin})");
        //     if (!isAdmin) {
        //         this.router.navigate(['/login']);
        //     }
        //     return isAdmin;
        // }));
        return this.userService.user.pipe(map((user) => {
            if (!user) {
                this.router.navigate(['/login']);
                return false;
            }
            if (!user.admin) {
                this.router.navigate(['/403']);
                return false;
            }
            return true;
        }));
    }
}
