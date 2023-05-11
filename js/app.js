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
// Return 0 if it was a draw, return 1 if player1 won and return 2 if player2 won.
function printOutcomeOfDiceRollsToH1(p1, p2) {
    let retVal = -1;
    if (p1 > p2) {
        theTitleElement.innerText = "player 1 wins"; 
        retVal = 1;
    } else if (p2 > p1) {
        theTitleElement.innerText = "player 2 wins"; 
        retVal = 2;
    } else {
        theTitleElement.innerText = "it's a draw"; 
        retVal = 0;
    }
    return retVal;
}

// Play a single round of the game (roll dice for player 1 and for player 2).
function playGame(diceImg1, diceImg2) {
    let p1Roll = rollTheDice();
    let p2Roll = rollTheDice();
    // Update the dice images.
    diceImg1.setAttribute("src", `images/dice${p1Roll}.png`);
    diceImg2.setAttribute("src", `images/dice${p2Roll}.png`);
    // Print who wins this round in the title (H1 element).
    const theWinner = printOutcomeOfDiceRollsToH1(p1Roll, p2Roll);
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
    // Update the statistics string. This string is in format: 
    // "Statistics: Player 1 wins: NUMBER, Player 2 wins NUMBER, Draws: NUMBER" 
    let arrOfStr1 = theParagraphStatsElement.innerText.split("Player 1 wins: ");
    let arrOfStr2 = arrOfStr1[1].split(", Player 2 wins: ");
    let p1Wins = arrOfStr2[0]; 
    arrOfStr1 = theParagraphStatsElement.innerText.split("Player 2 wins: ");
    arrOfStr2 = arrOfStr1[1].split(", Draws: ");
    let p2Wins = arrOfStr2[0];
    arrOfStr1 = theParagraphStatsElement.innerText.split("Draws: ");
    arrOfStr2 = arrOfStr1[1];
    let drawNumber = arrOfStr2[0];
    if (theWinner===1){
        p1Wins++;
    } else if (theWinner===2) {
        p2Wins++;
    } else if (theWinner===0) {
        drawNumber++;
    } else {
        console.log("winner error!");
    }
    theParagraphStatsElement.innerHTML = "Statistics: Player 1 wins: " + p1Wins +
        ", Player 2 wins: " + p2Wins + ", Draws: " + drawNumber; 
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
        // Local storage acts like an object which doesn't have order, need to order manually.
        let orderedArrVals = new Array(window.localStorage.length).fill(0);
        for (let i = 0; i < window.localStorage.length; i++) {
            // Get the key/value pairs from local storage. The key is a counter and values are JSON data.
            const key = window.localStorage.key(i);
            const valueObj = JSON.parse(window.localStorage.getItem(key));
            orderedArrVals[key] = valueObj;
        }
        // Print ordered results database to page and calculate stats.
        let p1WinCount = 0;
        let p2WinCount = 0;
        let drawCount = 0;
        for (let i = 0; i < orderedArrVals.length; i++) {
            const p1Val = orderedArrVals[i]["P1"];
            const p2Val = orderedArrVals[i]["P2"];
            const theOutputHtml =
                `Round ${i + 1}, Player1: ${p1Val}, Player2: ${p2Val}<br>`;
            // Print to page.
            theParagraphDbElement.innerHTML += theOutputHtml;
            if (p1Val > p2Val) {
                p1WinCount++;
            } else if (p2Val > p1Val) {
                p2WinCount++;
            } else {
                drawCount++;
            }
        }
        // Print stats to the page. MUST KEEP THIS FORMAT as it's updated later via string split().
        theParagraphStatsElement.innerHTML = "Statistics: Player 1 wins: " + p1WinCount + ", Player 2 wins: " +
            p2WinCount + ", Draws: " + drawCount;
        // Set the dice images to the last values in the database.
        const lastDiceRollP1 = orderedArrVals[orderedArrVals.length-1]["P1"];
        const lastDiceRollP2 = orderedArrVals[orderedArrVals.length-1]["P2"];
        diceImagePlayer1.setAttribute("src", `./images/dice${lastDiceRollP1}.png`);
        diceImagePlayer2.setAttribute("src", `./images/dice${lastDiceRollP2}.png`);
        // Print who won the last round of the game in the title (H1 element).
        printOutcomeOfDiceRollsToH1(lastDiceRollP1, lastDiceRollP2);
    }
    // Else there is no data in the database, default state for game.
    else {
        theTitleElement.innerText = theTitleOriginalText;
        diceImagePlayer1.setAttribute("src", "./images/dice6.png");
        diceImagePlayer2.setAttribute("src", "./images/dice6.png");
    }
}

// Reset text, images and variables to default values and clear local storage.
function resetEverything() {
    // Reset the title text.
    theTitleElement.innerText = theTitleOriginalText;
    // Reset the statistics text.
    theParagraphStatsElement.innerHTML = theStatsOriginalText;
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
const theParagraphStatsElement = document.getElementById("pStats");
const theTitleOriginalText = theTitleElement.innerHTML;
const theStatsOriginalText = theParagraphStatsElement.innerHTML;

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