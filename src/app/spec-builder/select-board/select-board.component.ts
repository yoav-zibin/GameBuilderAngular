import { Component, EventEmitter, Output, ElementRef  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import * as firebase from 'firebase/app';
import constants from '../../../constants.js'


@Component({
  selector: 'app-select-board',
  templateUrl: './select-board.component.html',
  styleUrls: ['./select-board.component.css']
})
export class SelectBoardComponent {
	images: FirebaseListObservable<any[]>;
	selected: boolean;
	selectedBoardUrl: string;
	selectedBoardKey: string;
	selectedBoardName: string;
	@Output() onSelected = new EventEmitter<object>();

	constructor(
		private db: AngularFireDatabase,
		private auth: AuthService,
	) {

		if(this.auth.authenticated) {
			this.images = db.list(constants.IMAGES_PATH, {
				query: {
					orderByChild: 'isBoardImage',
					equalTo: true,
				}
			});
		}
	}

	selectBoard(board) {
		console.log("sending board...")
		console.log(board);
		this.onSelected.emit(
			{
				'key': board.$key,
				'name': board.name,
				'url': board.downloadURL
			}
		);
	}
}
