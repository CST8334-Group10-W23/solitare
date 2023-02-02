// JavaScript file

/* jslint es6:true */
/* eslint-env es6 */
/* eslint-disable */

// Array of suits
const suits = ["hearts", "diamonds", "spades", "clubs"];

// Array of values
const values = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];

// card object
let card = {
    suit: null,
    value: null,
    color: null
}

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

const tableauOne = [];

// take the last item from the array and put it into a card object
card.value = deck.deck[deck.deck.length-1].split("_")[0];
card.suit = deck.deck[deck.deck.length-1].split("_")[2];

// identifies the card color
if (card.suit == "diamonds" || card.suit == "hearts") {
    card.color = "red";
} else{
    card.color = "black";
}

// send card to tableauOne
tableauOne.push(card); 
console.log(tableauOne);

// changes the img src to the correct front image of the card
document.getElementById("test").src = "images/"+deck.deck[deck.deck.length-1]+".png";

// remove the card from the deck
deck.deck.pop();
