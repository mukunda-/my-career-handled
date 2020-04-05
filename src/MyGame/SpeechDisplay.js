import Engine from '../Engine';
import React from 'react';
import Sprite from '../Sprite';

import './SpeechDisplay.css';
///////////////////////////////////////////////////////////////////////////////

class SpeechDisplay extends Engine.Entity {
   start( options ) {
      this.active    = true;
      this.fullText  = options.text || "MISSING TEXT";
      this.actor     = options.actor;
      this.reader    = 0;
      this.text      = "";
      this.startTime = Engine.getTime();
      this.mouthMove = 0;
      this.mouthOpen = 0;
      this.textScrollOffset = 0;
      this.finished = false;
      this.callback = options.callback;
      this.nomouth  = options.nomouth;

      if( options.vo ) {
         this.duration = options.vo.duration;

      } else {
         this.duration = options.text.length / (options.speed || 15);
      }
      
   }

   update( updateTime ) {
      if( !this.active ) return;
      let elapsed = Engine.getTime() - this.startTime
      let progress = Math.min( elapsed / (this.duration), 1.0 );
      
      let charPos = Math.floor(progress * this.fullText.length);
      let text = this.fullText.substring( 0, charPos );
      let remainingText = this.fullText.substring( charPos );
      let nextSpace = remainingText.search( " " );
      if( nextSpace === -1 ) {
         nextSpace = remainingText.length;
      }
      let textSuffix = "";
      if( nextSpace > 0 ) {
         textSuffix =
                  <span className='invisible'>
                     {remainingText.substring( 0, nextSpace ).replace(/>/g,"")}
                  </span>;
      }
      text = text.replace( />/g, "" );

      if( progress < 1.0 ) {
         this.mouthMove += updateTime;
         if( this.mouthMove > 0.1 ) {
            this.mouthMove = 0;
            let randomOffset = (Math.random() - 0.25) * 5;
            this.mouthOpen = Math.max( Math.abs(Math.sin( elapsed * 12 ) * 10) + randomOffset, 0.0 );
         }
      } else {
         this.mouthOpen = 0;
         this.finished = true;
         if( this.callback ) {
            this.callback();
            this.callback = null;
         }
      }

      let currentCharacter = this.fullText.substring( charPos, charPos + 1 )
      if( currentCharacter === ">" || this.nomouth ) {
         this.mouthOpen = 0;
      }

      this.textScrollOffset = 0;
      this.text = text;
      this.textSuffix = textSuffix;

      let oldElement = document.getElementById( this.key + "-inner" )
      if( !!oldElement ) {
         
         let overflow = Math.max( oldElement.clientHeight - (76), 0 );
         if( overflow > 0 ) {
            this.textScrollOffset = -overflow;
         }
      }

   }

   hide() {
      this.active = false;
   }

   isDone() {
      return this.finished;
   }

   render() {
      if( !this.active ) return;

      return (
         <div className="Speechbox" key={this.key}>
            <Sprite src={{
               texture: this.actor.image,
               x: 8,
               y: 10,
               width: 90,
               height: 76
            }}/>
            
            <div className="frame">
               <div className="text">
                  <div className="inner" id={this.key + "-inner"} style={{top: this.textScrollOffset + "px"}}>
                     {this.text}{this.textSuffix}
                  </div>
               </div>
            </div>
         </div>
      );

      /* the mouth stuff was too goofy
      <Sprite src={{
               texture: this.actor.mouth,
               x: (8+this.actor.mouthOrigin[0]),
               y: (10+this.actor.mouthOrigin[1]) + this.mouthOpen,
               width: this.actor.mouthSize[0],
               height: this.actor.mouthSize[1]
            }}/>
            */
   }
}

export default SpeechDisplay;
