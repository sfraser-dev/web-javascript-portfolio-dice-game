// A simple two player dice game. The results of each round are stored in local 
// storage ("database") in JSON format. The user can print the "database" to screen.
// The user can also simultaneously reset the game and clear the "database".
// UPDATE THIS - THIS NEEDS CHANGED **********************

"use strict";

// Return a number between 1 and 6 (inclusive of 1 and 6).
function rollTheDice() {
    const max = 6;
    const min = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Determine winner of dice roll round and update h1 element with the result.
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
    // For each round, add the dice values of each player (in JSON format) to local storage.
    // window.localStorage.setItem(statusObj["roll counter"]++,
    //     JSON.stringify({ "P1": p1Roll, "P2": p2Roll }));

    // Append current dice rolls to the pDatabase too
    // Get the last key in DB
    const theLen = window.localStorage.length;
    
    window.localStorage.setItem(theLen,
        JSON.stringify({ "P1": p1Roll, "P2": p2Roll }));

    const theOutputHtml =
        `Round ${theLen}, Player1: ${p1Roll}, Player2: ${p2Roll}<br>`;
    theParagraphDbElement.innerHTML += theOutputHtml;
    // showResultsDatabase(statusObj);
}

// Get data from local storage and show it on the page.
//function showResultsDatabase(statusObj) {
// // Alert user if attempting to see updated database without there being any more dice rolls. 
// if (window.localStorage.length === statusObj["previous db length"]) {
//     alert("No new dice rolls have been added to the database since the last check.");
// }
// statusObj["previous db length"] = window.localStorage.length;

// // If there is already database info printed on the page, change the button's text.
// if (window.localStorage.length > 0) {
//     let showDbBtn = document.getElementsByClassName("btnDatabase")[0];
//     showDbBtn.innerHTML = "🛢 Show new dice rolls in updated database";
// }

// // Need to delete any previously shown results (or they will just concatenate).
// deleteResultsDatabaseFromScreen("resultsDatabase");

// Local storage acts like an object which doesn't have order, need to order manually.
// let orderedArrVals = new Array(window.localStorage.length).fill(0);
// for (let i = 0; i < window.localStorage.length; i++) {
//     // Get the key/value pairs from local storage. The key is a counter and values are JSON data.
//     const key = window.localStorage.key(i);
//     const valueObj = JSON.parse(window.localStorage.getItem(key));
//     orderedArrVals[key] = valueObj;
// }
// // Print ordered results database to page.
// for (let i = 0; i < orderedArrVals.length; i++) {
//     const newParagraph = document.createElement("p");
//     newParagraph.setAttribute("class", "resultsDatabase");
//     const theOutputText =
//         `Round ${i + 1}, Player1: ${orderedArrVals[i]["P1"]}, Player2: ${orderedArrVals[i]["P2"]}`;
//     newParagraph.innerText = theOutputText;
//     document.body.append(newParagraph);
// }
// // scroll to bottom of the page (to easily see new database entries)
// window.scrollTo(0, document.body.scrollHeight);
// }

// Remove results database from page.
// function deleteResultsDatabaseFromScreen(className) {
//     const elements = document.getElementsByClassName(className);
//     while (elements.length > 0) {
//         elements[0].parentNode.removeChild(elements[0]);
//     }
// }

// Show/hide the "back to top" button.
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

// When the user clicks on the "back to top" button, scroll to the top of the page. 
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function init() {
    if (window.localStorage.length > 0) {
        let lastDiceRollP1;
        let lastDiceRollP2;
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
            // const newParagraph = document.createElement("p");
            // newParagraph.setAttribute("class", "resultsDatabase");
            // const pDb = document.getElementById("pDatabase");
            const theOutputHtml =
                `Round ${i + 1}, Player1: ${orderedArrVals[i]["P1"]}, Player2: ${orderedArrVals[i]["P2"]}<br>`;
            theParagraphDbElement.innerHTML += theOutputHtml;
            lastDiceRollP1 = orderedArrVals[i]["P1"];
            lastDiceRollP2 = orderedArrVals[i]["P2"];
        }
        // Set dice to the last values in the database
        diceImagePlayer1.setAttribute("src", `./images/dice${lastDiceRollP1}.png`);
        diceImagePlayer2.setAttribute("src", `./images/dice${lastDiceRollP2}.png`);
        // Print who wins this round in the title (h1 element).
        printOutcomeOfDiceRollsToH1(lastDiceRollP1, lastDiceRollP2);
        // Scroll to bottom of the page (to easily see new database entries).
        window.scrollTo(0, document.body.scrollHeight);
    }
    // Else there is no data in the database.
    else {
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
    // Reset the database button text.
    databaseBtn.innerHTML = databaseBtnOriginalText;
    // Delete any printed database results from the screen and clear the database.
    // deleteResultsDatabaseFromScreen("pDatabase");
    theParagraphDbElement.innerHTML = ""; 
    window.localStorage.clear();
    // window.location.reload();  // Reload the page.
    // Reset the status object parameters.
    // statusObj["roll counter"] = 0;
    // statusObj["previous db length"] = 0;
}

//----- Main
// Grab the HTML elements.
const diceImagePlayer1 = document.getElementsByClassName("img1")[0];
const diceImagePlayer2 = document.getElementsByClassName("img2")[0];
const rollBtn = document.getElementsByClassName("btnRoll")[0];
const resetBtn = document.getElementsByClassName("btnReset")[0];
const databaseBtn = document.getElementsByClassName("btnDatabase")[0];
const databaseBtnOriginalText = databaseBtn.innerHTML;
const backToTopBtn = document.getElementsByClassName("btnBackToTop")[0];
const theTitleElement = document.getElementById("title");
const theParagraphDbElement = document.getElementById("pDatabase");
const theTitleOriginalText = theTitleElement.innerHTML;
const statusObj = { "roll counter": 0, "previous db length": 0 };

init();

// Start afresh.
//resetEverything();

// Roll both dice by passing a function with parameters to eventListener via an anonymous function.
rollBtn.addEventListener("click", function () {
    playGame(diceImagePlayer1, diceImagePlayer2);
});

// Button to show dice throw results database.
// databaseBtn.addEventListener("click", function () { showResultsDatabase(statusObj); });

// Scroll back to the top button
backToTopBtn.addEventListener("click", topFunction);

// Reset the game by resetting the data and images.
resetBtn.addEventListener("click", resetEverything);

// Show/hide the "back to top" button.
window.onscroll = function () { scrollFunction(); };