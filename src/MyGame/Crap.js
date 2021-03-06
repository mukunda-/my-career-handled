import Engine from "../Engine";
import {Howl} from 'howler';
import React from 'react';
import Sprite from '../Sprite';

import crapTexture from './res/crap.png';

import flingSoundFile from './res/fling.mp3';
import crashSoundFile from './res/crapcrash.mp3';
///////////////////////////////////////////////////////////////////////////////

const flingSound = new Howl({
   src: flingSoundFile,
   volume: 0.6
});

const crashSound = new Howl({
   src: crashSoundFile,
   volume: 0.8
});

//-----------------------------------------------------------------------------
// A box full of my crap; supports a function to fling it into the truck.
class Crap extends Engine.Entity {
   //--------------------------------------------------------------------------
   constructor( x, y ) {
      super();
      this.x        = x;
      this.y        = y;
      this.vel      = [0, 0];
      this.flinging = false;
      this.active   = true;
   }

   //--------------------------------------------------------------------------
   // Fling the box to the right and make it despawn.
   fling() {
      flingSound.play();
      this.vel = [ 500, -220 ];
      Engine.after( 0.3, () => {
         crashSound.play();
         this.active = false;
      });
      this.flinging = true;
   }

   //--------------------------------------------------------------------------
   update( time ) {
      if( !this.active ) return;

      if( this.flinging ) {
         this.x += this.vel[0] * time;
         this.y += this.vel[1] * time;
         this.vel[1] += 1000 * time;
         this.vel[0] *= Math.pow(0.4, time);
      }
   }

   //--------------------------------------------------------------------------
   render() {
      if( !this.active ) return;
      const [x, y] = Engine.translate( this.x - 25, this.y - 48 );
      return (
         <Sprite src={{
               texture: crapTexture,
               x, y,
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
