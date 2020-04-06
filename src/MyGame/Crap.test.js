import { render } from '@testing-library/react';
import Engine from '../Engine';
import Crap from './Crap';
///////////////////////////////////////////////////////////////////////////////

beforeEach( () => Engine.reset() );

//-----------------------------------------------------------------------------
test( 'Crap entity tests.', () => {
   let crap = new Crap( 100, 100 );
   {
      const {container} = render( crap.render() );
      const style = container.firstChild.style;
      expect( style.backgroundImage ).toContain( "crap" );
   }
   // Update the camera and the road entity, and the background should move.
   crap.fling();
   crap.update( 1.0 );
   Engine.after( 1.0, () => {
      {
         expect( crap.render() ).toBeUndefined();
      }
      
      expect( Engine.getEntityList().length ).toBe( 1 );
      crap.obliterate();
      expect( Engine.getEntityList().length ).toBe( 0 );
   });
});
