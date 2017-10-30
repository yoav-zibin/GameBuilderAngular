import { Injectable } from '@angular/core';
import * as Konva from 'konva';

@Injectable()
export class KonvaService {
    stage;
    layer;
    dragLayer;

    constructor() { }
    
    buildImage(xPos, yPos, url) {
        let imageObj = new Image();
            imageObj.onload = function() {
                let img = new Konva.Image({
                    x: xPos,
                    y: yPos,
                    image: imageObj,
                    width: 50,
                    height: 50
                });
                img.cache();
                img.drawHitFromCache(0);
            };
            imageObj.src = url;
        return imageObj;
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
                  strokeWidth: 4
                });
        this.layer.add(circle)
        
        this.stage.add(this.layer, this.dragLayer);
    }

    onDrop(img) {
        let image = this.buildImage(
            img.xPos, img.yPos, img.src);
        this.layer.add(image);
    }
}
