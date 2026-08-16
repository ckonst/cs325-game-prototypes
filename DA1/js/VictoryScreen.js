'use strict';

GameStates.makeVictoryScreen = function (game, shared) {
    let music = null;
    let playButton = null;
    let text1;

    function backToMain(pointer) {
        music.stop();
        game.state.start('MainMenu');
    }

    return {
        create: function () {
            music = game.add.audio('titleMusic');
            music.loopFull();

            game.add.sprite(-100, 0, 'Win');

            const style = {
                font: 'bold 32px Arial',
                fill: '#fff',
                boundsAlignH: 'center',
                boundsAlignV: 'middle',
            };
            text1 = game.add.text(
                0,
                50,
                "Congo Rats!\n You repelled the INVADER\n from you're Minecraft base!\n",
                style,
            );
            text1.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text1.setTextBounds(0, 0, 800, 100);

            playButton = game.add.button(
                303,
                400,
                'playButton',
                backToMain,
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
