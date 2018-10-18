import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { RosterComponent } from './roster/roster.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

const routes: Routes = [
    {path: 'roster', component: RosterComponent, canActivate: [AuthGuard] },
    {path: 'login', component: LoginComponent },
    {path: '403', component: AccessDeniedComponent},
    {path: '', redirectTo: '/roster', pathMatch: 'full'}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
