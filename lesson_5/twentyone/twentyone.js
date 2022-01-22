let readline = require('readline-sync');

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

  displaySingleLine() {
    console.log(`╭─────${'─'.repeat(this.message[0].length)}──╮
│  🃟  ${this.message[0]}  │
╰─────${'─'.repeat(this.message[0].length)}──╯\n`);
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
  static LOW_ACE_SCORE = 1;
  static HIGH_ACE_SCORE = 11;

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.setPoints();
    this.setAceStatus();
    this.hidden = false;
  }

  setAceStatus(status = true) {
    if (this.isAce()) this.aceHigh = status;
  }

  setPoints() {
    const ROYALTY_SCORE = 10;

    if (this.isRoyalty()) this.points = ROYALTY_SCORE;
    else if (this.isAce()) this.points = Card.HIGH_ACE_SCORE;
    else this.points = Number(this.getRank());
  }

  isRoyalty() {
    const ROYALTY_RANKS = ['J', 'Q', 'K'];
    return ROYALTY_RANKS.includes(this.getRank());
  }

  isAce() {
    const ACE = 'A';
    return this.getRank() === ACE;
  }

  isHighAce() {
    return this.isAce() && this.getAceHigh();
  }

  setAceLow() {
    this.aceHigh = false;
    this.points = Card.LOW_ACE_SCORE;
  }

  getAceHigh() {
    return this.aceHigh;
  }

  getPoints() {
    return this.points;
  }

  hide() {
    this.hidden = true;
  }

  unhide() {
    this.hidden = false;
  }

  isHidden() {
    return this.hidden;
  }

  getSuit() {
    return this.suit;
  }

  getRank() {
    return this.rank;
  }
}

class Deck extends Array {
  static SUITS = ['♠', '♥', '♦', '♣'];
  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  constructor() {
    super();
    this.createNewDeck();
  }

  createNewDeck() {
    for (let suit of Deck.SUITS) {
      for (let rank of Deck.RANKS) {
        this.push(new Card(suit, rank));
      }
    }

    return this.cards;
  }

  dealRandomCard() {
    let index = Math.floor(Math.random() * this.length);
    let card = this.splice(index, 1)[0];
    return card;
  }
}

class Participant {
  constructor() {
    this.name = null;
    this.resetHand();
    this.resetScore();
  }

  getName() {
    return this.name;
  }

  getHand() {
    return this.hand;
  }

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
  }

  displayScore() {
    console.log(`${this.name}: ${this.score} points`);
  }

  resetScore() {
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  getLastCardDealt() {
    return this.hand.at(-1);
  }

  resetHand() {
    this.hand = [];
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

  choosesToHit() {
    const QUESTION = 'Hit or stay?';
    return this.askPlayerBool(QUESTION, 'h', 's');
  }

  choosesToPlayAgain() {
    const QUESTION = 'Would you like to continue playing?';
    return this.askPlayerBool(QUESTION, 'y', 'n');
  }

  getWinnings() {
    return this.dollars - Player.STARTING_DOLLARS;
  }

  askPlayerBool(question, trueKeyIn = 'y', falseKeyIn = 'n') {
    const READLINE_OPTIONS = {
      limit: trueKeyIn + falseKeyIn,
    };

    return readline.keyIn(`${question} [${trueKeyIn}/${falseKeyIn}]: `, READLINE_OPTIONS) === trueKeyIn;
  }

  lostBet() {
    this.dollars -= 1;
  }

  wonBet() {
    this.dollars += 1;
  }

  displayDollars() {
    let money = Array(this.dollars).fill('$');
    let missing = Array(Player.WINNING_DOLLARS - this.dollars).fill('_');
    console.log(`╭───────────────────────────────╮
│  Wallet: ${money.concat(missing).join(' ')}  │
╰───────────────────────────────╯`);
  }

  getDollars() {
    return this.dollars;
  }

  isBroke() {
    return this.dollars === 0;
  }

  isRich() {
    return this.dollars === Player.WINNING_DOLLARS;
  }
}

class Dealer extends Participant {
  static SECOND_CARD_INDEX = 1;

  constructor(deck) {
    super();
    this.deck = deck;
    this.name = 'Dealer';
  }

  hideSecondCard() {
    this.hand[Dealer.SECOND_CARD_INDEX].hide();
  }

  unhideSecondCard() {
    this.hand[Dealer.SECOND_CARD_INDEX].unhide();
  }

  dealCard(player) {
    let card = this.deck.dealRandomCard();
    player.hand.push(card);
  }

  isBelowScoreThreshold() {
    const DEALER_HIT_SCORE_THRESHOLD = 17;
    return this.score < DEALER_HIT_SCORE_THRESHOLD;
  }
}

class TwentyOneGame {
  static CARDS_IN_INITIAL_HAND = 2;
  static TARGET_SCORE = 21;

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

    if (this.player.isBroke() || this.player.isRich()) this.waitForEnter();

    this.displayGoodbyeMessage();
  }

  setUpTable() {
    this.deck.createNewDeck();
    this.player.resetHand();
    this.dealer.resetHand();
    this.player.resetScore();
    this.dealer.resetScore();
  }

  playRound() {
    this.dealCards();
    this.displayTable();
    this.playerTurn();
    this.dealerTurn();
    this.settleUp();
    this.displayRoundResults();
  }

  dealCards() {
    for (let card = 0; card < TwentyOneGame.CARDS_IN_INITIAL_HAND; card += 1) {
      this.dealer.dealCard(this.dealer);
      this.updateScore(this.dealer);
      this.dealer.dealCard(this.player);
      this.updateScore(this.player);
    }

    this.dealer.hideSecondCard();
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
    this.dealer.unhideSecondCard();
    this.displayTable();

    while (!this.isBusted(this.player) && this.dealer.isBelowScoreThreshold()) {
      this.dealer.dealCard(this.dealer);
      this.updateScore(this.dealer);
      this.displayTable();
    }
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

  displayRoundResults() {
    let result = this.getWinner() ?
      `${this.getWinner().getName()} won!` :
      `It's a tie.`;
    let bustMessage = this.whoBusted() ? ` ${this.whoBusted().getName()} busted.` : ``;
    let message = new Message(result + bustMessage);

    this.displayTable();
    message.displaySingleLine();
  }

  settleUp() {
    if (this.isWinner(this.player)) this.player.wonBet();
    else if (this.isWinner(this.dealer)) this.player.lostBet();
  }

  whoBusted() {
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
      return undefined;
    } else {
      return this.player.getScore() > this.dealer.getScore() ?
        this.player : this.dealer;
    }
  }

  isWinner(player) {
    return (player === this.getWinner());
  }

  waitForEnter() {
    readline.question(`Press ENTER to continue... `, {hideEchoBack: true, mask: ''});
  }

  isBusted(player) {
    return player.getScore() > TwentyOneGame.TARGET_SCORE;
  }

  updateScore(player) {
    let card = player.getLastCardDealt();

    player.score += card.getPoints();
    this.updateScoreWithAces(player);
  }

  updateScoreWithAces(player) {
    let highAces = player.getHand().filter(card => card.isHighAce());

    while (player.getScore() > TwentyOneGame.TARGET_SCORE && highAces.length) {
      let ace = highAces.pop();
      ace.setAceLow();
      player.score -= (Card.HIGH_ACE_SCORE - Card.LOW_ACE_SCORE);
    }
  }
}

let game = new TwentyOneGame();
game.play();