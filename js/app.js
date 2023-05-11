// A simple two player dice game. The results of each round are stored in local 
// storage ("database") in JSON format. The "database" is shown and updated on the
// page in real-time. The "database" will persist after browser close and computer
// shutdown - the game will continue from previous state on reactivation. The dice
// game continues on and on until the user resets the game and clears the "database"
// via a button click. 

"use strict";

// Return a number between 1 and 6 (inclusive of 1 and 6).
function rollTheDice() {
    const max = 6;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Determine winner of dice roll round and update the H1 element with the result.
function printOutcomeOfDiceRollsToH1(p1, p2) {
    theTitleElement.innerText = (p1 > p2) ? "player 1 wins" : ((p2 > p1) ? "player 2 wins" : "it's a draw");
}

// Play a single round of the game (roll dice for player 1 and player 2).
function playGame(diceImg1, diceImg2) {
    let p1Roll = rollTheDice();
    let p2Roll = rollTheDice();
    // Update the dice images.
    diceImg1.setAttribute("src", `images/dice${p1Roll}.png`);
    diceImg2.setAttribute("src", `images/dice${p2Roll}.png`);
    // Print who wins this round in the title (h1 element).
    printOutcomeOfDiceRollsToH1(p1Roll, p2Roll);
    // Append current dice rolls just made to the local storage database too.
    // The local storage key is essentially a zero indexed array.
    // Roll 1 has index 0, roll 2 has index 1, roll 3 has index 2, etc.
    // So the length of local storage gives the next index to be used for insertion.
    const theLen = window.localStorage.length;
    // Add to local storage database in JSON format.
    window.localStorage.setItem(theLen,
        JSON.stringify({ "P1": p1Roll, "P2": p2Roll }));
    // Update the local storage database that is printed on the page.
    const theOutputHtml =
        `Round ${theLen+1}, Player1: ${p1Roll}, Player2: ${p2Roll}<br>`;
    theParagraphDbElement.innerHTML += theOutputHtml;
}

// Automatically show/hide the "back to top" button.
function backToTopScrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

// When the user clicks on the "back to top" button, scroll to the top of the page. 
function backToTopFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Initialise. If there is data in the "database", use that so we continue off from the previous
// state of the game. If there is no data in the "database", then start game from default state.
function init() {
    if (window.localStorage.length > 0) {
        let lastDiceRollP1 = -1;
        let lastDiceRollP2 = -1;
        // Local storage acts like an object which doesn't have order, need to order manually.
        let orderedArrVals = new Array(window.localStorage.length).fill(0);
        for (let i = 0; i < window.localStorage.length; i++) {
            // Get the key/value pairs from local storage. The key is a counter and values are JSON data.
            const key = window.localStorage.key(i);
            const valueObj = JSON.parse(window.localStorage.getItem(key));
            orderedArrVals[key] = valueObj;
        }
        // Print ordered results database to page.
        for (let i = 0; i < orderedArrVals.length; i++) {
            const theOutputHtml =
                `Round ${i + 1}, Player1: ${orderedArrVals[i]["P1"]}, Player2: ${orderedArrVals[i]["P2"]}<br>`;
            // Print to page.
            theParagraphDbElement.innerHTML += theOutputHtml;
            lastDiceRollP1 = orderedArrVals[i]["P1"];
            lastDiceRollP2 = orderedArrVals[i]["P2"];
        }
        // Set the dice images to the last values in the database.
        diceImagePlayer1.setAttribute("src", `./images/dice${lastDiceRollP1}.png`);
        diceImagePlayer2.setAttribute("src", `./images/dice${lastDiceRollP2}.png`);
        // Print who wins this round in the title (h1 element).
        printOutcomeOfDiceRollsToH1(lastDiceRollP1, lastDiceRollP2);
        // Scroll to bottom of the page (to easily see new database entries).
        window.scrollTo(0, document.body.scrollHeight);
    }
    // Else there is no data in the database, default state for game.
    else {
        theTitleElement.innerText = "The Dice Game";
        diceImagePlayer1.setAttribute("src", "./images/dice6.png");
        diceImagePlayer2.setAttribute("src", "./images/dice6.png");
    }
}

// Reset text, images and variables to default values and clear local storage.
function resetEverything() {
    // Reset the title text.
    theTitleElement.innerText = theTitleOriginalText;
    // Reset the dice images.
    diceImagePlayer1.setAttribute("src", "./images/dice6.png");
    diceImagePlayer2.setAttribute("src", "./images/dice6.png");
    // Delete any printed database results from the screen.
    theParagraphDbElement.innerHTML = ""; 
    // Clear the local storage "database".
    window.localStorage.clear();
    // window.location.reload();  // Reload the page.
}

// Automatcally show/hide the "back to top" button.
window.onscroll = function () { backToTopScrollFunction(); };

//----- Main -----//

// Grab the HTML elements.
const diceImagePlayer1 = document.getElementsByClassName("img1")[0];
const diceImagePlayer2 = document.getElementsByClassName("img2")[0];
const rollBtn = document.getElementsByClassName("btnRoll")[0];
const resetBtn = document.getElementsByClassName("btnReset")[0];
const backToTopBtn = document.getElementsByClassName("btnBackToTop")[0];
const theTitleElement = document.getElementById("title");
const theParagraphDbElement = document.getElementById("pDatabase");
const theTitleOriginalText = theTitleElement.innerHTML;

// Initialise game state.
init();

// Roll both dice by passing a function with parameters to eventListener via an anonymous function.
rollBtn.addEventListener("click", function () {
    playGame(diceImagePlayer1, diceImagePlayer2);
});

// Scroll back to the top button
backToTopBtn.addEventListener("click", backToTopFunction);

// Reset the game by resetting the data and images.
resetBtn.addEventListener("click", resetEverything);
