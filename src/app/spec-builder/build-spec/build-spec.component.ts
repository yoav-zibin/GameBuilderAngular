import { Component, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../../constants.js';

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
	piecesMap = new Map<string, object>();
	pieces: object[] = new Array();
	images: object[] = new Array();
	elements: object[] = new Array();
	imageData = new Map<string, object>();
	elementsRef: FirebaseListObservable<any[]>;
	imagesRef: FirebaseListObservable<any[]>;

	currentFilter = 'all';
	options = [
		{value: 'all', viewValue: 'All Elements'},
		{value: 'standard', viewValue: 'Standard'},
		{value: 'toggable', viewValue: 'Toggable'},
		{value: 'dice', viewValue: 'Dice'},
		{value: 'card', viewValue: 'Card'},
		{value: 'cardsDeck', viewValue: 'Cards Deck'},
		{value: 'piecesDeck', viewValue: 'Pieces Deck'},
	]

	constructor(
		private auth: AuthService, 
		private db: AngularFireDatabase
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
					preserveSnapshot: true
				})

				this.elementsRef.subscribe(snapshot => {
					console.log('creating element array');
					snapshot.forEach(data => {
						let element = data.val();
						let key = element.images[0]['imageId'];
						let img = this.imageData.get(key);
						
						if(img !== undefined) {
							console.log('ok to go');
							element['downloadURL'] = img['downloadURL'];
							element['name'] = img['name'];
							this.elements.push(element);
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
					let key = element.images[0]['imageId'];
					let img = this.imageData.get(key);
					
					if(img !== undefined) {
						console.log('ok to go');
						element['downloadURL'] = img['downloadURL'];
						element['name'] = img['name'];
						this.elements.push(element);
					}
				})
				console.log(this.elements);
			});
		})
	}

	@HostListener('dragstart', ['$event'])
	onDragStart(event) {
		console.log("hello");
		
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

		let data = event.dataTransfer.getData("data");
        data = JSON.parse(data);
        let elementID = event.dataTransfer.getData("text");

		if(event.preventDefault)
			event.preventDefault();
        if(event.stopPropagation)
        	event.stopPropagation();

        if(event.target.id !== 'board-overlay') {
        	if(event.target.id === "trash-can") {
				console.log("deleting piece");
				this.deleteElement(data, elementID);
        	}
			else
				console.log("abandoning drop")
			return
		}

        console.log('data: ' + data);
        console.log('id:' + elementID);

        [xPos, yPos] = this.calculatePosition(event);
        console.log('x:' + xPos);
        console.log('y:' + yPos);


      	if(this.fromSource(elementID)) {
      		elem = this.copyElement(data, elementID);
      		elementID = (elem as HTMLElement).id;
      	}
      	else
      		elem = document.getElementById(elementID);

		
		elem = this.updateStyle(elem, xPos, yPos);

		//scale coordinates for range (0,0)
		[xPos, yPos] = this.scaleCoord(xPos, yPos);
		console.log("final: " + xPos + " " + yPos);

		let piece = {
    		"img_key": data["key"],
    		"url": data["url"],
    		"xPos": xPos,
    		"yPos": yPos,
    		"zPos": this.zPos,
    	}

		this.piecesMap.set(elementID, piece);
		console.log(this.piecesMap);
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

	updateStyle(elem, xPos, yPos) {
		let styleString = "position:absolute; top:" + yPos + "px;" +
				"left:" + xPos + "px; width:50px; height:50px; " +
				"z-index:" + (++this.zPos);
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
		
		this.piecesMap.delete(id);
		console.log(this.piecesMap);
        this.onPiecesSet.emit(this.piecesMap);
        document.getElementById('board-overlay').removeChild(
        	document.getElementById(id));
	}

	buildQuery() {
		if(this.currentFilter === 'all')
			return {
				orderByChild: 'elementKind'
			}
		else {
			return {
				orderByChild: 'elementKind',
				equalTo: this.currentFilter,
			}
		}
	}

	/*
	TO DO: popover warning when hover on trash
	
	deleteWarning(){
		return "Warning! You're about to delete this piece!"
	}
	*/

}
