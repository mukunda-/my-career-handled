// This handles the cars that periodically pass by, spawned by the overall game
//  script.
//
import Audio  from '/Audio';
import Engine from '../Engine';
import React  from 'react';
import Sprite from '../Sprite';

import carsTexture  from './res/cars.png';
import carSoundFile from './res/trafficslow.mp3';
///////////////////////////////////////////////////////////////////////////////

const slowSound = Audio.load({
   src: carSoundFile,
   volume: 0.2
});

//-----------------------------------------------------------------------------
class TrafficCar extends Engine.Entity {
   //--------------------------------------------------------------------------
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
      this.speed = (50 + Math.pow(Math.random(), 2.0) * 100.0) * 2.5;
      this.model = Math.floor(Math.random() * 5);
      slowSound.play();
   }

   //--------------------------------------------------------------------------
   update( time ) {
      // Cars just go from right to left and then obliterate themselves once
      //  they're out of sight.
      this.x -= time * this.speed;

      const [sx,] = Engine.translate( this.x, this.y );
      if( sx < -200 ) {
         this.obliterate();
      }
   }

   //--------------------------------------------------------------------------
   render() {
      // Sprite size = 164 x 58. TODO: the used texture should not touch the
      //  edge of each texture space, as it can bleed into adjacent textures
      //  when using a squished display resolution (on small screens).
      //
      const [x, y] = Engine.translate( this.x - 164/2, this.y - 58 );
      return (
         <Sprite src={{
               texture: carsTexture,
               x, y,
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
