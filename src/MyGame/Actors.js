import mukundaFace from './res/mug.png';
import chrisFace from './res/chrisface.png';
import sethFace from './res/sethface.png';

///////////////////////////////////////////////////////////////////////////////
// These are the avatars that show up in the chatbox window, also known as
//  ACTORS.
// Mouth support was removed to make the show not look too stupid.

//-----------------------------------------------------------------------------
const mukunda = {
   image: mukundaFace,      // Background image file
   mouth: 'res/mouth.png',  // Mouth/jaw overlay
   mouthOrigin: [25, 55],   // Where the overlay is
   mouthSize: [26, 21]      // Size of the overlay texture
}

//-----------------------------------------------------------------------------
const chris = {
   image: chrisFace,
   mouth: 'res/chrismouth.png',
   mouthOrigin: [36, 48],
   mouthSize: [19, 14]
}

//-----------------------------------------------------------------------------
const seth = {
   image: sethFace,
   mouth: 'res/sethface.png',
   mouthOrigin: [0, 0],
   mouthSize: [0, 0]
}

 ///////////////////////////////////////////////////////////////////////////////
export default {mukunda, chris, seth};
