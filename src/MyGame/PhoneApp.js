import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';
import './PhoneApp.css';

import phoneTexture from './res/gamechangingapp.png';
///////////////////////////////////////////////////////////////////////////////

class PhoneApp extends Engine.Entity {
   setContent( content ) {
      this.text = content;
   }

   getRenderPosition() {
      const displaySize = Engine.getDisplaySize();
      const x = displaySize[0] * 0.55;
      const y = displaySize[1] * 0.6;
      return [x, y];
   }

   render() {
      
      let [x, y] = this.getRenderPosition();
      x -= 150/2;
      y -= 150/2;

      // TODO: does this need an array? Can these two be merged?
      return ([
         <Sprite src={{
                    x, y,
                    width: 150,
                    height: 150,
                    texture: phoneTexture
                 }}
                 key={this.key}>
            <div className="PhoneApp text"
               style={{left: 47, top: 69}}>
               {this.text}
            </div>
         </Sprite>
      ]);
   }
}

///////////////////////////////////////////////////////////////////////////////
export default PhoneApp;