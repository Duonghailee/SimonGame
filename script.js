"use strict"

/* Global variable */
var display = document.getElementById("digital-display");
var count = document.getElementById("digital-display").getAttribute("value");
var correct = true; // use to track user correct choice
var gameStatus = "off"; // use to track game is on/off
var strictMode = document.getElementById("strictMode"); //this variable tracks the strict mode on/off

const whichPart = ['green', 'red', 'yellow', 'blue'];
const tones = {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    playerTurn: new Audio('http://soundjax.com/reddo/40725%5EDING1.mp3'),
    fail: new Audio('http://soundjax.com/reddo/76527%5Eerror.mp3')
};
var generating = 0; // use to track reset the game when user click off
var player = [];
var playerIsRight = true; //use to track the game status, if player is on winning 

var nodes = document.getElementsByClassName("quarter");
var els = [].slice.call(nodes);

/* this function turn on / off the game */
function toggle() {
    var slider = document.getElementById("slider");
    var status = slider.getAttribute("value"); // on or off
    var turn = status === "off" ? "on" : "off";
    gameStatus = turn; // this varible pass the game status: on/off to the start button
    slider.style.cssFloat = turn === "on" ? "right" : "left"; //slide the toggle
    slider.setAttribute("value", turn);
    //console.log("status now is: " + gameStatus);
    if (turn === "off") {
        clearGame();
    }

}

/* this funct enable/disable strict mode */
function setStrict() {

    strictMode.setAttribute("value", strictMode.getAttribute("value") === "off" ? "on" : "off");
    strictMode.classList.toggle("lighten");
    // console.log("strictmode is: " + strictMode.getAttribute("value"));
}

function startGame() {
    if (gameStatus === "on") {
        //this funct helps blinking the - - in the display panel
        clearGame(); //clear the last played game first;
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
        if (playerIsRight) {

            var t_pattern = 2000;

            generating = setInterval(function() {

                var color = whichPart[(Math.floor(Math.random() * 4))];
                move.colors.push(color);

                move.step = count;
                simonPattern.push(move);
                console.log(move);
                count++;
                lighten(move.colors);
                console.log(move.colors);



            }, t_pattern += 2000);
        }
    }


}

function lighten(colors) {
    var i = 0;
    var queue = setInterval(function() {
        lightenColor(colors[i]);
        setTimeout(function() {
            i++;
            if (i >= colors.length) {
                clearInterval(queue); //lighten and darken a set of colors has finished
                //now is player turn, 
                updateCount();
                tones.playerTurn.play(); //notify player's turn
                console.log("player's turn");
                checkWin(colors);

            }
        }, 300); //300ms because it let the lightColor finished first, which takes about 100ms

    }, 1000);
}

function lightenColor(color) {
    var el = document.getElementById(color);
    el.classList.add("lighten");
    tones[color].play();
    console.log("color: " + color + " brighten");
    setTimeout(function() {
        el.classList.remove("lighten");
        console.log("color: " + color + " darken");
    }, 200);
}

function checkWin(colors) {
    console.log("test check win function");
    if (!match(colors)) {
        if (strictMode.getAttribute("value") === "on") {
            console.log("you lose");
            clearGame();
            tones.fail.play();
        }
        /*else {
                   setTimeout(function() {

                   }, 1000); // not in strict mode
                   if (match(colors)) {
                       console.log("congrat, you can continue");
                   } else {

                   }
                   console.log("please try again");
               } */
    } else {
        console.log("player click the right pattern");
    }
}

function match(colors) {
    player = []; //reset each round;
    els.forEach(function(element) {
        element.onclick = function() {
            // console.log(element.id + " color is clicked");
            player.push(element.id);
            tones[element.id].play();
            console.log("player input :" + player);
        }

    }, this);


    //compare pattern
    if (colors.length == player.length && player.every(function(e, i) {
            return e === colors[i]
        })) {
        console.log("colors length: " + colors.length + "and player input length: " + player.length);
        return true;
        console.log("right");
    } else {
        console.log("compare false");
        return false;
    }
}