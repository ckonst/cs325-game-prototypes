"use strict";

window.onload = function () {
	var game = new Phaser.Game(1137, 640, Phaser.CANVAS, 'game', {}, false, false);

	var isMuted = true;

	var shared = { isMuted: isMuted };

	game.state.add('Boot', GameStates.makeBoot(game));
	game.state.add('Preloader', GameStates.makePreloader(game));
	game.state.add('MainMenu', GameStates.makeMainMenu(game, shared));
	game.state.add('Level1', GameStates.makeLevel1(game, shared));
	game.state.add('Level2', GameStates.makeLevel2(game, shared));

	//	Now start the Boot state.
	game.state.start('Boot');

};
