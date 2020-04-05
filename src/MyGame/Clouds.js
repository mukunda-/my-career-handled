import Engine from "../Engine";
import React from 'react';
import Sprite from '../Sprite';

import cloudTexture from './res/clouds.png';
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
class Clouds extends Engine.Entity {
   render() {
      this.cloudScroll = Engine.getTime() * 1.5;
      let [x, y] = Engine.translate( -this.cloudScroll, -53, 0.1 );
      x = x % 472;
      const displaySize = Engine.getDisplaySize();
      return (
         <Sprite src={{
               texture: cloudTexture,
               x: x, //((0 - this.cloudScroll - camera[0]  * 0.1) % 472),
               y: y, //-53 - camera[1] * 0.1,
               width: displaySize[0] + 472,
               height: 137
            }}
            key={this.key}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Clouds;
