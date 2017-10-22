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
  dimensionsMatch: boolean = true;
  elementCreated: boolean = false;
  elementType: string;
  isDraggable: boolean = false;
  isDrawable: boolean = false;
  rotatableDegrees: number = 1;
  selectedImages: any = [];
  userIsAnonymous: boolean;

  images = new BehaviorSubject([]);
  batch: number = 10;
  lastKey: any = '';
  finished: boolean = false;
  

  constructor(
    private imageSelectionService: ImageSelectionService,
    private af: AngularFireDatabase,
    private afauth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.userIsAnonymous = (this.afauth.auth.currentUser == null) || 
                            this.afauth.auth.currentUser.isAnonymous;
    this.getImages();
  }

  select(image) {
    if (this.elementType == Types[Types.standard]) {
      if (this.selectedImages.length == 0) {
        this.selectedImages.push(image);
      } else if (this.selectedImages.length == 1 && this.selectedImages[0] == image) {
        this.clearArray();
      }

    } else if (this.elementType == Types[Types.toggable]) {
      if (this.selectedImages.length <= 1 && this.selectedImages.indexOf(image) == -1) {
        this.selectedImages.push(image);
      } else if (this.selectedImages.length <= 2 && this.selectedImages.indexOf(image) != -1) {
        this.selectedImages.splice(this.selectedImages.indexOf(image), 1);
      }
    }

    this.validateImagesDimension();
  }

  reset() {
    this.elementCreated = false;
  }

  submit() {
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

  private validateImagesDimension() {
    if (this.selectedImages.length <= 1) {
      this.dimensionsMatch = true;
    } else{
      let image = this.selectedImages[0];
      let height: number = image.height;
      let width: number = image.width;
      this.dimensionsMatch = this.selectedImages.every(function sameHeightWidth(element, index, array) {
        return element.height == height && element.width == width;
      });
    }
  }

  private getBasicElementInfo() {
    return {
      "uploaderEmail": this.afauth.auth.currentUser.email,
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

  private getImages(key?) {
    if (this.finished) return

    this.imageSelectionService
        .getImages(this.batch+1, this.lastKey)
        .do(images => {
          // Set the lastKey in preparation for next query.
          this.lastKey = _.last(images)['$key'];
          const newImages = _.slice(images, 0, this.batch);

          // Get current images in BehaviorSubject.
          const currentImages = this.images.getValue()

          // Reach the end of database.
          if (this.lastKey == _.last(newImages)['$key']) {
            this.finished = true;
          }

          // Concatenate new images to current images
          this.images.next( _.concat(currentImages, newImages) );
        })
        .take(1)
        .subscribe();
  }

}