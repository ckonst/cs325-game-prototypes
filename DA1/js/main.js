'use strict';

window.onload = function () {
    const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    const shared = {};

    game.state.add('Boot', GameStates.makeBoot(game));
    game.state.add('Preloader', GameStates.makePreloader(game));
    game.state.add('MainMenu', GameStates.makeMainMenu(game, shared));
    game.state.add('Game', GameStates.makeGame(game, shared));
    game.state.add('Victory', GameStates.makeVictoryScreen(game, shared));

    game.state.start('Boot');
};
