import React    from 'react';
import ReactDOM from 'react-dom';
import Scene    from './Scene';
import Engine   from './Engine';
import MyGame   from './MyGame/MyGame';

import * as serviceWorker from './serviceWorker';

import './Base.css';
///////////////////////////////////////////////////////////////////////////////
let currentScreenSize = [0, 0];
let viewportScale     = 1.0;

//-----------------------------------------------------------------------------
// Returns the pixel dimensions of the user's client area.
function getDeviceDimensions() {
   return [Math.max( document.documentElement.clientWidth, window.innerWidth || 0 ),
           Math.max( document.documentElement.clientHeight, window.innerHeight || 0 )];
}

//-----------------------------------------------------------------------------
// Reads the browser client dimensions and then updates the cached size and
//  makes a scale that fits within the window.
//
// Todo: Is there a way to force portrait orientation?
function adjustViewportScale() {
   // The device/client viewport rectangle.
   const [vw, vh] = getDeviceDimensions();
   
   if( vw !== currentScreenSize[0] || vh !== currentScreenSize[1] ) {
      currentScreenSize = [vw, vh];
      let [scaledWidth, scaledHeight] = Engine.getDisplaySize();

      // This is for extra-dense screens, as far as I know from brief reading
      //  this is 1 or 2, depending on if the screen has extremely small
      //  pixels (like my OnePlus 3T 1080p screen).
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

      viewportScale = scaledWidth / Engine.getDisplaySize()[0];
   }
}

//-----------------------------------------------------------------------------
// Binding for engine and tapping is here.
function onTap( e ) {

   let displaySize  = Engine.getDisplaySize();
   const marginLeft = (currentScreenSize[0] - displaySize[0] * viewportScale) / 2.0;
   const marginTop = (currentScreenSize[1] - displaySize[1] * viewportScale) / 2.0;
   const width = displaySize[0] * viewportScale;
   const height = displaySize[1] * viewportScale;

   let mx = e.clientX;
   let my = e.clientY;

   mx = ((mx - marginLeft) / width) * displaySize[0];
   my = ((my - marginTop) / height) * displaySize[1];

   console.log( `Tapped [${mx}, ${my}].` );
   
   Engine.tap( mx, my );
}

//-----------------------------------------------------------------------------
// Debug functions - not quite sure yet how to only enable this for debug
//  builds.
function onKeyDown() {
   Engine.setTimeScale( 25 );
}
function onKeyUp() {
   Engine.setTimeScale( 1.0 );
}
document.addEventListener('keyup', onKeyUp);
document.addEventListener('keydown', onKeyDown);

//-----------------------------------------------------------------------------
// Viewport sits at the top level, typically with a Scene as the only child
//  that holds everything else. The Viewport is what automatically transforms
//                                                itself with a fitting scale.
let Viewport = (props) => {
   const style = {
      transform: `scale(${props.scale})`,
      width: props.size[0] + "px",
      height: props.size[1] + "px",
      marginLeft: `${(currentScreenSize[0] - props.size[0] * viewportScale) / 2.0}px`,
      marginTop: `${(currentScreenSize[1] - props.size[1] * viewportScale) / 2.0}px`
   }; 

   return (
      <div className="Viewport" style={style} onClick={onTap} >
         {props.children}
      </div>
   );
}

//-----------------------------------------------------------------------------
// Frame update routine.
function onTick() {

   // Auto-scale the viewport to fit within the user's device size.
   adjustViewportScale();

   // Update all entities, etc.
   Engine.update();

   // Generate a list of React components through rendering functions.
   const components = Engine.render();

   // The engine is in control of some rendering properties, like the backdrop
   //  color. Game logic interacts with the engine, and not here directly.
   const sceneOptions = Engine.getRenderOptions();
   const displaySize  = Engine.getDisplaySize();
   
   ReactDOM.render(
      <React.StrictMode>
         <Viewport scale={viewportScale} size={displaySize} id="viewport">
            <Scene options={sceneOptions}>
               {components}
            </Scene>
         </Viewport>
      </React.StrictMode>,
      document.getElementById('root')
   );
}

//-----------------------------------------------------------------------------
// Run for infinity.
function renderLoop() {
   onTick();
   window.requestAnimationFrame( renderLoop );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//-----------------------------------------------------------------------------
// Entry point is here, reset the Engine and start our game. See MyGame.js.

Engine.reset();
MyGame.Start();
renderLoop();

///////////////////////////////////////////////////////////////////////////////
// Exporting for testing purposes.
export {onTick};