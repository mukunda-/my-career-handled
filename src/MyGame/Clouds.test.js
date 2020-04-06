import { render } from '@testing-library/react';
import Engine from '../Engine';
import Clouds from './Clouds';
///////////////////////////////////////////////////////////////////////////////

beforeEach( () => Engine.reset() );

//-----------------------------------------------------------------------------
test( 'Cloud entity tests.', () => {
   let clouds = new Clouds();
   const {container} = render( clouds.render() );
   const style = container.firstChild.style;
   expect( parseInt(style.width.match( /\d+/ )) ).toBeGreaterThan( Engine.getDisplaySize()[0] );
   expect( parseInt(style.height.match( /\d+/ )) ).toBeGreaterThan( 32 );

   clouds.obliterate();
   expect( Engine.getEntityList.length ).toEqual( 0 );
});
