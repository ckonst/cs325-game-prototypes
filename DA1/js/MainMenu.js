'use strict';

GameStates.makeMainMenu = function (game, shared) {
    let music = null;
    let playButton = null;

    function startGame(pointer) {
        music.stop();
        game.state.start('Game');
    }

    return {
        create: function () {
            music = game.add.audio('titleMusic');
            music.loopFull();

            game.add.sprite(0, 0, 'titlePage');
            game.add.sprite(0, -125, 'Title');

            playButton = game.add.button(
                303,
                400,
                'playButton',
                startGame,
                null,
                'over',
                'out',
                'down',
            );
        },

        update: function () {
            if (!music.isPlaying) {
                music.play();
            }
        },
    };
};
