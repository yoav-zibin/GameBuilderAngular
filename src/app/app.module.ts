import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';

//import * as firebase from 'firebase/app';

import { AppComponent } from './app.component';
import { PhoneloginComponent } from './phonelogin/phonelogin.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLoginComponent } from './user-login/user-login.component';
import {AuthService} from './auth.service'
import {AppRoutingModule} from './app-routing.module';

export const firebaseConfig = { 
	apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
  	authDomain: "universalgamemaker.firebaseapp.com",
  	databaseURL: "https://universalgamemaker.firebaseio.com",
  	projectId: "universalgamemaker",
  	storageBucket: "universalgamemaker.appspot.com",
  	messagingSenderId: "144595629077"
}; 

export const appRoutes: Routes = [
  {path: 'app', component: AppComponent},
  {path: 'phonelogin', component: PhoneloginComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'user', component: UserInfoComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    PhoneloginComponent,
    UserInfoComponent,
    UserLoginComponent
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
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
