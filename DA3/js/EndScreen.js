'use strict';

GameStates.makeEndScreen = function (game, shared) {
    let music = null;
    const playButton = null;
    let text;
    const timer = 5000;
    let time1;
    function backToMain(pointer) {
        music.stop();
        game.state.start('MainMenu');
    }

    return {
        create: function () {
            music = game.add.audio('titleMusic');
            music.loopFull();

            const style = { font: 'bold 40px Lucida Console', fill: '#FFFFFF' };
            text = game.add.text(
                0,
                200,
                'time up! your POINTS: ' + shared.points + '\nWow! Great job!',
                style,
            );
            text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            time1 = game.time.now;
        },

        update: function () {
            const time = game.time.now;
            if (!music.isPlaying) {
                music.play();
            }
            const mouseClick = game.input.activePointer.leftButton.isDown;
            if (mouseClick && time > timer + time1) backToMain();
        },
    };
};
