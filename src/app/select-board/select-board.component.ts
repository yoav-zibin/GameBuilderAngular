import { Component } from '@angular/core';
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
}
