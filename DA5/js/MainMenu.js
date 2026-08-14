'use strict';

GameStates.makeMainMenu = (game, shared) => {
    let music;

    const startGame = () => {
        music.stop();
        game.state.start('Level1');
    };

    const goFullScreen = () => game.scale.startFullScreen(false);

    return {
        create() {
            game.input.onDown.addOnce(() => {
                if (
                    game.sound.usingWebAudio &&
                    game.sound.context.state !== 'running'
                ) {
                    game.sound.context.resume();
                    game.sound.mute = shared.isMuted;
                }
            });

            music = game.add.audio('TitleMusic');
            music.loopFull();

            const background = game.add.sprite(0, 0, 'TitlePage');
            background.tint = 0xffffff;

            const title = game.add.sprite(1137 / 2 - 400, 0, 'Title');
            title.tint = 0x2e7794;

            const playButton = game.add.button(
                1137 / 2 - 96,
                400,
                'PlayButton',
                startGame,
                null,
                'over',
                'out',
                'down',
            );
            playButton.tint = 0x2e7794;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

            const muteButton = game.add.button(
                game.world.width - 50,
                50,
                'MutedIcon',
                toggleMute,
                this,
            );
            muteButton.scale.set(0.5, 0.5);
            muteButton.anchor.set(0.5);

            function toggleMute() {
                shared.isMuted = !shared.isMuted;
                game.sound.mute = shared.isMuted;
                muteButton.loadTexture(
                    shared.isMuted ? 'MutedIcon' : 'UnmutedIcon',
                );

                if (!music.isPlaying && !shared.isMuted) {
                    music.play();
                }
            }
        },

        update() {
            game.input.onDown.add(goFullScreen, this);
        },
    };
};
