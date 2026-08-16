'use strict';

GameStates.makeEndScreen = function (game, shared) {
    let music = null;
    const playButton = null;
    let text;
    const timer = 5000;
    let time1;
    let bg;
    function backToMain(pointer) {
        music.stop();
        game.state.start('MainMenu');
    }

    return {
        create: function () {
            music = game.add.audio('EndScreen');
            music.loopFull();

            const style = { font: 'bold 40px Lucida Console', fill: '#FFFFFF' };
            if (shared.victory) {
                bg = game.add.sprite(-25, 0, 'cd');
                bg.scale.x = 1.9;
                bg.scale.y = 2;

                text = game.add.text(
                    0,
                    200,
                    'Great job!\nChicken Omega is now\ndelicious Dinner!' +
                    '\nYour Time: ' +
                    shared.yourTime / 1000 +
                    ' seconds\nFastest Time: ' +
                    shared.fastestTime / 1000 +
                    ' seconds',
                    style,
                );
                text.setShadow(3, 3, 'rgba(0,0,0,1)', 2);
            } else {
                text = game.add.text(
                    0,
                    200,
                    'Darn! you Lost! Thats too bad!\nLoser!',
                    style,
                );
                text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            }
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
