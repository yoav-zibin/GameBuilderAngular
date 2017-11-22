import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js';

@Component({
	selector: 'app-spec-viewer',
	templateUrl: './spec-viewer.component.html',
	styleUrls: ['./spec-viewer.component.css']
})
export class SpecViewerComponent implements OnInit {

	specs: FirebaseListObservable<any[]>;
	spec: Object;
	blocked: boolean;
	currentSpec: string;
	imagesRef: FirebaseListObservable<any[]>;
	images: object[] = new Array();
	imageData = new Map<string, object>();
	map = new Map<String, String>()
	elementData = new Map<string, object>();
	elementImageIndex = new Map<string, object>();
	elementsRef: FirebaseListObservable<any[]>;
	elements: object[] = new Array();

	pieceData = new Map<String, Object>();
	piecesRef: FirebaseListObservable<any[]>;
	pieces: object[] = new Array();
	imageURL: String;

	constructor(
		private auth: AuthService,
		private db: AngularFireDatabase
	) {
		if (this.auth.authenticated) {
			console.log('got here');

			this.specs = db.list(constants.SPECS_PATH);

			let p = new Promise((resolve, reject) => {

				this.imagesRef = db.list(constants.IMAGES_PATH, {
					query: {
						orderByChild: 'isBoardImage',
						equalTo: true,
					},
					preserveSnapshot: true
				});

				this.imagesRef.subscribe(snapshot => {
					console.log('creating image array');
					snapshot.forEach(data => {
						this.images.push(data.val());
						// this.imageData.set(data.key, {
						// 	'downloadURL': data.val().downloadURL,
						// 	'name': data.val().name
						// });
						// console.log(data.val())
						this.imageData.set(data.key, {
							'downloadURL': data.val().downloadURL,
							'name': data.val().name
						});
						this.map.set(data.key, data.val().downloadURL)
						if (this.imageData.size === snapshot.length)
							resolve("Got images!");
						// console.log(data.key)
					})
				})
			});

			p = new Promise((resolve, reject) => {

				this.piecesRef = db.list(constants.IMAGES_PATH, {
					query: {
						orderByChild: 'isBoardImage',
						equalTo: false,
					},
					preserveSnapshot: true
				});

				this.piecesRef.subscribe(snapshot => {
					console.log('creating pieces array');
					snapshot.forEach(data => {
						this.pieces.push(data.val());
						// console.log(data.val())
						this.pieceData.set(data.key, {
							'downloadURL': data.val().downloadURL,
							'name': data.val().name
						});
						if (this.pieceData.size === snapshot.length)
							resolve("Got images!");
						// console.log(data.key)
					})
				})
			});
		}
	}

	ngOnInit() {
		this.blocked = this.auth.isAnonymous || !this.auth.authenticated;
	}

	onChange(value) {
		// console.log(this.imageData.keys())
		// console.log(this.images[0]['downloadURL'])
		// console.log(this.map)
		this.currentSpec = value;
		// console.log(this.currentSpec);

		this.db.object(constants.SPECS_PATH + '/' + value, {
			preserveSnapshot: true
		})
			.subscribe(snap => {
				this.spec = snap.val();
			});

		console.log(this.spec)

		let imageId = this.spec['board']['imageId']
		this.imageURL = this.imageData.get(imageId)['downloadURL']

		
		// console.log(this.map.get(this.spec['board']['imageId']))
		// console.log(this.imageURL)

	}


}
