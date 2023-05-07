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
    // Print who wins this round in the title (h1 heading).
    printOutcomeOfDiceRolls(p1Roll, p2Roll, titleElement);
    // For each round, store the dice values of each player in JSON format.
    window.localStorage.setItem(ROLL_COUNTER++, JSON.stringify({ "P1": p1Roll, "P2": p2Roll }));
}

// Get data from local storage and show it on the page.
function showResultsDatabase() {
    if (window.localStorage.length > 0) {
        let showDbBtn = document.getElementsByClassName("btnDatabase")[0];
        showDbBtn.innerHTML = "Update results database with new values";
    }
    // Need to delete any previously shown results (or they will just concatenate).
    deleteHistoricalResults("resultsDatabase");
    // Local storage acts like an object which doesn't have order, need to order manually.
    let orderedArrVals = new Array(window.localStorage.length).fill(0);
    for (let i = 0; i < window.localStorage.length; i++) {
        // Get the key/value pairs from local storage. The key is a counter and values are JSON data.
        const key = window.localStorage.key(i);
        const valueObj = JSON.parse(window.localStorage.getItem(key));
        orderedArrVals[key] = valueObj;
    }
    // Put ordered historical results onto page.
    for (let i = 0; i < orderedArrVals.length; i++) {
        const newParagraph = document.createElement("p");
        newParagraph.setAttribute("class", "resultsDatabase");
        const theOutputText = 
            `Round ${i+1}, Player1: ${orderedArrVals[i]["P1"]}, Player2: ${orderedArrVals[i]["P2"]}`;
        newParagraph.innerText = theOutputText;
        document.body.appendChild(newParagraph);
    }
}

// Remove historical results printed to screen as paragraphs.
function deleteHistoricalResults(className) {
    const histElements = document.getElementsByClassName(className);
    while (histElements.length > 0) {
        histElements[0].parentNode.removeChild(histElements[0]);
    }
}

// Get the HTML elements by class name and ID.
const diceImagePlayer1 = document.getElementsByClassName("img1")[0];
const diceImagePlayer2 = document.getElementsByClassName("img2")[0];
const rollBtn = document.getElementsByClassName("btnRoll")[0];
const resetBtn = document.getElementsByClassName("btnReset")[0];
const historyBtn = document.getElementsByClassName("btnDatabase")[0];
const theTitleElement = document.getElementById("title");
const theTitleOriginalText = theTitleElement.innerHTML;
let ROLL_COUNTER = 0;

// Roll both dice by passing a function with parameters to eventListener via an anonymous function.
rollBtn.addEventListener("click", function () {
    playGame(diceImagePlayer1,
        diceImagePlayer2, theTitleElement);
});

// Show dice throw historical results 
historyBtn.addEventListener("click", showResultsDatabase);

// Reset the game by resetting the data and images.
resetBtn.addEventListener("click", () => {
    // This arrow function is restting variables which must be declared beforehand.
    theTitleElement.innerText = theTitleOriginalText;
    diceImagePlayer1.setAttribute("src", "./images/dice6.png");
    diceImagePlayer2.setAttribute("src", "./images/dice6.png");
    window.localStorage.clear();
    ROLL_COUNTER = 0;
    deleteHistoricalResults("resultsDatabase");
});