'use strict';

GameStates.makeGame = function (game, shared) {
    let Ls = [];
    let text1, text2, text3;
    let player, playerHealth;
    let enemy, enemyHealth;
    let facing = 'left';
    let jumpTimer = 0,
        projectileTimer = 0,
        damageTimer = 0,
        enemyMovementTimerX = 0,
        enemyMovementTimerY = 0;
    let cursors;
    let jumpButton;
    let bg;
    let wasd;
    let jumped;
    let music, shootSound, jumpSound, enemyDeathSound;
    const platformHeight = 400;
    let platforms;
    let shootButton;
    let victory = false;

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

            game.stage.backgroundColor = '#000000';

            bg = game.add.tileSprite(-200, 0, 1000, 600, 'background');
            bg.fixedToCamera = true;

            const style = {
                font: 'bold 32px Arial',
                fill: '#fff',
                boundsAlignH: 'center',
                boundsAlignV: 'middle',
            };
            text1 = game.add.text(
                0,
                0,
                'Oh No! It is the D***** T****!\n',
                style,
            );
            text1.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text1.setTextBounds(0, 0, 800, 100);
            text2 = game.add.text(
                0,
                0,
                'Press [F] to hand him FAT Ls\n',
                style,
            );
            text2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text2.setTextBounds(0, 75, 800, 100);

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

            playerHealth = 2000;
            enemyHealth = 20000;

            enemy.body.collideWorldBounds = true;
            enemy.body.allowGravity = false;
            enemy.body.immovable = true;
            enemy.body.setSize(180, 180, 10, 10);

            // audio
            music = game.add.audio('GameBGM');
            music.volume = 0.6;
            shootSound = game.add.audio('shoot');
            shootSound.volume = 0.18;
            jumpSound = game.add.audio('jump');
            enemyDeathSound = game.add.audio('death');

            game.camera.follow(player);

            cursors = game.input.keyboard.createCursorKeys();
            wasd = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            };
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            shootButton = game.input.keyboard.addKey(Phaser.Keyboard.F);

            music.loopFull();
        },

        update: function () {
            let onFloor = player.body.onFloor();
            let time = game.time.now;

            // player collided with platform
            for (const platform of platforms) {
                if (game.physics.arcade.collide(player, platform)) {
                    player.body.velocity.y = 0;
                    onFloor = true;
                    jumpTimer = 0;
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
                time > damageTimer
            ) {
                // take damage
                playerHealth -= 100;
                enemy.body.velocity.y *= -1;
                damageTimer = time + 100;
            }

            if (playerHealth < 1) {
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
                    enemyHealth -= 150;
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

            if (enemyHealth < 1) {
                // enemy dies
                enemyDeathSound.play();
                enemy.destroy();
                victory = true;
                music.stop();
                game.state.start('Victory');
                Ls = [];
                // game is over, everything is destroyed, so return early to prevent error
                return;
            }

            player.body.velocity.x = 0;
            time = game.time.now;

            if (enemy.body.velocity.x === 0) enemy.body.velocity.x = 300;
            if (enemy.body.velocity.y === 0) enemy.body.velocity.y = -300;
            if (time > enemyMovementTimerX) {
                enemyMovementTimerX = time + 2000;
                enemy.body.velocity.x *= -1;
            }
            if (time > enemyMovementTimerY) {
                enemyMovementTimerY = time + 2200;
                enemy.body.velocity.y *= -1;
            }

            if (cursors.left.isDown || wasd.left.isDown) {
                player.body.velocity.x = -315;
                facing = 'left';
            } else if (cursors.right.isDown || wasd.right.isDown) {
                player.body.velocity.x = 315;
                facing = 'right';
            }

            if (shootButton.isDown && time > projectileTimer) {
                shootSound.play();
                let L;
                if (facing === 'right') {
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
                projectileTimer = time + 50;
            }

            if (time >= jumpTimer) {
                jumped = false;
            }

            if (jumpButton.isDown && onFloor && time > jumpTimer) {
                jumpSound.play();
                player.body.velocity.y = -1075;
                jumpTimer = time + 300;
                jumped = true;
            } else if (!onFloor && jumped) {
                player.body.velocity.y =
                    ((jumpTimer + 200 - game.time.now) / 600.0) * -1075.0;
            }
        },
    };
};
