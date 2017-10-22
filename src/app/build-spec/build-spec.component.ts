import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

@Component({
  selector: 'app-build-spec',
  templateUrl: './build-spec.component.html',
  styleUrls: ['./build-spec.component.css']
})
export class BuildSpecComponent{
	@Input() selectedBoard: object;
	@Output() onPiecesSet = new EventEmitter<object[]>();
	images: FirebaseListObservable<any[]>;
	pieces: object[] = new Array();

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
		console.log(piece.key + ' ' + piece.downloadURL);
		this.pieces.push({"key": piece.key, "url": piece.downloadURL});
		this.onPiecesSet.emit(this.pieces);
	}

}
