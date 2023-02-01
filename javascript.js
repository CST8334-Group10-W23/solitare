// JavaScript file

// Array of suits
const suits = ["hearts", "diamonds", "spades", "clubs"];

// Array of values
const values = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];

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
        this.deck.push(`${value} of ${suit}`);
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