import Animations from './Animations';
import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import chrisTexture from './res/chris.png';
///////////////////////////////////////////////////////////////////////////////

class Chris extends Engine.Entity {
   
   constructor() {
      
      super();
      this.animations = new Animations({
         
         "run": {
            startFrame: 0,
            numFrames: 9,
            fps: 10
         }
      });
      this.moveSpeed = 130;
      this.hidden = true;
   }

   spawn( x, y ) {
      this.x = x;
      this.y = y;
      this.hidden = false;
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
         this.animations.set( "run" );
         this.animations.update( time );
      }


      if( !this.hidden ) {
         
      }
   }

   moveTo( x, completionCallback ) {
      this.destX = x;
      if( Math.abs(this.x - this.destX) > 3 ) {
         this.moving = true;
      }
      this.moveCallback = completionCallback;
   }

   hide() {
      this.hidden = true;
   }

   render() {
      if( this.hidden ) return;

      const [x, y] = Engine.translate( this.x - 64/2, this.y - 62 );
      return (
         <Sprite src={{
               texture: chrisTexture,
               x, y,
               width: 64,
               height: 64,
               z: 1,
               transform: this.flip ? "scaleX( -1 )" : "",
               tx: -this.animations.frame * 64
            }}
            key={this.key}
         />
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Chris;
