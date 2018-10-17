import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { PapaParseModule } from 'ngx-papaparse';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { RosterComponent } from './roster/roster.component';

import { RankService } from './services/rank.service';
import { MemberService } from './services/member.service';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@NgModule({
    declarations: [
        AppComponent,
        RosterComponent
    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        PapaParseModule,
        GridModule,
        BrowserAnimationsModule,
        DropDownsModule,
        InputsModule,
        FormsModule,
        ReactiveFormsModule,
        DateInputsModule,
        ButtonsModule
    ],
    providers: [
        RankService,
        MemberService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
