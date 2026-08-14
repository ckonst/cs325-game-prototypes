'use strict';

const GameStates = (window.GameStates ??= {});

GameStates.makeBoot = (game) => ({
    init() {
        // Unless you specifically know your game needs to support multi-touch, limit it to one pointer.
        game.input.maxPointers = 1;

        // Keep the game active when the browser tab loses focus.
        game.stage.disableVisibilityChange = true;

        if (game.device.desktop) {
            game.scale.pageAlignHorizontally = true;
            return;
        }

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setMinMax(480, 260, 1920, 1080);
        game.scale.forceLandscape = true;
        game.scale.pageAlignHorizontally = true;
    },

    preload() {
        game.load.image(
            'PreloaderBackground',
            'assets/img/Menu/LoadingScreen.png',
        );
    },

    create() {
        game.state.start('Preloader');
    },
});
