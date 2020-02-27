"use strict";

GameStates.makeEndScreen = function( game, shared ) {

	var music = null;
	var playButton = null;
	var text;
    var timer = 5000;
	var time1;
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
			
			var style = { font: "bold 40px Lucida Console", fill: "#FFFFFF"};
			text = game.add.text(0,200, "time up! your POINTS: " + shared.points + "\nWow! Great job!" , style);
						text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			time1 = game.time.now;
        },
    
        update: function () {
			//console.log("in main\n");
            //	Do some nice funky main menu effect here
			var time = game.time.now;
			if(!music.isPlaying) {
				music.play();
			}
			var mouseClick;
			mouseClick = game.input.activePointer.leftButton.isDown;
			if(mouseClick && time > timer + time1)
				backToMain();
		}
        
    };
};
