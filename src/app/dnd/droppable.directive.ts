import { Directive, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'dropzone'
})
export class DroppableDirective {
	public zPos:number = 0;

  	constructor(private el: ElementRef) { }

  	@Input('droppable')
    isDroppable() {
        this.el.nativeElement.setClass('droppable');
	}

	@HostListener('drop', ['$event'])
	onDrop(event) {
		console.log("drop");

		if(event.preventDefault)
			event.preventDefault();
        if(event.stopPropagation)
        	event.stopPropagation();

        let data = event.dataTransfer.getData("data");
        let text = event.dataTransfer.getData("text/html")
        data = JSON.parse(data);
        console.log(data);
        console.log(text);

        console.log(event.target);

        /*
        let wrapper = document.createElement("div");
        wrapper.classList.add('piece-wrapper');
		*/

        let elem = document.createElement("img");
        elem.setAttribute("src", data["url"]);
        elem.setAttribute("alt", data["key"]);
        elem.classList.add('placed');

        let xPos = event.clientX;
		let yPos = event.clientY;
		let styleString = "top:" + xPos + "px; left:" + yPos + "px";
        elem.setAttribute('style', styleString)

        //wrapper.appendChild(elem)
        event.target.appendChild(elem);

		console.log("mouse: " + xPos + " " + yPos);

		/*
		let style = window.getComputedStyle(event.target, null);
		let dropX = parseInt(style.getPropertyValue("top"), 10)
		let dropY = parseInt(style.getPropertyValue("left"),10)
		*/

		/*
		console.log("box: " + dropX + " " + dropY);

		elem.style.top = (xPos - dropX) + "";
		elem.style.left = (yPos - dropY) + "";

		console.log("final: " + elem.style.top + " " + elem.style.left);
		//elem.style.width = '50px';
		//elem.style.height = '50px';

		*/

        /*
        let dragData = JSON.parse(data).dd;
        let xPos = dragData['xPos'];
        let yPos = dragData['yPos'];
        console.log(dragData);

        this.el.nativeElement.style.left =
        	(xPos - this.el.nativeElement.offsetWidth/2) + 'px';
		this.el.nativeElement.style.top =
			(yPos - this.el.nativeElement.offsetHeight/2) + 'px';
		this.el.nativeElement.style.zIndex = '' + (++this.zPos);

		console.log(this.el.nativeElement.style.left);
		console.log(this.el.nativeElement.style.top);
		*/

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
