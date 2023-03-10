// JavaScript file

/* jslint es6:true */
/* eslint-env es6 */
/* eslint-disable */

// Array of suits
const suits = ["hearts", "diamonds", "spades", "clubs"];

// Array of values
const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
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

// stock pile
const stock = stockPile();

// tableau piles
const tableau = [[],[],[],[],[],[],[]];

// identify tableau pile id
let tableauPileId = 0;

// foundation piles
const foundation = [[],[],[],[]];

// waste pile
const waste = [];

// check if king
let isKing = false;

// setup the tableau / deal cards
setupGame()
    
// setup tableau
function setupGame() {
    for (let tableauArrayIndex=0;tableauArrayIndex < 7;tableauArrayIndex++) {
        tableauPileId = tableauArrayIndex+1;
        dealCards(tableauArrayIndex);
        displayBottomCards(tableauArrayIndex,tableauPileId);
        displayTopCard(tableauArrayIndex,tableauPileId);
        layerSetup();
    }
}

// displays back image of bottom cards from the tableau piles
function displayBottomCards(tableauArrayIndex,tableauPileId) {
    // any tableau piles with more than one card
    if (tableau[tableauArrayIndex].length > 1) {
        // first loop
        // "a" identifies the card position in the array
        for (let a=0; a < tableau[tableauArrayIndex].length-1; a++){
            // second loop
            // "b" identifies the tableau card id
            for (let b=1; b < tableau[tableauArrayIndex].length; b++) {
                document.getElementById("tableau-"+tableauPileId+"-"+b).src = tableau[tableauArrayIndex][a].backImage;
                document.getElementById("tableau-"+tableauPileId+"-"+b).style.display = "";
            }
        }
    }
}

// displays front image of top cards from the tableau piles
function displayTopCard(tableauArrayIndex,tableauPileId) {
    try {
        document.getElementById("tableau-"+tableauPileId+"-"+tableauPileId).src = tableau[tableauArrayIndex][tableau[tableauArrayIndex].length-1].frontImage;
        document.getElementById("tableau-"+tableauPileId+"-"+tableauPileId).style.display = "";
    }
    // displays nothing as the img src if the tableau pile is 0
    catch (err) {
        document.getElementById("tableau-"+tableauPileId+"-"+tableauPileId).style = "none";
        document.getElementById("tableau-"+tableauPileId+"-"+tableauPileId).style.zIndex = "-1";
    }
}

// loops through tableau piles from left to right
// and places cards into tableau piles
function dealCards(tableauArrayIndex) {
    // loops through piles
    for (let i=tableauArrayIndex; i < 7; i++) {
        
    // place card into tableau pile
    tableau[i].push(stock[stock.length-1]);
        
    // remove card from stock pile
    stock.pop();
    }    
}

// create card objects from the deck
function setCard(deck) {
    // take the last card from the deck and gather details
    value = deck.deck[deck.deck.length-1].split("_")[0];    
    suit = deck.deck[deck.deck.length-1].split("_")[2];
    frontImage = "images/"+deck.deck[deck.deck.length-1]+".png";

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
        backImage: "images/deck_backing.jpg"
    }
    
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
    for (let i=0; i < 52; i++) {

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
    }
    // catch if there is no card (empty pile)
    catch (err) {
        moveFromColor = null;
    }
    
    // try to retrieve color from top card of moveTo pile
    try{
        moveToColor = tableau[moveTo][tableau[moveTo].length-1].color;
    }
    // catch if there is no card (empty tableau pile)
    catch (err) {
        moveToColor = null;
    }
        
    // avoid dropping on the same tableau pile
    if (tableau[moveTo] === moveFrom) {
        alert("Cannot drop a card on same pile");
    }
    
    // card colors are the same, display alert
    else if (moveToColor == moveFromColor) {
        alert("Cannot move card! \nStacking cards on a tableau pile must be of alternating colors");
    }
    
    // spare tableau spots can only be filled with kings
    else if (tableau[moveTo].length === 0) {
        isKing = true;
        fillTableauSpot(moveFrom, moveTo);
    }
    
    // checks if the tableau card exists
    // avoids undefined objects being moved to tableau piles
    else if (moveFrom.length === 0) {
        alert("Cannot move a card from a pile that has no card to move");
    }
    
    // cards can only be stacked in the proper order 
    else if (checkOrder(moveCard,moveTo)) {
        alert("Cards can only be stacked in descending order.\nKing, Queen, Jack, 10, 9, 8, 7, 6, 5, 4, 3, 2, Ace");
    }
    
    // card colors are not the same, proceed
    else {
        // move card from one array pile to another

        if (whatClass[0] == "card") {
            movePile(moveFrom, moveTo);
                        
        }
        else {
            tableau[moveTo][tableau[moveTo].length] = moveFrom.pop();
            updateDisplay(moveFrom, moveTo);  
            
            // identify the tableau row
            let tableauRow = document.getElementById("tableau"+(moveTo+1)+"-row"+(tableau[moveTo].length));

            // change the zIndex on the tableauRow to layer it on top
            tableauRow.style.zIndex = (tableau[moveTo].length)*10;  
        }
        
    }
}

let isPile = false;

function movePile(moveFrom, moveTo) {
    for (let i=cardRow; i < pileLength; i++) {
        cardPile[cardPile.length] = moveFrom.pop();                          
            
        }
            
    for (let i=cardRow; i < pileLength; i++) {
        console.log("for loop two "+i)
        
        isPile = true;
        
        tableau[moveTo][tableau[moveTo].length] = cardPile.pop();
        updateDisplay(moveFrom, moveTo, i);   

        // identify the tableau row
        let tableauRow = document.getElementById("tableau"+(moveTo+1)+"-row"+(tableau[moveTo].length));

        // change the zIndex on the tableauRow to layer it on top
        tableauRow.style.zIndex = (tableau[moveTo].length)*10;  
    }
            
//    keepBlankCard(moveFrom);
}

// check value order of cards being moved
function checkOrder(moveFrom, moveTo) {
    // get values of the cards being moved and stacked on
    let valueFrom = values.indexOf(moveCard.value);
    let valueTo = values.indexOf(tableau[moveTo][tableau[moveTo].length-1].value);
    
    // check which card has the higher value
    let isBigger = (valueFrom > valueTo) || (valueFrom == valueTo);

    // if the card value is smaller than the card being stacked
    if (!isBigger) {
        // checks if the card value is in directly descending order of the card being stacked
        let inOrder = (valueFrom === (valueTo-1));
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
    let suitFrom = moveFrom[moveFrom.length-1].suit;
    let suitTo = foundation[moveTo][foundation[moveTo].length-1].suit;
    
    // boolean for comparing the suits
    let sameSuit = (suitFrom == suitTo);
    
    // returns boolean
    return sameSuit;
}

// for foundation
// check value order of cards being moved
function foundationCheckOrder(moveFrom, moveTo) {
    // get values of the cards being moved and stacked on
    let valueFrom = values.indexOf(moveFrom[moveFrom.length-1].value);
    let valueTo = values.indexOf(foundation[moveTo][foundation[moveTo].length-1].value);
    
    // check which card has the higher value
    let isBigger = (valueFrom > valueTo);

    // if the card value is smaller than the card being stacked
    if (isBigger) {
        // checks if the card value being moved on to the foundation is the card directly above it
        let inOrder = (valueTo === (valueFrom-1));
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
    showNextFrontImage(moveFrom);
    removeFrontImage(moveFrom, i);
    showMovedFrontImage(moveTo);  
}

function showNextFrontImage(moveFrom) {

    if (whatClass[0] === "card") { 
// displays next front image of the moveFrom tableau pile
        try {
            document.getElementById("tableau-"+tableauColFrom+"-"+moveFrom.length).src = moveFrom[moveFrom.length-1].frontImage;

        }
        // catch if there is no card (empty pile)
        catch (e){
            document.getElementById("tableau-"+tableauColFrom+"-1").src = "images/blank_card.png";
        }
    }
    else {
        let imgId = document.getElementById("waste");
        try {
            imgId.src = waste[waste.length-1].frontImage;
        }
        // catch if there is no card (empty pile)
        catch (e) {
            imgId.src = "images/blank_card.png";
        }
    }
}

function keepBlankCard(moveFrom) {
    if (whatClass[0] === "card") {
        // identify img element id
        let baseImgId = document.getElementById("tableau-"+tableauColFrom+"-1");

        // if the pile will be empty after the move
        if (moveFrom.length == 0){
            // keeps an img element available
            // this is to make sure a card can still be placed on the empty pile afterwards
            baseImgId.src = "images/blank_card.png";
            baseImgId.style.display = "";
            let row = document.getElementById("tableau"+tableauColFrom+"-row1");
            row.style.zIndex = 10;
        }
    }
}

function removeFrontImage(moveFrom, i) {
    let imgId;
    let row;
    
    console.log(droppedTargetSplit[0])
    if (droppedTargetSplit[0] === "foundation") {
        // identify img element id
        imgId = document.getElementById("tableau-"+tableauColFrom+"-"+(moveFrom.length+1));
        // identify row
        row = document.getElementById("tableau"+tableauColFrom+"-row"+(moveFrom.length+1));
    }
        
    else if (whatClass[0] === "card") {
        // identify img element id
        imgId = document.getElementById("tableau-"+tableauColFrom+"-"+(i+1));
        // identify row
        row = document.getElementById("tableau"+tableauColFrom+"-row"+(i+1));
    }
    
    if (whatClass[0] != "waste") {
        // another card is available
        // removes front image of the moveFrom tableau pile   
        imgId.src = "";
        imgId.style.display = "none";

        // layers row to the background
        row.style.zIndex = 0;
    }
    keepBlankCard(moveFrom);
    
    
}


// displays the moveFrom card in the moveTo tableau pile
function showMovedFrontImage(moveTo) {
    // identifies the tableau card
    let tableauCard = document.getElementById("tableau-"+(moveTo+1)+"-"+tableau[moveTo].length);
    // changes the img src to the front image
    tableauCard.src = tableau[moveTo][tableau[moveTo].length-1].frontImage;
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
        }
        else if (whatClass[0] === "card") {
            movePile(moveFrom, moveTo);
        }
        
//        updateDisplay(moveFrom, moveTo);
    } else { 
        alert("Cannot move card! \nOnly kings can fill an empty tableau spot");
    }  
} 

// displays the foundation front card image
function displayFoundationImage(foundationPile) {
    document.getElementById("foundation-"+(foundationPile+1)).src = foundation[foundationPile][foundation[foundationPile].length-1].frontImage;
}

// foundations can only be fileld starting with an ace
function canFillFoundation(foundationPile, moveFrom) { 

// checks if the foundation is at 0
  if (foundation[foundationPile].length === 0) {
    // checks if the card value is an ace
    if (moveFrom[moveFrom.length-1].value === "ace") {
        // move card to foundation
        moveFoundationCard(foundationPile, moveFrom);
    } 
    else { 
      alert("Cannot move card! \nOnly aces can be the base of a foundation");
    }
  }  
} 

// move card to foundation
function moveFoundationCard(foundationPile, moveFrom) {
    // moves the moveFrom card to the foundationPile
    foundation[foundationPile][foundation[foundationPile].length] = moveFrom.pop();
    // removes the front card image in the moveFrom pile
    removeFrontImage(moveFrom);
    // displays the next front card image in the moveFrom pile
    showNextFrontImage(moveFrom);
    // displays foundation front card image        
    displayFoundationImage(foundationPile);
}

// click listener for stock pile
document.getElementById("stock").addEventListener("click", function() { clickStockpile() });

// function to move stock pile card to the waste pile
function clickStockpile() {
    //refill stock pile if empty upon click
    if (stock.length === 0) {
        refillStockpile();
    }
    else {
    // puts top stock pile card to the waste pile
    waste[waste.length] = stock.pop();
    // displays the front image of the top waste pile card
    document.getElementById("waste").src = waste[waste.length-1].frontImage;  
    }
      
}

// function to refill the stock pile when empty
function refillStockpile() {
    // get the length of the waste array
    let wasteLength = waste.length;
    // cycle through and put the waste pile back into the stock pile
    // keeping the original sequence
    for (let i=0; i < wasteLength; i++) {
        stock[stock.length] = waste.pop();
    }
    // remove the front image on the top waste pile card
    document.getElementById("waste").src = "images/blank_card.png";
}

// hide empty img elements and layer cards for tableau setup 
function layerSetup() {
    
    // tableau piles
    for (let j=0; j < 7; j++) {

        // tableau cards in pile
        for (let i=0; i < 13; i++) {

            // individual tableau card spots
            let tableauCard = tableau[j][i];
            // tableau columns and rows
            let tableauRow = document.getElementById("tableau"+(j+1)+"-row"+(i+1));
            // individual tableau img id
            let tableauImgId = document.getElementById("tableau-"+(j+1)+"-"+(i+1));

            // if tableau card in pile is undefined/blank
            if (tableauCard == undefined){
                // display to not display the undefined img elements
                tableauImgId.style.display = "none";

                // zIndex to keep the layer to 0 for empty cards
                tableauRow.style.zIndex = 0;
            }
            // if tableau card is present 
            else {
                // zindex goes up in 10s
                if (i == 0) tableauRow.style.zIndex = i+10;
                else tableauRow.style.zIndex = (i+1)*10;
            }
        }  
    }
}

// very helpful youtube video to understand drag and drop feature
// https://www.youtube.com/watch?v=C22hQKE_32c
// click and drag testing

// waste pile element
const wasteQuery = document.querySelector('.waste');
// foundation pile elements
const foundations = document.querySelectorAll('.foundation');
// tableau pile elements
const tableaus = document.querySelectorAll('.tableau');
// card elements
const cards = document.querySelectorAll('.card');

let whatClass;
let tableauColFrom;
let whatCardId;
let whatCardSrc;
let cardPile = [];
let cardRow;
let pileLength;
let droppedTargetSplit;

// wasteQuery listeners
wasteQuery.addEventListener('dragstart', dragStart);
wasteQuery.addEventListener('dragend', dragEnd);

// loop through foundations and call drag events
for(const foundation of foundations) {
    foundation.addEventListener('dragover', dragOver);
    foundation.addEventListener('drop', dragDrop);
}


// loop through tableau and call drag events
for(const tableau of tableaus) {
//    tableau.addEventListener('dragstart', dragStart);
//    tableau.addEventListener('dragend', dragEnd);
//    tableau.addEventListener('dragover', dragOver);
    tableau.addEventListener('drop', dragDrop);
}


// loop through each card and call drag events
for (const card of cards) {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
    card.addEventListener('dragover', dragOver);
//    card.addEventListener('drop', dragDrop);
}


// drag functions

// triggers when the drag is started
function dragStart(event) {
    console.log('start');
    this.className += ' hold';
    // to further identify the class name of what element is being dragged
    whatClass = this.className.split(" ");
    if (whatClass[0] === "tableau") {
        tableauColFrom = whatClass[1].slice(11);
    }
    console.log()
    let whatElement = document.getElementsByClassName("hold");
    whatCardSrc = whatElement[0].getAttribute("src");
    whatCardId = whatElement[0].getAttribute("id").split("-");
    cardRow = whatCardId[2]-1;
    tableauColFrom = whatCardId[1];
    console.log(whatClass);
    
}

// triggers when the drag is released
function dragEnd() {
    console.log('end');
    // return card back to waste pile if not dropped on a valid pile
    if (whatClass[0] == "waste") {
        this.className = "waste";
    }
    /*
    // return card back to tableau pile if not dropped on a valid pile
    else if (whatClass[0] == "tableau") {
        this.className = whatClass[0]+" "+whatClass[1]+" "+whatClass[2];
    }
    */
    // return card back to card class
    else if (whatClass[0] == "card") {
        this.className = "card";
    }
}

// triggers when a drag and hold is over a pile.
// only purpose of this function is to identify
// when the drag is over a pile that is listening
function dragOver(e) {
    e.preventDefault();
    console.log('over');
}

// triggers when a drag and hold is dropped on a pile
function dragDrop(event) {
    console.log('drop');
    
    // pile that the card will be moving from
    let moveFrom;

    // identify pile where dropped
    let dropped = event.target;
    // split the dropped element id to identify and use elements
    droppedTargetSplit = dropped.id.split('-');
    
    // card moving from waste pile
    if (whatClass[0] == "waste") {
        moveFrom = waste;
        moveCard = waste[waste.length-1];
        console.log(moveCard);
    } 
    
    /*
    // card moving from tableau pile
    else if (whatClass[0] == "tableau") {
        // identify the card that the tableau pile is being moved from
        moveFrom = tableau[(whatClass[1].slice(11))-1];
        
        // moveCard not being used yet
        moveCard = moveFrom[moveFrom.length-1];         
    }
    */
    
    // tableau card
    else if (whatClass[0] == "card") {
        // if card trying to be moved has not been discovered
        if (whatCardSrc == "images/deck_backing.jpg"){
            console.log("SONK");
        }
        // if card has been discovered
        else {
            pileLength = tableau[(whatCardId[1]-1)].length;
            moveFrom = tableau[(whatCardId[1]-1)];
            moveCard = moveFrom[cardRow];
            console.log(moveCard);
        }
    }
    
    else {
        console.log("something else");
    }

    // card dropped on a tableau pile
    if (droppedTargetSplit[0] == "tableau") {
        // identify the target tableau array pile
        let moveTo = droppedTargetSplit[1]-1;
        // identify the target tableau array card
        // not being used yet
        let tableauArrayCard = droppedTargetSplit[2]-1;
        
        // call function to move cards
        moveTableauCard(moveFrom, moveTo, moveCard);
    } 

        
    // card dropped on a foundation pile
    else if (droppedTargetSplit[0] == "foundation") {
        let foundationArrayPile = droppedTargetSplit[1]-1;
        let fPile = foundation[foundationArrayPile];

        
        // if foundation pile is empty
        if (foundation[foundationArrayPile].length === 0) {
            canFillFoundation(foundationArrayPile, moveFrom);
        }
        // if foundation pile is not empty
        else {
            // verifies that the suit is the same
            if (!foundationCheckSuit(moveFrom, foundationArrayPile)) {
                alert("Cannot move card! \nAdding on a foundation must be the same suit")
            }
            // verifies that the order is stacking in direct ascending order
            else if (foundationCheckOrder(moveFrom, foundationArrayPile)) {
                alert("Cannot move card! \nAdding on a foundation must follow ascending value \nAce, 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King")
            }
            // moves card if both conditions are met
            else {
                // moves card and updates display
                moveFoundationCard(foundationArrayPile, moveFrom);
            }
            
        }
        
    }
    
    // card dropped on an invalid area
    else {
        console.log("Not dropped on a valid target/pile");
    }
}

// TESTING



