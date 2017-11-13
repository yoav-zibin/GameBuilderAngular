import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class DBQueryService {
    constructor(private db: AngularFireDatabase) { }

    private imagesBasePath: string = "gameBuilder/images";
    private elementsBasePath: string = "gameBuilder/elements";

    getAllImages() {
        let query = {
            orderByKey: true,
        };
        return this.db.list(this.imagesBasePath, {
            query
        });
    }

    getCardElements() {
        let query = {
            orderByChild: "elementKind",
            equalTo: "card"
        };
        return this.db.list(this.elementsBasePath, {
            query
        });
    }
    
    getAllElements() {
        let query = {
            orderByKey: true,
        };
        return this.db.list(this.elementsBasePath, {
            query
        });
    }
}