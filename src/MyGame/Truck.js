///////////////////////////////////////////////////////////////////////////////
import Engine from "../Engine";
import React from 'react';
import Sprite from '../Sprite';
import {Howl} from 'howler';
import truckTexture from './res/handled_truck.png';
import wheelTexture from './res/wheel.png';

import slowSoundFile from './res/truckslow.ogg';
import speedSoundFile from './res/speeding.mp3';
import speedSoundLoopFile from './res/speedloop.wav';
import takeoffSoundFile from './res/takeoff.mp3';
import rocketSoundFile from './res/rocket.mp3';
// slow driving
// speedup
// speedloop
// flying
///////////////////////////////////////////////////////////////////////////////

const slowSound = new Howl({
   src: slowSoundFile,
   loop: true
});

const speedSound = new Howl({
   src: speedSoundFile,
   volume: 0.4
});

const speedSoundLoop = new Howl({
   src: speedSoundLoopFile,
   loop: true,
   volume: 0.4
});

const takeoffSound = new Howl({
   src: takeoffSoundFile,
   volume: 0.5
});

const rocketSound = new Howl({
   src: rocketSoundFile,
   volume: 0.5,
   loop: true
});

//-----------------------------------------------------------------------------
class Truck extends Engine.Entity {
   //--------------------------------------------------------------------------
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
      //this.x = camera[0] - 100;
      //this.y = roadLevel;
      this.accel = 0;
      this.rocket = 0;
   }

   //--------------------------------------------------------------------------
   rollUp( x ) {
      this.rollingUp = true;
      this.rollTo = x;
      if( !this.slowSound ) {
         this.slowSound = slowSound.play();
      }
      slowSound.fade( 0, 1, 500, this.slowSound );
   }

   //--------------------------------------------------------------------------
   gogogo() {
      this.going = true;
      if( this.slowSound ) {
         slowSound.fade( 1, 0, this.slowSound );
      }
      if( !this.speedSound ) {
         this.speedSound = speedSound.play();

         // This is very hacky being fixed like this, but we really need a
         //  better timing library to begin with.
         setTimeout(() => {
            speedSound.fade( 0.4, 0, 1000, this.speedSound );
            this.speedSound = speedSoundLoop.play();
            speedSoundLoop.fade( 0, 0.3, 1000, this.speedSound );
         }, 22.9*1000);
      }
   }

   //--------------------------------------------------------------------------
   fly() {
      this.flying = true;
      if( this.speedSound ) {
         speedSoundLoop.fade( 0.3, 0, 1000, this.speedSound );
         takeoffSound.play();
         this.rocketSound = rocketSound.play();
         rocketSound.fade( 0, 0.5, 1000, this.rocketSound );
      }
   }

   //--------------------------------------------------------------------------
   isGoing() {
      return this.going;
   }

   //--------------------------------------------------------------------------
   flyTo( x, y ) {
      this.flyingTo = [x, y];
      this.flyFrom = [this.x, this.y];
      this.flyToTime = 0;
      if( this.rocketSound ) {
         rocketSound.fade( 0.5, 0, 1000, this.rocketSound );
      }
      takeoffSound.play();
   }

   //--------------------------------------------------------------------------
   update( updateTime ) {
      if( this.rollingUp ) {
         this.x += updateTime * 150;
         if( this.x >= this.rollTo ) {//camera[0] + 220 ) {
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
            if( this.accel < 45 ) {
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
   }

   render() {
      const [left, top] = Engine.translate( this.x - 81, this.y - 80 );

      // wheel diameter = 23 pixels
      let wheelRotation = (this.x / (Math.PI * 23) * 360) % 360;
      
      return [
         <Sprite src={{
            x: left,
            y: top + ((this.x % 50) > 40 ? 1 : 0),
            width: 162,
            height: 69,
            texture: truckTexture
         }} key={this.key}/>,
         <Sprite src={{
            x: left + 28 - 23/2,
            y: top + 69 - 23/2,
            width: 23,
            height: 23,
            texture: wheelTexture,
            transform: `rotate(${wheelRotation}deg)`
         }} key={this.key+"-wheel1"}/>,
         <Sprite src={{
            x: left + 138 - 23/2,
            y: top + 69 - 23/2,
            width: 23,
            height: 23,
            texture: wheelTexture,
            transform: `rotate(${wheelRotation}deg)`
         }} key={this.key+"-wheel2"}/>
      ];
   }

   getX() {
      return this.x;
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Truck;
