import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';
import { BuildSpecComponent } from './build-spec/build-spec.component'
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-spec-builder',
  templateUrl: './spec-builder.component.html',
  styleUrls: ['./spec-builder.component.css']
})
export class SpecBuilderComponent implements OnInit {
	isLinear = true;
    selected = false;
    piecesSet = false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	selectedBoard: object = {};
	pieces: object[] = new Array();
    blocked: boolean;

  @ViewChild(BuildSpecComponent) build: BuildSpecComponent;

	constructor(
		private auth: AuthService,
		private _formBuilder: FormBuilder,
		private db: AngularFireDatabase,
        private snackBar: MdSnackBar
	) {	}

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

  	onSelected(board: object) {
      this.selected = true;
	    this.selectedBoard = board;
      this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['validated', Validators.required]
      });
  		console.log("receiving board");
  	}

  	onPiecesSet(piecesObj: object) {
        let updatedDeck = this.updateDeckPieceIndices(piecesObj);
  	    this.pieces = piecesObj['nonDeck'].concat(updatedDeck);
        if(this.pieces.length > 0) {
            this.secondFormGroup = this._formBuilder.group({
                secondCtrl: ['validated', Validators.required]
            });
        }
  		console.log("updating pieces");
  	}

    updateDeckPieceIndices(piecesObj: object) {
        let nonDeck = piecesObj['nonDeck'];
        let deck = piecesObj['deck'];

        let i = nonDeck.length;
        //remove 'undefined' pieces
        while(i--) {
            if(!nonDeck[i])
                nonDeck.splice(i, 1);
        }

        nonDeck.forEach((piece, index) => {
            if(piece['type'].endsWith('Deck')) {
              deck.forEach((el) => {
                  if(el['deckIndex'] !== index)
                      el['deckIndex'] = index;
                  else
                    return;
              });
            }
        });

        return deck;
    }

   updatePieces() {
        this.build.emitUpdates();
    }

    firstWarning() {
        if(this.isEmptyObject(this.selectedBoard)) {
            this.snackBar.open("You must select a board.", 'Close', {
                duration: 1000,
            });
        }
    }

    secondWarning() {
        if(this.pieces.length === 0) {
            this.snackBar.open("You must place at least one element.", 'Close', {
                duration: 1000,
            });
        }
        else
            this.piecesSet = true;
    }

  /*
  ** https://stackoverflow.com/questions/44337856/check-if-specific-object-is-empty-in-typescript
  */
    isEmptyObject(obj) {
        for(var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
           }
        }
    
        return true;
    }

}
