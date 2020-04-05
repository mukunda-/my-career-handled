import React from 'react';

//-----------------------------------------------------------------------------
// A simple texture component.
// props.src holds the position and other attributes for the image.
//   x, y           Position on screen in pixels.
//   z              Z-index for this sprite.
//   transform      String to apply as a CSS transform.
//   width, height  Size of sprite in pixels.
//   texture        Path to texture file (or texture resource).
//   tx, ty         Texture coordinate. Textures will be set to wrap, too.
//   custom         Custom style entries, e.g., custom.op (TODO)
let Sprite = ( props ) => {
   let style = {
      left:             props.src.x + "px",
      top:              props.src.y + "px",
      width:            props.src.width + "px",
      height:           props.src.height + "px",
      backgroundImage:  `url(${props.src.texture})`,
      backgroundRepeat: "repeat"
   }
   if( props.src.tx || props.src.ty ) {
      style.backgroundPosition = `${props.src.tx||0}px ${props.src.ty||0}px`
   }
   if( props.src.transform ) {
      style.transform = props.src.transform;
   }
   if( props.src.z ) {
      style.zIndex = props.src.z;
   }
   if( props.src.opacity ) {
      style.opacity = props.src.opacity;
   }
   return <div className="Sprite" style={style}></div>;
}

export default Sprite;
