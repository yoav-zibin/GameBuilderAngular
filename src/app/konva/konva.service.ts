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

    buildImage(imageObj, xPos, yPos, pos, type) {
      let img:any = new Konva.Image({
          x: xPos,
          y: yPos,
          image: imageObj,
          draggable: true
      });
      img.name = pos;
      img.type = type;
      img.on('click', function(event) {
        eventHandler('click', event, this);
      });
      img.on('dragstart', function(event) {
        eventHandler('dragstart', event, this);
      });
      img.on('dragend', function(event) {
        eventHandler('dragend', event, this);
      });

      // works now, but very slow
      //img.cache();
      //img.drawHitFromCache();
      return img;
    }

    updateImage(id, url) {
      let images = this.stage.children[0].children;
      for(let image of images) {
          if(image.name == id) {
              image.attrs.image['src'] = url;
              image.moveTo(this.layer)
              image.show()
              image.draw()
              
              this.layer.draw()
              break;
          }
      }
      
    //   this.layer.draw()
      this.stage.draw();
    }

    shuffle(deckElemIndexMap, deckPosMap){
        let images = this.stage.children[0].children
        //key: deck index
        //console.log(deckElemIndexMap)
        //console.log(deckPosMap)
        for(let key of Array.from(deckElemIndexMap.keys())) {
            let cardIndexArr = deckElemIndexMap.get(key)
            let offset = 0
            cardIndexArr.forEach(index => {
                for(let image of images) {
                    // console.log(image.name)
                    // console.log(image['name'])
                    if(image.name == index) {
                        // console.log(image)
                        // console.log(offset)
                        image.attrs.z = offset
                        // image.setZIndex(image.getAbsoluteZIndex() + 1)
                        
                        // image.setZIndex()
                        var tween = new Konva.Tween({
                            node: image,
                            duration: 0,
                            x: deckPosMap.get(key)[0] + offset * 0.1 / 100 * 512,
                            y: deckPosMap.get(key)[1] + offset * 0.1 / 100 * 512,
                            // z: image.getAbsoluteZIndex() + 1
                        });
                        tween.play()
                        image.moveToTop()
                        this.layer.draw()
                        offset++
                        break;
                    }
                }
                
            });
        }
        
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

    buildStageWithPieces(container, pieces) {
        this.buildStage(container);
        for(let piece of pieces) {
            this.onDrop(piece);
        }
    }

    buildWithPieces(container, pieces) {
        this.stage.clear()
        this.stage.clearCache()
        this.buildStageWithPieces(container, pieces)
    }

    onDrop(img) {
        this._onDrop(img);
        this.stage.draw();
    }

    _onDrop(img) {
        console.log('konva drop!');
        
        let imageObj = new Image(img['width'], img['height']);
        //imageObj.crossOrigin = "Anonymous";
        imageObj.src = img['src'];
        
        let image = this.buildImage(
          imageObj, img['xPos'], img['yPos'], img['pos'], img['type']);
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

            //should pieceElements be layered like this?
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

      /*
      // moving to another layer will improve dragging performance ??
      event.target.moveTo(this.dragLayer)
      this.dragLayer.draw();
      */
    }

    onDragEnd(event, img) {
      console.log('konva dragend');
      console.log(img);
      this.sendUpdatedPieceSet(img.name, 'dragged');

      /*
      event.target.moveTo(this.layer);
      this.layer.draw();
      this.dragLayer.draw();
      */
    }

    onClick(event, img) {
        if(event.evt.altKey) {
            console.log('deleting image');
            img.destroy();
            this.stage.draw();
            this.sendUpdatedPieceSet(img.name, 'deleted');
        }
        else {
            this.sendUpdatedPieceSet(img.name, 'toggled');
        }
    }

    sendUpdatedPieceSet(id, message) {
      let pieces = this.stage.children[0].children;
      let pkg = [ pieces, id, message];
      this.specUpdateSubj.next(pkg);
    }


}