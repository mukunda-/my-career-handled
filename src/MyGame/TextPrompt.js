import Engine from '../Engine';
import React from 'react';
import './TextPrompt.css';
///////////////////////////////////////////////////////////////////////////////

class TextPrompt extends Engine.Entity {
   constructor( options ) {
      super();
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.width = options.width || 100;
      this.text = options.text || "";
      this.color = options.color || "#000";
   }

   setText( text ) {
      this.text = text;
   }

   render() {
      return (
         <div className="TextPrompt" style={{
            left: this.x - this.width / 2,
            top: this.y,
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
