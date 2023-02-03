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

setupTableau()
console.log(tableau);
    
// setup tableau
function setupTableau() {
    for (let i=0;i < 7;i++) {
    x = i+1;
    dealCards(i);
    displayBottomCards(i,x);
    displayTopCard(i,x);
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
            }
        }
    }
}

// displays front image of top cards from the tableau piles
function displayTopCard(i,x) {
    try {
        document.getElementById("tableau-"+x+"-"+x).src = tableau[i][tableau[i].length-1].frontImage;
    }
    // displays nothing as the img src if the tableau pile is 0
    catch (err) {
        document.getElementById("tableau-"+x+"-"+x).src = "";
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

// TESTING

// move card
function moveCard(moveTo, moveFrom) {
    // move card from one tableau array to another 
    tableau[moveTo][tableau[moveTo].length] = tableau[moveFrom].pop();
    
    // removes front image of the moveFrom tableau pile
    document.getElementById("tableau-"+(moveFrom+1)+"-"+(tableau[moveFrom].length+1)).src = "";
    
    // displays next front image of the moveFrom tableau pile
    document.getElementById("tableau-"+(moveFrom+1)+"-"+tableau[moveFrom].length).src = tableau[moveFrom][tableau[moveFrom].length-1].frontImage;
    
    // end cards need to be fixed a bit, but overall it works!
    // displays the moveFrom card in the moveTo tableau pile
    document.getElementById("tableau-"+(moveTo+1)+"-"+tableau[moveTo].length).src = tableau[moveTo][tableau[moveTo].length-1].frontImage;
}

// can't click on elements that are underneath another element
// this could be because of the table's, td's, and img's blocking the elements underneath?

// doesn't work
document.getElementById("tableau-1-1").addEventListener("click", function(){ alert("clicked on tableau-1-1"); });
// doesn't work
document.getElementById("tableau-1-12").addEventListener("click", function(){ alert("clicked on tableau-1-12"); });
// works
document.getElementById("tableau-1-13").addEventListener("click", function(){ alert("clicked on tableau-1-13"); });
// works
document.getElementById("hand").addEventListener("click", function(){ alert("clicked on hand pile"); });



