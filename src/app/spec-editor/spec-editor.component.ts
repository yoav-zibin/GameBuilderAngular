import { Component, OnInit, ViewChild } from '@angular/core';
import { BuildSpecComponent } from '../spec-builder/build-spec/build-spec.component';
import { MdSnackBar } from '@angular/material';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-spec-editor',
  templateUrl: './spec-editor.component.html',
  styleUrls: ['./spec-editor.component.css']
})
export class SpecEditorComponent implements OnInit {
    isLinear: boolean = true;
    selected: boolean = false;
    piecesSet: boolean = false;
    newStage: boolean = false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	selectedSpec: object = {};
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

    test() { console.log("test"); }
    
  	onSpecSelected(spec: object) {
        this.selected = true;
        this.newStage = true;
        this.selectedSpec = spec;
	    //console.log(this.selectedSpec);
	      this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['validated', Validators.required]
        });
  	    console.log("receiving spec");
  	}

    onNewStage(stage: boolean) {
        console.log('stage is ' + stage);
        this.newStage = stage;
    }

    onBoardSelected(board: object) {
        this.selectedBoard = board;
        console.log("receiving board");
    }

    onPiecesSelected(pieces: object[]) {
        this.pieces = pieces;
        console.log('receiving pieces');
    }

  	onPiecesSet(piecesObj: object) {
        let uid = this.selectedSpec['uploaderUid'];
        let updatedDeck = this.updateDeckPieceIndices(piecesObj);
        this.pieces = piecesObj['nonDeck'].concat(updatedDeck);

    		if(this.pieces.length > 0 && uid === this.auth.currentUserId) {
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

        let prevCount = 0;

        nonDeck.forEach((piece, index) => {
            if(piece['type'].endsWith('Deck')) {
                for(let i = prevCount; i < (prevCount + piece['deckPieceCount']); i++) {
                    if(deck[i]['deckIndex'] !== index)
                        deck[i]['deckIndex'] = index; 
                }

                prevCount += piece['deckPieceCount'];
            }
        });

        return deck;
    }

    resetStage() {
        this.newStage = !this.newStage;
        this.pieces = new Array();
        console.log('resetting');
    }

    updatePieces() {
        this.build.emitUpdates();
    }

    firstWarning() {
    	if(this.isEmptyObject(this.selectedSpec)) {
        	this.snackBar.open("You must select a spec.", 'Close', { 
        		duration: 1000,
        	});
        }
	}

	secondWarning() {
        let uid = this.selectedSpec['uploaderUid'];
        if(uid !== this.auth.currentUserId) {
		    this.snackBar.open("You may only modify your own specs.", 'Close', {
                duration: 1000,
            });
        }
        else if(this.pieces.length === 0) {
      		this.snackBar.open("You must place at least one element.", 'Close', {
        		duration: 1000,
      		});
    	}
    	else {
            console.log('pieces?');
            console.log(this.pieces);
      		this.piecesSet = true;
        }
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
