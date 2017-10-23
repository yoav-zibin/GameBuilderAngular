import { 
	Directive,
	ElementRef,
	Input,
	Output,
	HostListener,
	EventEmitter
} from '@angular/core';

@Directive({
  	selector: '[draggable]'
})
export class DraggableDirective {

  	constructor(private el: ElementRef) { }

  	@Input('draggable')
    isDraggable() {
        this.el.nativeElement.setAttribute('draggable', true);
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
