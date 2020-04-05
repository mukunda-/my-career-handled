import React from 'react';
import './App.css';
import Audio from './Audio.js';

//Audio.load( 'res/')
//Audio.play( 'ehlnlo' );

const displaySize = [512, 288];
let currentScreenSize = [0, 0];
let viewportScale = 1.0;
let entitiesList = [];
let camera = [ 0, 0 ];
let currentTime = 0;
const appStartTime = new Date().getTime();
const roadLevel = 234;
let gameController = null;
let backgroundFade = 0;

function Setup() {
   gameController = new GameController();
   
}

let nextNewKeyIndex = 1;

//-----------------------------------------------------------------------------
function makeKey() {
   return "verySpecialKey" + nextNewKeyIndex++;
}

//-----------------------------------------------------------------------------
function getTime() {
   return currentTime / 1000;
}

//-----------------------------------------------------------------------------
function updateTime() {
   currentTime = new Date().getTime() - appStartTime;
}

//-----------------------------------------------------------------------------
function adjustViewport() {
   // The device/client viewport rectangle.
   const [vw, vh] = [Math.max( document.documentElement.clientWidth, window.innerWidth || 0 ),
                     Math.max( document.documentElement.clientHeight, window.innerHeight || 0 )];
   
   if( vw !== currentScreenSize[0] || vh !== currentScreenSize[1] ) {
      currentScreenSize = [vw, vh];
      let [scaledWidth, scaledHeight] = displaySize;

      // For extra-dense screens, we want a reasonable size.
      let dpr = window.devicePixelRatio;
      scaledWidth  *= dpr;
      scaledHeight *= dpr;
      
      // Fit within the viewport.
      if( scaledWidth > vw ) {
         let scale = vw / scaledWidth;
         scaledWidth  *= scale;
         scaledHeight *= scale;
      }
      
      if( scaledHeight > vh ) {
         let scale = vh / scaledHeight;
         scaledWidth  *= scale;
         scaledHeight *= scale;
      }

      viewportScale = scaledWidth / displaySize[0];
   }
}

//-----------------------------------------------------------------------------
let Sprite = ( props ) => {
   let style = {
      left:             props.src.x + "px",
      top:              props.src.y + "px",
      width:            props.src.width + "px",
      height:           props.src.height + "px",
      backgroundImage:  `url(${props.src.texture})`,
      backgroundRepeat: "repeat"
   }
   if( props.src.tx || props.src.ty ) {
      style.backgroundPosition = `${props.src.tx||0}px ${props.src.ty||0}px`
   }
   if( props.src.transform ) {
      style.transform = props.src.transform;
   }
   if( props.src.z ) {
      style.zIndex = props.src.z;
   }
   if( props.src.opacity ) {
      style.opacity = props.src.opacity;
   }
   return <div className="Sprite" style={style}></div>;
}





//-----------------------------------------------------------------------------
class GameController extends Entity {
   
}

/*
let lastTime = getTime();

//-----------------------------------------------------------------------------
let EntityRenderer = ( props ) => {
   let time = getTime();
   let elapsed = Math.min( (time - lastTime), 0.25 ) ;
   lastTime = time;
   
   let elements = [];
   entitiesList.forEach( e => {
      let toAdd = e.update( elapsed );
      if( toAdd ) {
         if( Array.isArray(toAdd) ) {
            
            elements = elements.concat( toAdd );
         } else {
            elements.push( toAdd );
         }
      }
   });

   return elements;
}
*/
/*
let Speechbox = (props) => {
   return (
      <div className="Speechbox">
         <img className="avatar" src="res/mug.png"/>
         <div className="frame">
            <div className="text">
               <div className="inner">
                  I knew there was something wrong with Chris--he's too nice... how about them
               </div>
            </div>
         </div>
      </div>
   )
}*/

function onTap() {
   if( gameController ) {
      gameController.onTap();
   }
}

//-----------------------------------------------------------------------------
let App = ( props ) => {
   adjustViewport();
   updateTime();


   if( backgroundFade > 0 ) {
      let bf = 1 - backgroundFade;
      appStyle.backgroundColor = `rgb( ${0xc4*bf}, ${0xee*bf}, ${0xe0*bf} )`;
   }

   return (
      <div className="App" style={appStyle} onClick={onTap}>
         <EntityRenderer/>
      </div>
   );
}

Setup();

export default App;
