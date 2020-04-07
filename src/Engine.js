///////////////////////////////////////////////////////////////////////////////
// Game Engine
///////////////////////////////////////////////////////////////////////////////
const displaySize = [512, 288];

// Don't initialize any of this; that's done in reset(), mainly so our tests
//  can easily start in clean states.
let startTime;
let entitiesList;
let camera;
let currentTimeMs;
let nextNewKeyIndex;
let lastTimePollMs;
let lastUpdateTime;
let timeScale;
let backdrop;
let tapCallbacks;
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// Reset the engine - destroying all entities and everything.
function reset() {
   startTime         = new Date().getTime();
   entitiesList      = [];
   tapCallbacks      = [];
   camera            = [0, 0];
   currentTimeMs     = 0;
   nextNewKeyIndex   = 1;
   lastTimePollMs    = 0;
   lastUpdateTime    = 0;
   timeScale         = 1.0;
   backdrop          = [ 32, 32, 32 ];
}

//-----------------------------------------------------------------------------
// Allocate a unique key string for anything. Used mostly for React component
//  keys.
function makeKey() {
   return "myVerySpecialAndLovedKey" + nextNewKeyIndex++;
}

//-----------------------------------------------------------------------------
// Returns the current game time in seconds. This starts from 0 when the
//  game starts, and doesn't correspond to realtime if a timescale is set
//                                               (fast-forward/slowdown).
function getTime() {
   return currentTimeMs / 1000;
}

//-----------------------------------------------------------------------------
// Gets the Date().getTime when the engine was reset().
function getStartTime() {
   return startTime;
}

//-----------------------------------------------------------------------------
// The current timestamp is updated and cached each frame.
function updateTime() {
   // Only a maximum of real 100ms can pass in a single frame.
   let ms = new Date().getTime();
   ms = new Date().getTime()
   let elapsed = Math.min( ms - lastTimePollMs, 100 );
   lastTimePollMs = ms;
   currentTimeMs += elapsed * timeScale;
}

//-----------------------------------------------------------------------------
// Force this much time to pass for the next frame. This is for debugging and
//  fast forwarding. Note that there are throttles in place to keep things from
//                           going too fast, so large numbers may be truncated.
function forceTime( amount ) {
   lastTimePollMs -= amount * 1000;
}

//-----------------------------------------------------------------------------
// Scale is the ratio of time speed, 1.0 = normal speed, 2.0 = double speed,
//  0.5 = half speed.
function setTimeScale( scale ) {
   timeScale = scale;
}

//-----------------------------------------------------------------------------
function getTimeScale() {
   return timeScale;
}

//-----------------------------------------------------------------------------
// Execute func after x seconds, BUT these seconds are scaled by the current
//  timescale.
//
// TODO make it so that they respect variations in the time, not just a
//  constant when the timer stars. It should work by saving the expected
//  trigger time and checking each frame (in a sorted list).
function after( seconds, func ) {
   setTimeout( func, seconds*1000 / timeScale );
}

//-----------------------------------------------------------------------------
// The camera position for calculating sprite positions in the world.
function getCamera() {
   return [camera[0], camera[1]];
}

//-----------------------------------------------------------------------------
// Update the camera position for the next rendering pass.
function setCamera( x, y ) {
   camera = [x, y];
}

//-----------------------------------------------------------------------------
// This callback will be triggered whenever the user taps the screen. The
//  callback accepts (x, y), which is the mouse coordinates on the screen.
// That is, if the screen is scaled down to 50%, the coordinates will still
//                                          have the full displaySize range.
function registerForTaps( callback ) {
   tapCallbacks.push( callback );
}

//-----------------------------------------------------------------------------
// Unhook a function from receiving further callbacks.
// 
// TODO: unhooking manually is tedious; how to do this safer?
function unregisterForTaps( callback ) {
   const index = tapCallbacks.indexOf( callback );
   tapCallbacks.splice( index, 1 );
}

//-----------------------------------------------------------------------------
// Feed the engine a mouse tap. This needs to be called from the upper level
//  by whatever handles user events. The engine by itself does not detect
//                                                 clicks on the document.
function tap( x, y ) {
   tapCallbacks.forEach( f => {
      f( x, y );
   });
}

//-----------------------------------------------------------------------------
// Mainly for diagnostic purposes.
function getEntityList() {
   return entitiesList;
}

//-----------------------------------------------------------------------------
// Returns [x, y] translated by the current camera position.
function translate( x, y, scale = 1.0 ) {
   return [x - camera[0] * scale, y - camera[1] * scale];
}

//-----------------------------------------------------------------------------
// Returns [width, height], the fixed dimensions of the game display. This is
//                                         not affected by the viewport scale.
function getDisplaySize() {
   return displaySize;
}

//-----------------------------------------------------------------------------
// Some generic rendering options meant to be passed to whatever frontend
//                                              render-controlling object.
function getRenderOptions() {
   return { backdrop };
}

function setBackdrop( newBackdrop ) {
   backdrop = newBackdrop;
}

//-----------------------------------------------------------------------------
// Called every frame to handle a new game tick. All entities in the active
//                                                   list will be refreshed.
function update() {
   updateTime();
   let time = getTime();
   let elapsed = Math.min( (time - lastUpdateTime), 0.25 ) ;
   lastUpdateTime = time;
   
   entitiesList.forEach( e => {
      e.update( elapsed );
   });
}

//-----------------------------------------------------------------------------
// Returns the render data from each entity (components) as an array.
function render() {
   let elements = [];
   entitiesList.forEach( e => {
      let toAdd = e.render();
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

//-----------------------------------------------------------------------------
// Base class for entities in the world. When an entity is created, it is
//  registered for updates each frame.
class Entity {
   //--------------------------------------------------------------------------
   // `this.key` is a unique key for the duration of the game, handy for
   //   setting unique values for react component keys.
   constructor() {
      this.key = makeKey();
      entitiesList.push( this );
   }

   //--------------------------------------------------------------------------
   // Remove this entity from the game.
   obliterate() {
      const index = entitiesList.indexOf( this );
      if( index !== -1 ) {
         entitiesList.splice( index, 1 );
      }
   }

   //--------------------------------------------------------------------------
   // [virtual] This is automatically called for every game frame.
   update() {}

   //--------------------------------------------------------------------------
   // [virtual] This is polled every frame after update(). For an entity to
   //  render itself, it should return a React component, or an array of
   //      components, from this function to be added to the render list.
   render() {}
}

window.DEBUG_setTimeScale = setTimeScale
window.DEBUG_getTimeScale = getTimeScale

///////////////////////////////////////////////////////////////////////////////
export default {
   reset, makeKey, getTime, updateTime, getCamera, setCamera, Entity,
   getDisplaySize, getRenderOptions, update, render, getStartTime, translate,
   setBackdrop, setTimeScale, getTimeScale, getEntityList, after, forceTime,
   registerForTaps, unregisterForTaps, tap
};
