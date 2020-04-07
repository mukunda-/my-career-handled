// A simple layer on top of Howler to keep track of all howls and let us know
//  when they're all loaded for a smooth experience.

import {Howl} from 'howler';
import Engine from '../Engine';
///////////////////////////////////////////////////////////////////////////////
const howls = [];
/*
class DummyHowl {
   play() {}
   fade() {}
   state() { return "loaded"; }
}*/

//-----------------------------------------------------------------------------
// Accepts the same input as Howl and returns the same, just a proxy to keep
//                                          track of what needs to be loaded.
function load( options ) {
   //if( process.env.JEST_WORKER_ID !== undefined ) {
   //   return new DummyHowl();
   //} else {
      const howl = new Howl( options )
      howls.push( howl );
      return howl;
   //}
}

//-----------------------------------------------------------------------------
// Returns 1 when everything is loaded, and less than 1 for what percentage is
//  loaded (0.3 = 30%).
function loadingProgress() {
   let loadingCount = 0;
   let totalCount = 0;
   howls.forEach( h => {
      if( h.state() === "loading" ) {
         loadingCount++;
      }
      totalCount ++;
   });

   if( loadingCount > 0 ) {
      return (totalCount-loadingCount) / totalCount;
   } else {
      if( Engine.getTime() < 2.0 ) return 0.9;
      return 1;
   }
}

///////////////////////////////////////////////////////////////////////////////
export default { load, loadingProgress };
