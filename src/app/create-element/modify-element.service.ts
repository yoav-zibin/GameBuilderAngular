import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DBQueryService } from './db-query.service';
import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Upload } from '../upload-image/upload';
import { UploadService } from '../upload-image/upload-image.service';
import * as firebase from 'firebase';

const DB_ELEMENTS_PATH: string = "gameBuilder/elements/";
const PROXY: string = "https://cors-anywhere.herokuapp.com/";

@Injectable()
export class ModifyElement {
  private finished: boolean = false;
  private started: boolean = false;
  
  constructor(
    private af: AngularFireDatabase,
    private afauth: AngularFireAuth,
    private dbQueryService: DBQueryService,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private uploadService: UploadService,
  ) { }

  /*
   * This function returns an id of an element with new dimensions. However, due to asynchrony,
   *  this function might not have finished at the moment the new element id is returned.
   */
  resizeElement(elementId: string, newWidth: number, newHeight: number) {
    const newElementId: string = this.af.database.ref(DB_ELEMENTS_PATH).push().key;
    this.dbQueryService.getAllElements().subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        if (elementId == snapshot.$key) {
          const elementKind = snapshot.elementKind;
          const images: Object = snapshot.images;
          const isDraggable: boolean = snapshot.isDraggable;
          const isDrawable: boolean = snapshot.isDrawable;
          const rotatableDegrees: number = snapshot.rotatableDegrees;

          if (elementKind == "cardsDeck" || elementKind == "piecesDeck") {
            const imageIdArray: string[] = [images[0]['imageId']];
            console.log(snapshot.deckElements);
            this.resizeAllCards(snapshot.deckElements, elementKind, isDraggable, isDrawable,
                newElementId, newHeight, imageIdArray, newWidth, rotatableDegrees);

          } else {
            let newImageIds: string[] = [];
            for (let imageIndex in images) {
              newImageIds.push('0');
            }
            this.resizeAllImages([], elementKind, images, isDraggable, isDrawable, newElementId,
                newHeight, newImageIds, newWidth, rotatableDegrees);         
          }
          return;
        }
      });
    });
    return newElementId;
  }
  
  private isEmpty(ids: string[]) {
    for (let id of ids) {
      if (id == '0') {
        return true;
      }
    }
    return false;
  }

  private resizeAllCards(deckElements: Object, elementKind: string, isDraggable: boolean,
      isDrawable: boolean, newElementId: string, newHeight: number, newImageIds: string[],
      newWidth: number, rotatableDegrees: number) {
    const allNewElementIds: string[] = [];
    // Initialize array in case of asynchrony.
    for (let deckElementIndex in deckElements) {
      allNewElementIds.push('0');
    }
    
    if (!this.started) {
      this.started = true;
      for (let deckElementIndex in deckElements) {
        const elementId: string = deckElements[deckElementIndex]["deckMemberElementId"];
        console.log(elementId);
        allNewElementIds[deckElementIndex] = this.resizeElement(elementId, newWidth, newHeight);
        this.finished = false;
        if (!this.isEmpty(allNewElementIds)) {
          this.updateNewElement(allNewElementIds, elementKind, isDraggable, isDrawable, newElementId,
            newHeight, newImageIds, newWidth, rotatableDegrees);
        }
      }
    }
  }

  private resizeAllImages(cardIds: string[], elementKind: string, images: Object,
        isDraggable: boolean, isDrawable: boolean, newElementId: string, newHeight: number,
        newImageIds: string[], newWidth: number, rotatableDegrees: number) {
    let storagetRef = firebase.storage().ref();
    for (let imageIndex in images) {
      const imageId: string = images[imageIndex]["imageId"];

      let subscription = this.dbQueryService.getAllImages().subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (!this.finished && imageId == snapshot.$key) {
            console.log(snapshot.$key);

            // Download image.
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            var thisClass = this;
            xhr.onload = function(event) {
              var blob = xhr.response;
              const newImageName: string =
                  `${snapshot.name}_${String(newWidth)}x${String(newHeight)}`;
              const type: string = 'png';
              var file: File =
                  new File([blob], newImageName, {type:`image/${type}`, lastModified: Date.now()});
              
              // Resize Image.
              thisClass.ng2ImgMaxService.resize([file], newWidth, newHeight).subscribe(newFile => {
                console.log("Resize result:", newFile);
                console.log("filename", newFile.name);

                // Upload to Storage.
                const newImageId: string = thisClass.uploadImage(newFile, snapshot.isBoardImage,
                    type, newWidth, newHeight);
                newImageIds[imageIndex] = newImageId;

                // Update Database.
                if (!thisClass.finished && !thisClass.isEmpty(newImageIds)) {
                  thisClass.updateNewElement(cardIds, elementKind, isDraggable, isDrawable,
                      newElementId, newHeight, newImageIds, newWidth, rotatableDegrees);
                  thisClass.finished = true;
                }
                subscription.unsubscribe();
              }, error => {
                console.error("Resize error:", error);
              })
            };
            xhr.open('GET', PROXY + snapshot.downloadURL);
            xhr.send();
          }
        })
      });
    }
  }

  private uploadImage(newFile: File, isBoardImage: boolean, type: string, newWidth: number,
        newHeight: number) {
    let upload: Upload = new Upload(newFile);
    upload.isBoardImage = isBoardImage;
    upload.height = newHeight;
    upload.width = newWidth;
    upload.sizeInBytes = newFile.size;
    upload.type = `.${type}`;
    return this.uploadService.pushUpload(upload);
  }

  private updateNewElement(cardIds: string[], elementKind: string, isDraggable: boolean,
        isDrawable: boolean, newElementId: string, newHeight: number, newImageIds: string[],
        newWidth: number, rotatableDegrees: number) {
    const newElementBasicData: Object = {
      "createdOn": firebase.database.ServerValue.TIMESTAMP,
      "elementKind": elementKind,
      "height": newHeight,
      "isDraggable": isDraggable,
      "isDrawable": isDrawable,
      "rotatableDegrees": rotatableDegrees,
      "uploaderEmail": this.afauth.auth.currentUser.email,
      "uploaderUid": this.afauth.auth.currentUser.uid,
      "width": newWidth
    }
    let newElementImagesData = {};
    newImageIds.forEach((imageId, index) => {
      newElementImagesData[String(index)] = 
        {
          "imageId": imageId
        };
    });
    let newElementData: Object = {};
    Object.assign(newElementData, newElementBasicData, {"images": newElementImagesData});

    // Create deckElements entry for deck element.
    if (cardIds != []) {
      let deckInfo = {};
      cardIds.forEach((cardId, index) => {
        deckInfo[String(index)] = 
          {
            "deckMemberElementId": cardId
          };
      });

      let deckElementInfo: Object = {};
      Object.assign(deckElementInfo, newElementData, {"deckElements": deckInfo});
      newElementData = deckElementInfo;
    }
    //console.log(newElementData);
    this.af.database.ref(`${DB_ELEMENTS_PATH}${newElementId}`).update(newElementData)
        .then(result => {
          if (cardIds == []) {
            console.log("New element updated.");
          } else {
            console.log("Deck element created.") ;
          }          
        })
        .catch(error => {
          //console.log(error);
          /* Due to asynchrony, call this function by itself indefinitely and recursively untill
              all new images are uploaded to Storage and updated in DB.
          */
          this.updateNewElement(cardIds, elementKind, isDraggable, isDrawable, newElementId,
              newHeight, newImageIds, newWidth, rotatableDegrees);
        });
  }
}