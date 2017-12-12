import { Component, EventEmitter, Output, ElementRef  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import { MdSnackBar } from '@angular/material';
import { ImageSelectionService } from '../../image-select/imageSelection.service'
import * as firebase from 'firebase/app';
import constants from '../../../constants.js'


@Component({
  selector: 'app-select-spec',
  templateUrl: './select-spec.component.html',
  styleUrls: ['./select-spec.component.css']
})
export class SelectSpecComponent {
	specsRef: any;
	selected: boolean;
	searchByName: boolean;
	selectedBoardUrl: string;
	selectedBoardKey: string;
	selectedBoardName: string;
	boardURL: string;
	@Output() onSpecSelected = new EventEmitter<object>();
	@Output() onBoardSelected = new EventEmitter<object>();
	@Output() onPiecesSelected = new EventEmitter<object[]>();

	currentFilter = 'all';
	options = [
		{value: 'all', viewValue: 'All Specs'},
		{value: 'mine', viewValue: 'My Specs'},
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
			this.specsRef = select.getAllSpecs();
		}
	}

	onChange(value){
		this.searchByName = false;
		this.currentFilter = value;
		console.log("current filter: " + this.currentFilter);

		if(value == "mine")
			this.specsRef = this.select.getMySpecs(this.auth.currentUserId);
		else if(value == "recent")
			this.specsRef = this.select.getMostRecentSpecs();
		else if(value == "all")
			this.specsRef = this.select.getAllSpecs();
		else
			this.searchByName = true;
	}

	onSearchTermChange(value) {
    	this.specsRef = value == "" ? this.select.getAllSpecs() : 
    		this.select.getSpecsByName(value);
	}

	selectSpec(spec) {
		console.log("sending spec...")
		console.log(spec)
		this.onSpecSelected.emit(spec);
		this.selectedSpecMessage(spec['gameName']);
		let board = spec['board'];
		this.onPiecesSelected.emit(spec['pieces']);
		this.getBoardURL(board['imageId'])
		
	}

	selectedSpecMessage(name) {
    	this.snackBar.open("Selected " + name, 'Close', { 
			duration: 1000,
        });
	}

	getBoardURL(imageId) {
		let url;
		let boardRef = this.db.object(constants.IMAGES_PATH + '/' + imageId);
		let sub = boardRef.subscribe(board => {
			this.onBoardSelected.emit(
				{
					'key': board.$key,
					'name': board.name,
					'url': board.downloadURL
				}
			);
		});
	}
}
