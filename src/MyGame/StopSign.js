// The StopSign is a basic prop that shows a stop sign, used briefly when
//  Chris demonstrates his talent speeding.
//
import Engine from '../Engine';
import React  from 'react';
import Sprite from '../Sprite';

import stopTexture from './res/time2stop.png';
///////////////////////////////////////////////////////////////////////////////

class StopSign extends Engine.Entity {
   //--------------------------------------------------------------------------
   // Spawn at this coordinate - the pixel position at the foot of the sign.
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
   }

   //--------------------------------------------------------------------------
   // Should probably have some kind of logic somewhere to delete the entity
   //  once it goes out of range, but I don't think that's too important for
   //  this app...
   render() {
      const [x, y] = Engine.translate( this.x - 32/2, this.y - 80 );
      return (
         <Sprite src={{
               x, y,
               width: 32,
               height: 80,
               texture: stopTexture
            }}
            key={this.key}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default StopSign;
