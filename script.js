"use strict"

/* Global variable */
var display = document.getElementById("digital-display");
var count = document.getElementById("digital-display").getAttribute("value");



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
    var simon = new game();
    display.innerText = "- -";
}

function clearGame() {
    count = "";
    display.innerHTML = count;

}

// game Object
function game() {
    this.isOn = false;
    this.whichPart = ['green', 'red', 'yellow', 'blue'];
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
    this.player = [];
    this.tones = {
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    };
}