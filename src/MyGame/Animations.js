
//-----------------------------------------------------------------------------
// A helper class to manage simple frame-based animations.
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

///////////////////////////////////////////////////////////////////////////////
export default Animations;