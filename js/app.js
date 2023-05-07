"use strict";

// Return a number between 1 and 6 (inclusive of 1 and 6).
function rollTheDice() {
    const max = 6;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Determine which player wins (or if it's a draw) and update h1 element with the result.
function printOutcomeOfDiceRolls(p1, p2, titleElement) {
    let text = "";
    if (p1 > p2) {
        text = "player 1 wins";
    }
    else if (p2 > p1) {
        text = "player 2 wins";
    }
    else {
        text = "it's a draw";
    }
    titleElement.innerText = text;
}

// Play a sigle round of the game (roll dice for player 1 and player 2).
function playGame(diceImg1, diceImg2, titleElement) {
    let p1Roll = rollTheDice();
    let p2Roll = rollTheDice();
    diceImg1.setAttribute("src", `images/dice${p1Roll}.png`);
    diceImg2.setAttribute("src", `images/dice${p2Roll}.png`);
    printOutcomeOfDiceRolls(p1Roll, p2Roll, titleElement);
}

// Get the HTML elements by class name and ID.
const diceImagePlayer1 = document.getElementsByClassName("img1")[0];
const diceImagePlayer2 = document.getElementsByClassName("img2")[0];
const rollBtn = document.getElementsByClassName("btnRoll")[0];
const resetBtn = document.getElementsByClassName("btnReset")[0];
const theTitleElement = document.getElementById("title");
const theTitleOriginalText = theTitleElement.innerHTML;

// Roll both dice by passing a function with parameters to eventListener via an anonymous function.
rollBtn.addEventListener("click", function (){playGame(diceImagePlayer1, 
    diceImagePlayer2, theTitleElement);});

// Reset the game by reloading the page.
resetBtn.addEventListener("click", () => {
    // This arrow function is using global variables which must be declared beforehand.
    theTitleElement.innerText=theTitleOriginalText;
    diceImagePlayer1.setAttribute("src", "./images/dice6.png");
    diceImagePlayer2.setAttribute("src", "./images/dice6.png");
});