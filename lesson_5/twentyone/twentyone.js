const readline = require('readline-sync');
const shuffle = require('shuffle-array');

class Message {
  static MESSAGE_LENGTH = 23;
  static MESSAGE_LINES = 5;

  constructor(message = []) {
    this.message = [];

    if (!Array.isArray(message)) message = [message];

    for (let line = 0; line < Message.MESSAGE_LINES; line += 1) {
      this.message.push(message[line] || '');
    }
  }

  displaySingleLine(icon = '') {
    let iconLength = icon ? 3 : 0;

    console.log(`╭──${'─'.repeat(iconLength)}${'─'.repeat(this.message[0].length)}──╮
│  ${icon}${icon ? '  ' : ''}${this.message[0]}  │
╰──${'─'.repeat(iconLength)}${'─'.repeat(this.message[0].length)}──╯\n`);
  }

  displayFull() {
    console.clear();
    console.log(`╭─────────────${'─'.repeat(Message.MESSAGE_LENGTH)}──╮
│  ╭───────╮  ${' '.repeat(Message.MESSAGE_LENGTH)}  │
│  │21     │  ${this.message[0].padStart(Message.MESSAGE_LENGTH)}  │
│  │♥      │  ${this.message[1].padStart(Message.MESSAGE_LENGTH)}  │ 
│  │       │  ${this.message[2].padStart(Message.MESSAGE_LENGTH)}  │
│  │      ♥│  ${this.message[3].padStart(Message.MESSAGE_LENGTH)}  │
│  │     21│  ${this.message[4].padStart(Message.MESSAGE_LENGTH)}  │
│  ╰───────╯  ${' '.repeat(Message.MESSAGE_LENGTH)}  │
╰─────────────${'─'.repeat(Message.MESSAGE_LENGTH)}──╯\n`);
  }
}

class Card {
  static LOW_ACE_POINTS = 1;
  static HIGH_ACE_POINTS = 11;
  static ACE_POINT_DIFFERENTIAL = Card.HIGH_ACE_POINTS - Card.LOW_ACE_POINTS;

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.setPoints();
    this.setAceHigh();
    this.hidden = false;
  }

  getAceHigh() {
    return this.aceHigh;
  }

  getPoints() {
    return this.points;
  }

  getRank() {
    return this.rank;
  }

  getSuit() {
    return this.suit;
  }

  setAceHigh(status = true) {
    if (this.isAce()) this.aceHigh = status;
  }

  setAceLow() {
    if (this.isAce()) {
      this.aceHigh = false;
      this.points = Card.LOW_ACE_POINTS;
    }
  }

  setPoints() {
    const ROYALTY_POINTS = 10;

    if (this.isRoyalty()) this.points = ROYALTY_POINTS;
    else if (this.isAce()) this.points = Card.HIGH_ACE_POINTS;
    else this.points = Number(this.getRank());
  }

  isAce() {
    const ACE = 'A';
    return this.getRank() === ACE;
  }

  isAceHigh() {
    return this.isAce() && this.getAceHigh();
  }

  isRoyalty() {
    const ROYALTY_RANKS = ['J', 'Q', 'K'];
    return ROYALTY_RANKS.includes(this.getRank());
  }

  isHidden() {
    return this.hidden;
  }

  hide() {
    this.hidden = true;
  }

  unhide() {
    this.hidden = false;
  }

}

class Deck {
  static SUITS = ['♠', '♥', '♦', '♣'];
  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  constructor() {
    this.createNewDeck();
  }

  createNewDeck() {
    this.cards = [];

    for (let suit of Deck.SUITS) {
      for (let rank of Deck.RANKS) {
        this.cards.push(new Card(suit, rank));
      }
    }

    this.shuffleCards();
  }

  getAndRemoveCard() {
    return this.cards.pop();
  }

  shuffleCards() {
    shuffle(this.cards);
  }
}

let Score = {
  getScore() {
    return this.score;
  },

  setScore(score) {
    this.score = score;
  },

  resetScore() {
    this.score = 0;
    this.hidden = false;
  },

  isHidden() {
    return this.hidden === true;
  },

  hideScore() {
    this.hidden = true;
  },

  unhideScore() {
    this.hidden = false;
  },

  displayScore() {
    let score = this.isHidden() ? '??' : this.getScore();
    console.log(`${this.name}: ${score} points`);
  },
};

let Hand = {
  getHand() {
    return this.hand;
  },

  getLastCardDealt() {
    return this.hand.at(-1);
  },

  resetHand() {
    this.hand = [];
  },

  hideCard(cardNumber) {
    this.hand[cardNumber - 1].hide();
  },

  unhideCard(cardNumber) {
    this.hand[cardNumber - 1].unhide();
  },

  displayHand() {
    const CARD_HEIGHT = 7;
    const HIDDEN_SUIT_STRING = ' ';
    const HIDDEN_RANK_STRING = '?';

    let cardRows = this.hand.reduce((cardRows, card) => {
      let rank = card.isHidden() ? HIDDEN_RANK_STRING : card.getRank();
      let suit = card.isHidden() ? HIDDEN_SUIT_STRING : card.getSuit();
      cardRows[0].push(`╭───────╮`);
      cardRows[1].push(`│${rank.padEnd(2, ' ')}     │`);
      cardRows[2].push(`│${suit}      │`);
      cardRows[3].push(`│       │`);
      cardRows[4].push(`│      ${suit}│`);
      cardRows[5].push(`│     ${rank.padStart(2, ' ')}│`);
      cardRows[6].push(`╰───────╯`);

      return cardRows;
    }, [...Array(CARD_HEIGHT)].map(() => []));

    cardRows.forEach(cardRow => {
      console.log(cardRow.join(' '));
    });
  },
};

class Participant {
  constructor() {
    this.name = null;
    Object.assign(this, Hand);
    Object.assign(this, Score);
    this.resetHand();
    this.resetScore();
  }

  getName() {
    return this.name;
  }
}

class Player extends Participant {
  static STARTING_DOLLARS = 5;
  static WINNING_DOLLARS = 10;

  constructor(name) {
    super();
    this.dollars = Player.STARTING_DOLLARS;
    this.name = name;
  }

  getDollars() {
    return this.dollars;
  }

  getWinnings() {
    return this.dollars - Player.STARTING_DOLLARS;
  }

  isBroke() {
    return this.dollars === 0;
  }

  isRich() {
    return this.dollars === Player.WINNING_DOLLARS;
  }


  lostBet() {
    this.dollars -= 1;
  }

  wonBet() {
    this.dollars += 1;
  }

  askBool(question, trueKeyIn = 'y', falseKeyIn = 'n') {
    const READLINE_OPTIONS = {
      limit: trueKeyIn + falseKeyIn,
    };

    return readline.keyIn(`${question} [${trueKeyIn}/${falseKeyIn}]: `, READLINE_OPTIONS) === trueKeyIn;
  }

  choosesToHit() {
    const QUESTION = 'Hit or stay?';
    return this.askBool(QUESTION, 'h', 's');
  }

  choosesToPlayAgain() {
    const QUESTION = 'Would you like to continue playing?';
    return this.askBool(QUESTION, 'y', 'n');
  }

  displayDollars() {
    let money = Array(this.dollars).fill('$');
    let empty = Array(Player.WINNING_DOLLARS - this.dollars).fill('_');
    let message = `Wallet: ${money.concat(empty).join(' ')}`;

    new Message(message).displaySingleLine();
  }
}

class Dealer extends Participant {
  constructor(deck) {
    super();
    this.deck = deck;
    this.name = 'Dealer';
    this.hideScore();
  }

  isBelowScoreThreshold() {
    const DEALER_HIT_SCORE_THRESHOLD = 17;
    return this.score < DEALER_HIT_SCORE_THRESHOLD;
  }

  dealCard(player) {
    let card = this.deck.getAndRemoveCard();
    player.hand.push(card);
  }
}

class TwentyOneGame {
  static CARDS_IN_INITIAL_HAND = 2;
  static TARGET_SCORE = 21;
  static HIDDEN_CARD_NUMBER = 2;

  constructor() {
    this.deck = new Deck();
    this.dealer = new Dealer(this.deck);
    this.player = new Player('You');
  }

  play() {
    this.displayWelcomeMessage();

    do {
      this.playRound();
      this.setUpTable();
    } while (!this.player.isBroke() &&
             !this.player.isRich() &&
             this.player.choosesToPlayAgain());

    if (this.player.isBroke() || this.player.isRich()) {
      this.displayCommentOnWealth();
    }

    this.displayGoodbyeMessage();
  }

  playRound() {
    this.dealCards();
    this.displayTable();
    this.playerTurn();
    this.dealerTurn();
    this.settleUp();
    this.displayRoundResults();
  }

  setUpTable() {
    this.deck.createNewDeck();
    this.player.resetHand();
    this.dealer.resetHand();
    this.player.resetScore();
    this.dealer.resetScore();
    this.dealer.hideScore();
  }

  dealCards() {
    for (let card = 0; card < TwentyOneGame.CARDS_IN_INITIAL_HAND; card += 1) {
      this.dealer.dealCard(this.dealer);
      this.updateScore(this.dealer);
      this.dealer.dealCard(this.player);
      this.updateScore(this.player);
    }

    this.dealer.hideCard(TwentyOneGame.HIDDEN_CARD_NUMBER);
  }

  displayTable() {
    console.clear();
    this.player.displayDollars();
    this.dealer.displayScore();
    this.dealer.displayHand();
    this.player.displayScore();
    this.player.displayHand();
  }

  playerTurn() {
    while (!this.isBusted(this.player) && this.player.choosesToHit()) {
      this.dealer.dealCard(this.player);
      this.updateScore(this.player);
      this.displayTable();
    }
  }

  dealerTurn() {
    this.dealer.unhideScore();
    this.dealer.unhideCard(TwentyOneGame.HIDDEN_CARD_NUMBER);
    this.displayTable();

    while (!this.isBusted(this.player) && this.dealer.isBelowScoreThreshold()) {
      this.dealer.dealCard(this.dealer);
      this.updateScore(this.dealer);
      this.displayTable();
    }
  }

  updateScore(player) {
    let card = player.getLastCardDealt();

    player.setScore(player.getScore() + card.getPoints());
    this.updateScoreWithAces(player);
  }

  updateScoreWithAces(player) {
    let highAces = player.getHand().filter(card => card.isAceHigh());

    while (player.getScore() > TwentyOneGame.TARGET_SCORE && highAces.length) {
      let ace = highAces.pop();
      ace.setAceLow();
      player.setScore(player.getScore() - (Card.ACE_POINT_DIFFERENTIAL));
    }
  }

  settleUp() {
    if (this.isWinner(this.player)) this.player.wonBet();
    else if (this.isWinner(this.dealer)) this.player.lostBet();
  }

  getBusted() {
    if (this.isBusted(this.player)) return this.player;
    else if (this.isBusted(this.dealer)) return this.dealer;
    else return null;
  }

  getWinner() {
    if (this.isBusted(this.player)) {
      return this.dealer;
    } else if (this.isBusted(this.dealer)) {
      return this.player;
    } else if (this.player.getScore() === this.dealer.getScore()) {
      return null;
    } else {
      return this.player.getScore() > this.dealer.getScore() ?
        this.player : this.dealer;
    }
  }

  isBusted(player) {
    return player.getScore() > TwentyOneGame.TARGET_SCORE;
  }

  isWinner(player) {
    return (player === this.getWinner());
  }

  displayWelcomeMessage() {
    const WELCOME_MESSAGE = [
      'Welcome to 21.',
      'Good luck!',
    ];
    let message = new Message(WELCOME_MESSAGE);

    message.displayFull();
    this.waitForEnter();
  }

  displayRoundResults() {
    let result = this.getWinner() ?
      `${this.getWinner().getName()} won!` :
      `It's a tie.`;
    let bustMessage = this.getBusted() ? ` ${this.getBusted().getName()} busted.` : ``;
    let message = new Message(result + bustMessage);

    this.displayTable();
    message.displaySingleLine('🃟');
  }

  displayCommentOnWealth() {
    let wealthMessage;

    if (this.player.isBroke()) wealthMessage = `You're out of money!`;
    if (this.player.isRich()) wealthMessage = `Your pockets are full!`;

    new Message(wealthMessage).displaySingleLine('‼');
    this.waitForEnter();
  }

  displayGoodbyeMessage() {
    let result = `${this.player.getName()} `;

    if (this.player.getWinnings() > 0) result += 'won';
    else if (this.player.getWinnings() < 0) result += 'lost';
    else result += 'broke even';

    let winnings = Math.abs(this.player.getWinnings()) || '';
    let firstLine = `${result}${winnings ? ` $${winnings}` : ''}.`;
    let secondLine;

    if (this.player.isBroke()) secondLine = `You're broke!`;
    else if (this.player.isRich()) secondLine = `You're rich!`;

    const GOODBYE_MESSAGE = [
      firstLine,
      secondLine,
      '',
      'Thanks for playing 21!',
      'Goodbye.',
    ];
    let message = new Message(GOODBYE_MESSAGE);

    message.displayFull();
  }

  waitForEnter() {
    readline.question(`Press ENTER to continue... `, {hideEchoBack: true, mask: ''});
  }
}

let game = new TwentyOneGame();
game.play();