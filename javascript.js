// JavaScript file

/* jslint es6:true */
/* eslint-env es6 */
/* eslint-disable */

function newGame() {
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

    // Create a new deck of cards
    const deck = new Deck();
    
    // return the creation of the deck
    return deck.shuffle().deck;
}

// creation of the deck
let deck = createDeck();

// output the deck of cards
console.log(deck);

// variable names of counters in the for loops should probably be more clear
// daniel will *hopefully* clean it up after the first assignment
// x identifies the tableau pile id
// i identifies the array pile

// stock pile
const stock = stockPile();

// tableau piles
const tableau = [[],[],[],[],[],[],[]];
let x = 0;

// foundation piles
const foundation = [[],[],[],[]];

// waste pile
const waste = [];

setupTableau()
console.log(tableau);
    
// setup tableau
function setupTableau() {
    for (let i=0;i < 7;i++) {
        x = i+1;
        dealCards(i);
        displayBottomCards(i,x);
        displayTopCard(i,x);
        layerSetup();
    }
}

// displays back image of bottom cards from the tableau piles
function displayBottomCards(i,x) {
    // any tableau piles with more than one card
    if (tableau[i].length > 1) {
        // first loop
        // "a" identifies the card position in the array
        for (let a=0; a < tableau[i].length-1; a++){
            // second loop
            // "b" identifies the tableau card id
            for (let b=1; b < tableau[i].length; b++) {
                document.getElementById("tableau-"+x+"-"+b).src = tableau[i][a].backImage;
                document.getElementById("tableau-"+x+"-"+b).style.display = "";
            }
        }
    }
}

// displays front image of top cards from the tableau piles
function displayTopCard(i,x) {
    try {
        document.getElementById("tableau-"+x+"-"+x).src = tableau[i][tableau[i].length-1].frontImage;
        document.getElementById("tableau-"+x+"-"+x).style.display = "";
    }
    // displays nothing as the img src if the tableau pile is 0
    catch (err) {
        document.getElementById("tableau-"+x+"-"+x).style = "none";
        document.getElementById("tableau-"+x+"-"+x).style.zIndex = "-1";
    }
}

// loops through tableau piles from left to right
// and places cards into tableau piles
function dealCards(num) {
    // loops through piles
    for (let i=num; i < 7; i++) {
        
    // place card into tableau pile
    tableau[i].push(stock[stock.length-1]);
        
    // remove card from stock pile
    stock.pop();
    }    
}

// create card objects from the deck
function setCard(deck) {
    // take the last card from the deck and gather details
    value = deck[deck.length-1].split("_")[0];    
    suit = deck[deck.length-1].split("_")[2];
    frontImage = "images/"+deck[deck.length-1]+".png";

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
    deck.pop();
    
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
function moveTableauCard(moveFrom, moveTo) {
        
    let moveToColor, moveFromColor;
        
    // try to retrieve color from top card of moveFrom pile
    try {
//        moveFromColor = tableau[moveFrom][tableau[moveFrom].length-1].color;
        moveFromColor = moveFrom[moveFrom.length-1].color;
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
        fillTableauSpot(moveFrom, moveTo);
    }
    
    // checks if the tableau card exists
    // avoids undefined objects being moved to tableau piles
    else if (moveFrom.length === 0) {
        alert("Cannot move a card from a pile that has no card to move");
    }
    
    // cards can only be stacked in the proper order 
    else if (checkOrder(moveFrom,moveTo)) {
        alert("Cards can only be stacked in descending order.\nKing, Queen, Jack, 10, 9, 8, 7, 6, 5, 4, 3, 2, Ace");
    }
    
    // card colors are not the same, proceed
    else {
            // move card from one array pile to another
            tableau[moveTo][tableau[moveTo].length] = moveFrom.pop();
            updateDisplay(moveFrom, moveTo);
            
            // identify the tableau row
            let tableauRow = document.getElementById("tableau"+(moveTo+1)+"-row"+(tableau[moveTo].length));

            // change the zIndex on the tableauRow to layer it on top
            tableauRow.style.zIndex = (tableau[moveTo].length)*10;  
    }
}

// check value order of cards being moved
function checkOrder(moveFrom, moveTo) {
    // get values of the cards being moved and stacked on
    let valueFrom = values.indexOf(moveFrom[moveFrom.length-1].value);
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

// updates tableau display after a moveTableauCard has occurred
function updateDisplay(moveFrom, moveTo) {
    showNextFrontImage(moveFrom);
    removeFrontImage(moveFrom);
    showMovedFrontImage(moveTo);  
}

function showNextFrontImage(moveFrom) {

    if (whatClass[0] === "tableau") { 
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

function removeFrontImage(moveFrom) {
    
    if (whatClass[0] === "tableau") {
        // identify img element id
        let imgId = document.getElementById("tableau-"+tableauColFrom+"-"+(moveFrom.length+1));

        // if the pile will be empty after the move
        if (moveFrom.length == 0){
            // keeps an img element available
            // this is to make sure a card can still be placed on the empty pile afterwards
            imgId.src = "images/blank_card.png";
        }

        // another card is available
        else {
            // removes front image of the moveFrom tableau pile   
            imgId.src = "";
            imgId.style.display = "none";

            // layers row to the background
            let row = document.getElementById("tableau"+tableauColFrom+"-row"+(moveFrom.length+1));
            row.style.zIndex = 0;
        }
    }

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
    if (moveFrom[moveFrom.length-1].value === "king") {
        // remove card from moveFrom pile and move to moveTo pile
        tableau[moveTo][tableau[moveTo].length] = moveFrom.pop();
        updateDisplay(moveFrom, moveTo);
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
        
        // moves the moveFrom tableau card to the foundationPile
        foundation[foundationPile][foundation[foundationPile].length] = moveFrom.pop();
        // removes the tableau front card image in the moveFrom pile
        removeFrontImage(moveFrom);
        // displays the next tableau front card image in the moveFrom pile
        showNextFrontImage(moveFrom);
        // displays foundation front card image        
        displayFoundationImage(foundationPile);
    } 
    else { 
      alert("Cannot move card! \nOnly aces can be the base of a foundation");
    }
  }  
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

let whatClass;
let tableauColFrom;

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
    tableau.addEventListener('dragstart', dragStart);
    tableau.addEventListener('dragend', dragEnd);
    tableau.addEventListener('dragover', dragOver);
    tableau.addEventListener('drop', dragDrop);
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
    
}

// triggers when the drag is released
function dragEnd() {
    console.log('end');
    // return card back to waste pile if not dropped on a valid pile
    if (whatClass[0] == "waste") {
        this.className = "waste";
    }
    // return card back to tableau pile if not dropped on a valid pile
    else if (whatClass[0] == "tableau") {
        this.className = whatClass[0]+" "+whatClass[1]+" "+whatClass[2];
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
    let droppedTargetSplit = dropped.id.split('-');
    
    // card moving from waste pile
    if (whatClass[0] == "waste") {
        moveFrom = waste;
        moveCard = waste[waste.length-1];
    } 
    
    // card moving from tableau pile
    else if (whatClass[0] == "tableau") {
        // identify the card that the tableau pile is being moved from
        moveFrom = tableau[(whatClass[1].slice(11))-1];
        
        // moveCard not being used yet
        moveCard = moveFrom[moveFrom.length-1];         
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
        moveTableauCard(moveFrom, moveTo);
    } 
    
    // card dropped on a foundation pile
    else if (droppedTargetSplit[0] == "foundation") {
        let foundationArrayPile = droppedTargetSplit[1]-1;
        let fPile = foundation[foundationArrayPile];
        
        console.log(fPile);
    }
    
    // card dropped on an invalid area
    else {
        console.log("Not dropped on a valid target/pile");
    }
}
}

newGame();


// TESTING