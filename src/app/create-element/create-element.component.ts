import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImageSelectionService } from '../image-select/imageSelection.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import * as firebase from 'firebase';

enum Filters {
  all,
  myUploads,
  mostRecent,
  searchByName
}

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
  cardFilter: string;
  elementCreated: boolean = false;
  elementInfo: Object = {};
  elementName: string = "";
  elementTypeAndFaceNumber: string;
  elementType: string;
  faceNumber: number = null;
  imageFilter: string;
  isDraggable: boolean = false;
  isDrawable: boolean = false;
  rotatableDegrees: number = 360;
  searchTerm: string = "";

  // Images and elements(cards).
  elements: any;
  images: any;
  imageData: any = {};
  selectedCards: any = [];
  selectedCardIds: string[] = [];
  selectedImages: any = [];

  // Visability control.
  hideNextButton: boolean = true;
  hideSubmitButton: boolean = true;
  searchByName: boolean = false;
  showElements: boolean = false;
  
  // For auth use.
  userEmailEmpty: boolean;
  userIsAnonymous: boolean;

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
    if (!this.userIsAnonymous && !this.userEmailEmpty) {
      this.images = this.imageSelectionService.getNonBoardImages();
    }
  }

  ascendCard(index: number) {
    if (index > 0) {
      const tmpCard = this.selectedCards[index - 1];
      this.selectedCards[index - 1] = this.selectedCards[index];
      this.selectedCards[index] = tmpCard;

      const tmpCardId = this.selectedCardIds[index - 1];
      this.selectedCardIds[index - 1] = this.selectedCardIds[index];
      this.selectedCardIds[index] = tmpCardId;
    }
  }

  ascendImage(index: number) {
    if (index > 0) {
      const tmpImage = this.selectedImages[index - 1];
      this.selectedImages[index - 1] = this.selectedImages[index];
      this.selectedImages[index] = tmpImage;
    }
  }

  descendCard(index: number) {
    if (index < this.selectedCards.length - 1) {
      const tmpCard = this.selectedCards[index + 1];
      this.selectedCards[index + 1] = this.selectedCards[index];
      this.selectedCards[index] = tmpCard;

      const tmpCardId = this.selectedCardIds[index + 1];
      this.selectedCardIds[index + 1] = this.selectedCardIds[index];
      this.selectedCardIds[index] = tmpCardId;
    }
  }

  descendImage(index: number) {
    if (index < this.selectedImages.length - 1) {
      const tmpImage = this.selectedImages[index + 1];
      this.selectedImages[index + 1] = this.selectedImages[index];
      this.selectedImages[index] = tmpImage;
    }
  }

  onCardFilterChange(value) {
    this.searchByName = false;
    this.searchTerm = "";
    if (value == Filters[Filters.all]) {
      this.elements = this.imageSelectionService.getAllCards();
    } else if (value == Filters[Filters.myUploads]) {
      const uid: string = this.afauth.auth.currentUser.uid;
      this.elements = this.imageSelectionService.getMyCardUploads(uid);
    } else if (value == Filters[Filters.mostRecent]) {
      this.elements = this.imageSelectionService.getMostRecentCards();
    } else if (value == Filters[Filters.searchByName]) {
      this.searchByName = true;
    }
  }

  onImageFilterChange(value) {
    this.searchByName = false;
    this.searchTerm = "";
    if (value == Filters[Filters.all]) {
      this.images = this.imageSelectionService.getNonBoardImages();
    } else if (value == Filters[Filters.myUploads]) {
      const uid: string = this.afauth.auth.currentUser.uid;
      this.images = this.imageSelectionService.getMyNonBoardImageUploads(uid);
    } else if (value == Filters[Filters.mostRecent]) {
      this.images = this.imageSelectionService.getMostRecentNonBoardImages();
    } else if (value == Filters[Filters.searchByName]) {
      this.searchByName = true;
    }
  }

  onSearchTermChange(value) {
    if (this.showElements) {
      this.elements = value == "" ? this.imageSelectionService.getAllCards() :
          this.imageSelectionService.getCardsByName(value);
    } else {
      this.images = value == "" ? this.imageSelectionService.getNonBoardImages() : 
          this.imageSelectionService.getNonBoardImagesByName(value);
    }
  }

  next() {
    if (this.rotatableDegrees < 1 || this.rotatableDegrees > 360) {
      window.alert("Rotatable degrees must fall in range 1 ~ 360.");
      return;
    }
    if (this.elementName.length >= 100) {
      window.alert("Element's name should have less than 100 characters.");
    }
    let images = {};
    this.selectedImages.forEach((image, index) => {
      images[String(index)] = 
        {
          "imageId": image.$key
        };
    });
    Object.assign(this.elementInfo, this.getBasicElementInfo(), {"images": images});
    if (this.elementName != "") {
      let infoWithName = {}
      Object.assign(infoWithName, this.elementInfo, {"name": this.elementName});
      this.elementInfo = infoWithName;
    }

    if (!this.isDeck()) {
      this.images = this.imageSelectionService.getNonBoardImages();
      this.submit();
    } else {
      this.onCardFilterChange("all");
      this.showElements = true;
    }
  }

  saveImageData(imageId: string, imageURL: string, height: number, width: number) {
    this.imageData[imageId] = [imageURL, height, width];
    return imageURL;
  }

  removeElement(element) {
    let elementId: string = element.$key;
    this.selectedCardIds.splice(this.selectedCardIds.indexOf(elementId), 1);
    this.selectedCards.splice(this.selectedCards.indexOf(element), 1);
    this.validateElements();
  }

  removeImage(image) {
    this.selectedImages.splice(this.selectedImages.indexOf(image), 1);
  }

  reset() {
    this.cardFilter = null;
    this.elementCreated = false;
    this.elementInfo = {};
    this.elementName = "";
    this.elementType = null;
    this.elementTypeAndFaceNumber = null;
    this.faceNumber = null;
    this.imageFilter = null;
    this.isDraggable = false;
    this.isDrawable = false;
    this.rotatableDegrees = 360;
    this.searchTerm = "";
  
    // Images and elements(cards).
    this.imageData = {};
    this.selectedCards = [];
    this.selectedCardIds = [];
    this.selectedImages = [];
  
    // Visability control.
    this.searchByName = false;
    this.hideNextButton = true;
    this.hideSubmitButton = true;
    this.showElements = false;
  }

  selectElement(element) {
    let elementId: string = element.$key;
    this.selectedCardIds.push(elementId);
    this.selectedCards.push(element);
    this.validateElements();
  }

  selectImage(image) {
    if (!this.isToggableOrDice()) {
      if (this.selectedImages.length < this.faceNumber && this.selectedImages.indexOf(image) == -1) {
        this.selectedImages.push(image);
      } else if (this.selectedImages.length <= this.faceNumber && this.selectedImages.indexOf(image) != -1) {
        this.removeImage(image);
      }
    } else {
      if (this.selectedImages.indexOf(image) == -1) {
        this.selectedImages.push(image);
      } else {
        this.removeImage(image);
      }
    }
    this.validateImages();
  }

  submit() {
    if (this.isDeck()) {
      let deckInfo = {};
      this.selectedCardIds.forEach((elementId, index) => {
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
    this.hideSubmitButton = this.selectedCardIds.length < 2;
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

}