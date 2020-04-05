import Engine from "../Engine";
import React from 'react';
import Sprite from '../Sprite';

import crapTexture from './res/crap.png';
///////////////////////////////////////////////////////////////////////////////

class Crap extends Engine.Entity {
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
      this.vel = [0, 0];
      this.flinging = false;
      this.active = true;
   }

   fling() {
      this.vel = [ 500, -220 ];
      setTimeout(() => {
         this.active = false;
      }, 300 );
      this.flinging = true;
   }

   update( time ) {
      if( !this.active ) return;

      if( this.flinging ) {
         this.x += this.vel[0] * time;
         this.y += this.vel[1] * time;
         this.vel[1] += 1000 * time;
         this.vel[0] *= Math.pow(0.4, time);
      }
   }

   render() {
      if( !this.active ) return;
      const [x, y] = Engine.translate( this.x - 25, this.y - 48 );
      return (
         <Sprite src={{
               texture: crapTexture,
               x: x,
               y: y,
               width: 50,
               height: 48,
               z: -1
            }}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Crap;
