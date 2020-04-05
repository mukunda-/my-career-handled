import React from 'react';
import { render } from '@testing-library/react';
import Road from './Road';
import roadTexture from '../res/road.jpg';
import Game from '../Game';

beforeEach(() => {
   Game.reset();
});

test( 'create road entity', () => {
   let road = new Road( 0, 50 );
   const { container } = render( road.render() );
   road.obliterate();
});
