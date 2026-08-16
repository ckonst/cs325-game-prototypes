'use strict';

GameStates.makeGame = function (game, shared) {
    let L;
    let Ls;
    let text1, text2, text3;
    let player, player_health;
    let enemy, enemy_health;
    let facing = 'left';
    let jumpTimer = 0,
        projectileTimer = 0,
        damage_timer = 0,
        movement_timer_x = 0,
        movement_timer_y = 0;
    let cursors;
    let jumpButton;
    let bg;
    let wasd;
    let jumped;
    let music, shoot_sound, jump_sound, enemy_death_sound;
    let platforms;
    let platform1,
        platform2,
        platform3,
        platform4,
        platform5,
        platform6,
        platform7,
        platform8,
        platform9,
        platform10;
    let shoot_button;
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
            Ls = [];

            enemy = game.add.sprite(400, 300, 'pepe');
            player = game.add.sprite(10, 125, 'cheese');

            game.physics.enable(player, Phaser.Physics.ARCADE);
            game.physics.enable(enemy, Phaser.Physics.ARCADE);

            const platform_height = 400;
            // left platform
            platform1 = game.add.sprite(0, platform_height, 'cobble');
            platform2 = game.add.sprite(32, platform_height, 'cobble');
            platform3 = game.add.sprite(64, platform_height, 'cobble');
            platform4 = game.add.sprite(96, platform_height, 'cobble');
            platform5 = game.add.sprite(128, platform_height, 'cobble');

            // right platform
            platform6 = game.add.sprite(768, platform_height, 'cobble');
            platform7 = game.add.sprite(736, platform_height, 'cobble');
            platform8 = game.add.sprite(704, platform_height, 'cobble');
            platform9 = game.add.sprite(672, platform_height, 'cobble');
            platform10 = game.add.sprite(640, platform_height, 'cobble');
            platforms = [
                platform1,
                platform2,
                platform3,
                platform4,
                platform5,
                platform6,
                platform7,
                platform8,
                platform9,
                platform10,
            ];

            for (const platform of platforms) {
                game.physics.enable(platform, Phaser.Physics.ARCADE);
                platform.body.allowGravity = false;
                platform.body.immovable = true;
            }

            player.body.collideWorldBounds = true;
            player.body.immovable = false;
            player.body.setSize(110, 152, 20, 10);

            player_health = 2000;
            enemy_health = 20000;

            enemy.body.collideWorldBounds = true;
            enemy.body.allowGravity = false;
            enemy.body.immovable = true;
            enemy.body.setSize(180, 180, 10, 10);

            // audio
            music = game.add.audio('GameBGM');
            music.volume = 0.6;
            shoot_sound = game.add.audio('shoot');
            shoot_sound.volume = 0.18;
            jump_sound = game.add.audio('jump');
            enemy_death_sound = game.add.audio('death');

            game.camera.follow(player);

            cursors = game.input.keyboard.createCursorKeys();
            wasd = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            };
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            shoot_button = game.input.keyboard.addKey(Phaser.Keyboard.F);

            music.loopFull();
        },

        update: function () {
            // render();

            let onFloor = player.body.onFloor();
            let collided, enemy_collided, bullet_collided;
            let time = game.time.now;

            for (const platform of platforms) {
                collided |= game.physics.arcade.collide(player, platform);

                // bullet(s) collided with platform
                for (let j = 0; j < Ls.length; j++) {
                    if (game.physics.arcade.collide(Ls[j], platform)) {
                        Ls[j].destroy();
                    }
                }
            }

            if (collided) {
                player.body.velocity.y = 0;
                onFloor = true;
                jumpTimer = 0;
            }
            if (
                game.physics.arcade.collide(player, enemy) &&
                time > damage_timer
            ) {
                // take damage
                player_health -= 100;
                enemy.body.velocity.y *= -1;
                damage_timer = time + 100;
            }

            // bullet(s) hit enemy
            for (const L of Ls) {
                bullet_collided = game.physics.arcade.collide(L, enemy);
                if (bullet_collided) {
                    // enemy takes damage
                    enemy_health -= 150;
                    L.destroy();
                }

                // bullet(s) hit world bound
                const blocked = L?.body?.blocked;
                if (
                    blocked?.down ||
                    blocked?.up ||
                    blocked?.left ||
                    blocked?.right
                ) {
                    Ls[i].destroy();
                }
            }

            if (player_health < 1) {
                // player dies
                victory = false;
                quitGame();
            }
            if (enemy_health < 1) {
                // enemy dies
                enemy_death_sound.play();
                enemy.destroy();
                victory = true;
                music.stop();
                game.state.start('Victory');
            }

            if (player.body !== null) player.body.velocity.x = 0;
            time = game.time.now;
            if (enemy.body !== null) {
                if (enemy.body.velocity.x === 0) enemy.body.velocity.x = 300;
                if (enemy.body.velocity.y === 0) enemy.body.velocity.y = -300;
                if (time > movement_timer_x) {
                    movement_timer_x = time + 2000;
                    enemy.body.velocity.x *= -1;
                }
                if (time > movement_timer_y) {
                    movement_timer_y = time + 2200;
                    enemy.body.velocity.y *= -1;
                }
            }

            if (cursors.left.isDown || wasd.left.isDown) {
                if (player.body !== null) player.body.velocity.x = -315;

                if (facing !== 'left') {
                    facing = 'left';
                }
            } else if (cursors.right.isDown || wasd.right.isDown) {
                if (player.body !== null) player.body.velocity.x = 315;

                if (facing !== 'right') {
                    facing = 'right';
                }
            }

            if (shoot_button.isDown && time > projectileTimer) {
                shoot_sound.play();
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
                jump_sound.play();
                if (player.body !== null) player.body.velocity.y = -1075;
                jumpTimer = time + 300;
                jumped = true;
            } else if (!onFloor && jumped) {
                if (player.body !== null)
                    player.body.velocity.y =
                        ((jumpTimer + 200 - game.time.now) / 600.0) * -1075.0;
            }
        },
    };
};
