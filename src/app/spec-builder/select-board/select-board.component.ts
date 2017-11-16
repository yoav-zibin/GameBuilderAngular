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
	imagesRef: FirebaseListObservable<any[]>;
	images: object[] = new Array();
	all_images: object[] = new Array();
	my_images: object[] = new Array();
	selected: boolean;
	selectedBoardUrl: string;
	selectedBoardKey: string;
	selectedBoardName: string;
	@Output() onSelected = new EventEmitter<object>();

	currentFilter = 'all';
	options = [
		{value: 'all', viewValue: 'All Boards'},
		{value: 'mine', viewValue: 'My Boards'},
	]

	constructor(
		private db: AngularFireDatabase,
		private auth: AuthService,
	) {

		if(this.auth.authenticated) {
			this.imagesRef = db.list(constants.IMAGES_PATH, {
				query: {
					orderByChild: "isBoardImage",
					equalTo: true,
				},
				preserveSnapshot: true,
			});

			this.imagesRef.subscribe(snapshot => {
				console.log('creating image array');
				snapshot.forEach(data => {
					let board = data.val();
					board['key'] = data.key;
					console.log(board);
					this.all_images.push(board);
					if(board['uploaderUid'] == this.auth.currentUserId)
						this.my_images.push(board);
				});
			});

			this.images = this.all_images;
		}
	}

	onChange(value){
		this.currentFilter = value;
		console.log("current filter: " + this.currentFilter);

		if(value == "mine")
			this.images = this.my_images;
		else
			this.images = this.all_images;


	}

	selectBoard(board) {
		console.log("sending board...")
		console.log(board);
		this.onSelected.emit(
			{
				'key': board.key,
				'name': board.name,
				'url': board.downloadURL
			}
		);
	}
}
