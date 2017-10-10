import {environment} from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AuthService} from './auth.service';

//import * as firebase from 'firebase/app';

import { AppComponent } from './app.component';
import { PhoneloginComponent } from './phonelogin/phonelogin.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { GoogleLoginComponent } from './google-login/google-login.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


export const firebaseConfig = { 
	apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
  	authDomain: "universalgamemaker.firebaseapp.com",
  	databaseURL: "https://universalgamemaker.firebaseio.com",
  	projectId: "universalgamemaker",
  	storageBucket: "universalgamemaker.appspot.com",
  	messagingSenderId: "144595629077"
}; 

export const appRoutes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: 'app', component: AppComponent},
  {path: 'phonelogin', component: PhoneloginComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'user', component: UserInfoComponent},
  {path: 'googleLogin', component: GoogleLoginComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    PhoneloginComponent,
    UserInfoComponent,
    UserLoginComponent,
    GoogleLoginComponent,
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
    BsDropdownModule.forRoot()
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
