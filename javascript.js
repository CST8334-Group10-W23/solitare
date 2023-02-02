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



// TESTING

// stock pile
const stock = stockPile();

// tableau piles
const tableau = [[],[],[],[],[],[],[]];
let x = 0;

setupTableau()
console.log(tableau);
    
// change the img src to the correct back image
//    document.getElementById("tableau-"+y+"-"+x).src = tableau[0][tableau[i].length-1].backImage;

// setup tableau
function setupTableau() {
    for (let i=0;i < 7;i++) {
    x +=1;
    dealCards(i);
    displayTopCard(i, x)
    }
}

// displays top card of tableau pile
function displayTopCard(i,x) {
    document.getElementById("tableau-"+x+"-"+x).src = tableau[i][tableau[i].length-1].frontImage;
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