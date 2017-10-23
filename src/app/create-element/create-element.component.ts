import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImageSelectionService } from './imageSelection.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import * as firebase from 'firebase';

enum Types {
  card,
  cardsDeck,
  dice,
  piecesDeck,
  standard,
  toggable
}

@Component({
  selector: 'app-create-element',
  providers: [ImageSelectionService],
  templateUrl: './create-element.component.html',
  styleUrls: ['./create-element.component.css']
})
export class CreateElementComponent implements OnInit {
  basePath: string = "gameBuilder/elements/";
  elementCreated: boolean = false;
  elementType: string;
  faceNumber: number;
  hideSubmitButton: boolean = true;
  images: any;
  isDraggable: boolean = false;
  isDrawable: boolean = false;
  rotatableDegrees: number = 1;
  selectedImages: any = [];
  userIsAnonymous: boolean;
  

  constructor(
    private imageSelectionService: ImageSelectionService,
    private af: AngularFireDatabase,
    private afauth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.userIsAnonymous = (this.afauth.auth.currentUser == null) || 
                            this.afauth.auth.currentUser.isAnonymous;
    this.images = this.imageSelectionService.getImages();
  }

  select(image) {
    if (this.selectedImages.length < this.faceNumber && this.selectedImages.indexOf(image) == -1) {
      this.selectedImages.push(image);
    } else if (this.selectedImages.length <= this.faceNumber && this.selectedImages.indexOf(image) != -1) {
      this.selectedImages.splice(this.selectedImages.indexOf(image), 1);
    }

    this.validateImages();
  }

  reset() {
    this.elementCreated = false;
  }

  submit() {
    if (this.rotatableDegrees < 1 || this.rotatableDegrees > 360) {
      window.alert("Rotatable degrees must fall in range 1 ~ 360");
      return;
    }
    let images = {};
    this.selectedImages.forEach((image, index) => {
      images[String(index)] = 
        {
          "imageId": image.$key
        };
    });

    let elementInfo = {};
    Object.assign(elementInfo, this.getBasicElementInfo(), {"images": images});
    console.log(elementInfo);
    const elementId: string = this.af.database.ref(this.basePath).push().key;
    this.af.database.ref(`${this.basePath}${elementId}`).update(elementInfo);

    this.clearArray();
    this.elementCreated = true;
  }

  updateFaceNumber(i) {
    this.faceNumber = i;
    this.clearArray();
    this.validateImages();
  }

  private validateImages() {
    if (this.faceNumber == this.selectedImages.length) {
      let image = this.selectedImages[0];
      let height: number = image.height;
      let width: number = image.width;
      this.hideSubmitButton = !this.selectedImages.every(function sameHeightWidth(element, index, array) {
        return element.height == height && element.width == width;
      });
    } else {
      this.hideSubmitButton = true;
    }
  }

  private getBasicElementInfo() {
    return {
      //"uploaderEmail": this.afauth.auth.currentUser.email,
      "uploaderEmail": "yx1366@nyu.edu",
      "uploaderUid": this.afauth.auth.currentUser.uid,
      "createdOn": firebase.database.ServerValue.TIMESTAMP,
      "width": Math.max.apply(Math,this.selectedImages.map(function(image) {return image.width;})),
      "height": Math.max.apply(Math,this.selectedImages.map(function(image) {return image.height;})),
      "isDraggable": this.isDraggable,
      "elementKind": this.elementType,
      "rotatableDegrees": this.rotatableDegrees,
      "isDrawable": this.isDrawable,
    }
  }

  private clearArray() {
    this.selectedImages = [];
  }

}