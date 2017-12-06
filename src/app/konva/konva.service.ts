import { Injectable } from '@angular/core';
import * as Konva from 'konva';

@Injectable()
export class KonvaService {
    stage;
    layer;
    dragLayer;

    constructor() { }
    /*
    addImage(image, layer, stage) {
        console.log('building image!');
        let imageObj = new Image();
            imageObj.onload = function() {
                let img = new Konva.Image({
                    x: image.xPos,
                    y: image.yPos,
                    image: imageObj,
                    draggable: true,
                });
                //img.cache();
                //img.drawHitFromCache(0);

                layer.add(img);
                stage.draw()

            };
            imageObj.src = image.url;
         console.log('image built!');
        return imageObj;
    }
    */

    buildImage(imageObj, xPos, yPos) {
      let img = new Konva.Image({
          x: xPos,
          y: yPos,
          image: imageObj,
          draggable: true,
      });
      //img.cache();
      //img.drawHitFromCache(0);
      return img;
    }

    buildStage(container) {

        this.stage = new Konva.Stage({
            container: container,
            width: 512,
            height: 512,
        });

        this.layer = new Konva.Layer();
        this.dragLayer = new Konva.Layer();

        
        var circle = new Konva.Circle({
              x: this.stage.getWidth() / 2,
              y: this.stage.getHeight() / 2,
              radius: 70,
              fill: 'red',
              stroke: 'black',
              strokeWidth: 4,
              draggable: true,
            });

        this.stage.on('dragend', function(e) {
          console.log(e.target)
          console.log('x:' + e.target._lastPos.x + 'y: ' + e.target._lastPos.y);
        });

        this.layer.add(circle);
        
        
        this.stage.add(this.layer, this.dragLayer);
    }

    onDrop(obj) {
        console.log('konva drop!');
        console.log(obj);
        let imageObj = new Image(obj['width'], obj['height']);
        imageObj.src = obj['src'];
        let img = this.buildImage(imageObj, obj['xPos'], obj['yPos']);
        img.moveTo(this.layer)
        this.stage.draw();
        console.log('adding image!');
    }

    onDragStart(event) {
      console.log("konva draggstart");
      console.log(event.target);
      //var shape = event.target;
      // moving to another layer will improve dragging performance
      //shape.moveTo(this.dragLayer);
      //this.stage.draw();
    }

    onDragEnd(event) {
      console.log("konva dragend");
      //var shape = event.target;
      //shape.moveTo(this.layer);
      //this.stage.draw();
    }
}