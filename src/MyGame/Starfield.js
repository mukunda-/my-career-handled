// This handles a full-screen background display of a starfield, using a
//  repeating texture that moves with a low-scale camera offset.
//
import Engine from '../Engine';
import React  from 'react';
import Sprite from '../Sprite';

import starfieldTexture from './res/stars.png';
///////////////////////////////////////////////////////////////////////////////

class Starfield extends Engine.Entity {
   //--------------------------------------------------------------------------
   constructor() {
      super();
      this.opacity = 0;
   }

   //--------------------------------------------------------------------------
   // We start at opacity 0, and then fade it in as the sky backdrop turns
   //  darker.
   setOpacity( opacity ) {
      this.opacity = opacity;
   }

   //--------------------------------------------------------------------------
   render() {
      if( this.opacity === 0 ) {
         // Don't emit any component if we are not using it yet.
         return;
      }

      const displaySize = Engine.getDisplaySize();
      const camera = Engine.getCamera();

      // This entity has a fixed position on screen, and the background offset
      //  is used to make it move.
      return (
         <Sprite src={{
            x:       0,
            y:       0,
            width:   displaySize[0],
            height:  displaySize[1],
            texture: starfieldTexture,
            tx:      -camera[0] * 0.1,
            ty:      -camera[1] * 0.1,
            opacity: this.opacity,
            z:        -10
         }} key={this.key}/>
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Starfield;
