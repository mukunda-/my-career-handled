
let manifest = {};

function load( id, filename ) {
    manifest[id] = { loading: true };
    let request = new XMLHttpRequest();
    request.open( "GET", filename, true );
    request.responseType = "blob";
    request.onload = function() {
        if( this.status == 200 ) {
            let audio = new Audio( URL.createObjectURL( this.response ) );
            manifest[id].loading = false;
            manifest[id].element = audio;

            audio.load();
        }
    }
    request.send();
}

function play( id, position = 0.0, length = null ) {
    manifest[id].element.currentTime = position;
    manifest[id].element.play();
    if( manifest[id].timeout ) {
        clearTimeout( manifest[id].timeout );
        manifest[id].timeout = null;
    }
    if( length ) {
        manifest[id].timeout = setTimeout(() => {
            manifest[id].element.pause();
            manifest[id].timeout = null;
        }, length );
    }
}

function filesAreLoaded() {
    for( const [key, value] of Object.entries(manifest) ) {
        if( value.loading ) return false;
    }
    return true;
}

export default {
    load,
    play,
    filesAreLoaded
};

