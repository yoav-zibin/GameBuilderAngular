import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'dropzone'
})
export class DroppableDirective {
	public zPos:number = 0;
	@Output() onPiecesSet = new EventEmitter<object[]>();
	public pieces: object[] = new Array();

  	constructor(private el: ElementRef) { }

	@HostListener('drop', ['$event'])
	onDrop(event) {
		console.log("drop");

		if(event.preventDefault)
			event.preventDefault();
        if(event.stopPropagation)
        	event.stopPropagation();

        let data = event.dataTransfer.getData("data");
        data = JSON.parse(data);

        let elem = document.createElement("img");
        elem.setAttribute("src", data["url"]);
        elem.setAttribute("alt", data["key"]);

        let xPos = event.clientX;
		let yPos = event.clientY;
		let container = document.getElementById("board-overlay");
		let offsets = container.getBoundingClientRect();

		console.log("mouse: " + xPos + " " + yPos);
		console.log("container: " + offsets.left + " " + offsets.top);
		console.log("scroll: " + window.scrollY);

		let newXPos = xPos - offsets.left - 25;
		let offsetCalc = offsets.top + window.scrollY;
		let newYPos = (yPos + window.scrollY) - offsetCalc - 25;

		let styleString = "position:absolute; top:" + newYPos + "px;" +
			"left:" + newXPos + "px; width:50px; height:50px; " +
			"z-index:" + (++this.zPos);

		elem.setAttribute('style', styleString);

        event.target.appendChild(elem);

        this.pieces.push(
        	{
        		"key": data["key"],
        		"url": data["url"],
        		"xPos": newXPos,
        		"yPos": newYPos,
        	});
		this.onPiecesSet.emit(this.pieces);

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
	}

	@HostListener('dragleave', ['$event'])
	onDragLeave(event) {
		console.log("drag leave");
	}

}
