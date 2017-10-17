import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

@Component({
  selector: 'app-select-pieces',
  templateUrl: './select-pieces.component.html',
  styleUrls: ['./select-pieces.component.css']
})
export class SelectPiecesComponent{
	@Output() onSelected = new EventEmitter<object[]>();
	images: FirebaseListObservable<any[]>;
	pieces: object[];

  constructor(
		public afAuth: AngularFireAuth, 
		public db: AngularFireDatabase
	) {
		this.images = db.list(constants.IMAGES_PATH, {
			query: {
				orderByChild: 'is_board_image',
				equalTo: false,
			}
		});
	}

	selectPiece(piece) {
		this.pieces.push({"key": piece.key, "url": piece.downloadURL});
		//this.onSelected.emit(this.pieces);
	}

}
