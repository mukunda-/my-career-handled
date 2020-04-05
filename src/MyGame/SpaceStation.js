import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import spaceStationTxture from './res/spacestation14.png';
///////////////////////////////////////////////////////////////////////////////

class SpaceStation extends Engine.Entity {
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
      //[this.x, this.y] = [x, y];

      //this.x = camera[0] + displaySize[0] + 1000;
      //this.y = camera[1];
   }
   render() {
      const [x, y] = Engine.translate( this.x - 867/2, this.y - 238 );
      return (
         <Sprite src={{
            x: x,
            y: y,
            width: 867,
            height: 280,
            texture: spaceStationTxture,
            z: -2
         }} key={this.key}/>
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default SpaceStation;
