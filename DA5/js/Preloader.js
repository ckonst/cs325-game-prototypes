"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //Add loading screen assets
            background = game.add.sprite(-300, -75, 'preloaderBackground');
			background.scale.setTo(1.5, 1);
    
            // Title Screen Assets
			game.load.atlas('playButton', 'assets/img/Menu/play_button2.png', 'assets/img/Menu/play_button.json');
            game.load.audio('titleMusic', ['assets/audio/Menu/TitleScreen2.ogg']);
            game.load.image('titlePage', 'assets/img/Menu/MenuBG.png');
			game.load.image('Title', 'assets/img/Menu/TheHalfwayChild.png');
			
            //Level 1 assets
			game.load.audio('GameBGM', ['assets/audio/Level1/GameBGM2.ogg']);
			game.load.audio('jump', ['assets/audio/jump2.ogg']);
			game.load.spritesheet('girl', 'assets/img/SpriteSheet/girl.png', 64, 64);
			game.load.tilemap('level1', 'assets/tilemaps/json/level1DA5.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.image('tiles', 'assets/tilemaps/tiles/foresttiles1.png');
			
			game.load.image('front', 'assets/img/Level1/forestfront.png');
			game.load.image('mid', 'assets/img/Level1/forestmid.png');
			game.load.image('back', 'assets/img/Level1/forestback.png');
			
			//Level 2 assets
			game.load.image('front2', 'assets/img/Level2/Level2Front.png');
			game.load.image('mid2', 'assets/img/Level2/Level2Mid.png');
			game.load.image('back2', 'assets/img/Level2/Level2Back.png');
			game.load.image('tiles2', 'assets/tilemaps/tiles/tileFront2.png');
			
			game.load.image('upL', 'assets/img/UI/upLight.png');
			game.load.image('downL', 'assets/img/UI/downLight.png');
			game.load.image('leftL', 'assets/img/UI/leftLight.png');
			game.load.image('rightL', 'assets/img/UI/rightLight.png');
			
			game.load.tilemap('level2', 'assets/tilemaps/json/level2DA5.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.audio('Rhythm1', ['assets/audio/Level2/Rhythm1.mp3']);
			game.load.audio('blip', ['assets/audio/Level2/blip.mp3']);
			game.load.text('data2', 'assets/rhythmMaps/Level2/rhythmMap1.txt');
			
			//UI assets
			game.load.image('arrows', 'assets/img/UI/arrowsVert1.png');
			game.load.image('arrowUp', 'assets/img/UI/arrows3_02.png');
			game.load.image('arrowLeft', 'assets/img/UI/arrows3_04.png');
			game.load.image('arrowDown', 'assets/img/UI/arrows3_05.png');
			game.load.image('arrowRight', 'assets/img/UI/arrows3_06.png');
			game.load.image('textBox', 'assets/img/UI/TextBox1.png');
		
			
			
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
