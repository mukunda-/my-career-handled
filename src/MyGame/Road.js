import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import roadTexture from '../res/road.png';
///////////////////////////////////////////////////////////////////////////////
const textureWidth = 400;

//-----------------------------------------------------------------------------
// An entity to draw the road. Scrolls with the camera.
class Road extends Engine.Entity {
   constructor( roadLevel ) {
      super();
      this.level = roadLevel;
   }

   render() {
      const camera   = Engine.getCamera();
      console.log( camera );
      const [width,] = Engine.getDisplaySize();

      return (
         <Sprite 
            src={{
               texture: roadTexture,
               x: (-camera[0] % textureWidth),
               y: this.level - camera[1],
               width: width + textureWidth,
               height: 54
            }}
            key={this.key}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Road;
