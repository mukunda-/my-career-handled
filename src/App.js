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
      this.accel = 0;
      this.rocket = 0;
   }

   rollUp() {
      this.rollingUp = true;
   }

   gogogo() {
      this.going = true;
   }

   fly() {
      this.flying = true;
   }

   isGoing() {
      return this.going;
   }

   flyTo( x, y ) {
      this.flyingTo = [x, y];
      this.flyFrom = [this.x, this.y];
      this.flyToTime = 0;
   }

   update( updateTime ) {
      if( this.rollingUp ) {
         this.x += updateTime * 150;
         if( this.x >= camera[0] + 220 ) {
            this.rollingUp = false;
            this.rolledUp = true;
         }
      } else if( this.going ) {
         if( this.flyingTo ) {
            this.flyToTime += updateTime / 1.4;
            let delta = Math.min( this.flyToTime, 1 );
            //let d = 1-Math.pow((1 - 0.1),updateTime)
            
            this.x = this.flyFrom[0] + (this.flyingTo[0] - this.flyFrom[0]) * delta;
            this.y = this.flyFrom[1] + (this.flyingTo[1] - this.flyFrom[1]) * delta;
            //this.x += (this.flyingTo[0] - this.x) * d;
            //this.y += (this.flyingTo[1] - this.y) * d;
         } else {
            if( this.accel < 44 ) {
               this.accel += Math.min( 2.75 * updateTime, 1 );
            }  
            this.x += updateTime * 20 * this.accel;
            if( this.flying ) {
               if( this.rocket < 22 ) {
                  this.rocket += Math.min( 1.4 * updateTime, 1 );
               }
               this.y -= updateTime * 20 * this.rocket;
            }
         }
         
      }

      let left = this.x - camera[0] - 81;
      let top = this.y - camera[1] - 80;

      // wheel diameter = 23 pixels
      let wheelRotation = (this.x / (Math.PI * 23) * 360) % 360;
      
      return [
         <Sprite src={{
            x: left,
            y: top + ((this.x % 50) > 40 ? 1 : 0),
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
      this.vel = [ 500, -220 ];
      afterDelay( 0.3, () => {
         this.active = false;
      });
      this.flinging = true;
   }

   update( time ) {
      if( !this.active ) return;

      if( this.flinging ) {
         this.x += this.vel[0] * time;
         this.y += this.vel[1] * time;
         this.vel[1] += 1000 * time;
         this.vel[0] *= Math.pow(0.4, time);
      }
      console.log( this.x, this.y );
      return (
         <Sprite src={{
            texture: 'res/crap.png',
            x: this.x - camera[0] - 25,
            y: this.y - camera[1] - 48,
            width: 50,
            height: 48,
            z: -1
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

//-----------------------------------------------------------------------------
const mukundaActor = {
   image: 'res/mug.png',
   mouth: 'res/mouth.png',
   mouthOrigin: [25, 55],
   mouthSize: [26, 21]
}

//-----------------------------------------------------------------------------
const chrisActor = {
   image: 'res/chrisface.png',
   mouth: 'res/chrismouth.png',
   mouthOrigin: [36, 48],
   mouthSize: [19, 14]
}

//-----------------------------------------------------------------------------
const sethActor = {
   image: 'res/sethface.png',
   mouth: 'res/sethface.png',
   mouthOrigin: [0, 0],
   mouthSize: [0, 0]
}

//-----------------------------------------------------------------------------
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
      this.callback = options.callback;
      this.nomouth  = options.nomouth;

      if( options.vo ) {
         this.duration = options.vo.duration;

      } else {
         this.duration = options.text.length / (options.speed || 15);
      }
      
   }

   update( updateTime ) {
      if( !this.active ) return;
      let elapsed = getTime() - this.startTime
      let progress = Math.min( elapsed / (this.duration/5), 1.0 );
      
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
         if( this.callback ) {
            this.callback();
            this.callback = null;
         }
      }

      let currentCharacter = this.fullText.substring( charPos, charPos + 1 )
      if( currentCharacter == ">" || this.nomouth ) {
         this.mouthOpen = 0;
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
            
            <Sprite src={{
               texture: this.actor.image,
               x: 8,
               y: 10,
               width: 90,
               height: 76
            }}/>
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
      this.moveSpeed = 75;
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
               if( this.moveCallback ) {
                  this.moveCallback();
               }
            }
         } else {
            this.flip = true;
            this.x -= this.moveSpeed * time;
            if( this.x <= this.destX ) {
               this.x = this.destX;
               this.moving = false;
               this.flip = false;
               if( this.moveCallback ) {
                  this.moveCallback();
               }
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

   moveTo( x, completionCallback ) {
      this.destX = x;
      if( Math.abs(this.x - this.destX) > 3 ) {
         this.moving = true;
      }
      this.moveCallback = completionCallback;
   }

   useCell( ) {
      this.makingACall = true;
   }

   hide() {
      this.hidden = true;
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
      this.hidden = true;
      this.key = makeKey();
   }

   spawn( x, y ) {
      this.x = x;
      this.y = y;
      this.hidden = false;
   }

   update( time ) {
      if( this.moving ) {
         if( this.x < this.destX ) {
            this.flip = false;
            this.x += this.moveSpeed * time;
            if( this.x >= this.destX ) {
               this.x = this.destX;
               this.moving = false;
               if( this.moveCallback ) {
                  this.moveCallback();
               }
            }
         } else {
            this.flip = true;
            this.x -= this.moveSpeed * time;
            if( this.x <= this.destX ) {
               this.x = this.destX;
               this.moving = false;
               this.flip = false;
               if( this.moveCallback ) {
                  this.moveCallback();
               }
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
            transform: this.flip ? "scaleX( -1 )" : "",
            tx: -this.animations.frame * 64
         }} key={this.key}/> );
      }
   }

   moveTo( x, completionCallback ) {
      this.destX = x;
      if( Math.abs(this.x - this.destX) > 3 ) {
         this.moving = true;
      }
      this.moveCallback = completionCallback;
   }

   hide() {
      this.hidden = true;
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

class StopSign extends Entity {
   constructor() {
      super();
      this.x = camera[0] + displaySize[0] + 25;
      this.y = roadLevel;
   }

   update() {
      return (
         <Sprite src={{
            x: this.x - camera[0] - 32/2,
            y: this.y - camera[1] - 40,
            width: 32,
            height: 40,
            texture: "res/time2stop.png"
         }} key={this.key}/>
      )
   }
}

class RedLight extends Entity {
   constructor() {
      super();
      this.x = camera[0] + displaySize[0] + 25;
      this.y = roadLevel;
   }
   update() {
      return (
         <Sprite src={{
            x: this.x - camera[0] - 32/2,
            y: this.y - camera[1] - 92,
            width: 32,
            height: 92,
            texture: "res/trafficlight.png"
         }} key={this.key}/>
      );
   }
}

class SpaceStation extends Entity {
   constructor() {
      super();
      this.x = camera[0] + displaySize[0] + 1000;
      this.y = camera[1];
   }
   update() {
      return (
         <Sprite src={{
            x: this.x - camera[0] - 867/2,
            y: this.y - camera[1] - 238,
            width: 867,
            height: 280,
            texture: "res/spacestation.png",
            z: -2
         }} key={this.key}/>
      );
   }
}

class Seth extends Entity {
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
   }

   update( timeElapsed ) {
      let t = Math.floor((getTime() * 2) % 2);
      return (
         <Sprite src={{
            x: this.x - camera[0] - 49/2,
            y: this.y - camera[1] - 64,
            width: 49,
            height: 64,
            texture: "res/smallseth.png",
            tx: t * 49,
         }} key={this.key}/>
      )
   }
}

class Starfield extends Entity {
   
   constructor() {
      super();
      this.opacity = 0;
   }

   setOpacity( opacity ) {
      this.opacity = opacity;
   }

   update() {
      if( this.opacity === 0 ) {
         return;
      }

      return (
         <Sprite src={{
            x: 0,
            y: 0,
            width: displaySize[0],
            height: displaySize[1],
            texture: "res/stars.png",
            tx: -camera[0] * 0.1,
            ty: -camera[1] * 0.1,
            opacity: this.opacity,
            z: -10
         }} key={this.key}/>
      );
   }
}

class Handled extends Entity {
   constructor() {
      super();
      this.time = getTime();
   }

   update() {
      let opacity = Math.min( getTime() - this.time, 1 );
      let opacity2 = Math.min( (getTime() - this.time - 2) / 2, 1 );

      let output = [
         <Sprite src={{
            x: displaySize[0] / 2 - 150/2,
            y: displaySize[1] / 2 - 150/2,
            width: 150,
            height: 150,
            texture: "res/bigh.png",
            opacity: opacity
         }} key={this.key}/>
      ];

      if( opacity2 > 0 ) {
         output.push(
            <div className="hireme" key={this.key + "-tagline"}
                 style={{opacity:opacity2}}>
               I want to be a part of your change.
            </div>
         );
      }

      return output;
   }
}

// I really hate putting the delay time AFTER the function definition.
// This accepts seconds, too.
function afterDelay( time, func ) {
   return setTimeout( func, time * 1000 );
}

//-----------------------------------------------------------------------------
class GameController extends Entity {
   constructor() {
      super();
      this.scene = "start";
      this.lastTime = getTime();

      this.road = new Road();
     // this.clouds = new Clouds();

      this.dude = new Dude();
      this.dude.x = camera[0] - 100;
      this.dude.y = roadLevel;

      this.nextTrafficTime = 0;
      this.scheduleTrafficCar();

      this.speech = new SpeechDisplay();

      this.truck = new Truck();
      this.crap = new Crap();
      this.chris = new Chris();
      this.starfield = new Starfield();

      // Debug:
      /*
      this.state = "start5";
      this.dude.moveTo( 100 );
      this.dude.useCell();
      this.speech.start({
         actor: mukundaActor,
         text: "Ready!"
      });

      this.chris.spawn( camera[0] + 200, roadLevel );
      this.chris.moveTo( this.crap.x );
      this.speech.start({
         actor: chrisActor,
         text: "Hello, my dear new programmer slave."
      });
*/
//this.truck.x = 50;
this.truck.gogogo();
this.truck.fly();
this.followTruck =true;
      this.scene = "to space 5";
      this.onSceneStart( this.scene );
      
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

   onSceneStart( scene ) {
      switch( scene ) {
      case "start":
         afterDelay( 1.0, () => {
            this.dude.moveTo( 100, () => {
               this.setScene( "start2" );
            });
         });
         break;
      case "start2":
         afterDelay( 0.25, () => {
            //this.truck.rollUp();
            this.speech.start({
               actor: mukundaActor,
               text: "Hey Internet! I'm Mukunda Johnson, and today I'm going to move to the HANDLED virtual headquarters!",
               callback: () => {
                  //this.setScene( "take off" );
                  this.setScene( "start3" );
               }
            });
         });
         break;
      case "start3":
         afterDelay( 2.4, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "My programmer made me kind of dumb, but that's okay;"
                    +">>> you don't need a brain to use the highly intuitive Handled app! "
                    +">>>>>>>>>>>>Let me try and figure it out.",
               callback: () => {
                  this.setScene( "use_handled_app" );
               }
            });
         });
         break;
      case "use_handled_app":
         afterDelay( 2.4, () => {
            this.dude.useCell();
            this.speech.start({
               actor: mukundaActor,
               text: "I just pull out my phone and...>>> scan my stuff... >>>>>Oh!>>>> the machine learning read my mind, and I didn't even need to point my camera.>>> That's alarmingly painless.",
               callback: () => {
                  this.setScene( "chris rolls up" );
               }
            });
         });
         break;
      case "chris rolls up":
         this.truck.rollUp();
         afterDelay( 2.5, () => {
            this.chris.spawn( this.truck.x + 50, roadLevel );
            this.chris.moveTo( this.crap.x );
            this.speech.start({
               actor: chrisActor,
               text: "Hello, my dear new programmer slave.>>>>>>>> Let's get you to work.",
               callback: () => {
                  this.setScene( "hi chris" );
               }
            });
         });
         break;
      case "hi chris":
         afterDelay( 2, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "Chris?? I didn't know you were also a Hand!",
               callback: () => {
                  
                  this.setScene( "throw crap" );
               }
            });
         });
         break;
      case "throw crap":
         afterDelay( 2.0, () => {
            this.crap.fling();
            this.chris.moveTo( this.truck.x + 50, () => {
               this.chris.hide();
            });
            afterDelay( 1.0, () => {
               this.speech.start({
                  actor: mukundaActor,
                  text: "Whoa, careful! My rig is ten years old!",
                  callback: () => {
                     this.setScene( "take off" );
                  }
               });
            });
         });
         break;
      case "take off":
         afterDelay( 2, () => {
            this.speech.start({
               actor: chrisActor,
               text: "Let's roll the ball forward, my friend.",
               callback: () => {
                  
               }
            });
         });
         afterDelay( 3.0, () => {
            this.dude.moveTo( this.truck.x + 50, () => {
               this.dude.hide();
               this.setScene( "speeding" );
            });
         });
         break;
      case "speeding":
         afterDelay( 0.5, () => {
            this.speech.hide();
            this.truck.gogogo();
            this.followTruck = true;
         });
         afterDelay( 1.0, () => {
            this.setScene( "stopsign" );
         })
         break;
      case "stopsign":
         afterDelay( 3.0, () => {
            this.stopsign = new StopSign();
         });
         break;
      case "ran stop sign":
         this.speech.start({
            actor: mukundaActor,
            text: "Whoa, you just ran a stop sign, Chris...",
            callback: () => {
               afterDelay( 2.0, () => {
                  this.speech.start({
                     actor: chrisActor,
                     text: "Your move, Handled!",
                     callback: () => {
                        this.setScene( "part2" );
                     }
                  });
               });
               
            }
         });
         break;
      case "part2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "This might not be my best app, but it's an exercise to get a product done however it takes within a certain deadline for the thirsty clients.>>>>>>>>>>> That's you guys!",
               callback: () => {
                  this.setScene( "red light coming 3" );
               }
            });
         });
         break;
      case "red light coming":
         afterDelay( 2.5, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "Um... red light, Chris...>>>>>>>>>>> ...RED LIGHT, CHRIS!!",
               callback: () => this.setScene( "red light coming 2" )
            });
         });
         break;
      case "red light coming 2":
         afterDelay( 1.0, () => {
            this.speech.start({
               actor: chrisActor,
               text: "We can make it...",
               callback: () => this.setScene( "red light coming 3" )
            });
         });
         break;
      case "red light coming 3":
         afterDelay( 1.5, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "WE CAN'T MAKE IT - IT'S ALREADY RED!!",
               callback: () => this.setScene( "red light" )
            });
         });
         break;
      case "red light":
         this.redlight = new RedLight();
         break;
      case "ran red light":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: chrisActor,
               text: "I told you.",
               callback: () => this.setScene( "chris is messed up" )
            });
         });
         break;
      case "chris is messed up":
         afterDelay( 3.5, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "Okay, so Chris is kind of messed up... but as I was saying--",
               callback: () => this.setScene( "flying" )
            });
         });
         break;
      case "flying":
         this.truck.fly();
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "Oh whoa, we're flying!",
               callback: () => this.setScene( "flying 2" )
            });
         });
         break;
      case "flying 2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: chrisActor,
               text: "This isn't flying.>>>>>>>> This is moving.>>>>>> With style.",
               callback: () => this.setScene( "to the cloud" )
            });
         });
         break;
      case "to the cloud":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "Oh yeah, the Handled office is located in the cloud!",
               callback: () => this.setScene( "to space" )
            });
         });
         break;
      case "to space":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "Or... outer space...",
               callback: () => {
                  this.setScene( "to space 2" )
               }
            });
         });
         break;
      case "to space 2":
         this.startSpaceTruckY = this.truck.y;
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "Just so you're aware, Chris, as I am a proactive communicator - I didn't pack any Oxygen.>>>>>>>>>> But I'm willing to be flexible to work at your superb company.",
               callback: () => this.setScene( "to space 3" )
            });
         });
         break;
      case "to space 3":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: chrisActor,
               text: "You're in good Hands, my friend.",
               callback: () => this.setScene( "to space 4" )
            });
         });
         break;
      case "to space 4":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "*Nervous Asphyxiation*",
               nomouth: true,
               callback: () => this.setScene( "to space 5" )
            });
         });
         break;
      case "to space 5":
         afterDelay( 3.0, ()=> {
            this.speech.hide();
         });
         afterDelay( 8.0, ()=> {
            this.spacestation = new SpaceStation();
            this.seth = new Seth( this.spacestation.x + 25, this.spacestation.y - 45 );
            this.truck.flyTo( this.spacestation.x-150, this.spacestation.y );
            this.setScene( "to station" );
         });
         break;
      case "to station":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "...what's that voice...?>>>>>>>>>>>> ...could it be...?>>>>>>>>>> Mister Waite?>>>>>>>>>>>> ...addressing the universe with an inspirational speech...?",
               callback: () => this.setScene( "station 2" )
            });
         });
         break;
      case "station 2":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: sethActor,
               text: "...And my message is clear.",
               nomouth: true, // honestly scared bc i don't know how easygoing seth is. don't give him a goofy mouth
               callback: () => this.setScene( "station 3" )
            });
         });
         break;
      case "station 3":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: sethActor,
               text: "Change>>>>>>>> or be compelled to be changed!",
               nomouth: true,
               callback: () => this.setScene( "station 4" )
            });
         });
         break;
      case "station 4":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: mukundaActor,
               text: "What a legend...>>>>>>>>>> I feel the life returning to me...",
               callback: () => this.setScene( "station 5" )
            });
         });
         break;
      case "station 5":
         afterDelay( 3.0, () => {
            this.speech.hide();
            this.followTruck = false;
            this.cameraFloat = true;
         });
         afterDelay( 10.0, () => {
            this.handled = new Handled();
         });
         break;
      default:
         break;
      }
   }

   onSceneUpdate( scene, updateTime ) {
      switch( scene ) {
      case "speeding":
         if( this.truck.going ) {
            
            
         }
         break;
      case "stopsign":
         if( this.stopsign && this.truck.x > this.stopsign.x ) {
            this.setScene("ran stop sign");
            
         }
         break;
      case "red light":
         if( this.redlight && this.truck.x >= this.redlight.x ) {
            this.setScene( "ran red light" );
         }
         break;
      case "to space 2":
      case "to space 3":
      case "to space 4":
         

      default:
         break;
      }
   }

   onSceneEnd() {

   }

   setScene( newScene ) {
      this.onSceneEnd( this.scene );
      this.scene = newScene;
      this.onSceneStart( this.scene );
   }

   update( updateTime ) {

      this.onSceneUpdate( this.scene, updateTime );
      
      // Car spawner, runs async to everything else.
      if( getTime() > this.nextTrafficTime ) {
         this.scheduleTrafficCar();
         new TrafficCar();
      }

      if( this.followTruck ) {
         let desiredCameraX = this.truck.x - 100;
         console.log( desiredCameraX );
         let delta = Math.pow( 0.8, updateTime * 60 );
         camera[0] = camera[0] * delta + desiredCameraX * (1-delta);
         if( this.truck.flying ) {
            camera[1] = this.truck.y - roadLevel;
         }
      }

      if( this.cameraFloat ) {
         camera[1] -= updateTime * 25;
      }

      if( camera[1] < -2000 ) {

         backgroundFade = Math.min( (-camera[1] - 2000) / 10000, 1 );

         let so = -camera[1] - 8000;
         so /= 2000;
         so = Math.min( so, 1 );
         //let starfieldOpacity = Math.max( Math.min( (-camera[1] - 8000) / 2000, 1 ), 0 );
         this.starfield.setOpacity( so );
         console.log( so );
         console.log( backgroundFade, camera[1], "bgfade" );
      }

      return;
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
