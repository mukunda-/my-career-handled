import Engine from '../Engine';
import Tapper from './Tapper';
///////////////////////////////////////////////////////////////////////////////
// This was a good opportunity for test-driven development, a module that was
//  easy to write tests for before implementation. It feels good to write code
//  that you know will work right, because it's tested!

beforeEach( () => Engine.reset() );

//-----------------------------------------------------------------------------
test( 'tapper entity', async () => {

   const mock = jest.fn();

   {
      const tapper = new Tapper( 150, 150, 25, mock );
      Engine.tap( 150, 150 );
      expect( mock ).toHaveBeenCalledTimes( 1 );
      expect( mock ).toHaveBeenCalledWith( 150, 150 );

      // The tapper should kill itself by default.
      expect( Engine.getEntityList.length ).toEqual( 0 );
   }

   {
      // This one doesn't kill itself.
      const tapper = new Tapper( 140, 150, 25, mock, false );

      // Should be a miss. (Catch if we are cleaning up the
      //  previous one properly.)
      Engine.tap( 166, 150 );
      expect( mock ).toHaveBeenCalledTimes( 1 );

      // Should be a hit. 2(16^2) < 25^2
      Engine.tap( 140+16, 150+16 );
      expect( mock ).toHaveBeenCalledTimes( 2 );
      expect( mock ).toHaveBeenCalledWith( 140+16, 150+16 );
      Engine.tap( 140+16, 150+16 );
      expect( mock ).toHaveBeenCalledTimes( 3 );
      expect( mock ).toHaveBeenCalledWith( 140+16, 150+16 );

      // Smoke test.
      tapper.render();

      tapper.obliterate();
      expect( Engine.getEntityList.length ).toEqual( 0 );
   }
});
