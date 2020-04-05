
//-----------------------------------------------------------------------------
// A helper class to manage simple frame-based animations.
class Animations {
   // Animation list is an object of keyed animation entries:
   // key = {
   //    startFrame: 0 = first frame in file to start the animation set from.
   //    numFrames: How many frames are in the animation loop.
   //    fps: Frames per second. 0 = still image.
   // }
   constructor( animationList ) {
      this.animationList = animationList;
      this.progress = 0;
      this.current = "";
   }

   //--------------------------------------------------------------------------
   // Change the current animation. This resets the animation, or does nothing
   //  if the animation is already active.
   set( name ) { 
      if( this.current === name ) return;
      this.current = name;
      this.frame = this.animationList[name].startFrame;
      this.progress = 0;
   }

   //--------------------------------------------------------------------------
   // Pass the game time in here.
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

   getFrame() {
      return this.frame;
   }
}

///////////////////////////////////////////////////////////////////////////////
export default Animations;