import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { DBQueryService } from './db-query.service';
import { ModifyElement } from './modify-element.service';
import { UploadService } from '../upload-image/upload-image.service';
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
  providers: [DBQueryService, ModifyElement, UploadService],
  templateUrl: './create-element.component.html',
  styleUrls: ['./create-element.component.css']
})
export class CreateElementComponent implements OnInit {
  basePath: string = "gameBuilder/elements/";
  elementCreated: boolean = false;
  elementInfo: Object = {};
  elementTypeAndFaceNumber: string;
  elementType: string;
  faceNumber: number = null;
  isDraggable: boolean = false;
  isDrawable: boolean = false;
  rotatableDegrees: number = 360;

  // Images and elements(cards).
  elements: any;
  images: any;
  selectedElements: any = [];
  selectedImages: any = [];

  // Visability control.
  hideNextButton: boolean = true;
  hideSubmitButton: boolean = true;
  showElements: boolean = false;
  
  // For auth use.
  userEmailEmpty: boolean;
  userIsAnonymous: boolean;

  constructor(
    private af: AngularFireDatabase,
    private afauth: AngularFireAuth,
    private dbQueryService: DBQueryService,
    private modifyElement: ModifyElement
  ) { }

  ngOnInit() {
    this.userIsAnonymous = this.afauth.auth.currentUser == null || this.afauth.auth.currentUser.isAnonymous;
    if (this.userIsAnonymous) {
      this.userEmailEmpty = true;
    } else {
      this.userEmailEmpty = this.afauth.auth.currentUser.email == null;
    }
    if (!this.userIsAnonymous && !this.userEmailEmpty) {
      this.images = this.dbQueryService.getAllImages();
    }
  }

  next() {
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
    Object.assign(this.elementInfo, this.getBasicElementInfo(), {"images": images});

    if (!this.isDeck()) {
      this.submit();
    } else {
      this.elements = this.dbQueryService.getCardElements();
      this.showElements = true;
    }
  }

  reset() {
    this.elementCreated = false;
    this.elementInfo = {};
    this.elementType = null;
    this.faceNumber = null;
    this.isDraggable = false;
    this.isDrawable = false;
    this.rotatableDegrees = 360;
  
    // Images and elements(cards).
    this.selectedElements = [];
    this.selectedImages = [];
  
    // Visability control.
    this.hideNextButton = true;
    this.hideSubmitButton = true;
    this.showElements = false;
  }

  selectElement(element) {
    let elementId: string = element.$key;
    if (this.selectedElements.indexOf(elementId) == -1) {
      this.selectedElements.push(elementId);
    } else {
      this.selectedElements.splice(this.selectedElements.indexOf(elementId), 1);
    }
    this.validateElements();
  }

  selectImage(image) {
    if (!this.isToggableOrDice()) {
      if (this.selectedImages.length < this.faceNumber && this.selectedImages.indexOf(image) == -1) {
        this.selectedImages.push(image);
      } else if (this.selectedImages.length <= this.faceNumber && this.selectedImages.indexOf(image) != -1) {
        this.selectedImages.splice(this.selectedImages.indexOf(image), 1);
      }
    } else {
      if (this.selectedImages.indexOf(image) == -1) {
        this.selectedImages.push(image);
      } else {
        this.selectedImages.splice(this.selectedImages.indexOf(image), 1);
      }
    }
    this.validateImages();
  }

  submit() {
    if (this.isDeck()) {
      let deckInfo = {};
      this.selectedElements.forEach((elementId, index) => {
        deckInfo[String(index)] = 
          {
            "deckMemberElementId": elementId
          };
      });

      let deckElementInfo: Object = {};
      Object.assign(deckElementInfo, this.elementInfo, {"deckElements": deckInfo});
      this.elementInfo = deckElementInfo;
    }

    const elementId: string = this.af.database.ref(this.basePath).push().key;
    this.af.database.ref(`${this.basePath}${elementId}`).update(this.elementInfo);
    this.elementCreated = true;
  }

  updateType() {
    const separationIndex: number = this.elementTypeAndFaceNumber.length - 1;
    this.elementType = this.elementTypeAndFaceNumber.substring(0, separationIndex);
    this.faceNumber = +this.elementTypeAndFaceNumber.substring(separationIndex);
    this.selectedImages = [];
    this.validateImages();
  }

  private isDeck() {
    return this.elementType == Types[Types.cardsDeck] || this.elementType == Types[Types.piecesDeck];
  }

  private isToggableOrDice() {
    return this.elementType == Types[Types.toggable] || this.elementType == Types[Types.dice];
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

  private validateElements() {
    this.hideSubmitButton = this.selectedElements.length < 2;
  }

  private validateImages() {
    if (
      (this.isToggableOrDice() && this.selectedImages.length >= this.faceNumber) ||
      (this.selectedImages.length == this.faceNumber)
    ) {
      let image = this.selectedImages[0];
      let height: number = image.height;
      let width: number = image.width;
      this.hideNextButton = !this.selectedImages.every(function sameHeightWidth(element, index, array) {
        return element.height == height && element.width == width;
      });
    } else {
      this.hideNextButton = true;
    }
  }

  testResize() {
    return this.modifyElement.resizeElement("-KysBtKvi8k2q7xeu5GA", 90, 100);
  }

}
