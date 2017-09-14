"use strict"

/* Global variable */
var display = document.getElementById("digital-display");
var count = document.getElementById("digital-display").getAttribute("value");
var correct = true; // use to track user correct choice
const whichPart = ['green', 'red', 'yellow', 'blue'];
const tones = {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
};
var generating = 0; // use to track reset the game when user click off

function toggle() {
    var slider = document.getElementById("slider");
    var status = slider.getAttribute("value"); // on or off
    var turn = status === "off" ? "on" : "off";
    var turnOn = status === "off" ? true : false;

    slider.style.cssFloat = turnOn === true ? "right" : "left"; //slide the toggle
    slider.setAttribute("value", turn);

    var reset = turnOn === true ? startGame() : clearGame();
}

function startGame() {
    display.innerText = "- -";
    document.getElementById("start-btn").onclick = function() {
        document.getElementById("start-btn").style.pointerEvents = "none";
        var simon = new game();
        simon.start();
        count = 0;
    }

}

function clearGame() {
    document.getElementById("start-btn").style.pointerEvents = "auto";
    document.getElementById("start-btn").onclick = function() {
        alert("please turn on game");
    }
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
    this.strictMode = false;
    this.getStrict = function() {
        return this.strictMode;
    };
    this.getStatus = function() {
        return this.isOn;
    };
    this.restart = function() {
        this.reset = true;
    }
    this.setStrictMode = function() {
        this.strictMode = true;
    }
    this.getCount = function() {
        return this.count;
    }
    var simonPattern = [];
    this.player = [];

    this.start = function() {

        generateMove();

        function generateMove() {
            var t_pattern = 2000;
            generating = setInterval(function() {
                var move = { step: 0, colors: [] };
                for (var i = 0; i <= count; i++) {
                    var color = whichPart[(Math.floor(Math.random() * 4))];
                    move.colors.push(color);
                }
                move.step = count;
                simonPattern.push(move);
                console.log(move);
                count++;
                if (count === 6) {
                    clearInterval(generating);
                }

                lighten(move.colors);
                updateCount();
                console.log("count is update: " + count);
                /*setTimeout(function() {
                    darkenColor(move.colors);
                }, 400);*/
            }, t_pattern += 2000);
        }

    }
}

function lighten(colors) {
    var i = 0;
    var queue = setInterval(function() {
        lightenColor(colors[i]);
        i++;
        if (i >= colors.length) {
            clearInterval(queue);
        }
    }, 800);
}

function lightenColor(element) {
    document.getElementById(element).style.filter = "brightness(110%)";
    makeSound(element);
    console.log("color: " + element + " brighten");
    setTimeout(function() {
        document.getElementById(element).style.filter = "brightness(70%)";
        console.log("color: " + element + " darken");
    }, 300);
}

function makeSound(el) {
    tones[el].play();
}