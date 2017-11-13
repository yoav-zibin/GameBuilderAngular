import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule} from 'angularfire2';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BuildSpecComponent } from './spec-builder/build-spec/build-spec.component';
import { CreateElementComponent } from './create-element/create-element.component';
import { environment } from '../environments/environment';
import { FinalizeSpecComponent } from './spec-builder/finalize-spec/finalize-spec.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleLoginComponent } from './google-login/google-login.component';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdSelectModule,
  MdStepperModule,
  MdTooltipModule,
} from '@angular/material';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { NgModule } from '@angular/core';
import { PhoneloginComponent } from './phonelogin/phonelogin.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule, Routes } from '@angular/router';
import { SelectBoardComponent } from './spec-builder/select-board/select-board.component';
import { SpecBuilderComponent } from './spec-builder/spec-builder.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UploadImageComponent } from './upload-image/upload-image.component';

export const firebaseConfig = { 
	  apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
  	authDomain: "universalgamemaker.firebaseapp.com",
  	databaseURL: "https://universalgamemaker.firebaseio.com",
  	projectId: "universalgamemaker",
  	storageBucket: "universalgamemaker.appspot.com",
  	messagingSenderId: "144595629077"
};

/*
//OLD SPEC CONFIG
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
  {path: 'build', component: SpecBuilderComponent},
  {path: 'createElement', component: CreateElementComponent},
  {path: 'googleLogin', component: GoogleLoginComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'phonelogin', component: PhoneloginComponent},
  {path: 'uploadImage', component: UploadImageComponent},
  {path: 'user', component: UserInfoComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    BuildSpecComponent,
    CreateElementComponent,
    FinalizeSpecComponent,
    GoogleLoginComponent,
    PhoneloginComponent,
    SelectBoardComponent,
    SpecBuilderComponent,
    UploadImageComponent,
    UserInfoComponent,
    UserLoginComponent,
  ],
  exports: [
  	AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    MdButtonModule,
    MdCheckboxModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdSelectModule,
    MdStepperModule,
    MdTooltipModule,
    Ng2ImgMaxModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
