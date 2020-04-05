import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import carsTexture from './res/cars.png';
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
class TrafficCar extends Engine.Entity {
   constructor( x, y ) {
      super();
      this.x = x; //Engine.getCamera()[0] + 800;
      this.y = y;// roadLevel;
      this.speed = (50 + Math.pow(Math.random(), 2.0) * 100.0) * 2.5;
      this.model = Math.floor(Math.random() * 5);
   }
   update( time ) {
      this.x -= time * this.speed;

      const [sx, sy] = Engine.translate( this.x, this.y );
      if( sx < -200 ) {
         // It went offscreen.
         this.obliterate();
      }
   }
   render() {
      const [x, y] = Engine.translate( this.x - 164/2, this.y - 58 );
      return (
         <Sprite src={{
               texture: carsTexture,
               x: x,
               y: y,
               z: -5,
               width: 164,
               height: 58,
               ty: this.model * 58
            }}
            key={this.key}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default TrafficCar;
