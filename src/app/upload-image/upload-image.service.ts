import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Upload } from './upload';
import * as firebase from 'firebase';

@Injectable()
export class UploadService {
    private basePath: string = 'gameBuilder/images/';
    private uploadTask: firebase.storage.UploadTask;
    constructor(
        private afauth: AngularFireAuth,
        private af: AngularFireDatabase,
    ) { }

    pushUpload(upload: Upload) {
        upload.name = upload.file.name;
        upload.uploaderEmail = this.afauth.auth.currentUser.email;
        upload.uploaderPhone = this.afauth.auth.currentUser.phoneNumber;
        upload.uploaderUid = this.afauth.auth.currentUser.uid;

        let storagetRef = firebase.storage().ref();        
        upload.$key = this.af.database.ref(this.basePath).push().key;
        this.uploadTask = storagetRef.child(`${this.basePath}/${upload.$key}`).put(upload.file);
        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => {
                console.log(error);
            },
            () => {
                let metadata = {
                    customMetadata: {
                        "cloudStoragePath": `${this.basePath}${upload.$key}`,
                        "height": upload.height.toString(),
                        "isBoardImage": upload.isBoardImage.toString(),
                        "name": upload.name,
                        "uploaderUid": upload.uploaderUid,
                        "uploaderEmail": upload.uploaderEmail,
                        "uploaderPhone": upload.uploaderPhone,
                        "width": upload.width.toString()
                    }
                };
                storagetRef.child(`${this.basePath}${upload.$key}`).updateMetadata(metadata);
                upload.downloadURL = this.uploadTask.snapshot.downloadURL;
                this.af.database.ref(`${this.basePath}${upload.$key}`).update(this.getImageInfo(upload));
            }      
        )
    }

    getImageInfo(upload: Upload) {
        return {
            "cloudStoragePath": `${this.basePath}${upload.$key}`,
            "downloadURL": upload.downloadURL,
            "width": upload.width,
            "height": upload.height,
            "isBoardImage": upload.isBoardImage,
            "name": upload.name,
            "sizeInBytes": upload.sizeInBytes,
            "uploaderEmail": upload.uploaderEmail,
            "uploaderUid": upload.uploaderUid,
            "createdOn": firebase.database.ServerValue.TIMESTAMP,
        };
    }
}