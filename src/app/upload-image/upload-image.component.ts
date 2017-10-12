import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { Upload } from './upload';
import { UploadService } from './upload-image.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-upload-image',
  providers: [UploadService],
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {
  certified: boolean
  isBoard: boolean
  selectedFiles: FileList
  height: number
  width: number
  uploadSucceds: boolean;
  userIsAnonymous: boolean;

  constructor(
    private uploadService: UploadService,
    private afauth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.certified = false;
    this.isBoard = false;
    this.uploadSucceds = false;
    this.userIsAnonymous = this.afauth.auth.currentUser.isAnonymous;
  }

  fileEvent(event: any) {
    this.selectedFiles = event.target.files;
    let file = this.selectedFiles.item(0);

    let _URL = window.URL;
    let img: HTMLImageElement = document.createElement("img");
    let thisClass: UploadImageComponent = this;
    img.onload = function() {
      thisClass.height = img.height;
      thisClass.width = img.width;
    }
    img.src = _URL.createObjectURL(file);
  }

  uploadImage() {
    let file = this.selectedFiles.item(0);
    let upload: Upload = new Upload(file);
    upload.is_board_image = this.isBoard;
    upload.height = this.height;
    upload.width = this.width;
    this.uploadService.pushUpload(upload);
    this.uploadSucceds = true;
  }

  reset() {
    this.uploadSucceds = false;
  }
}
