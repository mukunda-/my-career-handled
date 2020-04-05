///////////////////////////////////////////////////////////////////////////////
import Engine from "../Engine";
import React from 'react';
import Sprite from '../Sprite';
///////////////////////////////////////////////////////////////////////////////

class Truck extends Engine.Entity {
   constructor( x, y ) {
      super();
      this.x = x;
      this.y = y;
      //this.x = camera[0] - 100;
      //this.y = roadLevel;
      this.accel = 0;
      this.rocket = 0;
   }

   rollUp( x ) {
      this.rollingUp = true;
      this.rollTo = x;
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

///////////////////////////////////////////////////////////////////////////////
export default Truck;
