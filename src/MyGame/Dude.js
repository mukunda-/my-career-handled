import Animations from './Animations';
import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import texture from './res/mewithglassestomakemeappearmoregifted.png';
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
class Dude extends Engine.Entity {
   constructor( x, y ) {
      super();
      this.animations = new Animations({
         "idle": {
            startFrame: 0,
            fps: 0
         },
         "cell": {
            startFrame: 1,
            fps: 0
         },
         "walk": {
            startFrame: 2,
            numFrames: 4,
            fps: 5
         },
         "noice": {
            startFrame: 6,
            fps: 0
         }
      });
      this.moveSpeed = 75;
      this.hidden = false;
      this.x = x;//camera[0] - 300;
      this.y = y;//0;
   }

   update( time ) {
      if( this.moving ) {
         if( this.x < this.destX ) {
            this.flip = false;
            this.x += this.moveSpeed * time;
            if( this.x >= this.destX ) {
               this.x = this.destX;
               this.moving = false;
               if( this.moveCallback ) {
                  this.moveCallback();
               }
            }
         } else {
            this.flip = true;
            this.x -= this.moveSpeed * time;
            if( this.x <= this.destX ) {
               this.x = this.destX;
               this.moving = false;
               this.flip = false;
               if( this.moveCallback ) {
                  this.moveCallback();
               }
            }
         }
         this.animations.set( "walk" );
      } else if( this.makingACall ) {
         this.animations.set( "cell" );
      } else {
         this.animations.set( "idle" );
      }

      this.animations.update( time );
   }

   moveTo( x, completionCallback ) {
      this.destX = x;
      if( Math.abs(this.x - this.destX) > 3 ) {
         this.moving = true;
      }
      this.moveCallback = completionCallback;
   }

   useCell( ) {
      this.makingACall = true;
   }

   hide() {
      this.hidden = true;
   }

   render() {
      if( this.hidden ) return;

      const [x, y] = Engine.translate( this.x - 49/2, this.y - 80 );
      return (
         <Sprite
            src={{
               texture: texture,
               x: x,
               y: y,
               width: 49,
               height: 84,
               z: 1,
               transform: "scale( 1 )",
               tx: -this.animations.frame * 49
            }}
            key={this.key}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Dude;
