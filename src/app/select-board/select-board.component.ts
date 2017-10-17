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
	selectedBoard: string;
	selectedBoardKey: string;
	@Output() onSelected = new EventEmitter<string>();

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
		this.selectedBoard = board.downloadURL;
		this.onSelected.emit(this.selectedBoard);
	}

	getSelectedOpacity(board) {
		if(this.selectedBoardKey === board.key) {
			return 0.6
		}
		return 1
	}

	getSelectedColor(board) {
		if(this.selectedBoardKey === board.key) {
			return '#3F51B5';
		}
		return 'F8F8F8';
	}
}
