"use strict"

/* Global variable */
var display = document.getElementById("digital-display");
var count = document.getElementById("digital-display").getAttribute("value");
var correct = true; // use to track user correct choice
var gameStatus = "off"; // use to track game is on/off
var strictMode = document.getElementById("strictMode"); //this variable tracks the strict mode on/off
var t = 2000; // time dealy for each checking user input

const whichPart = ['green', 'red', 'yellow', 'blue'];
const tones = {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    playerTurn: new Audio('http://soundjax.com/reddo/40725%5EDING1.mp3'),
    fail: new Audio('http://soundjax.com/reddo/76527%5Eerror.mp3')
};
var generating = 0,
    playerTime = 0,
    checkMatch = 0,
    checkWinner = 0,
    lightening = 0,
    lightOneColor = 0,
    p = 0;

// use to track reset the game when user click off
var player = [];
var playerIsRight = true; //use to track the game status, if player is on winning 

var nodes = document.getElementsByClassName("quarter");
var els = [].slice.call(nodes); //els color's part

/* this function turn on / off the game */
function toggle() {
    var slider = document.getElementById("slider");
    var status = slider.getAttribute("value"); // on or off
    var turn = status === "off" ? "on" : "off";
    gameStatus = turn; // this varible pass the game status: on/off to the start button
    slider.style.cssFloat = turn === "on" ? "right" : "left"; //slide the toggle
    slider.setAttribute("value", turn);
    console.log("status now is: " + gameStatus);
    if (turn === "off") {
        clearGame();
    }

}

/* this funct enable/disable strict mode */
function setStrict() {

    strictMode.setAttribute("value", strictMode.getAttribute("value") === "off" ? "on" : "off");
    strictMode.classList.toggle("lighten");
    console.log("strictmode is: " + strictMode.getAttribute("value"));
}

function startGame() {
    clearGame(); //clear the last played game first;
    if (gameStatus === "on") {
        //this funct helps blinking the - - in the display panel
        count = "- -";
        display.innerHTML = "<span class='blink'>" + count + "</span";

        //start new game here
        var simon = new game();
        count = 0;
        simon.start();

    } else {
        alert("please turn on the game");
    }
}

function clearGame() {
    count = "";
    updateCount();
    clearTimeout(checkWinner);
    clearTimeout(checkMatch);
    clearTimeout(playerTime);
    clearTimeout(lightOneColor);
    clearTimeout(lightening);
    clearInterval(generating);

}

function updateCount() {
    display.innerHTML = count;
}

// game Object
function game() {
    this.isOn = false;

    this.reset = false;

    var simonPattern = [];
    this.player = [];

    this.start = function() {
        var move = { step: 0, colors: [] };


        var t_pattern = 1000;

        generating = setInterval(function() {
            // if (playerIsRight) {
            updateCount();
            var colour = whichPart[(Math.floor(Math.random() * 4))];
            move.colors.push(colour);
            console.log("add extra step / color");
            move.step = count;
            //simonPattern.push(move);
            //console.log(move);
            count++;

            (p = function playerTurn() {
                lighten(move.colors);
                console.log(move.colors);
                playerTime = setTimeout(function() { // lighten finishes here
                    playerInput();
                    checkMatch = setTimeout(function() {
                        match(move.colors);
                        checkWinner = setTimeout(function() {
                            checkWin(move.colors);
                        }, 900);

                    }, 800);

                }, 500);
            })();



        }, t_pattern *= 3);

    }

}



function lighten(colors) {
    clickToggle();
    var i = 0;
    lightening = setInterval(function() { //after each 600ms, lighten continues lighten the next colors set
        lightenColor(colors[i]);
        setTimeout(function() {
            i++;
            if (i >= colors.length) {
                clearInterval(lightening); //lighten and darken a set of colors has finished
                //now is player turn,
            }
        }, 200); //300ms because it let the lightColor finished first, which takes about 100ms

    }, 300);

}

function lightenColor(color) {
    var el = document.getElementById(color);
    el.classList.add("lighten");
    tones[color].play();
    console.log("color: " + color + " brighten");
    lightOneColor = setTimeout(function() {
        el.classList.remove("lighten");
        console.log("color: " + color + " darken");
    }, 100);
}

function checkWin(colors) {
    console.log("test check win function");
    if (strictMode.getAttribute("value") === "on") {
        if (!playerIsRight) {
            //alert("you lose");
            console.log("you lose in strict mode");
            clearGame();
            // startGame();
        }
    } else {
        if (!playerIsRight) {
            //stop the generating and let the player re-enter pattern
            window[p]();
        }

    }
}

function playerInput() {
    tones.playerTurn.play(); //notify player's turn
    clickToggle();
    player = []; //reset each round;
    els.forEach(function(element) {
        element.onclick = function() {
            // console.log(element.id + " color is clicked");
            player.push(element.id);
            tones[element.id].play();

        }

    }, this);
    console.log("player input :" + player);
}

function match(colors) {

    //compare pattern

    if (colors.length == player.length && player.every(function(e, i) {
            return e === colors[i]
        })) {
        console.log("colors length: " + colors.length + "and player input length: " + player.length);
        playerIsRight = true;
        updateCount();
        //return true;
        console.log("right");
    } else {
        playerIsRight = false;
        clearTimeout()
        tones.fail.play();
        console.log("compare false");
        //return false;
    }


}


function clickToggle() {
    els.forEach(function(element) {
        element.classList.toggle("non-click");
    }, this);
}