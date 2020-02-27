"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //Add loading screen assets
            background = game.add.sprite(0, 0, 'preloaderBackground');
    
            // Title Screen Assets
			game.load.atlas('playButton', 'assets/img/play_button3.png', 'assets/img/play_button3.json');
            game.load.audio('titleMusic', 'assets/audio/TitleScreen3.ogg');
            game.load.image('titlePage', 'assets/img/MenuBG.png');
			
            //Main Game assets
			game.load.audio('GameBGM', 'assets/audio/gameBGM3.ogg');
			game.load.audio('excellent1', 'assets/audio/excellent/excellent1.ogg');
			game.load.audio('excellent2', 'assets/audio/excellent/excellent2.ogg');
			game.load.audio('excellent3', 'assets/audio/excellent/excellent3.ogg');
			game.load.audio('good1', 'assets/audio/good/good1.ogg');
			game.load.audio('good2', 'assets/audio/good/good2.ogg');
			game.load.audio('good3', 'assets/audio/good/good3.ogg');
			game.load.audio('gj1', 'assets/audio/greatjob/gj1.ogg');
			game.load.audio('gj2', 'assets/audio/greatjob/gj2.ogg');
			game.load.audio('gj3', 'assets/audio/greatjob/gj3.ogg');
			game.load.audio('nice1', 'assets/audio/nice/nice1.ogg');
			game.load.audio('nice2', 'assets/audio/nice/nice2.ogg');
			game.load.audio('nice3', 'assets/audio/nice/nice3.ogg');
			game.load.audio('no1', 'assets/audio/no/no1.ogg');
			game.load.audio('no2', 'assets/audio/no/no2.ogg');
			game.load.audio('no3', 'assets/audio/no/no3.ogg');
			game.load.audio('click1', 'assets/audio/click.ogg');
			game.load.audio('click2', 'assets/audio/click2.ogg');
			game.load.audio('click3', 'assets/audio/click3.ogg');
			game.load.audio('tutorial', 'assets/audio/tutorial.ogg');
			game.load.audio('beep', 'assets/audio/beep.ogg');
			game.load.audio('success', 'assets/audio/success.ogg');
			
			game.load.image('bg', 'assets/img/bg.png');
			game.load.image('washy', 'assets/img/washyPix.png');
			game.load.image('UI', 'assets/img/washer UI.png');
			
			game.load.image('baby', 'assets/img/BabyClear.png');
			game.load.image('panties', 'assets/img/pantiesClear.png');
			game.load.image('boxers', 'assets/img/boxers.png');
			
			game.load.image('bPants', 'assets/img/bluePants.png');
			game.load.image('bShirt', 'assets/img/blueShirt.png');
			
			game.load.image('gPants', 'assets/img/greenPants.png');
			game.load.image('gShirt', 'assets/img/greenShirt.png');
			
			game.load.image('rPants', 'assets/img/redPants.png');
			game.load.image('rShirt', 'assets/img/redShirt.png');
			
			game.load.image('wPants', 'assets/img/whitePants.png');
			game.load.image('wShirt', 'assets/img/whiteShirt.png');
			
			game.load.image('basket', 'assets/img/basketClear.png');
			
			
			
			
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            //preloadBar.cropEnabled = false;
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
