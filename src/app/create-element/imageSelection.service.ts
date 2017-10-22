import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ImageSelectionService {
    constructor(private db: AngularFireDatabase) { }

    getImages(batch, lastKey?) {
        let query = {
            orderByKey: true,
            limitToFirst: batch,
        }
        if (lastKey) {
            query['startAt'] = lastKey;
        }
        return this.db.list('gameBuilder/images', {
            query
        })        
    }
}