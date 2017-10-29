import { Component, Input } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import constants from '../../../constants.js'
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-finalize-spec',
  templateUrl: './finalize-spec.component.html',
  styleUrls: ['./finalize-spec.component.css']
})
export class FinalizeSpecComponent {
	@Input() selectedBoard: object;
	@Input() piecesMap: Map<string, object>;
  pieces: object[];

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
  	private router: Router
  ) { }

  createPiecesArray() {
    this.pieces = Array.from(this.piecesMap.values());
    console.log(this.pieces);
  }

  createGameSpec() {
    this.userID = this.auth.currentUserId;
    this.userEmail = this.auth.currentUserName;
    this.createPiecesArray();
  	this.gameName = (<HTMLInputElement>document.getElementById("gameName")).value;
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
      piece = this.addElementID(piece);
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
  			this.router.navigate(['/']).then(result => {
  				alert("Uploaded Spec!");
  			})
  		})
  		.catch(error => {
  			console.log(error.message);
  		})
  }

  addElementID(piece: object) {
    let img_key = piece['img_key'];
    let matched = false;

    this.db.list(constants.ELEMENTS_PATH, { preserveSnapshot: true})
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          let data = snapshot.val();
          for(let image of data['images']) {
              if(image['imageId'] === img_key && !matched) {
                matched = true;
                console.log('found match');
              piece['el_key'] = snapshot.key;
              }
          }
        });
      })
    return piece;
  }

}
