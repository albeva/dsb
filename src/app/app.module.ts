import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { environment } from '../environments/environment';

import { RankService } from './services/rank.service';
import { MemberService } from './services/member.service';
import { UserService } from './services/user.service';

import { AppComponent } from './app.component';
import { RosterComponent } from './roster/roster.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

import { AuthGuard } from './guards/auth.guard';


@NgModule({
    declarations: [
        AppComponent,
        RosterComponent,
        LoginComponent,
        AccessDeniedComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,

        GridModule,
        DropDownsModule,
        InputsModule,
        DateInputsModule,
        ButtonsModule,

        AppRoutingModule
    ],
    providers: [
        RankService,
        MemberService,
        UserService,
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
