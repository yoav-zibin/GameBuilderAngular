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
  rotatableDegrees: number = 360;
  selectedImages: any = [];

  userIsAnonymous: boolean;
  userEmailEmpty: boolean;

  constructor(
    private imageSelectionService: ImageSelectionService,
    private af: AngularFireDatabase,
    private afauth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.userIsAnonymous = this.afauth.auth.currentUser == null || this.afauth.auth.currentUser.isAnonymous;
    if (this.userIsAnonymous) {
      this.userEmailEmpty = true;
    } else {
      this.userEmailEmpty = this.afauth.auth.currentUser.email == null;
    }
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
      "uploaderEmail": this.afauth.auth.currentUser.email,
      "uploaderUid": this.afauth.auth.currentUser.uid,
      "createdOn": firebase.database.ServerValue.TIMESTAMP,
      "width": this.selectedImages[0].width,
      "height": this.selectedImages[0].height,
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

/*
newData.hasChildren(['uploaderEmail', 'uploaderUid', 'createdOn', 'width', 'height', 'isDraggable', 'elementKind', 'rotatableDegrees', 'isDrawable']) &&
$elementId.matches(/^[-_A-Za-z0-9]{17,40}$/) && 
(
  (newData.child('elementKind').val().matches(/^cardsDeck|piecesDeck$/) ? newData.child('deckElements/1').exists() : !newData.child('deckElements').exists())  && 
  (newData.child('isDrawable').val() === false || newData.child('elementKind').val().matches(/^standard|card$/))  && 
  (newData.child('rotatableDegrees').val() === 360 || newData.child('elementKind').val() === 'standard')  && 
  newData.child('images/0').exists()  && 
  (
    (newData.child('elementKind').val().matches(/^standard|cardsDeck|piecesDeck$/) && !newData.child('images/1').exists())  || 
    (newData.child('elementKind').val().matches(/^toggable|dice$/) && newData.child('images/1').exists())  || 
    (newData.child('elementKind').val() === 'card' && newData.child('images/1').exists() && !newData.child('images/2').exists()) 
  )
)
*/