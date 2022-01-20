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
  constructor() {

  }

  display() {
    console.clear();
    console.log('Human vs. Computer');
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
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
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
    this.scoreboard = new Scoreboard();
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  static joinOr(arr, punctuation = ', ', conjunction = 'or') {
    return arr.length < 2 ?
      arr.join('') :
      `${arr.slice(0, arr.length - 1).join(punctuation)} ${conjunction} ${arr.slice(-1)}`;
  }

  play() {
    this.displayWelcomeMessage();

    do {
      this.playGame();
    } while (this.playAgain());

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

    this.displayResults();
  }

  playAgain() {
    const LIMIT = ['Y', 'y', 'N', 'n'];
    const READLINE_OPTIONS = {
      limit: LIMIT,
      limitMessage: `Please enter one of the following options: ${TTTGame.joinOr(LIMIT)}`
    };

    return readline.question('Would you like to play again? (y/n): ', READLINE_OPTIONS) === 'y';
  }

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to Tic Tac Toe!`);
    readline.question(`\nPress ENTER to continue...`, {hideEchoBack: true, mask: ''});
  }

  displayGoodbyeMessage() {
    console.clear();
    console.log('Thanks for playing Tic Tac Toe. Goodbye!\n');
  }

  displayResults() {
    this.scoreboard.display();
    this.board.display();
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) {
        break;
      }

      console.log(`Sorry, that's not a valid choice\n`);
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }
}

let game = new TTTGame();
game.play();