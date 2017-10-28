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
        (elem as HTMLElement).setAttribute('draggable', "true");
        (elem as HTMLElement).classList.remove('currentlyDragged');

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

		let styleString = "position:absolute; top:" + yPos + "px;" +
			"left:" + xPos + "px; width:50px; height:50px; " +
			"z-index:" + (++this.zPos);

		//scale coordinates for range (0,0)
		let finalX = this.scaleCoord(xPos);
		let finalY = this.scaleCoord(yPos);
		console.log("final: " + finalX + " " + finalY);

		(elem as HTMLElement).setAttribute('style', styleString);

        this.onPiecesSet.emit(
        	{
        		"img_key": data["key"],
        		"url": data["url"],
        		"xPos": finalX,
        		"yPos": finalY,
        		"zPos": this.zPos,
        	}
        );

		event.target.appendChild(elem);
	}

	scaleCoord(coord) {
		// (0, 0) should be top left corner
		//TO DO
		return coord;
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

	@HostListener('dragstart', ['$event'])
	onDragStart(event) {
		console.log("hello");
		
	    if (this.el.nativeElement === event.target) {
	        event.target.classList.add('currentlyDragged');
	        let url = this.el.nativeElement.getAttribute('src');
	        let key = this.el.nativeElement.getAttribute('alt');
	        event.dataTransfer.setData("data",
	        	JSON.stringify({'key': key, 'url': url}));
	        event.dataTransfer.setData("text", event.target.id);
 			event.dataTransfer.dropEffect = "copy";
	    }
	}

	@HostListener('dragend', ['$event'])
    onDragEnd(event) {
    	console.log("goodbye");
        if (this.el.nativeElement === event.target) {
            event.target.classList.remove('currentlyDragged');
        }
	}

}
