import { Component, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../../constants.js'

@Component({
  selector: 'app-build-spec',
  templateUrl: './build-spec.component.html',
  styleUrls: ['./build-spec.component.css']
})
export class BuildSpecComponent{
	@Input() selectedBoard: object;
	@Output() onPiecesSet = new EventEmitter<object>();

	public zPos:number = 0;
	public pieces: object[] = new Array();
	images: FirebaseListObservable<any[]>;

  constructor(
		public afAuth: AngularFireAuth, 
		public db: AngularFireDatabase
	) {
		this.images = db.list(constants.IMAGES_PATH, {
			query: {
				orderByChild: 'isBoardImage',
				equalTo: false,
			}
		});

	}

	@HostListener('dragstart', ['$event'])
	onDragStart(event) {
		console.log("hello");
		
        event.target.classList.add('currentlyDragged');
        let url = event.target.getAttribute('src');
        let key = event.target.getAttribute('alt');

        console.log('key:' + key + 'url:' + url);
        event.dataTransfer.setData("data",
        	JSON.stringify({'key': key, 'url': url}));
        event.dataTransfer.setData("text", event.target.id);
			event.dataTransfer.dropEffect = "copy";
	}

	@HostListener('dragend', ['$event'])
    onDragEnd(event) {
    	console.log("goodbye");
        event.target.classList.remove('currentlyDragged');
	}

  	@HostListener('drop', ['$event'])
	onDrop(event) {
		console.log("drop");
		
		let elem, xPos, yPos, styleString;

		if(event.preventDefault)
			event.preventDefault();
        if(event.stopPropagation)
        	event.stopPropagation();

        let data = event.dataTransfer.getData("data");
        data = JSON.parse(data);
        let elementID = event.dataTransfer.getData("text");

        console.log('data: ' + data);
        console.log('id:' + elementID);

        [xPos, yPos] = this.calculatePosition(event);
        console.log('x:' + xPos);
        console.log('y:' + yPos);


      	if(this.fromSource(elementID))
      		elem = this.copyElement(data, elementID);
      	else
      		elem = document.getElementById(elementID);

		
		elem = this.updateStyle(elem, xPos, yPos);

		//scale coordinates for range (0,0)
		[xPos, yPos] = this.scaleCoord(xPos, yPos);
		console.log("final: " + xPos + " " + yPos);

        this.pieces.push(
        	{
        		"img_key": data["key"],
        		"url": data["url"],
        		"xPos": xPos,
        		"yPos": yPos,
        		"zPos": this.zPos,
        	}
        );

        this.onPiecesSet.emit(this.pieces);

        event.target.appendChild(elem);
	}

	scaleCoord(xPos, yPos) {
		//TODO
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
		(elem as HTMLElement).setAttribute('style', styleString);

		return elem;
	}

	fromSource(id) {
		return (id.indexOf('copy') > -1) ? false : true;
	}

	copyElement(data, id) {
		let elem = document.getElementById(id).cloneNode(true);
		(elem as HTMLElement).id = (elem as HTMLElement).id + 'copy';
        (elem as HTMLElement).setAttribute("src", data["url"]);
        (elem as HTMLElement).setAttribute("alt", data["key"]);
        (elem as HTMLElement).setAttribute('draggable', "true");
        (elem as HTMLElement).classList.remove('currentlyDragged');

        return elem;
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
    	event.dataTransfer.dropEffect = "copy";
		console.log(event.clientX + " " + event.clientY);
	}

	@HostListener('dragleave', ['$event'])
	onDragLeave(event) {
		console.log("drag leave");
	}

}
