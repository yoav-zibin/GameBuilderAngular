import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import * as Konva from 'konva';

let instance;
function eventHandler(type, event, obj?) {
  if(type === 'dragstart') {
    instance.onDragStart(event);
  }
  else if(type === 'dragend') {
    instance.onDragEnd(event);
  }
  else if(type === 'click') {
    instance.onClick(event, obj);
  }
}

@Injectable()
export class KonvaService {
    private stage;
    private layer;
    private dragLayer;
    private specUpdateSubj = new Subject<any>();
    private elements;

    specUpdateObs$ = this.specUpdateSubj.asObservable();

    constructor() {
      instance = this;
    }

    buildImage(imageObj, xPos, yPos) {
      let img = new Konva.Image({
          x: xPos,
          y: yPos,
          image: imageObj,
          draggable: true,
      });

      img.on('click', function(event) {
        eventHandler('click', event, this);
      })
      // this doesn't work with cross-origin image sources
      //img.cache();
      //img.drawHitFromCache(0);
      return img;
    }

    updateImage(index, url) {
      let img = this.stage.children[0].children[index];
      let image = img.attrs.image;
      image['src'] = url
      console.log(image);
      console.log(url);
      this.stage.draw();
    }

    buildStage(container) {

        this.stage = new Konva.Stage({
            container: container,
            width: 512,
            height: 512,
        });

        this.layer = new Konva.Layer();
        //this.dragLayer = new Konva.Layer();

        this.stage.add(this.layer);
        //this.stage.add(this.layer, this.dragLayer);

        this.stage.on('dragstart', function(event) {
            eventHandler('dragstart', event);
        });

        this.stage.on('dragend', function(event) {
            eventHandler('dragend', event);
        });

    }

    onDrop(obj) {
        this._onDrop(obj);
        this.stage.draw();
    }

    _onDrop(obj) {
        console.log('konva drop!');
        
        let imageObj = new Image(obj['width'], obj['height']);
        imageObj.src = obj['src'];
        
        let img = this.buildImage(imageObj, obj['xPos'], obj['yPos']);
        img.moveTo(this.layer)
    }

    onCardDeckDrop(deck, x, y) {
        let count = deck.length;
        for(let el of deck) {
            // don't add 'deck' to board
            console.log(el);

            let imageObj = {
                'xPos': x,
                'yPos': y,
                'src': el['downloadURL'], 
                'width': el['width'],
                'height': el['height']
            }
            console.log('DECK DROP');
            console.log(imageObj);
            this._onDrop(imageObj);
            this.stage.draw();
        }
    }

    onPiecesDeckDrop(deck, x, y) {
        let count = deck.length;
        for(let el of deck) {

            let imageObj = {
                'xPos': (x += 2),
                'yPos': (y += 2),
                'src': el['downloadURL'], 
                'width': el['width'],
                'height': el['height']
            }
            console.log('DECK DROP');
            console.log(imageObj);
            this._onDrop(imageObj);
            this.stage.draw();
        }

    }

    onDragStart(event) {
      console.log("konva dragstart");
      /*
      // moving to another layer will improve dragging performance ??
      event.target.moveTo(this.dragLayer)
      this.dragLayer.draw();
      */
    }

    onDragEnd(event) {
      console.log('konva dragend');
      this.sendUpdatedPieceSet()

      /*
      event.target.moveTo(this.layer);
      this.layer.draw();
      this.dragLayer.draw();
      */
    }

    onClick(event, obj) {
      let toggled = obj.index;
      this.sendUpdatedPieceSet(toggled);
    }

    sendUpdatedPieceSet(toggled?) {
      let pieces = this.stage.children[0].children;
      let pkg = [ pieces, toggled ];
      this.specUpdateSubj.next(pkg);
    }

}