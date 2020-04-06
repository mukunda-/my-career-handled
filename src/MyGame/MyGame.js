///////////////////////////////////////////////////////////////////////////////
// My Career, Handled!
//
// (C) 2020 Mukunda Johnson (www.mukunda.com)
///////////////////////////////////////////////////////////////////////////////
import React from 'react';

import Actors        from './Actors';
import Chris         from './Chris';
import Clouds        from './Clouds';
import Crap          from './Crap';
import Dude          from './Dude';
import Engine        from '../Engine';
import Handled       from './Handled';
import {Howl}        from 'howler';
import PhoneApp      from './PhoneApp';
import RedLight      from './RedLight';
import Road          from './Road';
import Seth          from './Seth';
import SpaceStation  from './SpaceStation';
import SpeechDisplay from './SpeechDisplay';
import Starfield     from './Starfield';
import StopSign      from './StopSign';
import Tapper        from './Tapper';
import TrafficCar    from './TrafficCar';
import Truck         from './Truck';

import beatItFile    from './res/beatit.mp3';
///////////////////////////////////////////////////////////////////////////////
const roadLevel = 234;
let stateInstance;

const beatIt = new Howl({
   src: beatItFile,
   volume: 0.5
});

//-----------------------------------------------------------------------------
// I really hate putting the delay time AFTER the function definition.
// This accepts seconds, too.
function afterDelay( time, func ) {
   return setTimeout( func, (time * 1000) / Engine.getTimeScale() );
}

//-----------------------------------------------------------------------------
// For `await timeout( seconds );`
//const timeout = seconds => new Promise( res => setTimeout( res, 
//                                       (seconds*1000)/Engine.getTimeScale()) );

//-----------------------------------------------------------------------------
// The big game state and all of its glorious script.
class State extends Engine.Entity {
   constructor() {
      super();
      this.scene = "start";
      this.lastTime = Engine.getTime();

      this.road = new Road( roadLevel );
      this.clouds = new Clouds();

      this.dude = new Dude( -300, roadLevel );
      this.dude.x = -100;
      this.dude.y = roadLevel;

      this.nextTrafficTime = 0;
      this.scheduleTrafficCar();

      this.speech = new SpeechDisplay();

      this.truck = new Truck( -100, roadLevel );
      this.crap = new Crap( 35, roadLevel );
      this.chris = new Chris();
      this.starfield = new Starfield();

      // Debug:
      /*
      this.state = "start5";
      this.dude.moveTo( 100 );
      this.dude.useCell();
      this.speech.start({
         actor: Actors.mukunda,
         text: "Ready!"
      });

      this.chris.spawn( camera[0] + 200, roadLevel );
      this.chris.moveTo( this.crap.x );
      this.speech.start({
         actor: Actors.chris,
         text: "Hello, my dear new programmer slave."
      });
*/
//this.truck.x = 50;
//this.truck.gogogo();
//this.truck.fly();
//this.followTruck =true;
//      this.scene = "to space 5";
      this.onSceneStart( this.scene );
      
   }

   onTap() {
      console.log('hi');
   }
   
   setTimer() {
      
   }

   scheduleTrafficCar() {
      this.nextTrafficTime = Engine.getTime() + 1.5 + Math.random() * 6.0;
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
               actor: Actors.mukunda,
               text: "Hi, Internet! I'm Mukunda Johnson, and I want to work at Handled!>>>>>>>> But first, I need some help getting there.",
               callback: () => {
                  this.setScene( "start3" );
               }
            });
         });
         break;
      case "start3":
         afterDelay( 2.4, () => {
            afterDelay( 0.5, () => {
               this.dude.useCell();
            });
            afterDelay( 0.6, () => {
               this.phone = new PhoneApp();
            });
            this.speech.start({
               actor: Actors.mukunda,
               text: "My programmer made me so dumb that I cannot fathom how to use the shockingly intuitive Handled app.>>>>> Can you figure it out?",
               callback: () => {
                  const [x, y] = this.phone.getRenderPosition();
                  this.phoneTapper = new Tapper( x, y, 150, () => {
                     this.setScene( "use_handled_app" );
                     this.phone.setContent( "SCANNING" );
                  });
               }
            });
         });
         break;
      case "use_handled_app":
         
         afterDelay( 2.5, () => {
            this.phone.setContent( <div>MUKUNDAS<br/>CRAP</div> );
         });
         afterDelay( 4.5, () => {
            this.phone.setContent( 
               <div>
                  MUKUNDAS<br/>CRAP<br/><br/>
                  AUTOMATIC<br/>MACHINE QUOTE™<br/>
                  <span style={{color: "#080"}}>$428,855</span><br/><br/>
                  <small>GUARANTEED!</small>
               </div>
            );
            this.dude.useCell();

         });
         afterDelay( 3.4, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Aha! Point and click; I would have never discovered that on my own! Thank you!"
                  +">>>>>>>>>>> And there is my automatic GUARANTEED quote!"
                  +">>>>>>>>>>> That was alarmingly painless!"
                  +">>>>>>>>>>>>>>>>>>>> Machine learning sure is getting smart these days."
                  +">>>>>>>>>>>>>>>>>>>> Soon, I will have no need for my grossly fallible brain.",
               callback: () => {
                  this.setScene( "use handled app 2" );
               }
            });
         });
         break;
      case "use handled app 2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "I'm submitting the request...",
               callback: () => {
                  afterDelay( 1.0, () => {
                     this.setScene( "chris rolls up" );
                  });
               }
            });
         });
         break;
      case "chris rolls up":
         this.phone.obliterate();
         this.dude.stopUsingCell();
         this.truck.rollUp( Engine.getCamera()[0] + 220 );
         afterDelay( 4.5, () => {
            this.chris.spawn( this.truck.x + 50, roadLevel );
            this.chris.moveTo( this.crap.x );
            this.speech.start({
               actor: Actors.chris,
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
               actor: Actors.mukunda,
               text: "Chris?? I didn't know you were also a part-time Hand!",
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
                  actor: Actors.mukunda,
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
               actor: Actors.chris,
               text: "Let's roll the ball forward, my friend.",
               callback: () => {
                  new Tapper( this.truck.x, this.truck.y - 55, 150, () => {
                     this.dude.moveTo( this.truck.x + 50, () => {
                        this.dude.hide();
                        this.setScene( "speeding" );
                     });
                  });
               }
            });
         });
         
         break;
      case "speeding":
         this.beatitTrack = beatIt.play();
         afterDelay( 0.5, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "All right, let's go! On the way, we can talk about boring things like software.",
               callback: () => {
                  this.setScene( "speeding 2" );
               }
            });
            this.truck.gogogo();
            this.followTruck = true;
         });
         break;
      case "speeding 2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "This is my first React app, built in a few days as an exercise to get myself in shape for my new role.>>>>>> I'll be back-end, but it doesn't hurt at all to be familiar with the fr--",
               callback: () => {
                  this.setScene( "stopsign" );
               }
            });
            
         });
         break;
      case "stopsign":
         {
            const x = Engine.getCamera()[0] + Engine.getDisplaySize()[0] + 25;
            this.stopsign = new StopSign( x, roadLevel );
         }
         break;
      case "ran stop sign":
         this.speech.start({
            actor: Actors.mukunda,
            text: "Whoa, you just ran a stop sign, Chris...",
            callback: () => {
               afterDelay( 2.0, () => {
                  this.speech.start({
                     actor: Actors.chris,
                     text: "I guess you could say, that I Handled that quite well...",
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
               actor: Actors.mukunda,
               text: "Okay...>>>>> this app also employs some neat things like automated testing, or CI, and deployment to AWS services. End to end testing too, using Chromium, Firefox, and--",
               callback: () => {
                  this.setScene( "red light coming" );
               }
            });
         });
         break;
      case "red light coming":
         afterDelay( 0.5, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Um... red light, Chris...>>>>>>>>>>> ...RED LIGHT, CHRIS!!",
               callback: () => this.setScene( "red light coming 2" )
            });
         });
         break;
      case "red light coming 2":
         afterDelay( 1.0, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "We can make it...",
               callback: () => this.setScene( "red light coming 3" )
            });
         });
         break;
      case "red light coming 3":
         afterDelay( 1.5, () => {
            this.speech.start({
               actor: Actors.mukunda,
               shouting: true,
               text: "WE CAN'T MAKE IT, CHRIS - IT'S ALREADY RED!!",
               callback: () => this.setScene( "red light" )
            });
         });
         break;
      case "red light": {
         const x = Engine.getCamera()[0] + Engine.getDisplaySize()[0] + 25;
         this.redlight = new RedLight( x, roadLevel );
         break;
      } case "ran red light":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "I told you.",
               callback: () => this.setScene( "chris is messed up" )
            });
         });
         break;
      case "chris is messed up":
         afterDelay( 3.5, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Okay, so Chris is kind of messed up... but as I was saying--",
               callback: () => this.setScene( "flying" )
            });
         });
         break;
      case "flying":
         this.truck.fly();
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "We're flying?!",
               callback: () => this.setScene( "flying 2" )
            });
         });
         break;
      case "flying 2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "This isn't flying.>>>>>>>> This is moving.>>>>>> With style.",
               callback: () => this.setScene( "to the cloud" )
            });
         });
         break;
      case "to the cloud":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Oh, right! The Handled office is located in the cloud!",
               callback: () => this.setScene( "to space" )
            });
         });
         break;
      case "to space":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Or... outer space...?",
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
               actor: Actors.mukunda,
               text: "Just so you're aware,>>> Chris,>>> because communication is key to success in a business: I didn't pack any Oxygen.>>>>>>>>> I'm willing to be flexible though, to be a part of your superb company.",
               callback: () => this.setScene( "to space 3" )
            });
         });
         break;
      case "to space 3":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "You're in good Hands, my friend.",
               callback: () => this.setScene( "to space 4" )
            });
         });
         break;
      case "to space 4":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "(Nervous Asphyxiation)",
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
            const camera = Engine.getCamera();
            const displaySize = Engine.getDisplaySize();
            this.spacestation = new SpaceStation(
                                          camera[0] + displaySize[0] + 1000,
                                          camera[1] );
            this.seth = new Seth( this.spacestation.x + 25,
                                  this.spacestation.y - 45 );
            this.truck.flyTo( this.spacestation.x - 150,
                              this.spacestation.y        );
            this.setScene( "to station" );
         });
         break;
      case "to station":
         beatIt.fade( 0.5, 0.2, 1000, this.beatitTrack );
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "...what's that voice...?>>>>>>>>>>>> ...could it be...?"
                    +">>>>>>>>>> Mister Waite?>>>>>>>>>>>> "
                    +"...addressing the universe with an inspirational speech...?",
               callback: () => this.setScene( "station 2" )
            });
         });
         break;
      case "station 2":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: Actors.seth,
               text: "...And my message is clear...",
               nomouth: true, // honestly scared bc i don't know how easygoing seth is. don't give him a goofy mouth
               callback: () => this.setScene( "station 3" )
            });
         });
         break;
      case "station 3":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: Actors.seth,
               text: "Change>>>>>>>> or be compelled to be changed!",
               nomouth: true,
               callback: () => this.setScene( "station 4" )
            });
         });
         break;
      case "station 4":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "What a legend...>>>>>>>>>> I feel the life returning to me...",
               callback: () => this.setScene( "station 5" )
            });
         });
         break;
      case "station 5":
         afterDelay( 3.0, () => {
            beatIt.fade( 0.2, 0.7, 3000, this.beatitTrack );
            this.speech.hide();
            this.followTruck = false;
            this.cameraFloat = true;
         });
         afterDelay( 10.0, () => {
            this.handled = new Handled();
         });
         afterDelay( 15.0, () => {
            this.game_over = true;
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
         
         break;
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
      if( Engine.getTime() > this.nextTrafficTime && !this.truck.flying ) {
         this.scheduleTrafficCar();
         let x = Engine.getCamera()[0] + Engine.getDisplaySize()[0] + 200;
         let y = roadLevel;
         new TrafficCar( x, y );
      }

      let camera = Engine.getCamera();

      if( this.followTruck ) {
         let desiredCameraX = this.truck.x - 100;
         let delta = Math.pow( 0.8, updateTime * 60 );
         camera[0] = camera[0] * delta + desiredCameraX * (1-delta);
         if( this.truck.flying ) {
            camera[1] = this.truck.y - roadLevel;
         }
      }

      if( this.cameraFloat ) {
         camera[1] -= updateTime * 25;
      }

      Engine.setCamera( camera[0], camera[1] );

      let backdrop = [0xc4, 0xee, 0xe0];
      let bgFade = 0.0;

      if( camera[1] < -2000 ) {

         bgFade = Math.min( (-camera[1] - 2000) / 10000, 1 );

         let so = -camera[1] - 8000;
         so /= 2000;
         so = Math.min( so, 1 );
         //let starfieldOpacity = Math.max( Math.min( (-camera[1] - 8000) / 2000, 1 ), 0 );
         this.starfield.setOpacity( so );
      }

      if( bgFade > 0 ) {
         for( let i = 0; i < 3; i++ ) backdrop[i] *= 1 - bgFade;
      }
      Engine.setBackdrop( backdrop );
   }
}

//-----------------------------------------------------------------------------
function Start() {
   Engine.reset();
   stateInstance = new State();
}

function getStateInstance() {
   return stateInstance;
}

///////////////////////////////////////////////////////////////////////////////
export default {
    Start, getStateInstance
}
