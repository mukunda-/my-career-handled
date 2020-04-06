import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import tapTexture from './res/tapper.png';
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// This spawns an area that can be clicked, along with an arrow pointing to it
//  to direct the user. When it's clicked, it obliterates itself and triggers
//  a callback.
class Tapper extends Engine.Entity {
   //--------------------------------------------------------------------------
   constructor( x, y, radius, callback, once = true ) {
      super();
      this.x        = x;
      this.y        = y;
      this.radius   = radius;
      this.callback = callback;
      this.once     = once;
      this.hook     = ( x, y ) => {
         const [dx, dy, r] = [x - this.x, y - this.y, this.radius];
         if( dx*dx + dy*dy < r*r ) {
            this.onTap( x, y );
         }
      };
      
      Engine.registerForTaps( this.hook );
   }

   //--------------------------------------------------------------------------
   // Disable the pointing arrow for this tapper, assuming some other prompt.
   hidePointer() {
      this.disableRender = true;
   }

   //--------------------------------------------------------------------------
   obliterate() {
      this.unhook();
      super.obliterate();
   }

   //--------------------------------------------------------------------------
   unhook() {
      if( this.hook ) {
         Engine.unregisterForTaps( this.hook );
         delete this.hook;
      }
   }

   //--------------------------------------------------------------------------
   onTap( x, y ) {
      this.callback( x, y );
      
      if( this.once ) {
         this.obliterate();
      }
   }

   //--------------------------------------------------------------------------
   render() {
      if( this.disableRender ) return;
      let [x, y] = Engine.translate( this.x - 16, this.y - 16);
      y -= 40;
      y += Math.sin( Engine.getTime() * 8 ) * 35;

      return ([
         <Sprite
            src={{
               x, y,
               width: 32,
               height: 32,
               texture: tapTexture
            }}
            key={this.key}
         />,
      ]);
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Tapper;
