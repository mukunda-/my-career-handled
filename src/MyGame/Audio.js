// A simple layer on top of Howler to keep track of all howls and let us know
//  when they're all loaded for a smooth experience.

import {Howl} from 'howler';
///////////////////////////////////////////////////////////////////////////////
const howls = [];

//-----------------------------------------------------------------------------
function load( options ) {
   const howl = new Howl( options )
   howls.push( howl );
   return howl;
}

//-----------------------------------------------------------------------------
function loadingProgress() {
   let loadingCount = 0;
   let totalCount = 0;
   howls.forEach( h => {
      if( h.state() == "loading" ) {
         loadingCount++;
      }
      totalCount ++;
   });

   if( loadingCount > 0 ) {
      return loadingCount / totalCount;
   } else {
      return 1;
   }
}

///////////////////////////////////////////////////////////////////////////////
export default { load };
