import { Component, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import constants from '../../constants.js'
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-finalize-spec',
  templateUrl: './finalize-spec.component.html',
  styleUrls: ['./finalize-spec.component.css']
})
export class FinalizeSpecComponent {
	@Input() selectedBoard: object;
	@Input() pieces: object[];

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
  	public db: AngularFireDatabase
  ) { 
	this.userID = this.auth.currentUserId;
	this.userEmail = this.auth.currentUserName;
  }


  createGameSpec() {
  	this.generated = false;
  	this.gameSpec = {
		'uploaderEmail': this.userEmail,
		'uploaderUid': this.userID,
		'createdOn': firebase.database.ServerValue.TIMESTAMP,
		'gameName': (this.gameName || 'default'),
		'gameIcon50x50': this.icon_50,
		'gameIcon512x512': this.icon_512,
		'wikipediaUrl': (this.wiki || 'https://no-wiki.com'),
		'tutorialYoutubeVideo': (this.tutorial || 'no_vid_here'),
		'board': this.createBoardSpec(),
		'pieces': this.createPiecesSpec(),
	}

	this.generated = true;
	console.log(this.gameSpec);
  }

  createBoardSpec() {
  	let boardSpec = {
  		'imageId': this.selectedBoard['key'],
  		'backgroundColor': (this.bgColor || 'FFFFFF'),
  		'maxScale': (this.maxScale || 1),
  	};
  	return boardSpec
  }

  createPiecesSpec() {
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
  			'currentImageIndex': 0,
  			//'cardVisibilitiy': [],
  			//'drawing'
  		},
  		'deckPieceIndex': -1,
  	};
  	return pieceSpec
  }

  uploadGameSpec() {
  	console.log("uploading...")
  	this.db.database.ref(constants.SPECS_PATH).push(this.gameSpec)
  		.then(result => {
  			console.log("this worked!")
  		})
  		.catch(error => {
  			console.log(error.message);
  		})
  }

}
