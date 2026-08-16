'use strict';

const GameStates = (window.GameStates ??= {});

GameStates.makeBoot = function (game) {
    return {
        init: function () {
            game.input.maxPointers = 1;
            game.stage.disableVisibilityChange = true;

            if (game.device.desktop) {
                game.scale.pageAlignHorizontally = true;
            } else {
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                game.scale.setMinMax(480, 260, 1024, 768);
                game.scale.forceLandscape = true;
                game.scale.pageAlignHorizontally = true;
            }
        },

        preload: function () {
            game.load.image('preloaderBackground', 'assets/img/load.png');
        },

        create: function () {
            game.state.start('Preloader');
        },
    };
};
