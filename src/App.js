import React from 'react';
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

//-----------------------------------------------------------------------------
function Sprite( props ) {
   let style = {
      left:          props.x + "px",
      top:           props.y + "px",
      width:         props.width + "px",
      height:        props.height + "px",
      backgroundImage: `url(${props.src})`
      
   }
   if( props.sx || props.sy ) {
      style.backgroundPosition = `${props.sx||0}px ${props.sy||0}px`
   }
   if( props.transform ) {
      style.transform = props.transform;
   }
   return <div className="Sprite" style={style}></div>;
}

//-----------------------------------------------------------------------------
class BouncingSquare extends React.Component {
   constructor(props) {
      super(props);
      this.pos  = [0, 0];
      this.vel  = [0, 0];
      this.size = [25, 25];
      this.gravity = 0.01;
   }
   update( time ) {
      this.vel[1] += this.gravity * time;
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
      if( this.vel[0] < 0 ) {
         if( this.pos[0] <= 0 ) {
            this.pos[0] = 0;
            this.vel[0] = -this.vel[0];
         }
      } else {
         if( this.pos[0] + this.size[0] >= displaySize[0] ) {
            this.pos[0] = displaySize[0] - this.pos[0];
            this.vel[0] = -this.vel[0];
         }
      }
      if( this.pos[1] + this.size[1] >= displaySize[1] ) {
         this.pos[1] = displaySize[1] - this.size[1];
         this.vel[1] = -this.vel[1];
      }

      this.x    += this.velx;
      this.vely += this.vely;
   }

   render() {
      let style = {
         width: this.width + "px",
         height: this.height + "px",
         backgroundColor: "red",
         position: "absolute",
         left: this.pos[0],
         top: this.pos[1]
      }
      return <div style={style}></div>;
      
   }
}

let entities = [];
entities.push( <BouncingSquare/> );

function Entities() {
   return <Sprite src="logo192.png" x="5" y="10" width="192" height="192"/>

   return entities;
}

function App() {
   AdjustViewport();
   const appStyle = {
      transform: `scale(${viewportScale})`,
      width: displaySize[0],
      height: displaySize[1],
      marginTop: `${(currentScreenSize[1] - displaySize[1] * viewportScale) / 2.0}px`,
      marginLeft: `${(currentScreenSize[0] - displaySize[0] * viewportScale) / 2.0}px`
   };

   return (
      <div className="App" style={appStyle}><Entities/></div>
   );
}


export default App;
