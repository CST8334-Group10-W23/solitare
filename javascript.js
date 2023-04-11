// JavaScript file

/* jslint es6:true */
/* eslint-env es6 */
/* eslint-disable */

// Array of suits
const suits = ["hearts", "diamonds", "spades", "clubs"];
// Array of values
const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

// Whether Vegas Mode is on or off
var vegasMode = false;

// Vegas mode button
function startVegas() {
    sessionStorage.setItem("vegas", "true");
    document.location.reload();
}

// Checks if Vegas mode is in effect every window reload
window.onload = function() {
    var vegas = sessionStorage.getItem("vegas");
    if (vegas) {
        sessionStorage.removeItem("vegas");
        // Enable vegasMode global to alter scoring rules
        vegasMode = true;
        // Visual indication of Vegas Mode
        document.body.style.backgroundImage = "url(images/table-background-vegas.jpg)"
    }
}

function createDeck() {
  // Class deck represents a deck of cards
  class Deck {
    constructor() {
      this.deck = [];
      this.reset();
    }

    //Create a deck of cards
    reset() {
      this.deck = [];
      for (let suit of suits) {
        for (let value of values) {
          this.deck.push(`${value}_of_${suit}`);
        }
      }
      return this;
    }

    //Shuffle the deck of cards
    shuffle() {
      let currentIndex = this.deck.length,
        temporaryValue,
        randomIndex;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = this.deck[currentIndex];
        this.deck[currentIndex] = this.deck[randomIndex];
        this.deck[randomIndex] = temporaryValue;
      }
      return this;
    }
  }
  const deck = new Deck();
  deck.shuffle().deck;
  return deck;
}

// Create a new deck of cards
const deck = createDeck();

class SolitaireScoring {
  constructor(options = { scores: { foundation: 10, deal: 5, rowToRow: 5, suitToRow: -15, win: 100 } }) {
    this.scores = options.scores;
    this.display = document.getElementById("score");
    this.score = 0;
  }

  // Add points to the score.
  addScore(points) {
    this.score += points;
    this.display.innerText = this.score;
    this.lastScore = points;
  }

  // Called when a card is dealt from the deck.
  deal() {
    // Add the deal score to the score.
    this.addScore(this.scores.deal);
  }

  // Called when a card is moved to the foundation.
  foundation() {
    // Add the foundation score to the score.
    this.addScore(this.scores.foundation);
  }

  rowToRow() {
    this.addScore(this.scores.rowToRow);
  }

  suitToRow() {
    this.addScore(this.scores.suitToRow);
  }

  undo() {
    this.addScore(-this.lastScore);
  }

  // Called when the game is won.
  win() {
    // Add the win score to the score.
    this.addScore(this.scores.win);
  }
}

const scoringSystem = new SolitaireScoring();

// stock pile
const stock = stockPile();

// tableau piles
const tableau = [[], [], [], [], [], [], []];

// identify tableau pile id
let tableauPileId = 0;

// foundation piles
const foundation = [[], [], [], []];

// waste pile
const waste = [];

// check if king
let isKing = false;

// setup the tableau / deal cards
setupGame();

// setup tableau
function setupGame() {
  for (let tableauArrayIndex = 0; tableauArrayIndex < 7; tableauArrayIndex++) {
    tableauPileId = tableauArrayIndex + 1;
    dealCards(tableauArrayIndex);
    displayBottomCards(tableauArrayIndex, tableauPileId);
    displayTopCard(tableauArrayIndex, tableauPileId);
    layerSetup();
  }
}

// displays back image of bottom cards from the tableau piles
function displayBottomCards(tableauArrayIndex, tableauPileId) {
  // any tableau piles with more than one card
  if (tableau[tableauArrayIndex].length > 1) {
    // first loop
    // "a" identifies the card position in the array
    for (let a = 0; a < tableau[tableauArrayIndex].length - 1; a++) {
      // second loop
      // "b" identifies the tableau card id
      for (let b = 1; b < tableau[tableauArrayIndex].length; b++) {
        document.getElementById("tableau-" + tableauPileId + "-" + b).src = tableau[tableauArrayIndex][a].backImage;
        document.getElementById("tableau-" + tableauPileId + "-" + b).style.display = "";
      }
    }
  }
}

// displays front image of top cards from the tableau piles
function displayTopCard(tableauArrayIndex, tableauPileId) {
  try {
    document.getElementById("tableau-" + tableauPileId + "-" + tableauPileId).src = tableau[tableauArrayIndex][tableau[tableauArrayIndex].length - 1].frontImage;
    document.getElementById("tableau-" + tableauPileId + "-" + tableauPileId).style.display = "";
  } catch (err) {
    // displays nothing as the img src if the tableau pile is 0
    document.getElementById("tableau-" + tableauPileId + "-" + tableauPileId).style = "none";
    document.getElementById("tableau-" + tableauPileId + "-" + tableauPileId).style.zIndex = "-1";
  }
}

// loops through tableau piles from left to right
// and places cards into tableau piles
function dealCards(tableauArrayIndex) {
  // loops through piles
  for (let i = tableauArrayIndex; i < 7; i++) {
    // place card into tableau pile
    tableau[i].push(stock[stock.length - 1]);

    // remove card from stock pile
    stock.pop();
  }
}

// create card objects from the deck
function setCard(deck) {
  // take the last card from the deck and gather details
  value = deck.deck[deck.deck.length - 1].split("_")[0];
  suit = deck.deck[deck.deck.length - 1].split("_")[2];
  frontImage = "images/" + deck.deck[deck.deck.length - 1] + ".png";

  // diamonds or hearts is a red card color
  if (suit == "diamonds" || suit == "hearts") {
    color = "red";
  }
  // spades and clubs is a black card color
  else {
    color = "black";
  }

  // create card object with the details
  let card = {
    value: value,
    suit: suit,
    color: color,
    frontImage: frontImage,
    backImage: "images/deck_backing.jpg",
  };

  // remove the last card from the deck
  deck.deck.pop();

  // return the card object
  return card;
}

// turn deck into the stock pile
function stockPile() {
  // an array for the stock
  const stock = [];

  // loop through all the cards in the deck
  for (let i = 0; i < 52; i++) {
    // make each card into a card object
    let card = setCard(deck);

    // put the card object into the stock array
    stock.push(card);
  }
  // return the stock array
  return stock;
}

// move most front card of tableau pile to another pile
function moveTableauCard(moveFrom, moveTo, moveCard) {
  let moveToColor, moveFromColor;

  // try to retrieve color from top card of moveFrom pile
  try {
    //        moveFromColor = tableau[moveFrom][tableau[moveFrom].length-1].color;
    moveFromColor = moveCard.color;
  } catch (err) {
    // catch if there is no card (empty pile)
    moveFromColor = null;
  }

  // try to retrieve color from top card of moveTo pile
  try {
    moveToColor = tableau[moveTo][tableau[moveTo].length - 1].color;
  } catch (err) {
    // catch if there is no card (empty tableau pile)
    moveToColor = null;
  }

  // avoid dropping on the same tableau pile
  if (tableau[moveTo] === moveFrom) {
    //        alert("Cannot drop a card on same pile");
    //        console.log("Cannot drop on same pile");
  }

  // card colors are the same, display alert
  else if (moveToColor == moveFromColor) {
    //        alert("Cannot move card! \nStacking cards on a tableau pile must be of alternating colors");
    //        console.log("Must be alternating color");
  }

  // spare tableau spots can only be filled with kings
  else if (tableau[moveTo].length === 0) {
    isKing = true;
    fillTableauSpot(moveFrom, moveTo);
  }

  // checks if the tableau card exists
  // avoids undefined objects being moved to tableau piles
  else if (moveFrom.length === 0) {
    //        alert("Cannot move a card from a pile that has no card to move");
    //        console.log("No card in pile");
  }

  // cards can only be stacked in the proper order
  else if (checkOrder(moveCard, moveTo)) {
    //        alert("Cards can only be stacked in descending order.\nKing, Queen, Jack, 10, 9, 8, 7, 6, 5, 4, 3, 2, Ace");
    //        console.log("Not in correct order");
  }

  // card colors are not the same, proceed
  else {
    // move card from one array pile to another
    if (whatClass[0] === "card") {
      movePile(moveFrom, moveTo);    
        
      for (let i = cardRow; i < pileLength; i++) {
        // moved from
        moveHistory[0][moveHistory[0].length] = tempHistory[0].pop();
        // move to
        moveHistory[1][moveHistory[1].length] = tempHistory[1].pop();
        // card
        moveHistory[2][moveHistory[2].length] = tempHistory[2].pop();
        // discovered check
        moveHistory[3][moveHistory[3].length] = tempHistory[3].pop();
        // movePileLength
        moveHistory[4][moveHistory[4].length] = tempHistory[4].pop();
      }
    } else {
      tableau[moveTo][tableau[moveTo].length] = moveFrom.pop();
      updateDisplay(moveFrom, moveTo);

      // identify the tableau row
      let tableauRow = document.getElementById("tableau" + (moveTo + 1) + "-row" + tableau[moveTo].length);

      // change the zIndex on the tableauRow to layer it on top
      tableauRow.style.zIndex = tableau[moveTo].length * 10;
    }
    checkMove = false;
  }
}

function movePile(moveFrom, moveTo) {
  for (let i = cardRow; i < pileLength; i++) {
    cardPile[cardPile.length] = moveFrom.pop();
  }

  for (let i = cardRow; i < pileLength; i++) {
    if (i == cardRow) {
      isUndiscovered = checkUndiscovered();
    } else {
      isUndiscovered = false;
    }

    tableau[moveTo][tableau[moveTo].length] = cardPile.pop();

    moveCard = tableau[moveTo][tableau[moveTo].length - 1];
    whatCardId[2] = i + 1;

    updateDisplay(moveFrom, moveTo, i);

    // identify the tableau row
    let tableauRow = document.getElementById("tableau" + (moveTo + 1) + "-row" + tableau[moveTo].length);

    // change the zIndex on the tableauRow to layer it on top
    tableauRow.style.zIndex = tableau[moveTo].length * 10;
  }
}

function checkUndiscovered() {
  try {
    let cardUnder = document.getElementById("tableau-" + whatCardId[1] + "-" + (whatCardId[2] - 1));

    let cardSrc = cardUnder.getAttribute("src") == "images/deck_backing.jpg";

    return cardSrc;
  } catch (e) {
    return false;
  }
}

// check value order of cards being moved
function checkOrder(moveFrom, moveTo) {
  // get values of the cards being moved and stacked on
  let valueFrom = values.indexOf(moveCard.value);
  let valueTo = values.indexOf(tableau[moveTo][tableau[moveTo].length - 1].value);

  // check which card has the higher value
  let isBigger = valueFrom > valueTo || valueFrom == valueTo;

  // if the card value is smaller than the card being stacked
  if (!isBigger) {
    // checks if the card value is in directly descending order of the card being stacked
    let inOrder = valueFrom === valueTo - 1;
    // return false if the card is not proper stacking order
    if (inOrder) return false;
    // return true if the card is in proper stacking order
    else return true;
  }
  // the value of the moving card is bigger than the card being stacked
  return isBigger;
}

// for foundation
// check matching suits prior to move
function foundationCheckSuit(moveFrom, moveTo) {
  // get suits of the cards being moved and stacked on
  let suitFrom = moveFrom[moveFrom.length - 1].suit;
  let suitTo = foundation[moveTo][foundation[moveTo].length - 1].suit;

  // boolean for comparing the suits
  let sameSuit = suitFrom == suitTo;

  // returns boolean
  return sameSuit;
}

// for foundation
// check value order of cards being moved
function foundationCheckOrder(moveFrom, moveTo) {
  // get values of the cards being moved and stacked on
  let valueFrom = values.indexOf(moveFrom[moveFrom.length - 1].value);
  let valueTo = values.indexOf(foundation[moveTo][foundation[moveTo].length - 1].value);

  // check which card has the higher value
  let isBigger = valueFrom > valueTo;

  // if the card value is smaller than the card being stacked
  if (isBigger) {
    // checks if the card value being moved on to the foundation is the card directly above it
    let inOrder = valueTo === valueFrom - 1;
    // return false if the card is in proper stacking order
    if (inOrder) return false;
    // return true if the card is not in proper stacking order
    else return true;
  }
  // the value of the moving card is bigger than the card being stacked
  return !isBigger;
}

// updates tableau display after a moveTableauCard has occurred
function updateDisplay(moveFrom, moveTo, i) {
  checkWin();
  showNextFrontImage(moveFrom);
  removeFrontImage(moveFrom, i);
  showMovedFrontImage(moveTo);
  consoleLogMoveTableau(moveTo + 1, i);
}

function showNextFrontImage(moveFrom) {
  let imgId;

  if (whatClass[0] === "card") {
    // displays next front image of the moveFrom tableau pile
    try {
      document.getElementById("tableau-" + tableauColFrom + "-" + moveFrom.length).src = moveFrom[moveFrom.length - 1].frontImage;
    } catch (e) {
      // catch if there is no card (empty pile)
      document.getElementById("tableau-" + tableauColFrom + "-1").src = "images/blank_card.png";
    }
  } else if (whatClass[0] === "foundation") {
    imgId = document.getElementById("foundation-" + whatCardId[1]);
    try {
      imgId.src = moveFrom[moveFrom.length - 1].frontImage;
    } catch (e) {
      imgId.src = "images/blank_card.png";
    }
  } else {
    imgId = document.getElementById("waste");
    try {
      imgId.src = waste[waste.length - 1].frontImage;
    } catch (e) {
      // catch if there is no card (empty pile)
      imgId.src = "images/blank_card.png";
    }
  }
}

function keepBlankCard(moveFrom) {
  if (whatClass[0] === "card") {
    // identify img element id
    let baseImgId = document.getElementById("tableau-" + tableauColFrom + "-1");

    // if the pile will be empty after the move
    if (moveFrom.length == 0) {
      // keeps an img element available
      // this is to make sure a card can still be placed on the empty pile afterwards
      baseImgId.src = "images/blank_card.png";
      baseImgId.style.display = "";
      if (whatClass[0] != "foundation") {
        let row = document.getElementById("tableau" + tableauColFrom + "-row1");
        row.style.zIndex = 10;
      }
    }
  }
}

function showNextFrontImageFoundation(moveFrom) {
  imgId = document.getElementById("foundation-" + two[1]);
  try {
    imgId.src = moveFrom[moveFrom.length - 1].frontImage;
  } catch (e) {
    imgId.src = "images/blank_card.png";
  }
}

function showNextFrontImageWaste(moveFrom) {
  imgId = document.getElementById("waste");
  try {
    imgId.src = waste[waste.length - 1].frontImage;
  } catch (e) {
    // catch if there is no card (empty pile)
    imgId.src = "images/blank_card.png";
  }
}

function removeFrontImage(moveFrom, i) {
  let imgId;
  let row;

  if (undoFlag === true) {
    if (two[0] === "tableau") {
      imgId = document.getElementById("tableau-" + two[1] + "-" + two[2]);
      row = document.getElementById("tableau" + two[1] + "-row" + two[2]);

      imgId.src = "";
      imgId.style.display = "none";
      row.style.zIndex = 0;
    }
    //        else if (one[0] === "waste" && two[0] === "tableau") {
    //            imgId = document.getElementById("tableau-"+two[1])
    //        }
  } else {
    if (whatClass[0] === "waste");
    else if (droppedTargetSplit[0] === "foundation" || toFoundation) {
      // identify img element id
      imgId = document.getElementById("tableau-" + tableauColFrom + "-" + (moveFrom.length + 1));
      // identify row
      row = document.getElementById("tableau" + tableauColFrom + "-row" + (moveFrom.length + 1));
    } else if (whatClass[0] === "foundation") {
      imgId = document.getElementById("foundation-" + whatCardId[1]);
    } else if (whatClass[0] === "card") {
      // identify img element id
      imgId = document.getElementById("tableau-" + tableauColFrom + "-" + (i + 1));
      // identify row
      row = document.getElementById("tableau" + tableauColFrom + "-row" + (i + 1));
    }

    if (whatClass[0] === "card") {
      // another card is available
      // removes front image of the moveFrom tableau pile
      imgId.src = "";
      imgId.style.display = "none";

      row.style.zIndex = 0;
    }
    keepBlankCard(moveFrom);
  }
}

// displays the moveFrom card in the moveTo tableau pile
function showMovedFrontImage(moveTo) {
  // identifies the tableau card
  let tableauCard = document.getElementById("tableau-" + (moveTo + 1) + "-" + tableau[moveTo].length);
  // changes the img src to the front image
  tableauCard.src = tableau[moveTo][tableau[moveTo].length - 1].frontImage;
  // removes the display none on the img element
  tableauCard.style.display = "";
}

// spare tableau spots can only be filled with kings
function fillTableauSpot(moveFrom, moveTo) {
  if (moveCard.value === "king") {
    // remove card from moveFrom pile and move to moveTo pile
    if (whatClass[0] === "waste") {
      tableau[moveTo][tableau[moveTo].length] = moveFrom.pop();
      updateDisplay(moveFrom, moveTo);
    } else if (whatClass[0] === "card") {
      movePile(moveFrom, moveTo);

      for (let i = cardRow; i < pileLength; i++) {
        // moved from
        moveHistory[0][moveHistory[0].length] = tempHistory[0].pop();
        // move to
        moveHistory[1][moveHistory[1].length] = tempHistory[1].pop();
        // card
        moveHistory[2][moveHistory[2].length] = tempHistory[2].pop();
        // discovered check
        moveHistory[3][moveHistory[3].length] = tempHistory[3].pop();
        // movePileLength
        moveHistory[4][moveHistory[4].length] = tempHistory[4].pop();
      }
    }
    checkMove = false;
  }
}

// displays the foundation front card image
function displayFoundationImage(foundationPile) {
  document.getElementById("foundation-" + (foundationPile + 1)).src = foundation[foundationPile][foundation[foundationPile].length - 1].frontImage;
}

// foundations can only be fileld starting with an ace
function canFillFoundation(foundationPile, moveFrom) {
  // checks if the foundation is at 0
  if (foundation[foundationPile].length === 0) {
    // checks if the card value is an ace
    if (moveFrom[moveFrom.length - 1].value === "ace") {
      // move card to foundation
      moveFoundationCard(foundationPile, moveFrom);
    }
  }
}

let toFoundation = false;

// move card to foundation
function moveFoundationCard(foundationPile, moveFrom) {
  isUndiscovered = checkUndiscovered();

  // moves the moveFrom card to the foundationPile
  foundation[foundationPile][foundation[foundationPile].length] = moveFrom.pop();
  if (click === true) checkMove = false;
  toFoundation = true;
  // removes the front card image in the moveFrom pile
  removeFrontImage(moveFrom);
  // displays the next front card image in the moveFrom pile
  showNextFrontImage(moveFrom);
  // displays foundation front card image
  displayFoundationImage(foundationPile);

  consoleLogMoveFoundation(foundationPile + 1);
  toFoundation = false;
}

// click listener for stock pile
document.getElementById("stock").addEventListener("click", function () {
  clickStockpile();
});

// function to move stock pile card to the waste pile
function clickStockpile() {
  //refill stock pile if empty upon click
  if (stock.length === 0 && waste.length === 0) {
    document.getElementById("stock").src = "images/blank_card.png";
    document.getElementById("waste").src = "images/blank_card.png";
    console.log("STOCKPILE AND WASTE ARE EMPTY");
  } else if (stock.length === 0) {
    refillStockpile();
  } else {
    // puts top stock pile card to the waste pile
    waste[waste.length] = stock.pop();
    // displays the front image of the top waste pile card
    document.getElementById("waste").src = waste[waste.length - 1].frontImage;
    let topWasteCard = waste[waste.length - 1];

    // console log the move
    console.log(topWasteCard.value + " of " + topWasteCard.suit + " from stock to waste");

    // moved from
    moveHistory[0][moveHistory[0].length] = "stock";
    // move to
    moveHistory[1][moveHistory[1].length] = "waste";
    // card
    moveHistory[2][moveHistory[2].length] = topWasteCard;
    // check discovery
    moveHistory[3][moveHistory[3].length] = false;
    // movePileHistory
    moveHistory[4][moveHistory[4].length] = 1;

    // after move if the stockpile is empty show that there are no cards
    if (stock.length === 0) {
      document.getElementById("stock").src = "images/blank_card.png";
    }
  }
}

// function to refill the stock pile when empty
function refillStockpile() {
  // get the length of the waste array
  let wasteLength = waste.length;
  // cycle through and put the waste pile back into the stock pile
  // keeping the original sequence
  for (let i = 0; i < wasteLength; i++) {
    stock[stock.length] = waste.pop();
  }
  // remove the front image on the top waste pile card
  document.getElementById("waste").src = "images/blank_card.png";
  document.getElementById("stock").src = "images/deck_backing.jpg";
  console.log("STOCKPILE REFILLED");
}

// hide empty img elements and layer cards for tableau setup
function layerSetup() {
  // tableau piles
  for (let j = 0; j < 7; j++) {
    // tableau cards in pile
    for (let i = 0; i < 19; i++) {
      // individual tableau card spots
      let tableauCard = tableau[j][i];
      // tableau columns and rows
      let tableauRow = document.getElementById("tableau" + (j + 1) + "-row" + (i + 1));
      // individual tableau img id
      let tableauImgId = document.getElementById("tableau-" + (j + 1) + "-" + (i + 1));

      // if tableau card in pile is undefined/blank
      if (tableauCard == undefined) {
        // display to not display the undefined img elements
        tableauImgId.style.display = "none";

        // zIndex to keep the layer to 0 for empty cards
        tableauRow.style.zIndex = 0;
      }
      // if tableau card is present
      else {
        // zindex goes up in 10s
        if (i == 0) tableauRow.style.zIndex = i + 10;
        else tableauRow.style.zIndex = (i + 1) * 10;
      }
    }
  }
}

// very helpful youtube video to understand drag and drop feature
// https://www.youtube.com/watch?v=C22hQKE_32c
// click and drag testing

// waste pile element
const wasteQuery = document.querySelector(".waste");
// foundation pile elements
const foundations = document.querySelectorAll(".foundation");
// tableau pile elements
const tableaus = document.querySelectorAll(".tableau");
// card elements
const cards = document.querySelectorAll(".card");

let whatClass;
let tableauColFrom;
let whatCardId;
let whatCardSrc;
let cardPile = [];
let cardRow;
let pileLength;
let droppedTargetSplit = [];

// wasteQuery listeners
wasteQuery.addEventListener("dragstart", dragStart);
wasteQuery.addEventListener("dragend", dragEnd);

// loop through foundations and call drag events
for (const foundation of foundations) {
  foundation.addEventListener("dragover", dragOver);
  foundation.addEventListener("drop", dragDrop);
  foundation.addEventListener("click", onClickMove);
}

// loop through tableau and call drag events
for (const tableau of tableaus) {
  tableau.addEventListener("drop", dragDrop);
}

// loop through each card and call drag events
for (const card of cards) {
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);
  card.addEventListener("dragover", dragOver);
  card.addEventListener("click", onClickMove);
}

function queryHold() {
  return document.querySelectorAll(".hold");
}

// drag functions

// triggers when the drag is started
function dragStart(event) {
  // appends hold to class name for the first card being clicked and dragged
  this.className += " hold";

  // to further identify the class name of what element is being dragged
  whatClass = this.className.split(" ");

  // parsing the HTML to be used for specifying cards/piles/arrays
  let whatElement = document.getElementsByClassName("hold");
  whatCardSrc = whatElement[0].getAttribute("src");
  whatCardId = whatElement[0].getAttribute("id").split("-");
  cardRow = whatCardId[2] - 1;
  tableauColFrom = whatCardId[1];

  if (whatCardSrc === "images/deck_backing.jpg") return null;

  // enters only if the card click and dragged was from the tableau
  if (whatClass[0] === "card") {
    // identifies the tableau pile length from the card that was clicked and dragged
    pileLength = tableau[whatCardId[1] - 1].length;
    // used to create a hold on all layered cards while dragging
    // identifies the exact being clicked and dragged
    let cardLocation = tableau[whatCardId[1] - 1][whatCardId[2] - 2];
    // identifies the index of where that card sits in the array
    // adding 1 to the index to get the proper HTML id
    let indexCard = tableau[whatCardId[1] - 1].indexOf(cardLocation) + 1;
    // identifies how many cards are being dragged / also if there is a pile
    let pileOfCardsMoving = pileLength - indexCard;

    // for loop to go through the cards that are in the pile being moved
    // and applying class names to them, if there is a pile
    for (let i = indexCard + 1; i < pileLength; i++) {
      // identifies the specific card in the pile being moved
      let holdClass = document.getElementById("tableau-" + whatCardId[1] + "-" + (i + 1));
      // appends hold to class name
      holdClass.className += " hold";
      // appends invisible to class name
      holdClass.className += " invisible";
    }
  }
  //     appends invisible to class name for the first card being clicked and dragged
  //     sets card selected to be invisible when dragged
  setTimeout(() => (this.className += " invisible"), 0);
}

// triggers when the drag is released
function dragEnd() {
  // return card back to waste pile if not dropped on a valid pile
  if (whatClass[0] == "waste") {
    this.className = "waste";
  }

  // return card back to card class
  else if (whatClass[0] == "card") {
    let holdClasses = queryHold();
    for (const holding of holdClasses) {
      holding.className = "card";
    }
  }
}

// triggers when a drag and hold is over a pile.
// only purpose of this function is to identify
// when the drag is over a pile that is listening
function dragOver(e) {
  e.preventDefault();
}

// triggers when a drag and hold is dropped on a pile
function dragDrop(event) {
  // pile that the card will be moving from
  let moveFrom;

  // identify pile where dropped
  let dropped = event.target;
  // split the dropped element id to identify and use elements
  droppedTargetSplit = dropped.id.split("-");

  // card moving from waste pile
  if (whatClass[0] == "waste") {
    moveFrom = waste;
    moveCard = waste[waste.length - 1];
  }

  // tableau card
  else if (whatClass[0] == "card") {
    // if card trying to be moved has not been discovered
    if (whatCardSrc == "images/deck_backing.jpg") return null;
    // if card has been discovered
    else {
      moveFrom = tableau[whatCardId[1] - 1];
      moveCard = moveFrom[cardRow];
    }
  }

  // card dropped on a tableau pile
  if (droppedTargetSplit[0] == "tableau") {
    // identify the target tableau array pile
    let moveTo = droppedTargetSplit[1] - 1;
    // identify the target tableau array card
    // not being used yet
    let tableauArrayCard = droppedTargetSplit[2] - 1;

    // call function to move cards
    moveTableauCard(moveFrom, moveTo, moveCard);
  }

  // card dropped on a foundation pile
  else if (droppedTargetSplit[0] == "foundation") {
    let foundationArrayPile = droppedTargetSplit[1] - 1;
    let fPile = foundation[foundationArrayPile];

    // if foundation pile is empty
    if (foundation[foundationArrayPile].length === 0) {
      canFillFoundation(foundationArrayPile, moveFrom);
    }
    // if foundation pile is not empty
    else {
      // verifies that the suit is the same
      if (!foundationCheckSuit(moveFrom, foundationArrayPile)) {
        //                alert("Cannot move card! \nAdding on a foundation must be the same suit")
      }
      // verifies that the order is stacking in direct ascending order
      else if (foundationCheckOrder(moveFrom, foundationArrayPile)) {
        //                alert("Cannot move card! \nAdding on a foundation must follow ascending value \nAce, 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King")
      }
      // moves card if both conditions are met
      else {
        // moves card and updates display
        moveFoundationCard(foundationArrayPile, moveFrom);
      }
    }
  }
}

// click events

let click;
let checkMove;
let breakMe;

// listen for click on waste pile
wasteQuery.addEventListener("click", onClickMove);

// move on click if available
function onClickMove() {
  let moveFrom;
  breakMe = false;

  this.className += " clicked";
  whatClass = this.className.split(" ");

  //    console.log("click occurred on: "+whatClass[0]);

  if (whatClass[0] === "waste") {
    moveFrom = waste;
    moveCard = waste[waste.length - 1];
    //        console.log(moveCard);
  } else if (whatClass[0] === "foundation") {
    // identify pile
    let whatElement = document.getElementsByClassName("clicked");
    whatCardId = whatElement[0].firstElementChild.getAttribute("id").split("-");

    moveFrom = foundation[whatCardId[1] - 1];
    moveCard = moveFrom[moveFrom.length - 1];
  } else if (whatClass[0] === "card") {
    // identify pile
    let whatElement = document.getElementsByClassName("clicked");
    whatCardSrc = whatElement[0].getAttribute("src");
    whatCardId = whatElement[0].getAttribute("id").split("-");

    // if card trying to be moved has not been discovered
    if (whatCardSrc === "images/deck_backing.jpg") {
      console.log("clicked on undiscovered card");
      this.className = whatClass[0];
      breakMe = true;
    }

    cardRow = whatCardId[2] - 1;
    tableauColFrom = whatCardId[1];

    pileLength = tableau[whatCardId[1] - 1].length;
    moveFrom = tableau[whatCardId[1] - 1];
    moveCard = moveFrom[cardRow];
  }

  // exit function if card has not been discovered
  if (breakMe === true) return null;

  click = true;
  checkMove = true;

  checkAvailability(moveCard, moveFrom);

  // return back to normal state
  this.className = whatClass[0];
  click = false;
  checkMove = false;
}

// checks availability on click
function checkAvailability(moveCard, moveFrom) {
  let foundationClickSuccess = false;

  if (whatClass[0] != "foundation") {
    // check foundations first
    for (let i = 1; i <= foundations.length; i++) {
      // exception handling if the pile is empty
      if (whatClass[0] === "waste" && waste.length === 0) break;
      else if (whatClass[0] === "card" && tableau[parseInt(whatCardId[1]) - 1].length === 0) break;

      // identify img id for foundation pile
      let foundationId = document.getElementById("foundation-" + i);

      // check if foundation pile is empty
      // if move is successful break out of the loop
      if (foundation[i - 1].length === 0) {
        canFillFoundation(i - 1, moveFrom);
        if (checkMove === false) {
          foundationClickSuccess = true;
          break;
        }
      }
      // if foundation pile is not empty
      else {
        // verifies that the suit is the same
        if (!foundationCheckSuit(moveFrom, i - 1)) {
          //                    console.log("cannot move "+moveCard.value+" of "+moveCard.suit+" to foundation-"+i+". Invalid suit.");
        }
        // verifies that the order is stacking in direct ascending order
        else if (foundationCheckOrder(moveFrom, i - 1)) {
          //                    console.log("cannot move "+moveCard.value+" of "+moveCard.suit+" to foundation-"+i+". Invalid order.");
        }
        // moves card if both conditions are met
        // if move is successful break out of the loop
        else {
          moveFoundationCard(i - 1, moveFrom);
          foundationClickSuccess = true;
          break;
        }
      }
    }
  }

  // check tableaus second
  if (!foundationClickSuccess) {
    for (let i = 1; i <= tableau.length; i++) {
      let tableauTopCard = tableau[i - 1][tableau[i - 1].length - 1];

      let moveTo = i - 1;

      // call function to move card
      moveTableauCard(moveFrom, moveTo, moveCard);
      if (checkMove === false) break;
    }
  }
}

// console log the move occur
function consoleLogMoveFoundation(i) {
  if (undoFlag === false) {
    scoringSystem.foundation();
    switch (whatClass[0]) {
      case "waste":
        console.log(moveCard.value + " of " + moveCard.suit + " from waste to foundation-" + i);

        // moved from
        moveHistory[0][moveHistory[0].length] = "waste";
        // move to
        moveHistory[1][moveHistory[1].length] = "foundation-" + i;
        // card
        moveHistory[2][moveHistory[2].length] = moveCard;
        // check discovery
        moveHistory[3][moveHistory[3].length] = false;
        // movePileLength
        moveHistory[4][moveHistory[4].length] = 1;

        break;
      case "card":
        console.log(moveCard.value + " of " + moveCard.suit + " from tableau-" + whatCardId[1] + "-" + whatCardId[2] + " to foundation-" + i);

        // moved from
        moveHistory[0][moveHistory[0].length] = "tableau-" + whatCardId[1] + "-" + whatCardId[2];
        // move to
        moveHistory[1][moveHistory[1].length] = "foundation-" + i;
        // card
        moveHistory[2][moveHistory[2].length] = moveCard;
        // check discovery
        moveHistory[3][moveHistory[3].length] = isUndiscovered;
        // movePileLength
        moveHistory[4][moveHistory[4].length] = 1;

        break;
      default:
        break;
    }
  }
}

// console log the move occur
function consoleLogMoveTableau(i, x) {
  if (undoFlag === false) {
    switch (whatClass[0]) {
      case "waste":
        scoringSystem.deal();
        console.log(moveCard.value + " of " + moveCard.suit + " from waste to tableau-" + i + "-" + tableau[i - 1].length);

        // moved from
        moveHistory[0][moveHistory[0].length] = "waste";
        // move to
        moveHistory[1][moveHistory[1].length] = "tableau-" + i + "-" + tableau[i - 1].length;
        // card
        moveHistory[2][moveHistory[2].length] = moveCard;
        // check discovery
        moveHistory[3][moveHistory[3].length] = false;
        // movePileLength
        moveHistory[4][moveHistory[4].length] = 1;

        break;
      case "card":
        scoringSystem.rowToRow();
        console.log(moveCard.value + " of " + moveCard.suit + " from tableau-" + whatCardId[1] + "-" + whatCardId[2] + " to tableau-" + i + "-" + tableau[i - 1].length);

        // moved from
        tempHistory[0][tempHistory[0].length] = "tableau-" + whatCardId[1] + "-" + whatCardId[2];
        // move to
        tempHistory[1][tempHistory[1].length] = "tableau-" + i + "-" + tableau[i - 1].length;
        // card
        tempHistory[2][tempHistory[2].length] = moveCard;
        // check discovery
        tempHistory[3][tempHistory[3].length] = isUndiscovered;
        // movePileLength
        tempHistory[4][tempHistory[4].length] = pileLength-x;
            

        break;
      case "foundation":
        console.log(moveCard.value + " of " + moveCard.suit + " from foundation-" + whatCardId[1] + " to tableau-" + i + "-" + tableau[i - 1].length);

        // moved from
        moveHistory[0][moveHistory[0].length] = "foundation-" + whatCardId[1];
        // move to
        moveHistory[1][moveHistory[1].length] = "tableau-" + i + "-" + tableau[i - 1].length;
        // card
        moveHistory[2][moveHistory[2].length] = moveCard;
        // check discovery
        moveHistory[3][moveHistory[3].length] = isUndiscovered;
        // movePileLength
        moveHistory[4][moveHistory[4].length] = 1;

        break;
      default:
        break;
    }
  }
}

// TESTING

// array placements
// 0 is moveFrom
// 1 is moveTo
// 2 is moveCard
// 3 is checkUndiscovered
// 4 is movePileLength

let tempHistory = [[], [], [], [], []];
let moveHistory = [[], [], [], [], []];
let undoFlag = false;
let one, two;
let isUndiscovered;
let movePileLength;

function undo() {
  // if moveHistory is not empty
  if (moveHistory[0] != 0) {
    scoringSystem.undo();
    let moveTo, moveFrom, moveCard, historyIndex, undiscovered;
    undoFlag = true;

    one = moveHistory[0][moveHistory[0].length - 1].split("-");
    two = moveHistory[1][moveHistory[1].length - 1].split("-");

    // tableau to tableau
    if (one[0] === "tableau" && two[0] === "tableau") {
      moveTo = one[1] - 1;
      moveFrom = tableau[two[1] - 1];
      moveCard = moveHistory[2][moveHistory[2].length - 1];
      undiscovered = moveHistory[3][moveHistory[3].length - 1];
      movePileLength = moveHistory[4][moveHistory[4].length - 1];

      // moves the card
      tableau[moveTo][tableau[moveTo].length] = moveCard;

      // removes the card from the moveFrom pile
      historyIndex = moveFrom.indexOf(moveCard);
      moveFrom.splice(historyIndex, 1);

      // update display
      removeFrontImage(moveFrom);
      showMovedFrontImage(moveTo);

      // identify the tableau row
      let tableauRow = document.getElementById("tableau" + (moveTo + 1) + "-row" + tableau[moveTo].length);

      // change the zIndex on the tableauRow to layer it on top
      tableauRow.style.zIndex = tableau[moveTo].length * 10;

      if (undiscovered == true) {
        let cardUnder = document.getElementById("tableau-" + one[1] + "-" + (one[2] - 1));
        cardUnder.src = "images/deck_backing.jpg";
      }
    }
    // stock to waste
    else if (one[0] === "stock" && two[0] === "waste") {
      moveTo = stock;
      moveFrom = waste;
      moveCard = waste.length - 1;
      movePileLength = moveHistory[4][moveHistory[4].length - 1];

      // moves card to moveTo pile from the moveFrom pile
      moveTo[moveTo.length] = moveFrom.pop();

      // update display
      removeFrontImage(moveFrom);
      showNextFrontImageWaste(moveFrom);
    }
    // waste to tableau
    else if (one[0] === "waste" && two[0] === "tableau") {
      moveTo = waste;
      moveFrom = tableau[two[1] - 1];
      moveCard = moveHistory[2][moveHistory[2].length - 1];
      movePileLength = moveHistory[4][moveHistory[4].length - 1];

      // moves card to moveTo pile from the moveFrom pile
      moveTo[moveTo.length] = moveFrom.pop();

      // update display
      removeFrontImage(moveFrom);
      showNextFrontImageWaste(moveFrom);
    }
    // waste to foundation
    else if (one[0] === "waste" && two[0] === "foundation") {
      moveTo = waste;
      moveFrom = foundation[two[1] - 1];
      moveCard = moveHistory[2][moveHistory[2].length - 1];
      movePileLength = moveHistory[4][moveHistory[4].length - 1];

      // moves card to moveTo pile from the moveFrom pile
      moveTo[moveTo.length] = moveFrom.pop();

      // update display
      showNextFrontImageFoundation(moveFrom);
      showNextFrontImageWaste(moveFrom);
    }
    // tableau to foundation
    else if (one[0] === "tableau" && two[0] === "foundation") {
      moveTo = one[1] - 1;
      moveFrom = foundation[two[1] - 1];
      moveCard = moveHistory[2][moveHistory[2].length - 1];
      undiscovered = moveHistory[3][moveHistory[3].length - 1];
      movePileLength = moveHistory[4][moveHistory[4].length - 1];

      // moves the card
      tableau[moveTo][tableau[moveTo].length] = moveFrom.pop();

      // update display
      showNextFrontImageFoundation(moveFrom);
      showMovedFrontImage(moveTo);

      // identify the tableau row
      let tableauRow = document.getElementById("tableau" + (moveTo + 1) + "-row" + tableau[moveTo].length);

      // change the zIndex on the tableauRow to layer it on top
      tableauRow.style.zIndex = tableau[moveTo].length * 10;

      if (undiscovered == true) {
        let cardUnder = document.getElementById("tableau-" + one[1] + "-" + (one[2] - 1));
        cardUnder.src = "images/deck_backing.jpg";
      }
    }
    // foundation to tableau
    else if (one[0] === "foundation" && two[0] === "tableau") {
      moveTo = foundation[one[1] - 1];
      moveFrom = tableau[two[1] - 1];
      moveCard = moveHistory[2][moveHistory[2].length - 1];
      movePileLength = moveHistory[4][moveHistory[4].length - 1];

      // moves card to moveTo pile from the moveFrom pile
      moveTo[moveTo.length] = moveFrom.pop();

      // update display
      removeFrontImage(moveFrom);
      showNextFrontImage(moveFrom);
      displayFoundationImage(one[1] - 1);
    }
      
    if (movePileLength > 1) {
        popUndo();
        undo(); 
    }
    else {
        popUndo();
    }
  }
}

function popUndo() {
    moveHistory[0].pop();
    moveHistory[1].pop();
    moveHistory[2].pop();
    moveHistory[3].pop();
    moveHistory[4].pop();
    undoFlag = false;
}

function checkWin() {
  let didWin = true;

  tableau.forEach((t) => {
    if (t.length !== 0) {
      didWin = false;
    }
  });

  if (didWin) {
    alert("You win!");
  }
}
