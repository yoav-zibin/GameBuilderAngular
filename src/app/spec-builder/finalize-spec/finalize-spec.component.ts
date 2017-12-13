import { Component, Input } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import constants from '../../../constants.js'
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-finalize-spec',
  templateUrl: './finalize-spec.component.html',
  styleUrls: ['./finalize-spec.component.css']
})
export class FinalizeSpecComponent{
	@Input() selectedBoard: object;
  @Input() selectedSpec: object;
	@Input() pieces: object[] = new Array();
  specsRef: FirebaseListObservable<any[]>;
  unique:boolean;
	generated: boolean = false;
	gameSpec: object;
	
	//gameSpec
	userID: string;
	userEmail: string;
	gameName: string;
	wiki: string;
	tutorial: string;
	icon_50: string = '-KwqEPnE2xzAON9V2mcP';
	icon_512: string = '-KwqEjlZ_sv95XrfTn5z';

	//boardSpec
	bgColor: string;
	maxScale: number;

	//pieceSpec


  constructor(
  	private auth: AuthService,
  	private db: AngularFireDatabase,
  	private router: Router,
    private snackBar: MdSnackBar
  ) { }

  createGameSpec() {
    this.userID = this.auth.currentUserId;
    this.userEmail = this.auth.currentUserName;
    this.wiki =
      (<HTMLInputElement>document.getElementById("wikiURL")).value;
    this.tutorial =
      (<HTMLInputElement>document.getElementById("youtubeURL")).value;
  	this.gameSpec = {
  		'uploaderEmail': this.userEmail,
  		'uploaderUid': this.userID,
  		'createdOn': firebase.database.ServerValue.TIMESTAMP,
  		'gameName': this.gameName,
  		'gameIcon50x50': this.icon_50,
  		'gameIcon512x512': this.icon_512,
  		'wikipediaUrl': (this.wiki || 'https://no-wiki.com'),
  		'tutorialYoutubeVideo': (this.tutorial.substr(-11) || 'no_vid_here'),
  		'board': this.createBoardSpec(),
  		'pieces': this.createPiecesSpecArray(),
  	};
    this.generated = true;
  }

  createBoardSpec() {
  	let boardSpec = {
  		'imageId': this.selectedBoard['key'],
  		'backgroundColor': (this.bgColor || 'FFFFFF'),
  		'maxScale': (this.maxScale || 1),
  	};
  	return boardSpec
  }

  createPiecesSpecArray() {
  	let pieceList = [];
  	for(let piece of this.pieces) {
  		pieceList.push(this.createPieceSpec(piece))
  	}
  	return pieceList;
  }

  createPieceSpec(piece) {
  	let pieceSpec = {
  		'pieceElementId': piece['el_key'],
  		'initialState': {
  			'x': piece['xPos'],
  			'y': piece['yPos'],
  			'zDepth': piece['zPos'],
  			'currentImageIndex': piece['index'],
  			'cardVisibilitiy': [],
  			'drawing': [],
  		},
  		'deckPieceIndex': piece['deckIndex'],
  	};
  	return pieceSpec
  }

  uploadGameSpec() {
    if(!this.unique) {
      this.raiseSnackBar("This game name already exists. Please choose another.");
      return;
    }
  	console.log("uploading...")
  	this.db.database.ref(constants.SPECS_PATH).push(this.gameSpec)
  		.then(result => {
  			this.router.navigate(['/']).then(result => {
  				this.raiseSnackBar("Successfully uploaded spec!");
  			})
  		})
  		.catch(error => {
  			console.log(error.message);
  		})
  }

  updateGameSpec() {
    console.log("updating...");
    let specID = this.selectedSpec['$key'];
    this.db.database.ref(constants.SPECS_PATH + '/' + specID).set(this.gameSpec)
      .then(result => {
        this.router.navigate(['/']).then(result => {
          this.raiseSnackBar("Successfully updated spec!");
        })
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  isValid() {
    let valid = true;
    this.gameName =
      (<HTMLInputElement>document.getElementById("gameName")).value;
    if(this.gameName === "") {
      this.raiseSnackBar("Game name must contain at least one character.");
      valid = false;
    }
    
    /* run async check for duplicate names */
    this.isUnique()

    return valid;
  }

  isUnique() {
    this.unique = false;

    this.specsRef = this.db.list(constants.SPECS_PATH, {
        query: {
          orderByChild: "gameName",
          equalTo: this.gameName,
        },
        preserveSnapshot: true
    });

    this.specsRef.subscribe(snapshot => {
      if(snapshot.length === 0)
        this.unique = true;
    });

  }

  raiseSnackBar(message) {
      this.snackBar.open(message, 'Close', { duration: 1000 });
  }

}
