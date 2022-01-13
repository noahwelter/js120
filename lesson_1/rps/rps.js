const readline = require('readline-sync');

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  winningScore: 5,
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

  displayWelcomeMessage() {
    console.clear();
    console.log(
      `╭──────────────────────────╮\n` +
      `│                          │\n` +
      `│  ●                 Rock  │\n` +
      `│    ■              Paper  │\n` +
      `│      ✂         Scissors  │\n` +
      `│        𓆈         Lizard  │\n` +
      `│           𓂈       Spock  │\n` +
      `│                          │\n` +
      `╰──────────────────────────╯\n`
    );
    readline.question('Good luck! Press enter to continue...', {hideEchoBack: true, mask: ''});
  },

  displayGoodbyeMessage() {
    console.log(`Thanks for playing. Goodbye!`);
  },

  getGameWinner() {
    if (this.human.move === this.computer.move) {
      return null;
    }

    if (this.choiceTable[this.human.move].beats.includes(this.computer.move)) {
      return this.human;
    } else {
      return this.computer;
    }
  },

  displayGameWinner() {
    let winner = this.getGameWinner();

    this.displayScoreboard();

    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}\n`);

    if (winner === this.human) {
      console.log('You win!');
    } else if (winner === this.computer) {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie.");
    }

    console.log();
    readline.question('Press enter to continue...', {hideEchoBack: true, mask: ''});
  },

  displayScoreboard() {
    console.clear();
    console.log(
      `╭───────────┬────────────────╮\n` +
      `│  You:  ${this.human.points}  │  Computer:  ${this.computer.points}  │\n` +
      `╰───────────┴────────────────╯\n`
    );
  },

  updatePoints() {
    let winner = this.getGameWinner();
    if (winner) winner.points += 1;
  },

  resetPoints() {
    this.human.points = 0;
    this.computer.points = 0;
  },

  updateMoveHistory() {
    this.human.moveHistory.push(this.human.move);
    this.computer.moveHistory.push(this.computer.move);
  },

  getMatchWinner() {
    if (this.human.points === this.winningScore) {
      return this.human;
    }
    if (this.computer.points === this.winningScore) {
      return this.computer;
    }

    return null;
  },

  displayMatchWinner() {
    let winner = this.getMatchWinner();

    if (winner === this.human) {
      console.log(`You won!`);
    }

    if (winner === this.computer) {
      console.log(`The computer won!`);
    }
  },

  playAgain() {
    console.log(`Would you like to play again? (y/n)`);
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    this.displayWelcomeMessage();

    while (true) {
      while (!this.getMatchWinner()) {
        this.displayScoreboard();
        this.human.choose();
        this.computer.choose();
        this.updateMoveHistory();
        this.updatePoints();
        this.displayGameWinner();
      }

      this.displayMatchWinner();
      if (!this.playAgain()) break;
      this.resetPoints();
    }

    this.displayGoodbyeMessage();
  },
};

function createPlayer() {
  return {
    move: null,
    moveHistory: [],
    points: 0,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = Object.keys(RPSGame.choiceTable);
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        let choices = Object.keys(RPSGame.choiceTable).map(choice => {
          return `${choice[0]}\u0332${choice[1]}\u0332${choice.slice(2)}`;
        });
        let choicesList = choices.join(', ').replace(/([^, ]*)$/, 'or $1');

        console.log(`Please choose ${choicesList}:`);
        choice = this.getChoiceFromShorthand(readline.question());

        if (choice) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },

    getChoiceFromShorthand(userChoice) {
      for (validChoice in RPSGame.choiceTable) {
        if (RPSGame.choiceTable[validChoice].inputOptions.includes(userChoice.toLowerCase()))
          return validChoice;
      }

      return null;
    },
  };

  return Object.assign(playerObject, humanObject);
}

RPSGame.play();