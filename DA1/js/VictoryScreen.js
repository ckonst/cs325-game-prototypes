"use strict";

GameStates.makeVictoryScreen = function( game, shared ) {

	var music = null;
	var playButton = null;
	var text1;
    
    function backToMain(pointer) {

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        music.stop();

        //	And start the actual game
        game.state.start('MainMenu');
    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            music = game.add.audio('titleMusic');
            music.loopFull();
			
			game.add.sprite(-100, 0, 'Win');
			
			var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
			text1 = game.add.text(0, 50, "Congo Rats!\n You repelled the INVADER\n from you're Minecraft base!\n", style);
			text1.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			text1.setTextBounds(0, 0, 800, 100);
    
            playButton = game.add.button( 303, 400, 'playButton', backToMain, null, 'over', 'out', 'down');
			
			
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
			if(!music.isPlaying) {
				music.play();
			}
		}
        
    };
};
