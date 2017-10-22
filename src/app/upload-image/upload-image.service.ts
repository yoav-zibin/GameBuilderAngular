import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Upload } from './upload';
import * as firebase from 'firebase';

@Injectable()
export class UploadService {
    private basePath: string = 'images/';
    private uploadTask: firebase.storage.UploadTask;
    constructor(
        private afauth: AngularFireAuth,
        private af: AngularFireDatabase,
    ) { }

    pushUpload(upload: Upload) {
        upload.name = upload.file.name;
        upload.uploader_email = this.afauth.auth.currentUser.email;
        upload.uploader_phone = this.afauth.auth.currentUser.phoneNumber;
        upload.uploader_uid = this.afauth.auth.currentUser.uid;

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
                        "height": upload.height.toString(),
                        "is_board_image": upload.is_board_image.toString(),
                        "name": upload.name,
                        "uploader_uid": upload.uploader_uid,
                        "uploader_email": upload.uploader_email,
                        "uploader_phone": upload.uploader_phone,
                        "width": upload.width.toString()
                    }
                };
                storagetRef.child(`${this.basePath}/${upload.$key}`).updateMetadata(metadata);
                upload.downloadURL = this.uploadTask.snapshot.downloadURL;
                this.af.database.ref(`images/${upload.$key}`).update(this.getImageInfo(upload));
            }      
        )
    }

    getImageInfo(upload: Upload) {
        return {
            "uploaderEmail": upload.uploader_email,
            "uploaderUid": upload.uploader_uid,
            "createdOn": firebase.database.ServerValue.TIMESTAMP,
            "width": upload.width,
            "height": upload.height,
            "isBoardImage": upload.is_board_image,
            "downloadURL": upload.downloadURL,
            "sizeInBytes": ,
            "name": upload.name,
            "cloudStoragePath": `images/${upload.$key}`
        };
    }
}