// This displays a string of text on the screen.
//
import Engine from '../Engine';
import React from 'react';
import './TextPrompt.css';
///////////////////////////////////////////////////////////////////////////////

class TextPrompt extends Engine.Entity {
   //--------------------------------------------------------------------------
   // `x, y` are the coordinates of the center of the string.
   // `width` is the pixel width of the frame; text will wrap within the width.
   //         default "100".
   // `text` is the text to display. Change with `setText`.
   // `color` is the text color. Default "#000".
   constructor( options ) {
      super();
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.width = options.width || 100;
      this.text = options.text || "";
      this.color = options.color || "#000";
   }

   //--------------------------------------------------------------------------
   // Change what the text displays for the next rendering pass.
   setText( text ) {
      this.text = text;
   }

   //--------------------------------------------------------------------------
   render() {
      // Additional styles are in TextPrompt.css.
      return (
         <div className="TextPrompt" style={{
            left:  this.x - this.width / 2,
            top:   this.y,
            color: this.color,
            width: this.width + "px"
         }}>
            {this.text}
         </div>
      );
   }
}

///////////////////////////////////////////////////////////////////////////////
export default TextPrompt;
