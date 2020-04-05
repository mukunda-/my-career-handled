import { render } from '@testing-library/react';
import Engine from '../Engine';
import Road from './Road';
///////////////////////////////////////////////////////////////////////////////

beforeEach( () => Engine.reset() );

//-----------------------------------------------------------------------------
test( 'create road entity', () => {
   let road = new Road( 0, 50 );
   let container = render( road.render() ).container;
   let style = container.firstChild.style;
   // Background position should be 0 if the camera is 0.
   expect( style.backgroundImage ).toContain( "road" );
   expect( style.left ).toBe( "0px" );
   
   // Update the camera and the road entity, and the background should move.
   Engine.setCamera( 10, 0 );
   road.update( 1.0 );
   container = render( road.render() ).container;
   style = container.firstChild.style;
   expect( style.left ).toBe( "-10px" );
   
   // Make sure that there isn't anything funny here.
   road.obliterate();
   expect( Engine.getEntityList().length ).toBe( 0 );
});
