'use strict';

GameStates.makeGame = function (game, shared) {
    const cs1 = [
        'The goal of this game is to do your laundry.',
        'However, due to budget constraints,',
        'the washing machines are notorious for failing.',
        'A lot.',
        'Washy, the cartoon washing machine will help you with your task.',
        'Say hi, Washy.',
        "\nHey, hey, hey, what's good b0ss?",
        '\nThe rules are simple:',
        'Use the left mouse button to drag laundry that washy throws your way \ninto the baskets.',
        'When you feel a basket is ready,\ntoss the clothes into one of the six washing machines.',
        'Turn it on and let it spin.',
        'Keep an eye on the washing machines, because if they break,\nyou have to start the wash cycle over again.',
        'Keep your baskets empty, otherwise they might overflow.',
        'Get points by successfully washing clothes,\nand avoid mixing colors with whites.',
        'Ready?',
        'Go!',
    ];
    let line = [];
    let wordIndex = 0;
    let lineIndex = 0;
    const wordDelay = 300;
    const lineDelay = 1300;
    let text, skipText;
    let bg;
    let music, tutorial;
    let tutFlag = false;
    let washy;
    let washTimer = 0;
    let clothesTimer = 0;
    const clothes = []; // a list of all clothes currently in the game
    const washers = []; // a list of the six washing machines UI states (on/off, health, list of clothes), location.
    const baskets = []; // a list of dicts of clothes in each basket and basket hitbox (4 baskets total)
    const basketColorWeights = [];
    const basketClothes = [];
    const cTypes = {
        red: ['rPants', 'rShirt', 'panties', 'boxers'],
        green: ['gPants', 'gShirt', 'boxers'],
        blue: ['bPants', 'bShirt', 'boxers'],
        white: ['wPants', 'wShirt'],
        none: ['baby'],
    };
    ; // clothing types
    let UI, basket, cloth;
    let washerInspect;
    let tip1, tip2;
    let basketIndex = -1;
    const hover = false;
    const feedbackGood = [];
    const feedbackExcellent = [];
    const feedbackBad = [];
    let feedBackCount = 0;
    const hitBox = null;
    const style = { font: 'bold 18px Lucida Console', fill: '#FFFFFF' };
    let score, timer;
    const washerDamage = [];
    const washerClothes = [];
    const washerInspecting = [];
    let washerState = [];
    let click1, click3;
    let success, beep;
    let cycleFlag = true;
    let isHovering = false;

    //const damage = ['fine', 'troubled', 'broken'];
    const gameTime = 120000;
    const gravity = 400;

    function cb(basket) {
        //console.log("hover!");
    }

    function gameStart() {
        // add the baskets
        for (let i = 0; i < 3; i++) {
            basket = game.add.sprite(48 + i * 300, 500, 'basket');
            game.physics.enable(basket, Phaser.Physics.ARCADE);
            basket.body.allowGravity = false;
            basket.body.immovable = true;
            basket.body.setSize(62, 63, 10, 10);
            basket.alpha = 1.0;
            basket.inputEnabled = true;
            game.input.addMoveCallback(() => cb(i), this);

            baskets[i] = basket;
            basketColorWeights[i] = 'none';
            basketClothes[i] = [];

            score = game.add.text(0, 0, '', style);
            score.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            timer = game.add.text(350, 0, '', style);
            score.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        }
        if (washy.alpha < 1.0) {
            washy.alpha = 1.0;
        }
        bg.alpha = 1.0;
        tutFlag = true;
        text.alpha = 0.0;
        skipText.alpha = 0.0;
        washy.body.velocity.x = 300;
        tutorial.stop();
        music.loopFull();
    }

    function clothSettings(x = 60, y = 60) {
        game.physics.enable(cloth, Phaser.Physics.ARCADE);
        cloth.body.allowGravity = true;
        cloth.inputEnabled = true;
        cloth.input.enableDrag(true);
        cloth.body.collideWorldBounds = true;
        cloth.body.setSize(x, y, 10, 10); // can change x, y later
    }

    function spewClothing() {
        // spews clothing by randomly selecting a number of clothes to generate,
        // then generating them randomly, and giving them horizontal and vertical acceleration randomly
        let rand, speed;
        const num = Math.floor(Math.random() * 3 + 1);
        for (let i = 0; i < num; i++) {
            rand = Math.floor(Math.random() * 11 + 1);
            const x = washy.body.x;
            const y = washy.body.y;
            if (clothes[i] !== null) {
                switch (rand) {
                    case 1:
                        cloth = game.add.sprite(x, y, 'baby');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 2:
                        cloth = game.add.sprite(x, y, 'boxers');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 3:
                        cloth = game.add.sprite(x, y, 'bPants');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 4:
                        cloth = game.add.sprite(x, y, 'bShirt');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 5:
                        cloth = game.add.sprite(x, y, 'gPants');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 6:
                        cloth = game.add.sprite(x, y, 'gShirt');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 7:
                        cloth = game.add.sprite(x, y, 'rPants');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 8:
                        cloth = game.add.sprite(x, y, 'rShirt');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 9:
                        cloth = game.add.sprite(x, y, 'panties');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 10:
                        cloth = game.add.sprite(x, y, 'wPants');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                    case 11:
                        cloth = game.add.sprite(x, y, 'wShirt');
                        clothSettings();
                        clothes.push(cloth);
                        break;
                }
            }
        }
        for (const cloth of clothes) {
            if (!cloth || !cloth.body) continue;
            speed = Math.floor(Math.random() * 600 - 300);
            cloth.body.velocity.x = speed;
            speed = Math.floor(Math.random() * -800 - 300);
            cloth.body.velocity.y = speed;
        }
    }

    function render() {
        game.debug.text(game.time.physicsElapsed, 32, 32);
        for (const cloth of clothes) {
            if (!cloth || !cloth.body) continue;
            game.debug.bodyInfo(cloth, 16, 24);
            game.debug.body(cloth);
        }

        console.log('clothes: ');
        console.log(clothes);
        console.log('washers: ');
        console.log(washers);
        console.log('baskets: ');
        //game.debug.body(baskets[0]);
    }

    function quitGame() {
        // Here you should destroy anything you no longer need.
        // Stop music, delete sprites, purge caches, free resources, all that good stuff.
        music.stop();
        bg.destroy();
        game.state.start('EndScreen');
    }

    function nextLine() {
        if (lineIndex === cs1.length) {
            //  We're finished
            lineIndex = 0;
            wordIndex = 0;

            return;
        }

        // Split the current line on spaces, so one word per array element
        line = cs1[lineIndex].split(' ');

        // Reset the word index to zero (the first word in the line)
        wordIndex = 0;

        // Call the 'nextWord' function once for each word in the line (line.length)
        game.time.events.repeat(wordDelay, line.length, nextWord, this);

        // Advance to the next line
        lineIndex++;
    }
    function nextWord() {
        // Add the next word onto the text string, followed by a space
        text.text = text.text.concat(line[wordIndex] + ' ');

        // Advance the word index to the next word in the line
        wordIndex++;

        // Last word?
        if (wordIndex === line.length) {
            // Add a carriage return
            text.text = text.text.concat('\n');

            // Get the next line after the lineDelay amount of ms has elapsed
            game.time.events.add(lineDelay, nextLine, this);
        }
    }

    function washer(washerNum, clothes = null) {
        // show washer UI
        // do UI operations
        washer[washerNum] = [];
        washer[washerNum].alpha = 1.0;
        washerInspecting[washerNum] = true;
        //washerDamage = damage[0];
        if (clothes !== null) {
            washerClothes[washerNum] = clothes;
        }
    }

    function washCycle(washer) {
        // washing done, play a sound and get points based off of the mode of the colors
        let total = 0;
        washerClothes[washer] = [];
        const c = washerClothes[washer];
        let red = 0,
            green = 0,
            blue = 0,
            white = 0;
        for (let i = 0; i < c.length; i++) {
            if (cTypes.red.includes(c[i])) {
                red++;
            }
            if (cTypes.green.includes(c[i])) {
                green++;
            }
            if (cTypes.blue.includes(c[i])) {
                blue++;
            }
            if (cTypes.white.includes(c[i])) {
                white++;
            }
            if (cTypes.none.includes(c[i])) {
                total -= 1000;
            }
        }
        total +=
            (-(white * red * 3) +
                -(white * green) +
                -(white * blue) +
                blue * blue +
                red * red +
                green * green +
                white * white * white) *
            1000;
        shared.points += total;
        click1.play();
        beep.play();
        cycleFlag = true;
    }

    return {
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            bg = game.add.sprite(0, 0, 'bg');
            bg.alpha = 0.25;

            text = game.add.text(10, 10, '', style);
            text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text.setTextBounds(0, 0, 400, 100);

            tip1 = game.add.text(
                10,
                575,
                'Left click on a washer to load it.',
                style,
            );
            tip1.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            tip1.setTextBounds(0, 0, 400, 100);
            tip1.alpha = 0.0;

            tip2 = game.add.text(
                10,
                575,
                'Left click on a basket to take a load of clothes.',
                style,
            );
            tip2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            tip2.setTextBounds(0, 0, 400, 100);
            tip2.alpha = 0.0;

            nextLine(cs1, text);

            skipText = game.add.text(
                10,
                550,
                'Left click to skip Tutorial',
                style,
            );

            washy = game.add.sprite(550, 430, 'washy');
            washy.alpha = 0.0;

            game.physics.enable(washy, Phaser.Physics.ARCADE);
            washy.body.collideWorldBounds = true;

            game.physics.arcade.gravity.y = gravity;

            // controls
            game.input.mouse.capture = true;

            feedbackBad[0] = game.add.audio('no1');
            feedbackBad[1] = game.add.audio('no2');
            feedbackBad[2] = game.add.audio('no3');
            feedbackExcellent[0] = game.add.audio('excellent1');
            feedbackExcellent[1] = game.add.audio('excellent2');
            feedbackExcellent[2] = game.add.audio('excellent3');
            feedbackGood[0] = game.add.audio('good1');
            feedbackGood[1] = game.add.audio('good2');
            feedbackGood[2] = game.add.audio('good3');
            feedbackGood[3] = game.add.audio('gj1');
            feedbackGood[4] = game.add.audio('gj2');
            feedbackGood[5] = game.add.audio('gj3');
            feedbackGood[6] = game.add.audio('nice1');
            feedbackGood[7] = game.add.audio('nice2');
            feedbackGood[8] = game.add.audio('nice3');

            success = game.add.audio('success');
            beep = game.add.audio('beep');

            click1 = game.add.audio('click1');
            click3 = game.add.audio('click3');

            // adding the washers
            for (let i = 0; i < 6; i++) {
                UI = game.add.sprite(0, 0, 'UI');
                washerInspect = game.add.button(48 + i * 167, 370);
                game.physics.enable(UI, Phaser.Physics.ARCADE);
                UI.body.allowGravity = false;
                UI.body.immovable = true;
                UI.inputEnabled = true;
                UI.body.setSize(283, 283);
                UI.alpha = 0.0;
                washerDamage[i] = 'fine';
                washerInspecting[i] = false;
                washerClothes[i] = [];
                washerState = false;
                washers[i] = UI;
            }

            // audio
            music = game.add.audio('GameBGM');
            music.volume = 0.3;
            tutorial = game.add.audio('tutorial');

            tutorial.play();
        },

        update: function () {
            //render();
            const time = game.time.now;
            const mouseClick = game.input.activePointer.leftButton.isDown;

            // in tutorial
            if (!tutFlag) {
                if (mouseClick) {
                    gameStart();
                }

                if (time >= washTimer) {
                    if (washTimer === 0) {
                        washTimer = time + 19000;
                    } else if (washy.alpha < 1.0) {
                        washy.alpha = 1.0;
                    }
                }
                return;
            }

            // in game
            if (time >= gameTime) {
                // game over
                quitGame();
            }

            // clothes and baskets collision

            for (let j = 0; j < baskets.length; j++) {
                for (let i = 0; i < clothes.length; i++) {
                    if (
                        !game.physics.arcade.collide(clothes[i], baskets[j]) ||
                        !clothes[i]
                    ) continue

                    // cloth has gone into basket
                    basketClothes[j] = clothes[i];
                    for (let k = 0; k < Object.keys(cTypes).length; k++) {
                        const rand = Math.floor(Math.random() * 3);
                        const rand2 = Math.floor(Math.random() * 9);
                        // play sound for each
                        const key = clothes[i].key;

                        if (cTypes.red.includes(key)) // RED
                        {
                            if (basketColorWeights[j] === 'white') {
                                // Mixed whites with non-whites!!!
                                feedbackBad[rand].play();
                                feedBackCount = 0;
                                shared.points -= 1000;
                            } else if (basketColorWeights[j] === 'red') {
                                if (feedBackCount < 6)
                                    feedbackGood[rand2].play();
                                else {
                                    feedbackExcellent[rand].play();
                                    success.play();
                                }
                                feedBackCount += 2;
                                shared.points += feedBackCount * 100;
                            } else if (basketColorWeights[j] === 'none') {
                                basketColorWeights[j] = 'red';
                                feedbackGood[rand2].play();
                                feedBackCount++;
                                shared.points += feedBackCount * 100;
                            } else {
                                feedBackCount++;
                                shared.points += feedBackCount * 100;
                            }
                            break;
                        } else if (cTypes.green.includes(key)) // GREEN
                        {
                            if (basketColorWeights[j] === 'white') {
                                // Mixed whites with non-whites!!!
                                feedbackBad[rand].play();
                                feedBackCount = 0;
                                shared.points -= 1000;
                            } else if (basketColorWeights[j] === 'green') {
                                if (feedBackCount < 6)
                                    feedbackGood[rand2].play();
                                else {
                                    feedbackExcellent[rand].play();
                                    success.play();
                                }
                                feedBackCount += 2;
                                shared.points += feedBackCount * 100;
                            } else if (basketColorWeights[j] === 'none') {
                                basketColorWeights[j] = 'green';
                                feedbackGood[rand2].play();
                                feedBackCount++;
                                shared.points += feedBackCount * 100;
                            } else {
                                feedBackCount++;
                                shared.points += feedBackCount * 100;
                            }
                            break;
                        } else if (cTypes.blue.includes(key)) //BLUE
                        {
                            if (basketColorWeights[j] === 'white') {
                                // Mixed whites with non-whites!!!
                                feedbackBad[rand].play();
                                feedBackCount = 0;
                                shared.points -= 1000;
                            } else if (basketColorWeights[j] === 'blue') {
                                if (feedBackCount < 6)
                                    feedbackGood[rand2].play();
                                else {
                                    feedbackExcellent[rand].play();
                                    success.play();
                                }
                                feedBackCount += 2;
                                shared.points += feedBackCount * 100;
                            } else if (basketColorWeights[j] === 'none') {
                                basketColorWeights[j] = 'blue';
                                feedbackGood[rand2].play();
                                feedBackCount++;
                                shared.points += feedBackCount * 100;
                            } else {
                                feedBackCount++;
                                shared.points += feedBackCount * 100;
                            }
                            break;
                        } else if (cTypes.white.includes(key)) // WHITE
                        {
                            if (
                                basketColorWeights[j] !== 'white' &&
                                basketColorWeights[j] !== 'none'
                            ) {
                                // Mixed whites with non-whites!!!
                                feedbackBad[rand].play();
                                feedBackCount = 0;
                                shared.points -= 1000;
                            } else if (basketColorWeights[j] === 'white') {
                                if (feedBackCount < 6)
                                    feedbackGood[rand2].play();
                                else {
                                    feedbackExcellent[rand].play();
                                    success.play();
                                }
                                feedBackCount += 2;
                                shared.points += feedBackCount * 100;
                            } else if (basketColorWeights[j] === 'none') {
                                basketColorWeights[j] = 'white';
                                feedbackGood[rand2].play();
                                feedBackCount++;
                                shared.points += feedBackCount * 100;
                            }

                            break;
                        } else if (cTypes.none.includes(key)) // BABY
                        {
                            feedbackBad[rand].play();
                            feedBackCount = 0;
                            shared.points -= 500;
                            break;
                        }
                    }
                    clothes[i].destroy();
                }
            }

            score.setText('points: ' + shared.points);
            timer.setText('Time Left: ' + Math.floor((gameTime - time) / 1000));

            // show tooltips
            // get index of basket last clicked
            for (let i = 0; i < baskets.length; i++) {
                isHovering = baskets[i].input.pointerOver();
                if (isHovering) {
                    tip2.alpha = 1.0;
                    tip1.alpha = 0.0;
                }
                if (mouseClick) {
                    tip2.alpha = 0.0;
                    tip1.alpha = 1.0;
                }
                if (isHovering && mouseClick) {
                    basketIndex = i;
                }
                if (isHovering === false) {
                    basketIndex = -1;
                }
            }

            // washers
            for (let i = 0; i < washers.length; i++) {
                isHovering = washers[i].input.pointerOver();
                if (!washerInspecting[i] && isHovering && mouseClick) {
                    const _clothes = basketIndex !== -1 ? basketClothes[basketIndex] : null;
                    washer(i, _clothes);
                } else if (mouseClick && cycleFlag) {
                    click3.play();
                    cycleFlag = false;
                    game.time.events.add(10000, () => washCycle(i), this);
                }
            }

            // clothes spewing
            if (time >= clothesTimer) {
                if (clothesTimer !== 0)
                    spewClothing();
                clothesTimer = clothesTimer === 0 ? time + 3000 : 0;
            }

            // destroy clothes if they touch the ground
            for (const cloth of clothes) {
                if (cloth?.body?.blocked?.down) {
                    cloth.destroy();
                }
            }

            // Washy's movement
            if (washy?.body?.blocked?.down) {
                washy.body.velocity.y = -300;
            }
            if (washy?.body?.blocked?.up) {
                washy.body.velocity.y = 300;
            }
            if (washy?.body?.blocked?.left) {
                washy.body.velocity.x = 200;
            }
            if (washy?.body?.blocked?.right) {
                washy.body.velocity.x = -200;
            }
        },
    };
};
