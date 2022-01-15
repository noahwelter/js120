const readline = require('readline-sync');

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  winningScore: 5,
  matchNumber: 0,
  matchWinner: null,
  choiceTable: {
    rock: {
      beats: ['lizard', 'scissors'],
      inputOptions: ['r', 'ro', 'rock'],
    },
    paper: {
      beats: ['rock', 'spock'],
      inputOptions: ['p', 'pa', 'paper'],
    },
    scissors: {
      beats: ['paper', 'lizard'],
      inputOptions: ['sc', 'scissors'],
    },
    lizard: {
      beats: ['spock', 'paper'],
      inputOptions: ['l', 'li', 'lizard'],
    },
    spock: {
      beats: ['scissors', 'rock'],
      inputOptions: ['sp', 'spock'],
    },
  },
  playAgainOptions: {
    yes: ['y', 'yes'],
    no: ['n', 'no']
  },

  displayWelcomeMessage() {
    console.clear();
    console.log(
      `╭─────────────────────────────────────────────────────╮\n` +
      `│                                                     │\n` +
      `│  ●  ●  ●  ●  ●  ●  ●  ●  ●                    Rock  │\n` +
      `│    ■  ■  ■  ■  ■  ■  ■  ■  ■                 Paper  │\n` +
      `│      ✂  ✂  ✂  ✂  ✂  ✂  ✂  ✂  ✂            Scissors  │\n` +
      `│        𓆈  𓆈  𓆈  𓆈  𓆈  𓆈  𓆈  𓆈  𓆈            Lizard  │\n` +
      `│           𓂈  𓂈  𓂈  𓂈  𓂈  𓂈  𓂈  𓂈  𓂈          Spock  │\n` +
      `│                                                     │\n` +
      `╰─────────────────────────────────────────────────────╯\n`
    );

    console.log('Rules:');
    for (let choice in this.choiceTable) {
      console.log(`  • ${choice.toUpperCase()} beats ${this.choiceTable[choice].beats.join(', ').toUpperCase()}`);
    }

    readline.question(`\nFirst to ${this.winningScore} points wins! Press ENTER to continue...`, {hideEchoBack: true, mask: ''});
  },

  displayGoodbyeMessage() {
    this.displayScoreboard();
    this.displayScoreboardInfo('Thanks for playing.', 'Goodbye!');
  },

  displayScoreboard() {
    console.clear();
    console.log(
      `╭──────────────────────────┬──────────────────────────╮\n` +
      `│          You: ${this.human.points}          │       Computer: ${this.computer.points}        │\n` +
      `├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┼┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┤`
    );
  },

  displayScoreboardInfo(humanInfo, computerInfo) {
    const LENGTH = 22;
    console.log(
      `│  ${humanInfo.padEnd(LENGTH)}  │  ${computerInfo.padEnd(LENGTH)}  │\n` +
      `╰──────────────────────────┴──────────────────────────╯\n`
    );
  },

  displayMoveHistory() {
    this.displayScoreboard();
    this.displayScoreboardInfo(this.human.getFormattedMoves(),
      this.computer.getFormattedMoves());
  },

  displayGameWinner() {
    this.displayScoreboard();
    this.displayScoreboardInfo(this.human.getFormattedMove(),
      this.computer.getFormattedMove());

    if (this.human.won) {
      console.log('You win!');
    } else if (this.computer.won) {
      console.log('Computer wins!');
    } else {
      console.log(`It's a tie.`);
    }

    readline.question('\nPress ENTER to continue...', {hideEchoBack: true, mask: ''});
  },

  displayMatchWinner() {
    this.displayMoveHistory();
    console.log(this.human.won ? `You won!` : `The computer won!`);
  },

  updateMoveHistory() {
    this.human.moveHistory[this.matchNumber].push(this.human.move);
    this.computer.moveHistory[this.matchNumber].push(this.computer.move);
  },

  updatePoints() {
    if (this.human.won) this.human.points += 1;
    if (this.computer.won) this.computer.points += 1;
  },

  resetPoints() {
    this.human.points = 0;
    this.computer.points = 0;
  },

  resetMatchWinner() {
    this.matchWinner = null;
  },

  setGameWinner() {
    if (this.human.move === this.computer.move) {
      this.human.won = false;
      this.computer.won = false;
    } else if (this.choiceTable[this.human.move].beats
      .includes(this.computer.move)) {
      this.human.won = true;
      this.computer.won = false;
    } else {
      this.human.won = false;
      this.computer.won = true;
    }
  },

  setMatchWinner() {
    if (this.human.points === this.winningScore) {
      this.matchWinner = this.human;
    } else if (this.computer.points === this.winningScore) {
      this.matchWinner = this.computer;
    }
  },

  getUserInput(prompt, inputOptions) {
    console.log(prompt);
    let userInput = readline.question().toLowerCase();
    let formattedOptions = inputOptions.map(choice => {
      return `\n  • ${choice.at(-1).toUpperCase()}: ${choice.join('/')}`;
    }).join('');

    while (!inputOptions.flat().includes(userInput)) {
      console.log(`\n'${userInput}' is not a valid choice. Please enter one of the following: ${formattedOptions}`);
      userInput = readline.question().toLowerCase();
    }

    return userInput;
  },

  playAgain() {
    let inputOptions = Object.values(this.playAgainOptions);
    let prompt = `\nWould you like to play again? (yes/no)`;
    let answer = this.getUserInput(prompt, inputOptions);

    return this.playAgainOptions.yes.includes(answer);
  },

  chooseMoves() {
    this.human.choose();
    this.computer.choose();
  },

  createNewMatch() {
    this.resetPoints();
    this.resetMatchWinner();
    this.matchNumber += 1;
    this.computer.initializeWinScore();
    this.human.moveHistory[this.matchNumber] = [];
    this.computer.moveHistory[this.matchNumber] = [];
  },

  playGame() {
    this.displayMoveHistory();
    this.chooseMoves();
    this.updateMoveHistory();
    this.setGameWinner();
    this.updatePoints();
    this.computer.updateWinScore();
    this.displayGameWinner();
  },

  playMatch() {
    this.displayWelcomeMessage();

    do {
      this.createNewMatch();

      while (!this.matchWinner) {
        this.playGame();
        this.setMatchWinner();
      }

      this.displayMatchWinner();
    } while (this.playAgain());

    this.displayGoodbyeMessage();
  },
};

// eslint-disable-next-line max-lines-per-function
function createPlayer() {
  return {
    move: null,
    moveHistory: {},
    points: 0,
    won: false,

    getFormattedMove() {
      const TOTAL_LENGTH = 22;
      let leadingSpace = Math.floor((TOTAL_LENGTH - this.move.length) / 2);

      return this.move.padStart(leadingSpace + this.move.length);
    },

    getFormattedMoves() {
      const MOVES_TO_DISPLAY = 5;
      const TWO_CHARACTERS = 2;

      return this.moveHistory[RPSGame.matchNumber]
        .slice(-MOVES_TO_DISPLAY)
        .map(move => {
          return move.slice(0, TWO_CHARACTERS);
        }).reverse().join(' │ ');
    },
  };
}

// eslint-disable-next-line max-lines-per-function
function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    winScore: {},
    winTolerance: 2,

    choose() {
      let mostWins = Math.max(...Object.values(this.winScore));
      let choices = Object.keys(this.winScore).filter(choice => {
        return this.winScore[choice] >= mostWins - this.winTolerance;
      });
      let choiceIndex = Math.floor(Math.random() * choices.length);

      this.move = choices[choiceIndex];
    },

    initializeWinScore() {
      for (let choice in RPSGame.choiceTable) this.winScore[choice] = 0;
    },

    updateWinScore() {
      const LOSS_PENALTY = 2;

      this.winScore[this.move] +=
        this.won ? 1 : -(LOSS_PENALTY * RPSGame.human.won);
    },
  };

  return Object.assign(playerObject, computerObject);
}

// eslint-disable-next-line max-lines-per-function
function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choicesList = this.accentTwoChars(Object.keys(RPSGame.choiceTable));
      let prompt = `Please choose ${choicesList}:`;
      let options = Object.values(RPSGame.choiceTable)
        .reduce((choices, choice) => {
          choices.push(choice.inputOptions);
          return choices;
        }, []);

      this.move = this.getValidChoice(RPSGame.getUserInput(prompt, options));
    },

    accentTwoChars(wordArray) {
      const FIRST_CHARACTER = 0;
      const SECOND_CHARACTER = 1;

      return wordArray
        .map(word => {
          return `${word[FIRST_CHARACTER]}\u0332${word[SECOND_CHARACTER]}\u0332` +
                 `${word.slice(2)}`;
        })
        .join(', ')
        .replace(/([^, ]*)$/, 'or $1');
    },

    getValidChoice(userChoice) {
      for (let validChoice in RPSGame.choiceTable) {
        if (RPSGame.choiceTable[validChoice].inputOptions
          .includes(userChoice.toLowerCase())) return validChoice;
      }

      return null;
    },
  };

  return Object.assign(playerObject, humanObject);
}

RPSGame.playMatch();