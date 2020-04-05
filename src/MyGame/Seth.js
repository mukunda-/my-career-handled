import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import sethTexture from './res/smallseth.png';
///////////////////////////////////////////////////////////////////////////////

class Seth extends Engine.Entity {
   // Spawning point is centered on his feet.
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
   }

   render() {
      // During the apex of his inspirational speech, he will wave his arm to
      //  drive the point home (2 frames).
      const t = Math.floor((Engine.getTime() * 2) % 2);
      const [x, y] = Engine.translate( this.x - 49/2, this.y - 64 );

      return (
         <Sprite src={{
            x: x,
            y: y,
            width: 49,
            height: 64,
            texture: sethTexture,
            tx: t * 49,
         }} key={this.key}/>
      )
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Seth;
