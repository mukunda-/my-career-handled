import express from 'express';
import playwright from 'playwright';

///////////////////////////////////////////////////////////////////////////////
const server = express();
let serverInstance = null;

//-----------------------------------------------------------------------------
// Before any tests in here, start up a webserver to host the production build.
// Build must be done beforehand (npm run build).
beforeAll(() => {
   server.use( express.static( 'build', {} ));

   serverInstance = server.listen( 3001, () => {
      console.log( 'Express webserver started!' );
   });
});

//-----------------------------------------------------------------------------
// Clean up when we're done.
afterAll(() => {
   if( serverInstance !== null ) {
      serverInstance.close();
   }
   serverInstance = null;
})

//-----------------------------------------------------------------------------
async function waitForTapper( page ) {
   let timeout = 20;
   let box = null;
   while( true ) {
      if( --timeout == 0 ) throw( "Timed out." );

      const elem = await page.waitForSelector('.Sprite.Tapper', { visible: true });
      box = await elem.boundingBox();
      // Sometimes I get null even right after the selector is found, hence
      //  this retry loop.
      if( box != null ) break;
   }

   const [mx, my] = [ box.x + box.width/2, box.y + box.height/2 ];
   console.log( "Tapper at", mx, my );
   
   // Just want to make sure that we hit it, even though all of these should
   //  hit it, every time.
   // The arrow moves up and down and doesn't point exactly to the tap area.
   await page.mouse.click( mx, my + 0 );
   await page.mouse.click( mx, my + 20 );
   await page.mouse.click( mx, my + 40 );
   await page.mouse.click( mx, my + 60 );

   // Wait a bit for the tapper to die; the game will progress in the meanwhile
   //  and this second isn't totally wasted.
   await page.waitFor( 1000 );
}

//-----------------------------------------------------------------------------
async function runBrowserTest( browserType ) {
   // We are hosting the production build of the app using express, and then
   //  connecting to that through playwright.
   // The project needs to be built for production before running this test.
   console.log( "Launching browser: ", browserType );
   const browser = await playwright[browserType].launch();
   const context = await browser.newContext();
   const page = await context.newPage();
   await page.goto('http://localhost:3001/');

   {
      await page.waitForSelector('.TextPrompt', { visible: true });

      await page.evaluate(() => {
         // Engine.js exposes this for testing purposes. We're going to fast
         //  forward through everything. In a real production environment, we'd
         //  probably want to normal-speed through the whole thing.
         DEBUG_setTimeScale( 25 );
      });

      let timeout = 10;
      while( true ) {
         const result = await page.$eval( ".TextPrompt", el => el.innerHTML );
         if( result.match( /tap to start/i )) {
            break;
         }

         if( --timeout == 0 ) {
            throw( "Timed out waiting for loading." );
         }
         
         await page.waitFor( 1000 );
      }
   }

   {
      const [mx,my] = await page.$eval( ".Viewport", el => {
         return [
            (el.getBoundingClientRect().left + el.getBoundingClientRect().right) / 2,
            (el.getBoundingClientRect().top + el.getBoundingClientRect().bottom) / 2
         ]
      });
      console.log( mx, my );
      await page.mouse.click( mx, my );
   }

   // Need to pass the two tappers at the start that require user input.
   await waitForTapper( page );
   await waitForTapper( page );
   //await page.screenshot({path: `debug/screenshot-${browserType}-mid.png`} );

   // Then we smooth sail to the end, waiting to see the tagline under the
   //  Handled icon.
   {
      await page.waitForSelector('.hireme', { visible: true, timeout: 60000 });
      const result = await page.$eval( ".hireme", el => el.innerHTML );
      expect( result ).toMatch( /i want to be a part of your change/i );
   }

   //await page.screenshot({path: `debug/screenshot-${browserType}-final.png`} );
   await browser.close();
}

//-----------------------------------------------------------------------------
// The mommy of all the tests, running it from a web browser simulation.
// This is totally overkill for this little game, but it's for the exercise...
test( "e2e production chromium", async () => {
   await runBrowserTest( "chromium" );
}, 50000);

test( "e2e production firefox", async () => {
   // I actually discovered that my stuff didn't work in Firefox from this
   //  test.
   await runBrowserTest( "firefox" );
}, 50000);

test( "e2e production webkit", async () => {
   // (TODO: this just crashes for me currently.)
   //await runBrowserTest( "webkit" );
}, 50000);

///////////////////////////////////////////////////////////////////////////////