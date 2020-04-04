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
   return <div className="Sprite" style={style}></div>;
}

//-----------------------------------------------------------------------------
class Entity {
   constructor() {
      this.key = makeKey();
      entitiesList.push( this );
   }
   obliterate() {
      const index = entitiesList.indexOf( this );
      if( index !== -1 ) {
         entitiesList.splice( index, 1 );
      }
   }
   update() {}
}

//-----------------------------------------------------------------------------
class Road extends Entity {
   update() {
      this.key = this.key || makeKey();
      return ( <Sprite src={{
         texture: "res/road.jpg",
         x: (0 - camera[0] % 400),
         y: displaySize[1] - 54 - camera[1],
         width: displaySize[0] + 400,
         height: 54
      }} key={this.key}/> );
   }
}

//-----------------------------------------------------------------------------
class Clouds extends Entity {
   update() {
      this.key = this.key || makeKey();
      this.cloudScroll = getTime() * 1.5;
      return ( <Sprite src={{
         texture: "res/clouds.png",
         x: ((0 - this.cloudScroll - camera[0]  * 0.1) % 472),
         y: -53 - camera[1] * 0.1,
         width: displaySize[0] + 472,
         height: 137
      }} key={this.key}/> );
   }
}

//-----------------------------------------------------------------------------
class Animations {
   constructor( animationList ) {
      this.animationList = animationList;
      this.progress = 0;
      this.current = "";
   }

   set( name ) {
      if( this.current === name ) return;
      this.current = name;
      this.frame = this.animationList[name].startFrame;
      this.progress = 0;
   }

   update( time ) {
      let animation = this.animationList[this.current];
      if( !animation ) return;
      this.progress += time * animation.fps;
      while( this.progress >= 1.0 ) {
         this.progress -= 1.0;
         this.frame++;
         if( this.frame >= animation.startFrame + animation.numFrames ) {
            this.frame = animation.startFrame;
         }
      }
   }
}

class Truck extends Entity {
   constructor() {
      super();
      this.x = camera[0] - 100;
      this.y = roadLevel;
   }

   rollUp() {
      this.rollingUp = true;
   }

   gogogo() {
      this.going = true;
   }

   update( updateTime ) {
      if( this.rollingUp ) {
         this.x += updateTime * 150;
         if( this.x >= camera[0] + 220 ) {
            this.rollingUp = false;
            this.rolledUp = true;
         }
      } else if( this.going ) {
         this.accel += Math.min( 0.25 * updateTime, 1 );
         this.x += updateTime * 20 * this.accel;
      }

      let left = this.x - camera[0] - 81;
      let top = this.y - camera[1] - 80;

      // wheel diameter = 23 pixels
      let wheelRotation = (this.x / (Math.PI * 23) * 360) % 360;
      
      return [
         <Sprite src={{
            x: left,
            y: top,
            width: 162,
            height: 69,
            texture: "res/truck.png"
         }} key={this.key}/>,
         <Sprite src={{
            x: left + 28 - 23/2,
            y: top + 69 - 23/2,
            width: 23,
            height: 23,
            texture: "res/wheel.png",
            transform: `rotate(${wheelRotation}deg)`
         }} key={this.key+"-wheel1"}/>,
         <Sprite src={{
            x: left + 138 - 23/2,
            y: top + 69 - 23/2,
            width: 23,
            height: 23,
            texture: "res/wheel.png",
            transform: `rotate(${wheelRotation}deg)`
         }} key={this.key+"-wheel2"}/>
      ];
   }

   getX() {
      return this.x;
   }
}

class Crap extends Entity {
   constructor() {
      super();
      this.x = camera[0] + 35;
      this.y = roadLevel;
      this.vel = [0, 0];
      this.flinging = false;
      this.active = true;
   }

   fling() {
      this.vel = [ 10, -5 ];
   }

   update( time ) {
      if( !this.active ) return;

      if( this.flinging ) {
         this.x += this.vel[0] * time;
         this.y += this.vel[1] * time;
         this.vel[1] += 1 * time;
      }
      console.log( this.x, this.y );
      return (
         <Sprite src={{
            texture: 'res/crap.png',
            x: this.x - camera[0] - 25,
            y: this.y - camera[1] - 48,
            width: 50,
            height: 48
         }}/>
      )
   }
}

//-----------------------------------------------------------------------------
class TrafficCar extends Entity {
   constructor() {
      super();
      this.x = camera[0] + 800;
      this.y = roadLevel;
      this.speed = (50 + Math.pow(Math.random(), 2.0) * 100.0) * 2.5;
      this.model = Math.floor(Math.random() * 5);
   }
   update( time ) {
      this.x -= time * this.speed;
      if( this.x - camera[0] < -200 ) {
         this.obliterate();
      }
      return ( <Sprite src={{
         texture: "res/cars.png",
         x: (this.x - camera[0] - 164/2),
         y: (this.y - 58) - camera[1],
         z: -5,
         width: 164,
         height: 58,
         ty: this.model * 58
      }} key={this.key}/> );
   }
}

const mukundaActor = {
   image: 'res/mug.png',
   mouth: 'res/mouth.png',
   mouthOrigin: [25, 55],
   mouthSize: [26, 21]
}

const chrisActor = {
   image: 'res/chrisface.png',
   mouth: 'res/chrismouth.png',
   mouthOrigin: [36, 48],
   mouthSize: [19, 14]
}

let theScript = [
   "wait_for_click",
   {
      action: "enter_stage_left"
   },
   {
      speech: "Hi, I'm Mukunda Johnson, and today I'm going to go and visit Handled!",
      vo: [ "./res/mukunda_speech.mp3", 0, 25 ],
      actor: mukundaActor
   },
   {
      delay: 0.25
   }

]

class SpeechDisplay extends Entity {
   constructor() {
      super();
   }

   start( options ) {
      this.active    = true;
      this.fullText  = options.text || "MISSING TEXT";
      this.actor     = options.actor;
      this.reader    = 0;
      this.text      = "";
      this.startTime = getTime();
      this.mouthMove = 0;
      this.mouthOpen = 0;
      this.textScrollOffset = 0;
      this.finished = false;

      if( options.vo ) {
         this.duration = options.vo.duration;

      } else {
         this.duration = options.text.length / (options.speed || 15);
      }
      
   }

   update( updateTime ) {
      if( !this.active ) return;
      let elapsed = getTime() - this.startTime
      let progress = Math.min( elapsed / this.duration, 1.0 );
      let charPos = Math.floor(progress * this.fullText.length);
      let text = this.fullText.substring( 0, charPos );
      let remainingText = this.fullText.substring( charPos );
      let nextSpace = remainingText.search( " " );
      if( nextSpace === -1 ) {
         nextSpace = remainingText.length;
      }
      let textSuffix = "";
      if( nextSpace > 0 ) {
         textSuffix = <span className='invisible'>{remainingText.substring( 0, nextSpace ).replace(/>/g,"")}</span>;
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
      }

      let currentCharacter = this.fullText.substring( charPos, charPos + 1 )
      if( currentCharacter == ">" ) {
         this.mouthOpen = false;
      }

      this.innerKey = this.innerKey || makeKey();
      let scrollOffset = 0;

      let oldElement = document.getElementById( this.innerKey )
      if( !!oldElement ) {
         
         let overflow = Math.max( oldElement.clientHeight - (76), 0 );
         if( overflow > 0 ) {
            scrollOffset = -overflow;
         }
      }

      return (
         <div className="Speechbox" key={this.key}>
            <div className="frame">
               <img className="avatar" src={this.actor.image}/>
               <Sprite src={{
                  texture: this.actor.mouth,
                  x: (8+this.actor.mouthOrigin[0]),
                  y: (10+this.actor.mouthOrigin[1]) + this.mouthOpen,
                  width: this.actor.mouthSize[0],
                  height: this.actor.mouthSize[1]
               }}/>
               <div className="frame">
                  <div className="text">
                     <div className="inner" id={this.innerKey} style={{top: scrollOffset + "px"}}>
                        {text}{textSuffix}
                     </div>
                  </div>
               </div>
            </div>
         </div>);
   }

   hide() {
      this.active = false;
   }

   isDone() {
      return this.finished;
   }
}

//-----------------------------------------------------------------------------
class Dude extends Entity {
   constructor() {
      super();
      this.animations = new Animations({
         "idle": {
            startFrame: 0,
            fps: 0
         },
         "cell": {
            startFrame: 1,
            fps: 0
         },
         "walk": {
            startFrame: 2,
            numFrames: 4,
            fps: 5
         },
         "noice": {
            startFrame: 6,
            fps: 0
         }
      });
      this.moveSpeed = 1111// debug75;
      this.hidden = false;
      this.key = makeKey();
      this.x = camera[0] - 300;
      this.y = 0;
   }

   update( time ) {
      if( this.moving ) {
         if( this.x < this.destX ) {
            this.flip = false;
            this.x += this.moveSpeed * time;
            if( this.x >= this.destX ) {
               this.x = this.destX;
               this.moving = false;
            }
         } else {
            this.flip = true;
            this.x -= this.moveSpeed * time;
            if( this.x <= this.destX ) {
               this.x = this.destX;
               this.moving = false;
               this.flip = false;
            }
         }
         this.animations.set( "walk" );
      } else if( this.makingACall ) {
         this.animations.set( "cell" );
      } else {
         this.animations.set( "idle" );
      }

      this.animations.update( time );

      if( !this.hidden ) {
         
         return ( <Sprite src={{
            texture: "res/mewithglassestomakemeappearmoregifted.png",
            x: (this.x - camera[0] - 49/2),
            y: (this.y - 80) - camera[1] * 0.1,
            width: 49,
            height: 84,
            z: 1,
            transform: "scale( 1 )",
            tx: -this.animations.frame * 49
         }} key={this.key}/> );
      }
   }

   moveTo( x ) {
      this.destX = x;
      if( Math.abs(this.x - this.destX) > 3 ) {
         this.moving = true;
      }
   }

   useCell( ) {
      this.makingACall = true;
   }
}

class Chris extends Entity {
   
   constructor() {
      
      super();
      this.animations = new Animations({
         
         "run": {
            startFrame: 0,
            numFrames: 9,
            fps: 10
         }
      });
      this.moveSpeed = 130;
      this.hidden = false;
      this.key = makeKey();
   }

   spawn( x, y ) {
      this.x = x;
      this.y = y;
   }

   update( time ) {
      if( this.moving ) {
         if( this.x < this.destX ) {
            this.flip = false;
            this.x += this.moveSpeed * time;
            if( this.x >= this.destX ) {
               this.x = this.destX;
               this.moving = false;
            }
         } else {
            this.flip = true;
            this.x -= this.moveSpeed * time;
            if( this.x <= this.destX ) {
               this.x = this.destX;
               this.moving = false;
               this.flip = false;
            }
         }
         this.animations.set( "run" );
         this.animations.update( time );
      }


      if( !this.hidden ) {
         
         return ( <Sprite src={{
            texture: "res/chris.png",
            x: (this.x - camera[0] - 64/2),
            y: (this.y - 62) - camera[1],
            width: 64,
            height: 64,
            z: 1,
            transform: "scaleX( -1 )",
            tx: -this.animations.frame * 64
         }} key={this.key}/> );
      }
   }

   moveTo( x ) {
      this.destX = x;
      if( Math.abs(this.x - this.destX) > 3 ) {
         this.moving = true;
      }
   }


}
/*
class Episode extends Entity {
   constructor() {
      super();
      this.active = true;
      this.timeStart = getTime();
   }
   update() {
      let elapsed = getTime() - this.lastTime();

   }
}
*/
//-----------------------------------------------------------------------------
class GameController extends Entity {
   constructor() {
      super();
      this.state = "start";
      this.lastTime = getTime();

      this.road = new Road();
      this.clouds = new Clouds();

      this.dude = new Dude();
      this.dude.x = camera[0] - 100;
      this.dude.y = roadLevel;

      this.nextTrafficTime = 0;
      this.scheduleTrafficCar();

      this.speech = new SpeechDisplay();

      this.truck = new Truck();
      this.crap = new Crap();

      // Debug:
      this.state = "start5";
      this.dude.moveTo( 100 );
      this.dude.useCell();
      this.speech.start({
         actor: mukundaActor,
         text: "Ready!"
      });

      this.chris = new Chris();
      this.chris.spawn( camera[0] + 200, roadLevel );
      this.chris.moveTo( this.crap.x );
      this.speech.start({
         actor: chrisActor,
         text: "Hello, my dear new programmer slave."
      });
   }

   onTap() {
      console.log('hi');
   }
   
   setTimer() {
      
   }

   scheduleTrafficCar() {
      this.nextTrafficTime = getTime() + 1.5 + Math.random() * 6.0;
   }

   waitForDelay( updateTime, delay, slot = "delay1" ) {
      this[slot] = (this[slot] || 0) + updateTime;
      if( this[slot] > delay ) {
         this[slot] = 0;
         return true;
      }
      return false;
   }

   update( updateTime ) {

      // I was going to make a special scripted list for this, but I think it's
      //  faster and more flexible to just implement to script as code.
      let elapsed = getTime() - this.lastTime;
      switch( this.state ) {
      case "start":
         // A little delay before we start. Should also wait for a button
         //  press so that we can use audio.
         if( elapsed > 1.0 ) {
            console.log( "Starting!" );
            this.dude.moveTo( 100 );
            this.state = "start2";
         }
         break;
      case "start2":
         if( !this.dude.moving ) {
            if( this.waitForDelay( updateTime, 0.25 )) {
               this.speech.start({
                  actor: mukundaActor,
                  text: "Hey Internet! I'm Mukunda Johnson, and today I'm going to move to the HANDLED virtual headquarters!"
               });
               this.state = "start3";
            }
         }
         break;
      case "start3":
         if( this.speech.isDone() ) {
            if( this.waitForDelay( updateTime, 2.4 )) {
               this.state = "start4";
               this.speech.start({
                  actor: mukundaActor,
                  text: "My programmer made me kind of dumb, but that's okay;>>> you don't need a brain to use the intuitive Handled app! >>>>Let me try and figure it out."
               });
            }
         }
         break;
      case "start4":
         if( this.speech.isDone() && this.waitForDelay( updateTime, 2.4 ) ) {
            this.state = "start5";
            this.dude.useCell();
            this.speech.start({
               actor: mukundaActor,
               text: "I just pull out my phone and...>>> scan my stuff... >>>>>Oh,>> look,>> the machine learning read my mind, and I didn't even need to point my camera.>>> That's alarmingly painless."
            });
         }
         break;
      case "start5":
         if( this.speech.isDone() && this.waitForDelay( updateTime, 3.0 ) ) {
            this.speech.hide();
            this.truck.rollUp();
            this.state = "start6";
         }
      default:
         break;
      }

      // Car spawner, runs async to everything else.
      if( getTime() > this.nextTrafficTime ) {
         this.scheduleTrafficCar();
         new TrafficCar();
      }

   }
}


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
}

function onTap() {
   if( gameController ) {
      gameController.onTap();
   }
}

//-----------------------------------------------------------------------------
let App = ( props ) => {
   adjustViewport();
   updateTime();

   const appStyle = {
      transform: `scale(${viewportScale})`,
      width: displaySize[0],
      height: displaySize[1],
      marginTop: `${(currentScreenSize[1] - displaySize[1] * viewportScale) / 2.0}px`,
      marginLeft: `${(currentScreenSize[0] - displaySize[0] * viewportScale) / 2.0}px`
   };

   return (
      <div className="App" style={appStyle} onClick={onTap}>
         <EntityRenderer/>
      </div>
   );
}

Setup();

export default App;
