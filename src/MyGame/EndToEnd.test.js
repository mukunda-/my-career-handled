import express from 'express';
import playwright from 'playwright';

///////////////////////////////////////////////////////////////////////////////
const server = express();
let serverInstance = null;

beforeAll(() => {
   //server.use( express.static( 'build', {} ));
   /*
   server.get( '/', (req, res) => {
      res.send('Hello World!');
   });*/

   //serverInstance = server.listen( 3000, () => {
   //   console.log( 'Express webserver started!' );
   //});
   
});

afterAll(() => {
   if( serverInstance !== null ) {
      serverInstance.close();
   }
   //serverInstance = null;
})

const timeout = seconds => new Promise( res => setTimeout( res, (seconds*1000) ));

//-----------------------------------------------------------------------------
// The mommy of all the tests, running it from a web browser simulation.
test( "e2e production", async () => {
   // We are hosting the production build of the app using express, and then
   //  connecting to that through playwright.
   // The project needs to be built for production before running this test.
   
   let browserType = process.env.MFBROWSER || "chromium";
   console.log( browserType, "START" );
   const browser = await playwright[browserType].launch();
   console.log( browserType, "LAUNCHED" );
   const context = await browser.newContext();
   console.log( browserType, "MADE CONTEXT" );
   const page = await context.newPage();
   console.log( browserType, "NEW PAGE" );
   await page.goto('http://localhost:3000/');
   console.log( browserType, "VISITED PAGE" );


   {
      await page.waitForSelector('.TextPrompt', { visible: true });

      await page.evaluate(() => {
         // Engine.js exposes this for testing purposes. We're going to fast
         //  forward through everything. In a real production environment, we'd
         //  probably want to normal-speed through the whole thing.
         DEBUG_setTimeScale( 10 );
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

   const [mx,my] = await page.$eval( ".Viewport", el => {
      return [
         (el.getBoundingClientRect().left + el.getBoundingClientRect().right) / 2,
         (el.getBoundingClientRect().top + el.getBoundingClientRect().bottom) / 2
      ]
   });
   console.log( mx, my );
   await page.mouse.click( mx, my );

   console.log( "PASSED THE BIG CHECKPOINT." );

   page.screenshot({path: 'screenshot.png'});
   await page.waitForSelector('.Sprite.Tapper', { visible: true });
   console.log( "FOUND A TAPPER." );
   
   await page.waitFor(() => {
      const elems = document.querySelectorAll( ".Sprite.Tapper" );
      elems.forEach( e => {
         if( e.style.backgroundImage.match( /'tapper'/ )) return true;
         /*
            // Click it until it blows!
            const [mx, my] = [
               (el.getBoundingClientRect().left + el.getBoundingClientRect().right) / 2,
               (el.getBoundingClientRect().top + el.getBoundingClientRect().bottom) / 2
            ];

            await page.mouse.click( mx, my );
            await page.waitFor( 100 );
         }*/
      });
      return false;
   });
   console.log( "found a tapper." );

   {
      const [mx, my] = await page.$$eval( ".Sprite", elems => {
         elems.forEach( e => {
            if( e.style.backgroundImage.match( /'tapper'/ )) {
               return [
                  (e.getBoundingClientRect().left + e.getBoundingClientRect().right) / 2,
                  (e.getBoundingClientRect().top + e.getBoundingClientRect().bottom) / 2
               ];
            }
         });
      });

      // Just want to make sure that we hit it, even though all of these should
      //  hit it, every time.
      // The arrow moves up and down and doesn't point exactly to the tap area.
      page.mouse.click( mx, my + 20 );
      page.mouse.click( mx, my + 40 );
      page.mouse.click( mx, my + 60 );
   }

   await page.screenshot({path: 'screenshot.png'});
   await browser.close();
   /*
   await page.waitForSelector('#thebutton', { visible: true });
   console.log( browserType, "FOUND SELECTOR" );
   await page.click('#thebutton');
   console.log( browserType, "CLICKED THE MF BUTTON" );
   const result = await page.$eval('#answer', (el:any) => el.innerHTML);
   console.log( browserType, "FETCHED THE RESULT" );
   await browser.close();
   console.log( browserType, "IS IT COFFEE?" );
   expect(result).toEqual('coffee');
   console.log( browserType, "I THINK SO" );*/
   
}, 20000);

///////////////////////////////////////////////////////////////////////////////