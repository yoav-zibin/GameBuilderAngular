import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ImageSelectionService {
    constructor(private db: AngularFireDatabase) { }

    getImages() {
        let query = {
            orderByKey: true,
        }
        return this.db.list('gameBuilder/images', {
            query
        })        
    }
}