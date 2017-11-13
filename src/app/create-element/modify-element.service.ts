import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DBQueryService } from './db-query.service';
import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Upload } from '../upload-image/upload';
import { UploadService } from '../upload-image/upload-image.service';
import * as firebase from 'firebase';

@Injectable()
export class ModifyElement {
  private databaseImagesPath: string = 'gameBuilder/images/';
  private databaseElementsPath: string = 'gameBuilder/elements/';
  private elementId: string;
  private elementKind: string;
  private finished: boolean = false;
  private images: Object;
  private isDraggable: boolean;
  private isDrawable: boolean;
  private newImageIds: string[] = [];
  private newHeight: number;
  private newWidth: number;
  private rotatableDegrees: number;

  constructor(
    private af: AngularFireDatabase,
    private afauth: AngularFireAuth,
    private dbQueryService: DBQueryService,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private uploadService: UploadService,
  ) { }

  resizeElement(elementId: string, newWidth: number, newHeight: number) {
    this.elementId = elementId;
    this.newHeight = newHeight;
    this.newWidth = newWidth;
    for (let imageIndex in this.images) {
      this.newImageIds.push('0');
    }
    this.dbQueryService.getAllElements().subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        if (elementId == snapshot.$key) {
          this.elementKind = snapshot.elementKind;
          this.images = snapshot.images;
          this.isDraggable = snapshot.isDraggable;
          this.isDrawable = snapshot.isDrawable;
          this.rotatableDegrees = snapshot.rotatableDegrees;
          this.resizeAllImages();
          return;
        }
      });
    });
  }
  
  private newImageIdsEmpty() {
    for (let id of this.newImageIds) {
      if (id == '0') {
        return true;
      }
    }
    return false;
  }

  private resizeAllImages() {
    let storagetRef = firebase.storage().ref();
    for (let imageIndex in this.images) {
      const imageId: string = this.images[imageIndex]["imageId"];

      let subscription = this.dbQueryService.getAllImages().subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (!this.finished && imageId == snapshot.$key) {
            console.log(snapshot.$key);
            //const type: string = snapshot.cloudStoragePath.substring("/images".length).substring(imageId.length+1);

            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            var thisClass = this;
            xhr.onload = function(event) {
              var blob = xhr.response;
              const newImageName: string = `${snapshot.name}_${String(thisClass.newWidth)}x${String(thisClass.newHeight)}`;
              const type: string = 'png';
              var file: File = new File([blob], newImageName, {type:`image/${type}`, lastModified: Date.now()});
              thisClass.ng2ImgMaxService.resize([file], thisClass.newWidth, thisClass.newHeight).subscribe(newFile => {
                console.log("Resize result:", newFile);
                console.log("filename", newFile.name);
                const newImageId: string = thisClass.uploadImage(newFile, snapshot.isBoardImage, type);
                thisClass.newImageIds[imageIndex] = newImageId;
                if (!thisClass.finished && !thisClass.newImageIdsEmpty()) {
                  thisClass.updateNewElement();
                  thisClass.finished = true;
                }
                subscription.unsubscribe();
              }, error => {
                console.error("Resize error:", error);
              })
            };
            xhr.open('GET', "https://cors-anywhere.herokuapp.com/"+snapshot.downloadURL);
            xhr.send();
          }
        })
      });
    }
  }

  private uploadImage(newFile: File, isBoardImage: boolean, type: string) {
    // Upload new image to Storage.
    let upload: Upload = new Upload(newFile);
    upload.isBoardImage = isBoardImage;
    upload.height = this.newHeight;
    upload.width = this.newWidth;
    upload.sizeInBytes = newFile.size;
    upload.type = `.${type}`;
    return this.uploadService.pushUpload(upload);
  }

  private updateNewElement() {
    const newElementId: string = this.af.database.ref(this.databaseElementsPath).push().key;
    const newElementBasicData: Object = {
      "createdOn": firebase.database.ServerValue.TIMESTAMP,
      "elementKind": this.elementKind,
      "height": this.newHeight,
      "isDraggable": this.isDraggable,
      "isDrawable": this.isDrawable,
      "rotatableDegrees": this.rotatableDegrees,
      "uploaderEmail": this.afauth.auth.currentUser.email,
      "uploaderUid": this.afauth.auth.currentUser.uid,
      "width": this.newWidth
    }
    let newElementImagesData = {};
    this.newImageIds.forEach((imageId, index) => {
      newElementImagesData[String(index)] = 
        {
          "imageId": imageId
        };
    });
    let newElementData: Object = {};
    Object.assign(newElementData, newElementBasicData, {"images": newElementImagesData});
    console.log(newElementData);
    this.af.database.ref(`${this.databaseElementsPath}${newElementId}`).update(newElementData)
        .then(result => {
          console.log("New element updated.");
        })
        .catch(error => {
          console.log(error);
          /* Due to asynchrony, call the function itself indefinitely and recursively untill
              all new images' data are uploaded to Storage and updated in DB.
          */
          this.updateNewElement();
        });
  }
}