import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';

@Injectable()
export class ImageSelectionService {
    constructor(private db: AngularFireDatabase) { }

    private IMAGES_PATH: string = "gameBuilder/images";
    private ELEMENTS_PATH: string = "gameBuilder/elements";

    getAllImages() {
        let query = {
            orderByKey: true,
        };
        return this.db.list(this.IMAGES_PATH, {query}); 
    }

    getAllCards() {
        let query = {
            orderByChild: "elementKind",
            equalTo: "card"
        };
        return this.db.list(this.ELEMENTS_PATH, {query});
    }

    getCardsByName(searchTerm: string) {
        let query = {
            orderByChild: "elementKind",
            equalTo: "card"
        };
        return this.db.list(this.ELEMENTS_PATH, {query})
                .map(cards => cards.filter(card => card.name &&
                    card.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1));
    }

    getMostRecentCards() {
        let query = {
            orderByChild: "createdOn"
        };
        return this.db.list(this.ELEMENTS_PATH, {query})
                .map(elements => elements.reverse().filter(element => element.elementKind == "card"));
    }

    getMostRecentNonBoardImages() {
        let query = {
            orderByChild: "createdOn"
        };
        return this.db.list(this.IMAGES_PATH, {query})
                .map(images => images.reverse().filter(image => !image.isBoardImage));
    }

    getMostRecentBoardImages() {
        let query = {
            orderByChild: "createdOn"
        };
        return this.db.list(this.IMAGES_PATH, {query})
                .map(images => images.reverse().filter(image => image.isBoardImage));
    }

    getMyCardUploads(uid: string) {
        let query = {
            orderByChild: "uploaderUid",
            equalTo: uid
        };
        return this.db.list(this.ELEMENTS_PATH, {query})
                .map(elements => elements.filter(element => element.elementKind == "card"));
    }

    getMyNonBoardImageUploads(uid: string) {
        let query = {
            orderByChild: "uploaderUid",
            equalTo: uid
        };
        return this.db.list(this.IMAGES_PATH, {query})
            .map(images => images.filter(image => !image.isBoardImage));
    }

    getMyBoardImageUploads(uid: string) {
        let query = {
            orderByChild: "uploaderUid",
            equalTo: uid
        };
        return this.db.list(this.IMAGES_PATH, {query})
            .map(images => images.filter(image => image.isBoardImage));
    }

    getNonBoardImages() {
        let query = {
            orderByChild: "isBoardImage",
            equalTo: false
        };
        return this.db.list(this.IMAGES_PATH, {query});
    }

    getBoardImages() {
        let query = {
            orderByChild: "isBoardImage",
            equalTo: true
        };
        return this.db.list(this.IMAGES_PATH, {query});
    }

    getNonBoardImagesByName(searchTerm: string) {
        let query = {
            orderByChild: "isBoardImage",
            equalTo: false
        }
        return this.db.list(this.IMAGES_PATH, {query})
                .map(images => images.filter(image => image.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1));
    }

    getBoardImagesByName(searchTerm: string) {
        let query = {
            orderByChild: "isBoardImage",
            equalTo: true
        }
        return this.db.list(this.IMAGES_PATH, {query})
                .map(images => images.filter(image => image.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1));
    }
}