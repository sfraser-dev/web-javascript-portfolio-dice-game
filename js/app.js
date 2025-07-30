// A simple two player dice game. The results of each round are stored in local
// storage ("database") in JSON format. The "database" is shown and updated on the
// page in real-time. The "database" will persist after browser close and computer
// shutdown - the game will continue from previous state on reactivation. The dice
// game continues on and on until the user resets the game and clears the "database"
// via a button click.

"use strict";

// Roll dice for player 1 and for player 2.
function rollTheDice(paragraphToAppend, diceImage1, diceImage2, headerTitle, statsObj, tableStats) {
    let p1Roll = getRolledDiceValue();
    let p2Roll = getRolledDiceValue();
    // Update the dice images.
    diceImage1.setAttribute("src", `images/dice${p1Roll}.png`);
    diceImage2.setAttribute("src", `images/dice${p2Roll}.png`);
    // Print who wins this round in the title (H1 element).
    const theWinner = printOutcomeOfDiceRollsToH1(p1Roll, p2Roll, headerTitle);
    // Append current dice rolls just made to the local storage database too.
    // The local storage key is a zero indexed array.
    // Roll 1 has index 0, roll 2 has index 1, roll 3 has index 2, etc.
    // So the length of local storage gives the next index to be used for insertion.
    const theLen = window.localStorage.length;
    // Add to local storage database in JSON format.
    window.localStorage.setItem(theLen,
        JSON.stringify({ "P1": p1Roll, "P2": p2Roll }));
    // Update the local storage database that is printed on the page.
    const theOutputHtml =
        `Round ${theLen + 1}, Player1: ${p1Roll}, Player2: ${p2Roll}<br>`;
    paragraphToAppend.innerHTML += theOutputHtml;
    // Get the current number of P1 wins, P2 wins and draws currently in the stats.
    let p1Wins = statsObj["p1Wins"];
    let p2Wins = statsObj["p2Wins"];
    let drawNumber = statsObj["draws"];
    // Increment the appropriate value based on the last dice roll.
    if (theWinner === 1) {
        p1Wins++;
    } else if (theWinner === 2) {
        p2Wins++;
    } else if (theWinner === 0) {
        drawNumber++;
    } else {
        console.log("winner error!");
    }
    // Update the statistics with the new result.
    statsObj["rounds"] = theLen + 1;
    statsObj["p1Wins"] = p1Wins;
    statsObj["p2Wins"] = p2Wins;
    statsObj["draws"] = drawNumber;
    updateTableStats(tableStats, statsObj["rounds"], statsObj["p1Wins"],
        statsObj["p2Wins"], statsObj["draws"]);
}

// Return a number between 1 and 6 (inclusive of 1 and 6).
function getRolledDiceValue() {
    const max = 6;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Determine winner of dice roll and update the H1 element with the result.
// Return 0 if it was a draw, return 1 if player1 won and return 2 if player2 won.
function printOutcomeOfDiceRollsToH1(p1, p2, headerTitle) {
    let retVal = -1;
    if (p1 > p2) {
        headerTitle.innerText = "Player 1 wins";
        retVal = 1;
    } else if (p2 > p1) {
        headerTitle.innerText = "Player 2 wins";
        retVal = 2;
    } else {
        headerTitle.innerText = "It's a draw";
        retVal = 0;
    }
    return retVal;
}

// Reset text, images and variables to default values and clear local storage.
function resetEverything(headerTitle, headerTitleOriginalText, diceImage1, diceImage2,
    paragraphToAppend, statsObj, tableStats) {
    // Reset the title text.
    headerTitle.innerText = headerTitleOriginalText;
    // Reset the statistics text.
    statsObj["rounds"] = 0;
    statsObj["p1Wins"] = 0;
    statsObj["p2Wins"] = 0;
    statsObj["draws"] = 0;
    updateTableStats(tableStats, statsObj["rounds"], statsObj["p1Wins"],
        statsObj["p2Wins"], statsObj["draws"]);
    // Reset the dice images.
    diceImage1.setAttribute("src", "./images/dice6.png");
    diceImage2.setAttribute("src", "./images/dice6.png");
    // Delete any printed database results from the screen.
    paragraphToAppend.innerHTML = "";
    // Clear the local storage "database".
    window.localStorage.clear();
    // window.location.reload();  // Reload the page.
}

// Initialise. If there is data in the "database", use that so we continue off from the previous
// state of the game. If there is no data in the "database", then start game from default state.
function init(paragraphToAppend, diceImage1, diceImage2, headerTitle,
    headerTitleOriginalText, statsObj, tableStats) {
    if (window.localStorage.length > 0) {
        // Local storage acts like an object which doesn't have order, need to order manually.
        let orderedArrVals = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            const val = window.localStorage.getItem(key);

            // Ignore keys like "theme", "user", etc.
            if (!/^\d+$/.test(key)) continue;

            try {
                const valueObj = JSON.parse(val);
                orderedArrVals[parseInt(key)] = valueObj;
            } catch (e) {
                console.warn(`Skipping invalid JSON at key=${key}`);
            }
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
            // Print ordered results to page.
            paragraphToAppend.innerHTML += theOutputHtml;
            // Stats counting.
            if (p1Val > p2Val) {
                p1WinCount++;
            } else if (p2Val > p1Val) {
                p2WinCount++;
            } else {
                drawCount++;
            }
        }
        // Print stats to the page.
        statsObj["rounds"] = orderedArrVals.length;
        statsObj["p1Wins"] = p1WinCount;
        statsObj["p2Wins"] = p2WinCount;
        statsObj["draws"] = drawCount;
        updateTableStats(tableStats, statsObj["rounds"], statsObj["p1Wins"],
            statsObj["p2Wins"], statsObj["draws"]);

        // Set the dice images to the last values in the database.
        const lastDiceRollP1 = orderedArrVals[orderedArrVals.length - 1]["P1"];
        const lastDiceRollP2 = orderedArrVals[orderedArrVals.length - 1]["P2"];
        diceImage1.setAttribute("src", `./images/dice${lastDiceRollP1}.png`);
        diceImage2.setAttribute("src", `./images/dice${lastDiceRollP2}.png`);
        // Print who won the last round of the game in the title (H1 element).
        printOutcomeOfDiceRollsToH1(lastDiceRollP1, lastDiceRollP2, headerTitle);
    }
    // Else there is no data in the database, default state for game.
    else {
        headerTitle.innerText = headerTitleOriginalText;
        diceImage1.setAttribute("src", "./images/dice6.png");
        diceImage2.setAttribute("src", "./images/dice6.png");
        statsObj["rounds"] = 0;
        statsObj["p1Wins"] = 0;
        statsObj["p2Wins"] = 0;
        statsObj["draws"] = 0;
        updateTableStats(tableStats, statsObj["rounds"], statsObj["p1Wins"],
            statsObj["p2Wins"], statsObj["draws"]);
    }
}

// Update the stats table.
function updateTableStats(tableStats, rounds, p1Wins, p2Wins, draws) {
    // Delete the second row as we are going to replace it with a new row.
    if (tableStats.rows.length > 1) {
        tableStats.deleteRow(1);
    }
    // Add a second row to the table.
    let row = tableStats.insertRow(1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerHTML = rounds;
    cell2.innerHTML = p1Wins;
    cell3.innerHTML = p2Wins;
    cell4.innerHTML = draws;
}

// Automatically show/hide the "back to top" button.
function backToTopScrollFunction(buttonBackToTop) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        buttonBackToTop.style.display = "block";
    } else {
        buttonBackToTop.style.display = "none";
    }
}

// When the user clicks on the "back to top" button, scroll to the top of the page.
function backToTopFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//---------- Main ----------//
// Grab the HTML elements.
const paragraphToAppend = document.getElementById("paragraph-to-append");
const buttonRoll = document.getElementById("button-roll");
const buttonReset = document.getElementById("button-reset");
const diceImage1 = document.getElementById("dice-image-1");
const diceImage2 = document.getElementById("dice-image-2");
const headerTitle = document.getElementById("header-title");
const tableStats = document.getElementById("table-stats");
const buttonBackToTop = document.getElementById("button-back-to-top");
const headerTitleOriginalText = headerTitle.innerHTML;

let statsObj = {
    "rounds": 0,
    "p1Wins": 0,
    "p2Wins": 0,
    "draws": 0,
};

init(paragraphToAppend, diceImage1, diceImage2,
    headerTitle, headerTitleOriginalText, statsObj, tableStats);

// Roll both dice by passing a function with parameters to eventListener
// via an anonymous function.
buttonRoll.addEventListener("click", function () {
    rollTheDice(paragraphToAppend, diceImage1, diceImage2, headerTitle, statsObj, tableStats);
});

// Reset the game by resetting the data and images.
// Pass a function with parameters to eventListener
// via an anonymous function.
buttonReset.addEventListener("click", function () {
    resetEverything(headerTitle, headerTitleOriginalText, diceImage1, diceImage2,
        paragraphToAppend, statsObj, tableStats);
});

// Scroll back to the top button.
buttonBackToTop.addEventListener("click", backToTopFunction);

// Automatcally show/hide the "back to top" button.
window.onscroll = function () { backToTopScrollFunction(buttonBackToTop); };
