import {environment} from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AuthService} from './auth/auth.service';

//import * as firebase from 'firebase/app';

import { AppComponent } from './app.component';
import { PhoneloginComponent } from './phonelogin/phonelogin.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { SpecBuilderComponent } from './spec-builder/spec-builder.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule, MatStepperModule } from '@angular/material';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { SelectBoardComponent } from './select-board/select-board.component';
import { BuildSpecComponent } from './build-spec/build-spec.component';
import { DraggableDirective } from './dnd/draggable.directive';
import { DroppableDirective } from './dnd/droppable.directive';
import { FinalizeSpecComponent } from './finalize-spec/finalize-spec.component';

export const firebaseConfig = { 
	  apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
  	authDomain: "universalgamemaker.firebaseapp.com",
  	databaseURL: "https://universalgamemaker.firebaseio.com",
  	projectId: "universalgamemaker",
  	storageBucket: "universalgamemaker.appspot.com",
  	messagingSenderId: "144595629077"
};

/*
export const firebaseConfig = {
    apiKey: "AIzaSyD6Q8YS9-rbhCXFR5crQLp-5oUfGaNyDKQ",
    authDomain: "tutorial-6ea2e.firebaseapp.com",
    databaseURL: "https://tutorial-6ea2e.firebaseio.com",
    projectId: "tutorial-6ea2e",
    storageBucket: "tutorial-6ea2e.appspot.com",
    messagingSenderId: "424710997339"
};
*/

export const appRoutes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: 'app', component: AppComponent},
  {path: 'phonelogin', component: PhoneloginComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'user', component: UserInfoComponent},
  {path: 'googleLogin', component: GoogleLoginComponent},
  {path: 'uploadImage', component: UploadImageComponent},
  {path: 'build', component: SpecBuilderComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    PhoneloginComponent,
    UserInfoComponent,
    UserLoginComponent,
    GoogleLoginComponent,
    UploadImageComponent,
    SpecBuilderComponent,
    ProgressBarComponent,
    SelectBoardComponent,
    BuildSpecComponent,
    DraggableDirective,
    DroppableDirective,
    FinalizeSpecComponent,
  ],
  exports: [
  	AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    MatGridListModule,
    MatStepperModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
