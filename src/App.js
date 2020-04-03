import React from 'react';
import logo from './logo.svg';
import './App.css';

const displaySize = [512, 288];
let currentScreenSize = [0, 0];
let viewportScale = 1.0;

function AdjustViewport() {
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

function App() {
   AdjustViewport();
   const appStyle = {
      transform: `scale(${viewportScale})`,
      width: displaySize[0],
      height: displaySize[1],
      marginTop: (currentScreenSize[1] - displaySize[1] * viewportScale) / 2.0 + "px",
      marginLeft: (currentScreenSize[0] - displaySize[0] * viewportScale) / 2.0 + "px"
   };

   return (
      <div className="App" style={appStyle}>VIEWPORT CREATED</div>
   );
}


export default App;
