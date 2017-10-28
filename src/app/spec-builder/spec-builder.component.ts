import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

import {FormBuilder, FormGroup, Validators} from '@angular/forms';



@Component({
  selector: 'app-spec-builder',
  templateUrl: './spec-builder.component.html',
  styleUrls: ['./spec-builder.component.css']
})
export class SpecBuilderComponent implements OnInit {
	isLinear = false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	selectedBoard: object = new Object();
	pieces: object[] = new Array();

	constructor(
		private auth: AuthService,
		private _formBuilder: FormBuilder,
		public db: AngularFireDatabase
	) {	}

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
  		console.log("updating pieces");
  	}

    /*
    onPiecesSet(piece: object) {
    let img_key = piece['img_key'];
    let matched = false;

    this.db.list(constants.ELEMENTS_PATH, { preserveSnapshot: true})
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          let data = snapshot.val();
          for(let image of data['images']) {
              if(image['imageId']=== img_key && !matched) {
                matched = true;
                console.log('found match');
              piece['el_key'] = snapshot.key;
              this.onPiecesSet.emit(piece);
            }
          }
        });
      })
    }
    */

  	getSelectedBoard() {
  		return this.selectedBoard;
  	}

  	getPieces() {
  		return this.pieces;
  	}

}
