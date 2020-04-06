// This /handles/ showing the Handled logo at the end and giving a heartwarming
//  message.
//
import Engine from '../Engine';
import React  from 'react';
import Sprite from '../Sprite';

import './Handled.css';
import handledTexture from './res/handled.png';
///////////////////////////////////////////////////////////////////////////////

class Handled extends Engine.Entity {
   //--------------------------------------------------------------------------
   constructor() {
      super();
      this.time = Engine.getTime();
   }

   //--------------------------------------------------------------------------
   render() {
      const t = Engine.getTime();
      const opacity     = Math.min( t - this.time, 1 );
      const opacity2    = Math.min( (t - this.time - 2) / 2, 1 );
      const displaySize = Engine.getDisplaySize();

      let output = [
         <Sprite src={{
            x:       displaySize[0] / 2 - 150/2,
            y:       displaySize[1] / 2 - 150/2,
            width:   150,
            height:  150,
            texture: handledTexture,
            opacity: opacity
         }} key={this.key}/>
      ];

      if( opacity2 > 0 ) {
         output.push(
            <div className="hireme" key={this.key + "-tagline"}
                 style={{opacity:opacity2}}>
               I want to be a part of your change.
            </div>
         );
      }

      return output;
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Handled;
