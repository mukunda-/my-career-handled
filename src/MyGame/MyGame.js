///////////////////////////////////////////////////////////////////////////////
// My Career, Handled!
//
// (C) 2020 Mukunda Johnson (www.mukunda.com)
///////////////////////////////////////////////////////////////////////////////
import React from 'react';

// This was all crammed into one file last Saturday during initial drafting. :)
import Actors        from './Actors';
import Audio         from './Audio';
import Chris         from './Chris';
import Clouds        from './Clouds';
import Crap          from './Crap';
import Dude          from './Dude';
import Engine        from '../Engine';
import Handled       from './Handled';
import PhoneApp      from './PhoneApp';
import RedLight      from './RedLight';
import Road          from './Road';
import Seth          from './Seth';
import SpaceStation  from './SpaceStation';
import SpeechDisplay from './SpeechDisplay';
import Starfield     from './Starfield';
import StopSign      from './StopSign';
import Tapper        from './Tapper';
import TextPrompt    from './TextPrompt';
import TrafficCar    from './TrafficCar';
import Truck         from './Truck';

import beatItFile     from './res/beatit.mp3';
import crashSoundFile from './res/crash.mp3';
import openSoundFile  from './res/open.mp3';
import robotBlipFile  from './res/RobotBlip.ogg';
///////////////////////////////////////////////////////////////////////////////
// The vertical coordinate where the road starts. 0 = clouds, 234 = road.
const roadLevel = 234;
let stateInstance; // For exposing state for testing code.

//-----------------------------------------------------------------------------
// Sound files to load.
const beatIt = Audio.load({
   src: beatItFile,
   volume: 0.5
});

const openSound = Audio.load({
   src: openSoundFile,
   volume: 0.4
});

const crashSound = Audio.load({
   src: crashSoundFile,
   volume: 0.6
});

const robotBlip = Audio.load({
   src: robotBlipFile,
   volume: 0.4
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

      this.starterPrompt = new TextPrompt({
         x: Engine.getDisplaySize()[0] / 2,
         y: Engine.getDisplaySize()[1] / 2,
         width: Engine.getDisplaySize()[0],
         text: "Loading..."
      });

      // Debug: clean up later.
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

   //--------------------------------------------------------------------------
   // Sets a random time in the near future that a TrafficCar will spawn - the
   //           cars that drive across the screen to simulate opposing traffic.
   scheduleTrafficCar() {
      this.nextTrafficTime = Engine.getTime() + 1.5 + Math.random() * 6.0;
   }

   //--------------------------------------------------------------------------
   /* Not used.
   waitForDelay( updateTime, delay, slot = "delay1" ) {
      this[slot] = (this[slot] || 0) + updateTime;
      if( this[slot] > delay ) {
         this[slot] = 0;
         return true;
      }
      return false;
   }*/

   //--------------------------------------------------------------------------
   // During design I had to weigh my options of what might be best to script
   //  the game. Why not just use the scripting language itself though? It's
   //  dirty, but flexible and fast to implement.
   // The 'game' is split up into different 'scenes', with each one progressing
   //  into the next. `setScene` changes what scene is current.
   onSceneStart( scene ) {
      switch( scene ) {
      //-----------------------------------------------------------------------
      // Initial short delay before beginning things, giving the user a moment
      //                                                to soak in the scenery.
      case "start":
         
         break;
      //-----------------------------------------------------------------------
      // Main character explains his predicament.
      case "start2":
         // Fine tune these delays to make things feel somewhat natural. If
         //  anything feels like too long of a pause, shorten the delay, and if
         //                                something seems rushed, lengthen it.
         afterDelay( 0.25, () => {
            this.speech.start({
               actor: Actors.mukunda,
               // Any '>' in the text is interpreted as a delay in the speech.
               text: "Hi, Internet! I'm Mukunda Johnson, and I want to work at Handled!"
                    +">>>>>>>> But first, I need some help getting there.",
               callback: () => {
                  this.setScene( "start3" );
               }
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Continued talk and pulling out the cell phone. After which you can
      //  click it to progress further. He can't figure out how to point and
      //  click.
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
               text: "My programmer made me so dumb that I cannot fathom how to "
                    +"use the shockingly intuitive Handled app."
                    +">>>>> Can you figure it out?",
               callback: () => {
                  // Once he's done saying that, show a tapper signal and wait
                  //  for user input.
                  const [x, y] = this.phone.getRenderPosition();
                  this.phoneTapper = new Tapper( x, y, 150, () => {
                     this.setScene( "use_handled_app" );
                  });
               }
            });
         });
         break;

      //-----------------------------------------------------------------------
      // SCANNING appears on the phone, a poor simulation of using the Handled
      //  app to collect the user's inventory. It shows up with 'MUKUNDAS CRAP'
      //                       before long, and an exorbitant guaranteed quote.
      case "use_handled_app":
         // Try to keep any state setup in the current handler, and not the
         //                                                  previous scene.
         robotBlip.play();
         this.phone.setContent( "SCANNING" );
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

               // He goes on a rant for a while about the wonders of modern
               //  technology.
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

      //-----------------------------------------------------------------------
      // After giving the user a moment to soak all that in, he orders the move
      //                                       and the truck will show up soon.
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

      //-----------------------------------------------------------------------
      // Put away the phone and wait for the truck to roll up.
      case "chris rolls up":
         this.phone.obliterate();
         this.dude.stopUsingCell();
         this.truck.rollUp( Engine.getCamera()[0] + 220 );
         afterDelay( 4.5, () => {
            openSound.play();
            this.chris.spawn( this.truck.x + 50, roadLevel );
            this.chris.moveTo( this.crap.x );
            this.speech.start({
               actor: Actors.chris,
               // Chris is very nonchalant about his new programmer slave.
               text: "Hello, my dear new programmer slave.>>>>>>>> Let's get you to work.",
               callback: () => {
                  this.setScene( "hi chris" );
               }
            });
         });
         break;
      //-----------------------------------------------------------------------
      // Be surprised that Chris is here to help you. Handled calls its moving
      //                                                   associates "hands."
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

      //-----------------------------------------------------------------------
      // Chris carelessly flings Mukunda's crap into the truck, likely breaking
      //  it. But that's okay, because this old rig needs to die anyway. You
      //                       should see the craters in my keyboard buttons.
      case "throw crap":
         afterDelay( 2.0, () => {
            this.crap.fling();
            // Chris also goes back to the car and gets inside.
            // Callback here triggers when he's done moving there, and it
            //                                                  hides him.
            this.chris.moveTo( this.truck.x + 50, () => {
               openSound.play();
               this.chris.hide();
            });
            afterDelay( 1.0, () => {
               this.speech.start({
                  actor: Actors.mukunda,
                  // (He doesn't really care about that old piece of shit.)
                  text: "Whoa, careful! My rig is ten years old!",
                  callback: () => {
                     this.setScene( "take off" );
                  }
               });
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Chris tells us to hurry up. Click the car to continue.
      case "take off":
         afterDelay( 2, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "Let's roll the ball forward, my friend.",
               callback: () => {
                  new Tapper( this.truck.x, this.truck.y - 55, 150, () => {
                     // Once the car is clicked, we wait for the dude to get in
                     //            the door, and then start the speeding scene.
                     this.dude.moveTo( this.truck.x + 50, () => {
                        openSound.play();
                        this.dude.hide();
                        this.setScene( "speeding" );
                     });
                  });
               }
            });
         });
         break;

      //-----------------------------------------------------------------------
      // We soon learn that Chris is insane. He has to be, because nobody is
      //                   that nice without something being wrong with them.
      case "speeding":
         this.beatitTrack = beatIt.play();
         afterDelay( 0.5, () => {
            this.speech.start({
               actor: Actors.mukunda,
               // Yay, software!
               text: "All right, let's go! On the way, we can talk about "
                    +"boring things like software.",
               callback: () => {
                  this.setScene( "speeding 2" );
               }
            });
            this.truck.gogogo();
            this.followTruck = true;
         });
         break;

      //-----------------------------------------------------------------------
      // Dude goes on a rant for a bit until being surprised that Chris zooms
      //  past a stop sign without a care in the world. Why is there a stop
      //                  sign on an open freeway? The world may never know.
      case "speeding 2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "This is my first React app, built in a few days as an "
                    +"exercise to get myself in shape for my new role."
                    +">>>>>> I'll be back-end, but it doesn't hurt at all to "
                    +"be familiar with the front-end technologies so I--",
               callback: () => {
                  // Suddenly, a stop sign.
                  this.setScene( "stopsign" );
               }
            });
         });
         break;
      //-----------------------------------------------------------------------
      // No slowing down. The next phase triggers in a polled update, when the
      //  truck passes the stop sign.
      case "stopsign":
         { // Dummy scope here, because I don't really know how JavaScript
           // handles declarations inside cases.
            const x = Engine.getCamera()[0] + Engine.getDisplaySize()[0] + 25;
            this.stopsign = new StopSign( x, roadLevel );
         }
         break;

      //-----------------------------------------------------------------------
      // Dude is alarmed. This is like being passenger when my dad is at the
      //  wheel.
      case "ran stop sign":
         this.speech.start({
            actor: Actors.mukunda,
            text: "Whoa, you just ran a stop sign, Chris...",
            callback: () => {
               afterDelay( 2.0, () => {
                  this.speech.start({
                     actor: Actors.chris,
                     // He did it for the pun, except no, he did not handle
                     //  that well.
                     text: "I guess you could say, that I Handled that quite well...",
                     callback: () => {
                        this.setScene( "part2" );
                     }
                  });
               });
            }
         });
         break;

      //-----------------------------------------------------------------------
      // Another lengthy speech section before a red light starts encroaching.
      case "part2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Actually, it was kind of the opposite, Chris..."
                    +">>>>>>> So anyway, this app also employs some neat things "
                    +"like automated testing, or CI, and deployment to AWS "
                    +"Amplify. End to end testing too, using playwright to "
                    +"simulate Chromium, Firefox, and--",
               callback: () => {
                  this.setScene( "red light coming" );
               }
            });
         });
         break;

      //-----------------------------------------------------------------------
      // A few scenes where the dude is freaking out and Chris is cool as a
      //  cucumber. Stuff like this could really benefit from async/await
      //                                      rather than this spaghetti.
      case "red light coming":
         afterDelay( 0.5, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Um, red light, Chris...>>>>>>>>>>> RED LIGHT, CHRIS!!",
               callback: () => this.setScene( "red light coming 2" )
            });
         });
         break;
      //-----------------------------------------------------------------------
      case "red light coming 2":
         afterDelay( 1.0, () => {
            this.speech.start({
               actor: Actors.chris,
               // No, we can't.
               text: "We can make it...",
               callback: () => this.setScene( "red light coming 3" )
            });
         });
         break;
      //-----------------------------------------------------------------------
      case "red light coming 3":
         afterDelay( 1.0, () => {
            this.speech.start({
               actor: Actors.mukunda,

               // Shouting makes the avatar zoomed in.
               shouting: true,
               text: "WE CAN'T MAKE IT, CHRIS - IT'S ALREADY RED!!",
               callback: () => this.setScene( "red light" )
            });
         });
         break;
      //-----------------------------------------------------------------------
      case "red light": {
         // Car crash sound; someone is getting sued.
         // It should sync up somewhat well with the red light spawning and
         //  passing.
         crashSound.play();
         const x = Engine.getCamera()[0] + Engine.getDisplaySize()[0] + 25;
         this.redlight = new RedLight( x, roadLevel );
         break;

      //-----------------------------------------------------------------------
      // Chris don't care.
      } case "ran red light":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "I told you.",
               callback: () => this.setScene( "chris is messed up" )
            });
         });
         break;
      
      //-----------------------------------------------------------------------
      // Dude tries to go on another rant, but is interrupted, by flying.
      case "chris is messed up":
         afterDelay( 3.5, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Okay, so Chris is kind of messed up... but as I was saying--",
               callback: () => this.setScene( "flying" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Suddenly, the truck is a craft suitable for entering orbit.
      case "flying":
         this.truck.fly();
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "We're flying?!",
               shouting: true,
               callback: () => this.setScene( "flying 2" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Only 90s kids would understand.
      case "flying 2":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "This isn't flying.>>>>>>>> This is moving.>>>>>> With style.",
               callback: () => this.setScene( "to the cloud" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Heh heh get it... cause they're going into the clouds.
      case "to the cloud":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "Oh, right! The Handled office is located in the cloud!",
               callback: () => this.setScene( "to space" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Except they zoom past those too and head for space.
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

      //-----------------------------------------------------------------------
      // Talking with Chris about the positive attitude and willingness to 
      //     adapt to difficult circumstances in favor of sweet employment.
      case "to space 2":
         // Not sure what this variable was used for.
         this.startSpaceTruckY = this.truck.y;
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               // I mean honestly, what good is an expert employee who doesn't
               //                              tell you what he's doing or how.
               text: "Just so you're aware,>>> Chris,>>> because communication "
                    +"is key to success in a business: I didn't pack any Oxygen."
                    +">>>>>>>>> I'm willing to be flexible though, to be a part "
                    +"of your superb company.",
               callback: () => this.setScene( "to space 3" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Chris is calm as ever.
      case "to space 3":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.chris,
               text: "You're in good Hands, my friend.",
               callback: () => this.setScene( "to space 4" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // Dude is dying; what will save him??
      case "to space 4":
         afterDelay( 2.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "(Nervous Asphyxiation)",

               // Originally I had moving mouths, but it was a bit over the top
               //  with stupidity. I was using real faces too, but I figured it
               //  might not be a good idea to use people's faces without their
               //  permission.
               nomouth: true,
               callback: () => this.setScene( "to space 5" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // This is a longer delay, just drifting in space for a bit while dying.
      case "to space 5":
         afterDelay( 3.0, () => {
            this.speech.hide();
         });
         afterDelay( 8.0, () => {
            // The truck zooms to the Handled space station, courtesy of
            //  shutterstock.
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

      //-----------------------------------------------------------------------
      // Just when all hope was nearly depleted, a miraculous force begins to
      //  heal the dude.
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

      //-----------------------------------------------------------------------
      // Seth Waite is on his space stage, broadcasting a speech to the
      //  universe.
      case "station 2":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: Actors.seth,
               text: "...And my message is clear...",
               nomouth: true,
               callback: () => this.setScene( "station 3" )
            });
         });
         break;
      
      //-----------------------------------------------------------------------
      // A message stolen from his blog.
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
      
      //-----------------------------------------------------------------------
      // Happy ending.
      case "station 4":
         afterDelay( 3.0, () => {
            this.speech.start({
               actor: Actors.mukunda,
               text: "What a legend...>>>>>>>>>> I feel the life returning to me...",
               callback: () => this.setScene( "station 5" )
            });
         });
         break;

      //-----------------------------------------------------------------------
      // After a moment, the camera starts to drift upward, and the Handled
      //             logo appears, alongside a heartwarming message from me.
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

   //--------------------------------------------------------------------------
   // This is triggered every frame for the active scene. updateTime is
   //  forwarded from the entity update.
   onSceneUpdate( scene, updateTime ) {
      switch( scene ) {
      case "start": {
         const loadProgress = Audio.loadingProgress()
         if( loadProgress < 1 ) {
            this.starterPrompt.setText( `Loading: ${Math.floor(loadProgress*100)}%` );
         } else {
            
            this.starterPrompt.setText( "Tap to start." );
            new Tapper( Engine.getDisplaySize()[0] / 2, Engine.getDisplaySize()[1] / 2, 500, () => {
               this.starterPrompt.obliterate();
               afterDelay( 1.0, () => {
                  // Dude walks up to talk to you.
                  this.dude.moveTo( 100, () => {
                     this.setScene( "start2" );
                  });
               });
            }).hidePointer();

            this.setScene( "start-wait" );
         }
         break;
      //-----------------------------------------------------------------------
      // For the stop sign scene, wait for the truck to pass the sign before
      //                                     progressing into the next scene.
      } case "stopsign":
         if( this.stopsign && this.truck.x > this.stopsign.x ) {
            this.setScene("ran stop sign");
         }
         break;
      //-----------------------------------------------------------------------
      // Same for the red light scene.
      case "red light":
         if( this.redlight && this.truck.x >= this.redlight.x ) {
            this.setScene( "ran red light" );
         }
         break;
      //-----------------------------------------------------------------------
      // Not sure what I was going to do here, but I guess I changed my mind.
      case "to space 2":
      case "to space 3":
      case "to space 4":
         
         break;
      default:
         break;
      }
   }

   //--------------------------------------------------------------------------
   // For posterity, not used.
   onSceneEnd( scene ) {

   }

   //--------------------------------------------------------------------------
   // Change the current scene. Triggers onSceneEnd and onSceneStart with
   //  the new setting.
   setScene( newScene ) {
      this.onSceneEnd( this.scene );
      this.scene = newScene;
      this.onSceneStart( this.scene );
   }

   //--------------------------------------------------------------------------
   // Called by the engine each frame.
   update( updateTime ) {
      this.onSceneUpdate( this.scene, updateTime );
      
      // Car spawner, runs async to everything else.
      // Cancels itself when the truck starts flying.
      if( Engine.getTime() > this.nextTrafficTime
                                         && !this.truck.flying
                                            && Audio.loadingProgress() >= 1 ) {
         this.scheduleTrafficCar();
         let x = Engine.getCamera()[0] + Engine.getDisplaySize()[0] + 200;
         let y = roadLevel;
         new TrafficCar( x, y );
      }

      // Camera moving code. When the truck starts moving, follow it. I'd like
      //  the transition and following to be a smoother, but it works good
      //  enough.
      let camera = Engine.getCamera();

      if( this.followTruck ) {
         let desiredCameraX = this.truck.x - 100;
         let delta = Math.pow( 0.8, updateTime * 60 );
         camera[0] = camera[0] * delta + desiredCameraX * (1-delta);
         if( this.truck.flying ) {
            // Keep the camera vertical level fixed up until the truck starts
            //  flying.
            camera[1] = this.truck.y - roadLevel;
         }
      }

      if( this.cameraFloat ) {
         camera[1] -= updateTime * 25;
      }

      Engine.setCamera( camera[0], camera[1] );

      // Handle fading out the backdrop and fading in the starfield at high
      //  altitudes.
      let backdrop = [0xc4, 0xee, 0xe0];
      let bgFade = 0.0;

      if( camera[1] < -2000 ) {

         bgFade = Math.min( (-camera[1] - 2000) / 10000, 1 );

         // Once the backdrop fade is reaching near black, the starfield starts
         //  to fade in.
         let so = -camera[1] - 8000;
         so /= 2000;
         so = Math.min( so, 1 );
         this.starfield.setOpacity( so );
      }

      if( bgFade > 0 ) {
         for( let i = 0; i < 3; i++ ) backdrop[i] *= 1 - bgFade;
      }
      Engine.setBackdrop( backdrop );
   }
}

//-----------------------------------------------------------------------------
// Game entry point called from outside. No support currently for calling this
//  more than once or running the game more than once.
function Start() {
   Engine.reset();
   stateInstance = new State();
}

//-----------------------------------------------------------------------------
// For debugging/testing.
function getStateInstance() {
   return stateInstance;
}

///////////////////////////////////////////////////////////////////////////////
export default {
    Start, getStateInstance
}
