'use strict';

window.onload = function () {
    const game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
    const shared = { victory: false, fastestTime: 999999, yourTime: 0 };

    game.state.add('Boot', GameStates.makeBoot(game));
    game.state.add('Preloader', GameStates.makePreloader(game));
    game.state.add('MainMenu', GameStates.makeMainMenu(game, shared));
    game.state.add('Game', GameStates.makeGame(game, shared));
    game.state.add('EndScreen', GameStates.makeEndScreen(game, shared));

    game.state.start('Boot');
};
