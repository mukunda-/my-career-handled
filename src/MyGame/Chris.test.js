import { render } from '@testing-library/react';
import Engine from '../Engine';
import Chris from './Chris';
///////////////////////////////////////////////////////////////////////////////

beforeEach( () => Engine.reset() );

//-----------------------------------------------------------------------------
test( 'Chris entity tests.', () => {
   let chris = new Chris();
   chris.spawn( 150, 150 );

   let finished = false;
/*
   function loop() {
      chris.update( 0.1 );
      if( !finished ) setTimeout( loop, 0.01 );
   }

   loop();*/
   
   chris.moveTo( 0, () => {
      expect( chris.x ).toBeLessThanOrEqual( 0 );
      chris.moveTo( 200, () => {
         expect( chris.x ).toBeGreaterThanOrEqual( 200 );
         chris.moveTo( 0, () => {
            expect( chris.x ).toBeLessThanOrEqual( 0 );
            {

               const {container} = render( chris.render() );
               const style = container.firstChild.style;
               expect( style.backgroundImage ).toContain( "chris" );
            }

            {
               chris.hide();
               expect( chris.render() ).toBeUndefined();
            }

            expect( Engine.getEntityList().length ).toBe( 1 );
            chris.obliterate();
            expect( Engine.getEntityList().length ).toBe( 0 );

            finished = true;
         });
      });
   });

   while(!finished) {
      chris.update(0.1);
   }

});
