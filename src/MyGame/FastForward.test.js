import Engine from '../Engine';
import MyGame from './MyGame';
///////////////////////////////////////////////////////////////////////////////

const timeout = seconds => new Promise( res => setTimeout( res, (seconds*1000) ));

// This test runs the game from start to finish using an extreme time scale,
//  since it doesn't really require skill.
test( "full run test", async () => {
    MyGame.Start();

    // Extreme multiplier. If this breaks something, then the code isn't robust
    //  enough.
    Engine.setTimeScale( 50.0 );
    const startTime = new Date().getTime();

    while( !MyGame.getStateInstance().game_over ) {
        const scene = MyGame.getStateInstance().scene;

        // Going to be really fast-forwarding.
        Engine.forceTime( 0.25 );
        Engine.update();
        Engine.render();

        const now = new Date().getTime();
        if( now > startTime + 5000 ) {
            throw( `Ran out of time at scene: ${scene}` );
        }

        // Allow async things to trigger here.
        await timeout( 0.01 );
    }
    
}, 10000);

///////////////////////////////////////////////////////////////////////////////