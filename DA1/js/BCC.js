'use strict';

GameStates.makeGame = function (game, shared) {
    let Ls = [];
    const helpText = {
        gameObject: null, // init deferred to create() as a valid game instance is required to initialize
        lines: ['Oh No! It is the D***** T****!', 'Press [F] to hand him FAT Ls'],
        style: {
            font: 'bold 32px Arial',
            fill: '#fff',
            align: 'center',
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: 'rgba(0,0,0,0.5)',
                blur: 2,
            },
        },
    };
    let player;
    let enemy;
    let background;
    let wasd;
    let cursors;
    let music;
    let platforms;
    let victory = false;
    const platformHeight = 400;

    function render() {
        game.debug.text(game.time.physicsElapsed, 32, 32);
        game.debug.body(player);
        game.debug.bodyInfo(player, 16, 24);
        game.debug.body(enemy);
    }

    function quitGame() {
        music.stop();
        player.destroy();
        game.state.start('MainMenu');
    }

    return {
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            background = game.add.tileSprite(-200, 0, 1000, 600, 'background');
            background.fixedToCamera = true;


            helpText.gameObject = game.add.text(
                0,
                75,
                helpText.lines.join('\n'),
                helpText.style,
            );
            helpText.gameObject.anchor.set(-0.4);

            game.physics.arcade.gravity.y = 1200;

            enemy = game.add.sprite(400, 300, 'pepe');
            player = game.add.sprite(10, 125, 'cheese');

            game.physics.enable(player, Phaser.Physics.ARCADE);
            game.physics.enable(enemy, Phaser.Physics.ARCADE);

            platforms = [
                // left platform
                game.add.sprite(0, platformHeight, 'cobble'),
                game.add.sprite(32, platformHeight, 'cobble'),
                game.add.sprite(64, platformHeight, 'cobble'),
                game.add.sprite(96, platformHeight, 'cobble'),
                game.add.sprite(128, platformHeight, 'cobble'),
                // right platform
                game.add.sprite(768, platformHeight, 'cobble'),
                game.add.sprite(736, platformHeight, 'cobble'),
                game.add.sprite(704, platformHeight, 'cobble'),
                game.add.sprite(672, platformHeight, 'cobble'),
                game.add.sprite(640, platformHeight, 'cobble'),
            ];

            for (const platform of platforms) {
                game.physics.enable(platform, Phaser.Physics.ARCADE);
                platform.body.allowGravity = false;
                platform.body.immovable = true;
            }

            player.body.collideWorldBounds = true;
            player.body.immovable = false;
            player.body.setSize(110, 152, 20, 10);

            player.health = 2000;
            enemy.health = 20000;

            enemy.body.collideWorldBounds = true;
            enemy.body.allowGravity = false;
            enemy.body.immovable = true;
            enemy.body.setSize(180, 180, 10, 10);

            // audio
            music = game.add.audio('GameBGM');
            // Phaser is drunk, and can't tell that 0.6 is a finite float if pass into the add audio function.
            music.volume = 0.6;
            player.shootSound = game.add.audio('shoot');
            // Phaser is drunk, and can't tell that 0.18 is a finite float if pass into the add audio function.
            player.shootSound.volume = 0.18;
            player.jumpSound = game.add.audio('jump');
            enemy.deathSound = game.add.audio('death');

            game.camera.follow(player);

            cursors = game.input.keyboard.createCursorKeys();
            wasd = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            };
            player.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            player.shootButton = game.input.keyboard.addKey(Phaser.Keyboard.F);

            player.damageTimer = 0;
            player.jumpTimer = 0;
            player.projectileTimer = 0;
            player.jumped = false;
            player.onFloor = false;
            player.facing = 'left';

            enemy.MovementTimerX = 0;
            enemy.MovementTimerY = 0;

            music.loopFull();
        },

        update: function () {
            let time = game.time.now;
            player.onFloor = player.body.onFloor();

            // player collided with platform
            for (const platform of platforms) {
                if (game.physics.arcade.collide(player, platform)) {
                    player.body.velocity.y = 0;
                    player.onFloor = true;
                    player.jumpTimer = 0;
                    break;
                }
            }

            // bullet(s) collided with platform
            for (const L of Ls) {
                // The two inner sprites are the only ones that can possibly collide with the Ls,
                // as long as they are only allowed to move horizontally.
                if (game.physics.arcade.collide(L, platforms[4]) ||
                    game.physics.arcade.collide(L, platforms[9])
                ) {
                    L.destroy();
                }
            }

            // player collided with enemy
            if (
                game.physics.arcade.collide(player, enemy) &&
                time > player.damageTimer
            ) {
                // take damage
                player.health -= 100;
                player.damageTimer = time + 100;
                enemy.body.velocity.y *= -1;
            }

            if (player.health < 1) {
                // player dies
                victory = false;
                Ls = [];
                quitGame();
                // game is over, everything is destroyed, so return early to prevent error
                return;
            }

            // list of bullet indices that have been destroyed and are waiting to be removed from the active Ls list
            let deadBulletIndices = [];

            // bullet(s) hit enemy
            for (const [i, L] of Ls.entries()) {
                if (game.physics.arcade.collide(L, enemy)) {
                    // enemy takes damage
                    enemy.health -= 150;
                    deadBulletIndices.push(i);
                    L.destroy();
                }

                // bullet(s) hit world bound
                const blocked = L?.body?.blocked;
                if (blocked && (
                    blocked.down ||
                    blocked.up ||
                    blocked.left ||
                    blocked.right)
                ) {
                    deadBulletIndices.push(i);
                    L.destroy();
                }
            }

            // Remove any destroyed Ls, and reset the dead bullet list
            Ls = Ls.filter((_, index) => !deadBulletIndices.includes(index));
            deadBulletIndices = [];

            if (enemy.health < 1) {
                // enemy dies
                enemy.deathSound.play();
                enemy.destroy();
                victory = true;
                music.stop();
                game.state.start('Victory');
                Ls = [];
                // game is over, everything is destroyed, so return early to prevent error
                return;
            }

            player.body.velocity.x = 0;

            if (enemy.body.velocity.x === 0) enemy.body.velocity.x = 300;
            if (enemy.body.velocity.y === 0) enemy.body.velocity.y = -300;
            if (time > enemy.MovementTimerX) {
                enemy.MovementTimerX = time + 2000;
                enemy.body.velocity.x *= -1;
            }
            if (time > enemy.MovementTimerY) {
                enemy.MovementTimerY = time + 2200;
                enemy.body.velocity.y *= -1;
            }

            if (cursors.left.isDown || wasd.left.isDown) {
                player.body.velocity.x = -315;
                player.facing = 'left';
            } else if (cursors.right.isDown || wasd.right.isDown) {
                player.body.velocity.x = 315;
                player.facing = 'right';
            }

            if (player.shootButton.isDown && time > player.projectileTimer) {
                player.shootSound.play();
                let L;
                if (player.facing === 'right') {
                    L = game.add.sprite(player.x + 100, player.y + 45, 'L');
                    game.physics.enable(L, Phaser.Physics.ARCADE);
                    L.body.velocity.x = 500;
                } else {
                    L = game.add.sprite(player.x, player.y + 45, 'L');
                    game.physics.enable(L, Phaser.Physics.ARCADE);
                    L.body.velocity.x = -500;
                }
                L.body.collideWorldBounds = true;
                L.body.allowGravity = false;
                L.body.immovable = true;
                Ls.push(L);
                player.projectileTimer = time + 50;
            }

            if (time >= player.jumpTimer) {
                player.jumped = false;
            }

            if (player.jumpButton.isDown && player.onFloor && time > player.jumpTimer) {
                player.jumpSound.play();
                player.body.velocity.y = -1075;
                player.jumpTimer = time + 300;
                player.jumped = true;
            } else if (!player.onFloor && player.jumped) {
                player.body.velocity.y =
                    ((player.jumpTimer + 200 - game.time.now) / 600.0) * -1075.0;
            }
        },
    };
};
