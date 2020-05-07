"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var music = null;
	var playButton = null;
	var title;
	var bg;
    function startGame(pointer) {
        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        music.stop();
	
        //	And start the actual game
        game.state.start('Level1');
    }
    //go to fullscreen mode
	function gofull() {
		/*	if (game.scale.isFullScreen)
			{
				game.scale.stopFullScreen();
			}
			else
			{
				game.scale.startFullScreen(false);
			}
		*/
		game.scale.startFullScreen(false);
	}
	
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('titleMusic');
            music.loopFull();
    
            bg = game.add.sprite(0, 0, 'titlePage');
			bg.tint = 0xffffff;
			title = game.add.sprite((1137 / 2 ) - 400, 0, 'Title');
			title.tint = 0x2e7794;
    
            playButton = game.add.button((1137 / 2 ) - 96, 400, 'playButton', startGame, null, 'over', 'out', 'down');
			
			playButton.tint = 0x2e7794;
			
			//maintain aspect ratio
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			
			
        },
    
        update: function () {
			//console.log("in main\n");
            //	Do some nice funky main menu effect here
			if(!music.isPlaying) {
				music.play();
			}
			game.input.onDown.add(gofull, this);
		}
        
    };
};
