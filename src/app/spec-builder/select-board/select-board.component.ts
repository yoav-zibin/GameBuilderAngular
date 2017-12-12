import { Component, EventEmitter, Output, ElementRef  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import { ImageSelectionService } from '../../image-select/imageSelection.service'
import { MdSnackBar } from '@angular/material';
import * as firebase from 'firebase/app';
import constants from '../../../constants.js'


@Component({
  selector: 'app-select-board',
  templateUrl: './select-board.component.html',
  styleUrls: ['./select-board.component.css']
})
export class SelectBoardComponent {
	imagesRef: any;
	images: object[] = new Array();
	all_images: object[] = new Array();
	my_images: object[] = new Array();
	selected: boolean;
	searchByName: boolean;
	selectedBoardUrl: string;
	selectedBoardKey: string;
	selectedBoardName: string;
	@Output() onSelected = new EventEmitter<object>();

	currentFilter = 'all';
	options = [
		{value: 'all', viewValue: 'All Boards'},
		{value: 'mine', viewValue: 'My Boards'},
		{value: 'recent', viewValue: 'Most Recent'},
		{value: 'search', viewValue: 'Search By Name'},
	]

	constructor(
		private db: AngularFireDatabase,
		private auth: AuthService,
		private select: ImageSelectionService,
		private snackBar: MdSnackBar
	) {

		if(this.auth.authenticated) {
			this.imagesRef = select.getBoardImages();
		}
	}

	onChange(value){
		this.searchByName = false;
		this.currentFilter = value;
		console.log("current filter: " + this.currentFilter);

		if(value == "mine")
			this.imagesRef = this.select.getMyBoardImageUploads(this.auth.currentUserId);
		else if(value == "recent")
			this.imagesRef = this.select.getMostRecentBoardImages();
		else if(value == "all")
			this.imagesRef = this.select.getBoardImages();
		else
			this.searchByName = true;
	}

	onSearchTermChange(value) {
    	this.imagesRef = value == "" ? this.select.getBoardImages() : 
    		this.select.getBoardImagesByName(value);
	}

	selectBoard(board) {
		console.log("sending board...")
		console.log(board)
		this.onSelected.emit(
			{
				'key': board.$key,
				'name': board.name,
				'url': board.downloadURL
			}
		);
		this.selectedBoardMessage(board.name);
	}

	selectedBoardMessage(name) {
    	this.snackBar.open("Selected " + name, 'Close', { 
			duration: 1000,
        });
	}
}
