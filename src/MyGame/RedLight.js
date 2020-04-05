import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import redLightTexture from './res/roxanne.png';
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// Shows a stationary red traffic light post.
class RedLight extends Engine.Entity {
   //--------------------------------------------------------------------------
   // Spawn at x, y (typically off screen to the right).
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
   }

   render() {
      const [x, y] = Engine.translate( this.x - 32/2, this.y - 92 );
      return (
         <Sprite src={{
               x: x,
               y: y,
               width: 32,
               height: 92,
               texture: redLightTexture
            }}
            key={this.key}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default RedLight;
