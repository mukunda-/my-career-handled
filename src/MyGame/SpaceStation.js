// Draws the space station thingy.
import Engine from '../Engine';
import React  from 'react';
import Sprite from '../Sprite';

// More than one clue that this was ripped from a stock site.
import spaceStationTexture from './res/spacestation14.png';
///////////////////////////////////////////////////////////////////////////////

class SpaceStation extends Engine.Entity {
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
   }
   
   render() {
      const [x, y] = Engine.translate( this.x - 867/2, this.y - 238 );
      return (
         <Sprite src={{
            x, y,
            width: 867,
            height: 280,
            texture: spaceStationTexture,
            z: -2
         }} key={this.key}/>
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default SpaceStation;
