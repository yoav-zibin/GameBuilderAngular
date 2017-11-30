import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js';
import {ViewSpecComponent} from './view-spec/view-spec.component';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-spec-viewer',
	templateUrl: './spec-viewer.component.html',
	styleUrls: ['./spec-viewer.component.css']
})
export class SpecViewerComponent implements OnInit {
	isLinear = true;
	selected = false;
	piecesSet = false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	selectedBoard: object = new Object();
	pieces: Map<string, object>;
	blocked: boolean;

	@ViewChild('viewSpec')
	viewSpec: ViewSpecComponent;

	specs: FirebaseListObservable<any[]>;
	spec: Object;
	currentSpec: string;

	board: Object;
	pieceSet: Object;
	piecesArray: Array<Object>;

	pieceSpec: Object[] = new Array();

	info: Map<string, string>;
  
	  constructor(
		  private auth: AuthService,
		  private _formBuilder: FormBuilder,
		  public db: AngularFireDatabase
	  ) {	
		this.specs = db.list(constants.SPECS_PATH);
		// console.log(this.specs)
	  }
  
	  ngOnInit() {
		this.blocked = this.auth.isAnonymous || !this.auth.authenticated;
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

		Select(piecesArr: Array<Object>){
			this.piecesArray = piecesArr;
		}
  
		onSelected(board: object) {
			this.selected = true;
			this.selectedBoard = board;
			this.firstFormGroup = this._formBuilder.group({
				firstCtrl: ['validated', Validators.required]
		});
			console.log("receiving board");
		}
  
		onPiecesSet(pieces: Map<string, object>) {
			this.pieces = pieces;
			this.secondFormGroup = this._formBuilder.group({
		  		secondCtrl: ['validated', Validators.required]
		});
			console.log("updating pieces");
		}
  
		getSelectedBoard() {
			return this.selectedBoard;
		}
  
		getPieces() {
			return this.pieces;
		}
  
		getPiecesSet() {
		return this.piecesSet;
		}
  
		toFinalStage() {
			this.piecesSet = true;
		}

		clean(){
			// this.pieces = new Map<string, object>();
			// console.log(this.pieces)
			this.viewSpec.reset()
		}

		onInfo(inf: Map<string, string>){
			this.info = inf
		}
		
		getInfo(){
			// console.log('info')
			// console.log(this.info)
			return this.info
		}
}
