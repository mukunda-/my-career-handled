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
               x, y,
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
