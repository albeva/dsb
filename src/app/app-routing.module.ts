import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { RosterComponent } from './roster/roster.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { MessageListComponent } from './message-list/message-list.component';
import { PromotionsComponent } from './promotions/promotions.component';

const routes: Routes = [
    {path: 'roster', component: RosterComponent, canActivate: [AuthGuard]},
    {path: 'messages', component: MessageListComponent, canActivate: [AuthGuard]},
    {path: 'promotions', component: PromotionsComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent },
    {path: '403', component: AccessDeniedComponent},
    {path: '', redirectTo: '/roster', pathMatch: 'full'}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
