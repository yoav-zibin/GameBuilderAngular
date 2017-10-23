import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'dropzone'
})
export class DroppableDirective {
	public zPos:number = 0;
	@Output() onPiecesSet = new EventEmitter<object>();
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

        let text = event.dataTransfer.getData("text");

      	//let elem = document.createElement("img");
      	let elem = document.getElementById(text).cloneNode(true);

      	(elem as HTMLElement).id = (elem as HTMLElement).id + 'copy';
        (elem as HTMLElement).setAttribute("src", data["url"]);
        (elem as HTMLElement).setAttribute("alt", data["key"]);
        (elem as HTMLElement).classList.remove('currentlyDragged');

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

		(elem as HTMLElement).setAttribute('style', styleString);

        this.onPiecesSet.emit(
        	{
        		"img_key": data["key"],
        		"url": data["url"],
        		"xPos": newXPos,
        		"yPos": newYPos,
        		"zPos": this.zPos,
        	}
        );

		event.target.appendChild(elem);
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
