import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import Scene from './Scene';
import GameHost from './Engine';
import MyGame from './MyGame/MyGame';
import * as serviceWorker from './serviceWorker';

let currentScreenSize = [0, 0];
let viewportScale = 1.0;

//-----------------------------------------------------------------------------
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
      let [scaledWidth, scaledHeight] = GameHost.getDisplaySize();

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

      viewportScale = scaledWidth / GameHost.getDisplaySize()[0];
   }
}

//-----------------------------------------------------------------------------
function onTap() {

}

//-----------------------------------------------------------------------------
let Viewport = (props) => {
   const style = {
      transform: `scale(${props.scale})`,
      width: props.size[0] + "px",
      height: props.size[1] + "px",
      marginLeft: `${(currentScreenSize[0] - props.size[0] * viewportScale) / 2.0}px`,
      marginTop: `${(currentScreenSize[1] - props.size[1] * viewportScale) / 2.0}px`
   }; 

   return (
      <div className="Viewport" style={style} onClick={onTap}>
         {props.children}
      </div>
   );
}

//-----------------------------------------------------------------------------
function renderLoop() {
   adjustViewportScale();
   GameHost.update();
   let components   = GameHost.render();
   let sceneOptions = GameHost.getRenderOptions();
   let displaySize  = GameHost.getDisplaySize();
   
   ReactDOM.render(
      <React.StrictMode>
         <Viewport scale={viewportScale} size={displaySize}>
            <Scene options={sceneOptions}>
               {components}
            </Scene>
         </Viewport>
      </React.StrictMode>,
      document.getElementById('root')
   );
   window.requestAnimationFrame( renderLoop );
}

GameHost.reset();
MyGame.Start();
renderLoop();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
