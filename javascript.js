// JavaScript file

/* jslint es6:true */
/* eslint-env es6 */
/* eslint-disable */

// Array of suits
const suits = ["hearts", "diamonds", "spades", "clubs"];

// Array of values
const values = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];

// card object
//let card = {
//    suit: null,
//    value: null,
//    color: null,
//    frontImage: null,
//    backImage: "images/deck_backing.jpg"
//}

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

//Output the deck of cards
console.log(deck.shuffle().deck);


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
function moveTableauCard(moveFrom, moveTo) {
    
    let moveToColor, moveFromColor;
        
    // try to retrieve color from top card of moveFrom tableau pile
    try {
        moveFromColor = tableau[moveFrom][tableau[moveFrom].length-1].color;
    }
    // catch if there is no card (empty tableau pile)
    catch (err) {
        moveFromColor = null;
    }
    
    // try to retrieve color from top card of moveTo tableau pile
    try{
        moveToColor = tableau[moveTo][tableau[moveTo].length-1].color;
    }
    // catch if there is no card (empty tableau pile)
    catch (err) {
        moveToColor = null;
    }
    
    // card colors are the same, display alert
    if (moveToColor == moveFromColor) {
        alert("Cannot move card! \nStacking cards on a tableau pile must be of alternating colors");
    }
    // card colors are not the same, proceed
    else {
        if (tableau[moveTo].length === 0) {
            // spare tableau spots can only be filled with kings
            fillTableauSpot(moveFrom, moveTo);
        }
        else {
            // move card from one tableau array to another 
            tableau[moveTo][tableau[moveTo].length] = tableau[moveFrom].pop();
            updateTableau(moveFrom, moveTo);
        }
    }
}

// updates tableau display after a moveTableauCard has occurred
function updateTableau(moveFrom, moveTo) {
    showNextFrontImage(moveFrom);
    removeFrontImage(moveFrom);
    showMovedFrontImage(moveTo);  
}

function showNextFrontImage(moveFrom) {
// displays next front image of the moveFrom tableau pile
    try {
        document.getElementById("tableau-"+(moveFrom+1)+"-"+tableau[moveFrom].length).src = tableau[moveFrom][tableau[moveFrom].length-1].frontImage;
    }
    // catch if there is no card (empty pile)
    catch (err){
        document.getElementById("tableau-"+(moveFrom+1)+"-1").src = "";
    }
}

function removeFrontImage(moveFrom) {
// removes front image of the moveFrom tableau pile
    document.getElementById("tableau-"+(moveFrom+1)+"-"+(tableau[moveFrom].length+1)).src = "";
}

function showMovedFrontImage(moveTo) {
// displays the moveFrom card in the moveTo tableau pile
    document.getElementById("tableau-"+(moveTo+1)+"-"+tableau[moveTo].length).src = tableau[moveTo][tableau[moveTo].length-1].frontImage;    
}

// spare tableau spots can only be filled with kings
function fillTableauSpot(moveFrom, moveTo) { 
    if (tableau[moveFrom][tableau[moveFrom].length-1].value === "king") {
        // remove card from moveFrom pile and move to moveTo pile
        tableau[moveTo][tableau[moveTo].length] = tableau[moveFrom].pop();
        updateTableau(moveFrom, moveTo);
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
    if (tableau[moveFrom][tableau[moveFrom].length-1].value === "ace") {
        
        // moves the moveFrom tableau card to the foundationPile
        foundation[foundationPile][foundation[foundationPile].length] = tableau[moveFrom].pop();
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

                // zindex to keep the layer to 0
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


// TESTING

// very helpful youtube video to understand drag and drop feature
// https://www.youtube.com/watch?v=C22hQKE_32c
// click and drag testing

// waste pile element
const wasteQuery = document.querySelector('.waste');
// foundation pile elements
const foundations = document.querySelectorAll('.foundation');
// tableau pile elements
const tableaus = document.querySelectorAll('.tableau');

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
    tableau.addEventListener('dragover', dragOver);
    tableau.addEventListener('drop', dragDrop);
}

// drag functions

// triggers when the drag is started
function dragStart(event) {
    console.log('start');
    this.className += ' hold';
    setTimeout(() => this.className = 'invisible', 0);
}

// triggers when the drag is released
function dragEnd() {
    console.log('end');
    // return card back to pile if not dropped on a valid pile
    this.className = 'waste'
}

// triggers when a drag and hold is over a pile
function dragOver(e) {
    e.preventDefault();
    console.log('over');
}

// triggers when a drag and hold is dropped on a pile
function dragDrop(event) {
    console.log('drop');
    // card moving from waste
    let moveCard = waste[waste.length-1];
    
    // identify pile where dropped
    let dropped = event.target;
    let droppedTargetSplit = dropped.id.split('-');
    
    // card dropped on a tableau pile
    if (droppedTargetSplit[0] == "tableau") {
        let tableauArrayPile = droppedTargetSplit[1]-1;
        let tableauArrayCard = droppedTargetSplit[2]-1;
        let tPile = tableau[tableauArrayPile][tableauArrayCard];
        
        
        console.log(tPile);
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
    
    
    
    // when dropped onto td tag
//    try {
//        dropped = event.target.childNodes[1].id;    
//    }
    // when dropped onto img tag
//    catch (e) { 
//        dropped = event.target.id;
//    }

    console.log(dropped);
    console.log(moveCard);
}



// Index/Hidden test -------------

//document.getElementById("test").hidden = "true";

//var t1 = document.getElementById("test");
//if (t1.firstElementChild.src = "") {
//    t1.hidden = "true";
//}



  


//var list = document.getElementById("container").getElementsByTagName("td");
//for (i = 0; i < list.length; i++) {
//    let image = list[i].firstElementChild;
//    if (image.style.display == "none") {
//        list[i].style.zIndex = "-1";
//    }
//}

// Another option to try: surround <img> with <object type="image/jpeg"></object> (gets rid of broken img icon and alt text, but won't load card from js). Will also require setting index to -1