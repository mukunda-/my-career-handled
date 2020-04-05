import Animations from './Animations';

test('Animations helper class tests.', () => {
    let anim = new Animations({
        "test1": {
            startFrame: 0,
            fps: 0
        },
        "test2": {
            startFrame: 1,
            numFrames: 5,
            fps: 10
        },
        "test3": {
            startFrame: 3,
            numFrames: 1,
            fps: 999999
        }
    });

    // Should be static.
    anim.set( "test1" );
    expect( anim.frame ).toEqual( 0 );
    anim.update( 99999 );
    expect( anim.frame ).toEqual( 0 );

    // Should be 1 if it's newly set.
    anim.set( "test2" );
    expect( anim.frame ).toEqual( 1 );

    // Adding large values.
    anim.update( 99999 );
    expect( anim.getFrame() ).toEqual( 1 + ((99999*10)%5) );
    anim.set( "test2" );
    anim.set( "test2" );
    expect( anim.getFrame() ).toEqual( 1 + ((99999*10)%5) );
    anim.update( 99999 );
    anim.set( "test2" );
    expect( anim.getFrame() ).toEqual( 1 + ((99999*2*10)%5) );
    
    anim.set( "test3" );
    expect( anim.getFrame() ).toEqual( 3 );
    anim.update( 199 );
    expect( anim.getFrame() ).toEqual( 3 );
    anim.update( 1 );
    expect( anim.getFrame() ).toEqual( 3 );
});
