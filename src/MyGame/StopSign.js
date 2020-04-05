import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

class StopSign extends Engine.Entity {
   constructor( x, y ) {
      super();
      this.x = x; //camera[0] + displaySize[0] + 25;
      this.y = y; //roadLevel;
   }

   render() {
      const [x, y] = Engine.translate( this.x - 32/2, this.y - 40 );
      return (
         <Sprite src={{
               x: x,
               y: y,
               width: 32,
               height: 40,
               texture: "res/time2stop.png"
            }}
            key={this.key}
         />
      );
   }
}

export default StopSign;
