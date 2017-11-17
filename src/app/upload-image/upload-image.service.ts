import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Upload } from './upload';
import * as firebase from 'firebase';

@Injectable()
export class UploadService {
    private storagePath: string = 'images/';
    private databasePath: string = 'gameBuilder/images/';
    private uploadTask: firebase.storage.UploadTask;
    constructor(
        private afauth: AngularFireAuth,
        private af: AngularFireDatabase,
    ) { }

    pushUpload(upload: Upload) {
        var fileName: string = upload.file.name;
        upload.name = fileName.substring(0, fileName.length - upload.type.length + 1);
        upload.uploaderEmail = this.afauth.auth.currentUser.email;
        upload.uploaderPhone = this.afauth.auth.currentUser.phoneNumber;
        upload.uploaderUid = this.afauth.auth.currentUser.uid;

        let storagetRef = firebase.storage().ref();        
        upload.$key = this.af.database.ref(this.databasePath).push().key;
        this.uploadTask = storagetRef.child(`${this.storagePath}/${upload.$key}${upload.type}`).put(upload.file);
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
                        "isBoardImage": upload.isBoardImage.toString(),
                        "name": upload.name,
                        "sizeInBytes": upload.sizeInBytes.toString(),
                        "uploaderUid": upload.uploaderUid,
                        "uploaderEmail": upload.uploaderEmail,
                        "uploaderPhone": upload.uploaderPhone,
                        "width": upload.width.toString()
                    }
                };
                storagetRef.child(`${this.storagePath}/${upload.$key}${upload.type}`).updateMetadata(metadata);
                upload.downloadURL = this.uploadTask.snapshot.downloadURL;
                var info = this.getImageInfo(upload);
                //console.log(info);
                this.af.database.ref(`${this.databasePath}${upload.$key}`).update(info);
            }      
        )
    }

    getImageInfo(upload: Upload) {
        return {
            "uploaderEmail": upload.uploaderEmail,
            "uploaderUid": upload.uploaderUid,
            "createdOn": firebase.database.ServerValue.TIMESTAMP,
            "width": upload.width,
            "height": upload.height,
            "isBoardImage": upload.isBoardImage,
            "downloadURL": upload.downloadURL,
            "sizeInBytes": upload.sizeInBytes,
            "name": upload.name,
            "cloudStoragePath": `${this.storagePath}${upload.$key}${upload.type}`
        };
    }
}