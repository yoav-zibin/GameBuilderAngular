import { Injectable } from '@angular/core';
import * as Konva from 'konva';

@Injectable()
export class KonvaService {
    stage;
    layer;
    dragLayer;

    constructor() {}

    buildImage(imageObj, xPos, yPos) {
      let img = new Konva.Image({
          x: xPos,
          y: yPos,
          image: imageObj,
          draggable: true,
      });

      // this doesn't work with cross-origin image sources
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

        this.layer.add(circle);
        this.stage.add(this.layer, this.dragLayer);

        this.stage.on('dragstart', function(event) {
          console.log(this);
        });

    }

    onDrop(obj) {
        console.log('konva drop!');
        console.log(obj);
        
        let imageObj = new Image(obj['width'], obj['height']);
        imageObj.src = obj['src'];
        
        let img = this.buildImage(imageObj, obj['xPos'], obj['yPos']);
        img.moveTo(this.layer)
        this.stage.draw();
    }

    onDragStart(event) {
      console.log("konva dragstart");

      console.log(event.target);

      /*
      // moving to another layer will improve dragging performance ??
      event.target.moveTo(this.dragLayer)
      this.dragLayer.draw();
      */
    }

    onDragEnd(event) {
      console.log("konva dragend");

      console.log(event.target);
      /*
      event.target.moveTo(this.layer);
      this.layer.draw();
      this.dragLayer.draw();
      */
    }
}