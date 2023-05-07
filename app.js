"use strict";

// Return a number between 1 and 6 (inclusive of 1 and 6).
function rollTheDice() {
    const max = 6;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Determine which player wins (or if it's a draw) and update h1 element with the result.
function printOutcomeOfDiceRolls(p1, p2) {
    const theTitle = document.getElementById("title");
    let text="";
    if (p1 > p2) {
        text="player 1 wins";
    }
    else if (p2 > p1) {
        text="player 2 wins";
    }
    else {
        text="it's a draw";
    }
    theTitle.innerText = text;
}

const player1dice = document.getElementsByClassName("img1");
const player2dice = document.getElementsByClassName("img2");
const paragraphClickToRoll = document.getElementById("pRoll");

let p1Roll = rollTheDice();
let p2Roll = rollTheDice();
player1dice[0].setAttribute("src", `images/dice${p1Roll}.png`);
player2dice[0].setAttribute("src", `images/dice${p2Roll}.png`);
printOutcomeOfDiceRolls(p1Roll, p2Roll);