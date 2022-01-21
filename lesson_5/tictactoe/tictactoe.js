let readline = require('readline-sync');

class Square {
  static UNUSED_SQUARE = ' ';
  static HUMAN_MARKER = '⨯';
  static COMPUTER_MARKER = '○';

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

class Scoreboard {
  constructor(human, computer) {
    this.human = human;
    this.computer = computer;
  }

  display() {
    console.clear();
    console.log(
      `╭─────────────────┬────────────────╮
│     ${this.human}:  ${this.human.getScore()}     │  ${this.computer}:  ${this.computer.getScore()}  │
╰─────────────────┴────────────────╯`);
  }
}

class Message {
  static MESSAGE_LENGTH = 23;

  constructor(message = {}) {
    this.firstLine = message.firstLine || '';
    this.secondLine = message.secondLine || '';
  }

  display() {
    console.clear();
    console.log(`╭──────────────────────────────────╮
│                                  │
│  ╶┼─┼╴  ${this.firstLine.padStart(Message.MESSAGE_LENGTH, ' ')}  │
│  ╶┼─┼╴  ${this.secondLine.padStart(Message.MESSAGE_LENGTH, ' ')}  │
│                                  │
╰──────────────────────────────────╯\n`);
  }
}

class Board {
  constructor() {
    this.reset();
  }

  display() {
    console.log(`
          ¹    │²    │³
            ${this.squares[1]}  │  ${this.squares[2]}  │  ${this.squares[3]}
               │     │
          ─────┼─────┼─────
          ⁴    │⁵    │⁶
            ${this.squares[4]}  │  ${this.squares[5]}  │  ${this.squares[6]}
               │     │
          ─────┼─────┼─────
          ⁷    │⁸    │⁹
            ${this.squares[7]}  │  ${this.squares[8]}  │  ${this.squares[9]}
               │     │
`);
  }

  reset() {
    this.squares = {};
    for (let square = 1; square <= 9; square += 1) {
      this.squares[square] = new Square();
    }
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
}

class Player {
  constructor(marker, name) {
    this.marker = marker;
    this.name = name;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  toString() {
    return this.name;
  }

  getScore() {
    return this.score;
  }

  incrementScore() {
    this.score += 1;
  }
}

class Human extends Player {
  static NAME = 'You';

  constructor() {
    super(Square.HUMAN_MARKER, Human.NAME);
  }
}

class Computer extends Player {
  static NAME = 'Computer';

  constructor() {
    super(Square.COMPUTER_MARKER, Computer.NAME);
  }
}

class TTTGame {
  static SQUARES_TO_WIN = 3;
  static WINNING_SCORE = 3;
  static POSSIBLE_WINNING_ROWS = [
    [ '1', '2', '3' ],            // top row of board
    [ '4', '5', '6' ],            // center row of board
    [ '7', '8', '9' ],            // bottom row of board
    [ '1', '4', '7' ],            // left column of board
    [ '2', '5', '8' ],            // middle column of board
    [ '3', '6', '9' ],            // right column of board
    [ '1', '5', '9' ],            // diagonal: top-left to bottom-right
    [ '3', '5', '7' ],            // diagonal: bottom-left to top-right
  ];

  constructor() {
    this.human = new Human();
    this.computer = new Computer();
    this.scoreboard = new Scoreboard(this.human, this.computer);
    this.board = new Board();
  }

  static joinOr(arr, punctuation = ', ', conjunction = 'or') {
    return arr.length < 2 ?
      arr.join('') :
      `${arr.slice(0, arr.length - 1).join(punctuation)} ${conjunction} ${arr.slice(-1)}`;
  }

  play() {
    this.displayWelcomeMessage();
    this.playMatch();
    this.displayGoodbyeMessage();
  }

  playGame() {
    this.board.reset();

    while (true) {
      this.scoreboard.display();
      this.board.display();

      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;
    }

    this.updateMatchScore();
    this.displayGameResults();
  }

  playMatch() {
    do {
      this.playGame();
    } while (!this.matchOver() && this.playAgain());

    this.displayMatchResults();
  }

  playAgain() {
    return readline.keyInYNStrict('Would you like to play another game?');
  }

  updateMatchScore() {
    if (this.isGameWinner(this.human)) this.human.incrementScore();
    if (this.isGameWinner(this.computer)) this.computer.incrementScore();
  }

  displayWelcomeMessage() {
    const MESSAGE = {
      firstLine: 'Welcome to Tic Tac Toe!',
      secondLine: `First to ${TTTGame.WINNING_SCORE} wins.`,
    };

    this.welcomeMessage = new Message(MESSAGE);
    this.welcomeMessage.display();

    readline.question(`Press ENTER to continue... `, {hideEchoBack: true, mask: ''});
  }

  displayGoodbyeMessage() {
    const MESSAGE = {
      firstLine: 'Thanks for playing.',
      secondLine: 'Goodbye!',
    };

    this.goodbyeMessage = new Message(MESSAGE);
    this.goodbyeMessage.display();
  }

  displayGameResults() {
    this.scoreboard.display();
    this.board.display();
    let message;

    if (this.getGameWinner()) {
      message = `${this.getGameWinner()} won this round!\n`;
    } else {
      message = `It's a tie!\n`;
    }

    console.log(message);
  }

  displayMatchResults() {
    this.displayGameResults();
    let message;

    if (this.getMatchWinner()) {
      message = `★ ${this.getMatchWinner()} won the match!`;
    } else {
      message = `≜ The match ends in a tie.`;
    }
    readline.question(`${message} Press ENTER to continue... `, {hideEchoBack: true, mask: ''});
  }

  humanMoves() {
    let validChoices = this.board.unusedSquares();
    const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
    const READLINE_OPTIONS = {
      limit: validChoices,
      limitMessage: `\nSorry, that's not a valid choice.\n`,
    };

    let choice = readline.question(prompt, READLINE_OPTIONS);

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let choice = this.offensiveComputerMove();
    if (!choice) choice = this.defensiveComputerMove();
    if (!choice) choice = this.centerSquareComputerMove();
    if (!choice) choice = this.randomSquareComputerMove();

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  offensiveComputerMove() {
    return this.findCriticalSquare(this.computer);
  }

  defensiveComputerMove() {
    return this.findCriticalSquare(this.human);
  }

  centerSquareComputerMove() {
    const CENTER_SQUARE = 5;
    return this.board.isUnusedSquare(CENTER_SQUARE) ? CENTER_SQUARE : null;
  }

  randomSquareComputerMove() {
    let choice;
    let validChoices = this.board.unusedSquares();

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    return choice;
  }

  findCriticalSquare(player) {
    for (let row of TTTGame.POSSIBLE_WINNING_ROWS) {
      let key = this.criticalSquare(row, player);
      if (key) return key;
    }

    return null;
  }

  criticalSquare(row, player) {
    const CRITICAL_RUN = TTTGame.SQUARES_TO_WIN - 1;

    if (this.board.countMarkersFor(player, row) === CRITICAL_RUN) {
      let key = row.find(key => this.board.isUnusedSquare(key));
      if (key) return key;
    }

    return null;
  }

  isGameWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === TTTGame.SQUARES_TO_WIN;
    });
  }

  isMatchWinner(player) {
    return player.getScore() === TTTGame.WINNING_SCORE;
  }

  getGameWinner() {
    if (this.isGameWinner(this.human)) return this.human;
    if (this.isGameWinner(this.computer)) return this.computer;

    return null;
  }

  getMatchWinner() {
    if (this.human.score > this.computer.score) return this.human;
    if (this.human.score < this.computer.score) return this.computer;

    return null;
  }

  gameOver() {
    return this.board.isFull() ||
           this.isGameWinner(this.human) ||
           this.isGameWinner(this.computer);
  }

  matchOver() {
    return this.isMatchWinner(this.human) || this.isMatchWinner(this.computer);
  }
}

let game = new TTTGame();
game.play();