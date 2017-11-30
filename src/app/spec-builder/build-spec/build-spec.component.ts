import { Component, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../auth/auth.service';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../../constants.js';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-build-spec',
  templateUrl: './build-spec.component.html',
  styleUrls: ['./build-spec.component.css']
})
export class BuildSpecComponent {
	@Input() selectedBoard: object;
	@Output() onPiecesSet = new EventEmitter<Map<string, object>>();

	zPos:number = 2;
	uniqueID: number = 0;
	dragged: boolean = false;
	piecesMap = new Map<string, object>();
	pieces: object[] = new Array();
	images: object[] = new Array();
	elements: object[] = new Array();
	imageData = new Map<string, object>();
	elementData = new Map<string, object>();
	elementImageIndex = new Map<string, object>();
	elementsRef: FirebaseListObservable<any[]>;
	imagesRef: FirebaseListObservable<any[]>;

	currentFilter = 'standard';
	options = [
		{value: 'mine', viewValue: 'My Uploads'},
		{value: 'standard', viewValue: 'Standard'},
		{value: 'toggable', viewValue: 'Toggable'},
		{value: 'dice', viewValue: 'Dice'},
		{value: 'card', viewValue: 'Card'},
		{value: 'cardsDeck', viewValue: 'Cards Deck'},
		{value: 'piecesDeck', viewValue: 'Pieces Deck'},
	]

	constructor(
		private auth: AuthService, 
		private db: AngularFireDatabase,
		private snackBar: MdSnackBar
	) {
  		if(this.auth.authenticated) {
  			console.log('got here');

  			let p = new Promise( (resolve, reject) => {

	  			this.imagesRef = db.list(constants.IMAGES_PATH, {
					query: {
						orderByChild: 'isBoardImage',
						equalTo: false,
					},
					preserveSnapshot: true
				});

				this.imagesRef.subscribe(snapshot => {
					console.log('creating image array');
					snapshot.forEach(data => {
						this.images.push(data.val());
						this.imageData.set(data.key, {
							'downloadURL': data.val().downloadURL,
							'name': data.val().name
						});
						if(this.imageData.size === snapshot.length)
							resolve("Got images!");
					})
				})
			});

			

			p.then( (msg) => {
				console.log(msg);
				
				this.elementsRef = db.list(constants.ELEMENTS_PATH, {
					query: this.buildQuery(),
					preserveSnapshot: true
				})

				this.elementsRef.subscribe(snapshot => {
					console.log('creating element array');
					snapshot.forEach(data => {
						let element = data.val();
						element['_key'] = data.key;
						let key = element.images[0]['imageId'];
						let img = this.imageData.get(key);
						
						if(img !== undefined) {
							element['downloadURL'] = img['downloadURL'];
							element['name'] = img['name'];
							this.elements.push(element);
							this.elementData.set(data.key, element);
							this.elementImageIndex.set(data.key, {
								'current': 0,
								'max': (element.images.length - 1),
							});
						}
					})
					console.log(this.elements);
				});
			}).catch( (error) => {
				console.log("something went wrong... " + error);
			})
		}
	}


	onChange(value){
		this.currentFilter = value;
		console.log("current filter: " + this.currentFilter);

		let p = new Promise( (resolve, reject) => {

			this.elementsRef = this.db.list(constants.ELEMENTS_PATH, {
				query: this.buildQuery(),
				preserveSnapshot: true
			})

			this.elements = new Array()

			this.elementsRef.subscribe(snapshot => {
				console.log('updating element array');
				snapshot.forEach(data => {
						let element = data.val();
						element['_key'] = data.key;
						let key = element.images[0]['imageId'];
						let img = this.imageData.get(key);
						
						if(img !== undefined) {
							element['downloadURL'] = img['downloadURL'];
							element['name'] = img['name'];
							this.elements.push(element);
							this.elementData.set(data.key, element);
							this.elementImageIndex.set(data.key, {
								'current': 0,
								'max': (element.images.length - 1),
							});
						}
					})
				// console.log(this.elements);
			});
		})
	}

	@HostListener('dragstart', ['$event'])
	onDragStart(event) {
		console.log("hello");
		this.dragged = true;
		
        event.target.classList.add('currentlyDragged');
        let url = event.target.getAttribute('src');
        let key = event.target.getAttribute('alt');

        console.log('key:' + key + ' url:' + url);
        event.dataTransfer.setData("data",
        	JSON.stringify({'key': key, 'url': url}));
        event.dataTransfer.setData("text", event.target.id);
	}

	@HostListener('dragend', ['$event'])
    onDragEnd(event) {
    	console.log("dragend");
        event.target.classList.remove('currentlyDragged');
	}

	@HostListener('dragenter', ['$event'])
	onDragEnter(event) {
		console.log("drag enter");
	}

	@HostListener('dragover', ['$event'])
	onDragOver(event) {
		if(event.preventDefault) {
    		console.log("prevent dragover!");
    		event.preventDefault();
    	}
    	console.log(event.clientX + " " + event.clientY);

        if(this.fromSource(event.dataTransfer.getData("text")))
			event.dataTransfer.dropEffect = "copy";
		else
			event.dataTransfer.dropEffect = "move";

	}

	@HostListener('dragleave', ['$event'])
	onDragLeave(event) {
		console.log("drag leave");
	}

  	@HostListener('drop', ['$event'])
	onDrop(event) {
		console.log("drop");
		
		let elem, xPos, yPos, styleString;
		let resize = false;

		let data = event.dataTransfer.getData("data");
        data = JSON.parse(data);
        let elementID = event.dataTransfer.getData("text");

		if(event.preventDefault)
			event.preventDefault();
        if(event.stopPropagation)
        	event.stopPropagation();

        if(event.target.id !== 'board-overlay') {
        	let parent = event.target.parentElement;

        	if(event.target.id === 'trash-can') {
				console.log('deleting piece');
				this.deleteElement(data, elementID);
				return
        	}
			else if(parent.id !== 'board-overlay') {
				console.log('abandoning drop')
				return
			}
		}

        // console.log('data: ' + data);
        // console.log('id:' + elementID);

        [xPos, yPos] = this.calculatePosition(event);
        // console.log('x:' + xPos);
        // console.log('y:' + yPos);


      	if(this.fromSource(elementID)) {
      		elem = this.copyElement(data, elementID);
      		elementID = (elem as HTMLElement).id;
      		resize = true;

      	}
      	else
      		elem = document.getElementById(elementID);

		elem = this.updateStyle(elem, xPos, yPos, resize);

		//scale coordinates for range (0,0)
		[xPos, yPos] = this.scaleCoord(xPos, yPos);
		console.log("final: " + xPos + " " + yPos);

		//TODO : toggle deck images
		let piece = {
    		"el_key": data["key"],
    		"url": data["url"],
    		"xPos": xPos,
    		"yPos": yPos,
    		"zPos": this.zPos,
    		"index": this.elementImageIndex.get(data["key"])["current"],
    		"deckIndex": null
    	}

		this.piecesMap.set(elementID, piece);
		// console.log(this.piecesMap);
        this.onPiecesSet.emit(this.piecesMap);

        if (event.target.nodeName !== "IMG") {
        	console.log('ok to drop here.')
    		event.target.appendChild(elem);
		}
		else {
			console.log('dropping in parent');
			event.target.parentNode.appendChild(elem);
		}
        
	}

	@HostListener('click', ['$event'])
	onClick(event) {
		if(this.dragged) {
			this.dragged = false;
			return;
		}

		if(event.target.id.indexOf('piece') === -1 ) {
			console.log("can't click here");
			return;
		}

		console.log('toggling!');
		let element = document.getElementById(event.target.id);
		let key = element.getAttribute('alt');
		let index = this.getImageIndex(key);
		let images = this.elementData.get(key)['images'];
		element.setAttribute(
			'src',
			this.imageData.get(images[index]['imageId'])['downloadURL']
		);

		let piece = this.piecesMap.get(event.target.id);
		piece['index'] = this.elementImageIndex.get(key)["current"];
		this.piecesMap.set(event.target.id, piece);
		// console.log(this.piecesMap);
        this.onPiecesSet.emit(this.piecesMap);

	}


	getImageIndex(key) {
		console.log(key);
		let indexData = this.elementImageIndex.get(key);
		console.log(indexData);
		let cur = indexData['current'];
		let max = indexData['max'];

		cur = (cur < max) ? (cur + 1) : 0;

		this.elementImageIndex.set(key, {
			'current': cur,
			'max': max
		});

		return cur;
	}

	scaleCoord(xPos, yPos) {
		xPos = (xPos * 100) / 512;
		yPos = (yPos * 100) / 512;
		return [xPos, yPos];
	}

	calculatePosition(event) {
		let xPos = event.clientX;
		let yPos = event.clientY;
		let container = document.getElementById("board-overlay");
		let offsets = container.getBoundingClientRect();

		console.log("mouse: " + xPos + " " + yPos);
		console.log("container: " + offsets.left + " " + offsets.top);
		console.log("scroll: " + window.scrollY);

		xPos = xPos - offsets.left - 25;
		let offsetCalc = offsets.top + window.scrollY;
		yPos = (yPos + window.scrollY) - offsetCalc - 25;

		console.log("fixed: " + xPos + " " + yPos + " " + (this.zPos + 1));

		return [xPos, yPos];
	}

	updateStyle(elem, xPos, yPos, resize) {
		let width = Number((elem as HTMLImageElement).width);
		let height = Number((elem as HTMLImageElement).height);
		if(resize) {
			width = width / 2;
			height = height / 2;
		}
		console.log("width: " + width + " height:" + height);
		let styleString = "position:absolute;"
			+ "top:" + yPos + "px;"
			+ "left:" + xPos + "px;"
			+ "width:" +  width + "px;" 
			+ "height:" + height + "px;"
			+ "z-index:" + (++this.zPos);
		console.log('zpos=' + this.zPos);
		(elem as HTMLElement).setAttribute('style', styleString);

		return elem;
	}

	fromSource(id) {
		return (id.indexOf('copy') > -1) ? false : true;
	}

	copyElement(data, id) {
		let elem = document.getElementById(id).cloneNode(true);
		(elem as HTMLElement).id = (elem as HTMLElement).id + 'copy' + this.uniqueID;
        (elem as HTMLElement).setAttribute("src", data["url"]);
        (elem as HTMLElement).setAttribute("alt", data["key"]);
        (elem as HTMLElement).classList.remove('currentlyDragged');
        this.uniqueID++;

        return elem;
	}

	deleteElement(data, id) {
		if(this.fromSource(id))
			return
		console.log(data);
		this.piecesMap.delete(id);
		console.log(this.piecesMap);
        this.onPiecesSet.emit(this.piecesMap);
        document.getElementById('board-overlay').removeChild(
        	document.getElementById(id));
        this.deleteWarning(data);
	}

	buildQuery() {
		if(this.currentFilter === 'mine')
			return {
				orderByChild: 'uploaderUid',
				equalTo: this.auth.currentUserId,
			}
		else {
			return {
				orderByChild: 'elementKind',
				equalTo: this.currentFilter,
			}
		}
	}

	deleteWarning(piece) {
    	this.snackBar.open("Removed " + piece['key'] + " from spec",
    		'Close', { duration: 1000 }
    	);
	}

}
