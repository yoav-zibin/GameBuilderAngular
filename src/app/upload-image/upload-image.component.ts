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
  imageName: string = "No file chosen"
  isBoard: boolean
  selectedFiles: FileList
  height: number
  type: string;
  width: number
  uploadSucceds: boolean;
  userEmailEmpty: boolean;
  userIsAnonymous: boolean;

  constructor(
    private uploadService: UploadService,
    private afauth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.certified = false;
    this.isBoard = false;
    this.uploadSucceds = false;
    this.userIsAnonymous = this.afauth.auth.currentUser == null || this.afauth.auth.currentUser.isAnonymous;
    if (this.userIsAnonymous) {
      this.userEmailEmpty = true;
    } else {
      this.userEmailEmpty = this.afauth.auth.currentUser.email == null;
    }
  }

  fileEvent(event: any) {
    this.selectedFiles = event.target.files;
    let file = this.selectedFiles.item(0);
    this.imageName = file.name;
    let _URL = window.URL;
    let img: HTMLImageElement = document.createElement("img");
    let thisClass: UploadImageComponent = this;
    img.onload = function() {
      thisClass.height = img.height;
      thisClass.width = img.width;
    }
    img.src = _URL.createObjectURL(file);
    this.type = file.type.substring(("image/").length);
    if (this.type == "jpeg") {
      this.type = "jpg";
    }
  }

  reset() {
    this.isBoard = false;
    this.certified = false;
    this.imageName = "No file chosen";
    this.uploadSucceds = false;
  }

  triggerUploadButton() {
    document.getElementById('uploadImage').click();
  }

  uploadImage() {
    if (this.height < 10 || this.height > 1024 || this.width < 10 || this.width > 1024) {
      window.alert("Width and height should fall in range 0 ~ 1024.");

    } else if (this.isBoard && (this.height != 1024 && this.width != 1024)) {
      window.alert("Board image: either height = 1024 or width = 1024.");

    } else {
      let file = this.selectedFiles.item(0);
      let upload: Upload = new Upload(file);
      upload.isBoardImage = this.isBoard;
      upload.height = this.height;
      upload.width = this.width;
      upload.sizeInBytes = file.size;
      upload.type = "." + this.type;
      this.uploadService.pushUpload(upload);
      this.uploadSucceds = true;
    }
  }
}
