import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
	isLinear = false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	public selectedBoard: object;
	public pieces: object[];

	constructor(
		private _formBuilder: FormBuilder,
		public afAuth: AngularFireAuth, 
		public db: AngularFireDatabase
	) { }

	ngOnInit() {
		this.firstFormGroup = this._formBuilder.group({
			firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = this._formBuilder.group({
      		secondCtrl: ['', Validators.required]
    	});
    	this.thirdFormGroup = this._formBuilder.group({
      		thirdCtrl: ['', Validators.required]
    	});
  	}

  	onSelected(board: object) {
  		this.selectedBoard = board
  		console.log("receiving board");
  	}

  	onPiecesSet(pieces: object[]) {
  		this.pieces = pieces;
  		console.log("receiving pieces");
  	}

  	getSelectedBoard() {
  		return this.selectedBoard;
  	}

  	getPieces() {
  		return this.pieces;
  	}
}
