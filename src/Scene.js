import React from 'react';
import './App.css';

let Scene = (props) => {
   let style = {}

   let [bgR, bgG, bgB] = [0, 0, 0];
   if( props.options.backdrop ) {
      [bgR, bgG, bgB] = props.options.backdrop;
   }
   
   style.backgroundColor = `rgb( ${bgR}, ${bgG}, ${bgB} )`;
   return <div className="Scene" style={style}>{props.children}</div>
}

export default Scene;
