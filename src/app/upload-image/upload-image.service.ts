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
        let storagetRef = firebase.storage().ref();
        // Put image under Storage.
        upload.$key = this.af.database.ref(this.basePath).push().key;
        console.log(upload.$key);
        this.uploadTask = storagetRef.child(`${this.basePath}/${upload.$key}`).put(upload.file);
        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
            },
            (error) => {
                console.log(error);
            },
            () => {
                upload.downloadURL = this.uploadTask.snapshot.downloadURL;
                upload.name = upload.file.name;
                upload.uploader_email = this.afauth.auth.currentUser.email;
                upload.uploader_phone = this.afauth.auth.currentUser.phoneNumber;
                upload.uploader_uid = this.afauth.auth.currentUser.uid;
                // Save metadata under Database.
                let metadata = this.getImageMetadata(upload);
                console.log(metadata);
                this.af.database.ref(`images/${upload.$key}`).update(metadata);
            }      
        )
    }

    getImageMetadata(upload: Upload) {
        return {
            "downloadURL": upload.downloadURL,
            "width": upload.width,
            "height": upload.height,
            "is_board_image": upload.is_board_image,
            "key": upload.$key,
            "name": upload.name,
            "uploader_email": upload.uploader_email,
            "uploader_uid": upload.uploader_uid,
            "createdOn": firebase.database.ServerValue.TIMESTAMP,
            "uploader_phone": upload.uploader_phone
        };
    }
}