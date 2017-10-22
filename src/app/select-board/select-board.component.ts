import { Component, EventEmitter, Output  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'



@Component({
  selector: 'app-select-board',
  templateUrl: './select-board.component.html',
  styleUrls: ['./select-board.component.css']
})
export class SelectBoardComponent {
	images: FirebaseListObservable<any[]>;
	selectedBoardUrl: string;
	selectedBoardKey: string;
	@Output() onSelected = new EventEmitter<object>();

	constructor(
		public afAuth: AngularFireAuth, 
		public db: AngularFireDatabase
	) {
		this.images = db.list(constants.IMAGES_PATH, {
			query: {
				orderByChild: 'is_board_image',
				equalTo: true,
			}
		});
	}

	selectBoard(board) {
		this.selectedBoardKey = board.key;
		this.selectedBoardUrl = board.downloadURL;
		console.log("sending board...")
		this.onSelected.emit(
			{
				'key': this.selectedBoardKey,
				'url': this.selectedBoardUrl
			}
		);
	}

	getSelectedOpacity(board) {
		if(this.selectedBoardKey === board.key) {
			return 0.6
		}
		return 1
	}

	/*
	getSelectedColor(board) {
		if(this.selectedBoardKey === board.key) {
			return '#3F51B5';
		}
		return 'F8F8F8';
	}
	*/
}
