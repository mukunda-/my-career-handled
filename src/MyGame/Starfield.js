import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

class Starfield extends Engine.Entity {
   
   constructor() {
      super();
      this.opacity = 0;
   }

   setOpacity( opacity ) {
      this.opacity = opacity;
   }

   update() {
      if( this.opacity === 0 ) {
         return;
      }

      const displaySize = Engine.getDisplaySize();
      const camera = Engine.getCamera();

      return (
         <Sprite src={{
            x: 0,
            y: 0,
            width: displaySize[0],
            height: displaySize[1],
            texture: "res/stars.png",
            tx: -camera[0] * 0.1,
            ty: -camera[1] * 0.1,
            opacity: this.opacity,
            z: -10
         }} key={this.key}/>
      );
   }
}

export default Starfield;
