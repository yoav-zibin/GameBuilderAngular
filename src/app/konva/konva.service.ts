import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import * as Konva from 'konva';

let instance;
function eventHandler(type, event, obj?) {
  if(type === 'dragstart') {
    instance.onDragStart(event, obj);
  }
  else if(type === 'dragend') {
    instance.onDragEnd(event, obj);
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
    private images: any[];

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
      });
      img.on('dragstart', function(event) {
        eventHandler('dragstart', event, this);
      });
      img.on('dragend', function(event) {
        eventHandler('dragend', event, this);
      });

      // this doesn't work with cross-origin image sources
      //img.cache();
      //img.drawHitFromCache(0);
      return img;
    }

    updateImage(id, url) {
      let images = this.stage.children[0].children;
      for(let image of images) {
          if(image._id === id) {
              let img = image.attrs.image;
              img['src'] = url;
              break;
          }
      }
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

    }

    onDrop(img) {
        this._onDrop(img);
        this.stage.draw();
    }

    _onDrop(img) {
        console.log('konva drop!');
        
        let imageObj = new Image(img['width'], img['height']);
        imageObj.src = img['src'];
        //imageObj.crossOrigin = "Anonymous";
        
        let image = this.buildImage(imageObj, img['xPos'], img['yPos']);
        console.log(image);
        image.moveTo(this.layer)
    }

    onCardDeckDrop(deck, x, y) {
        let count = deck.length;
        for(let el of deck) {

            let imageObj = {
                'xPos': x,
                'yPos': y,
                'src': el['downloadURL'], 
                'width': el['width'],
                'height': el['height']
            }
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
            this._onDrop(imageObj);
            this.stage.draw();
        }

    }

    onDragStart(event, img) {
      console.log("konva dragstart");
      img.setZIndex(img.getAbsoluteZIndex() + 1);
      /*
      // moving to another layer will improve dragging performance ??
      event.target.moveTo(this.dragLayer)
      this.dragLayer.draw();
      */
    }

    onDragEnd(event, img) {
      console.log('konva dragend');
      this.sendUpdatedPieceSet(this.getIndex(img), 'dragged');

      /*
      event.target.moveTo(this.layer);
      this.layer.draw();
      this.dragLayer.draw();
      */
    }

    onClick(event, img) {
      this.sendUpdatedPieceSet(this.getIndex(img), 'toggled');
    }

    sendUpdatedPieceSet(id, message) {
      let pieces = this.stage.children[0].children;
      let pkg = [ pieces, id, message];
      this.specUpdateSubj.next(pkg);
    }

    getIndex(img) {
        console.log('check id here');
        console.log(img);
        // get zero-based index from image._id
        // stage and layer have _ids 1 and 2
        return img._id - 3;
    }

}