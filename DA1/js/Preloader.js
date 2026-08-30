'use strict';

GameStates.makePreloader = function (game) {
    let background = null;
    let preloadBar = null;
    let ready = false;

    return {
        preload: function () {
            // Add loading screen assets
            background = game.add.sprite(-200, 0, 'preloaderBackground');
            preloadBar = game.add.sprite(200, 250, 'preloaderBar');

            // This sets the preloadBar sprite as a loader sprite.
            // What that does is automatically crop the sprite from 0 to full-width as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);

            // Title Screen Assets
            game.load.atlas(
                'playButton',
                'assets/img/PlayButton.png',
                'assets/img/PlayButton.json',
            );
            game.load.audio('titleMusic', ['assets/audio/TitleScreen.ogg']);
            game.load.image('titlePage', 'assets/img/TitleBG.png');
            game.load.image('Title', 'assets/img/BCC.png');

            // Main Game assets
            game.load.audio('GameBGM', ['assets/audio/GameBGM.ogg']);
            game.load.audio('shoot', ['assets/audio/Shoot.ogg']);
            game.load.audio('jump', ['assets/audio/Jump.ogg']);
            game.load.audio('death', ['assets/audio/EnemyDeath.ogg']);
            game.load.image('cheese', 'assets/img/BiggieCheeseSmall.png');
            game.load.image('cobble', 'assets/img/CobblestoneTexture.png');
            game.load.image('background', 'assets/img/Background.png');
            game.load.image('pepe', 'assets/img/Trumpepe.png');
            game.load.image('L', 'assets/img/SmallL.png');

            // Victory Screen
            game.load.image('Win', 'assets/img/BiggieCheese.jpg');
        },

        create: function () {
            // Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
        },

        update: function () {
            if (game.cache.isSoundDecoded('titleMusic') && !ready) {
                ready = true;
                game.state.start('MainMenu');
            }
        },
    };
};
