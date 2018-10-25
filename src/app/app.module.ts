// Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
//  Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
// Bootstrap
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// Kendo
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// environment
import { environment } from '../environments/environment';
// App services
import { RankService } from './services/rank.service';
import { MemberService } from './services/member.service';
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';
// App components
import { AppComponent } from './app.component';
import { RosterComponent } from './roster/roster.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { MessageComponent } from './message/message.component';
import { MessageListComponent } from './message-list/message-list.component';
// App utilties
import { AuthGuard } from './guards/auth.guard';


@NgModule({
    declarations: [
        AppComponent,
        RosterComponent,
        LoginComponent,
        AccessDeniedComponent,
        MessageComponent,
        MessageListComponent
    ],
    imports: [
        // angular
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        // firebase
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        // kendo
        GridModule,
        DropDownsModule,
        InputsModule,
        DateInputsModule,
        ButtonsModule,
        // bootstrap
        NgbModalModule,
        // app stuff
        AppRoutingModule
    ],
    providers: [
        RankService,
        MemberService,
        UserService,
        MessageService,
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
