import React from 'react';
import './Base.css';
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// The Scene is a basic container that sits in the viewport and holds all of
//  the game content. Currently the only property it has by itself is a color
//  backdrop.
let Scene = (props) => {
   let style = {}

   let [bgR, bgG, bgB] = [0, 0, 0];
   if( props.options.backdrop ) {
      [bgR, bgG, bgB] = props.options.backdrop;
   }
   
   style.backgroundColor = `rgb( ${bgR}, ${bgG}, ${bgB} )`;
   return <div className="Scene" style={style}>{props.children}</div>
}

///////////////////////////////////////////////////////////////////////////////
export default Scene;
