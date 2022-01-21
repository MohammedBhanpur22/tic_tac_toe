import { DRAW } from "./constants";

export default class Board {
  constructor(grid) {
    this.grid = grid;
    this.winningIndex = null;
  }

  makeMove = (square, player) => {
    if (this.grid[square] === null) {
      this.grid[square] = player;
    }
  };

  getEmptySquares = (grid = this.grid) => {
    let squares = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };

  isEmpty = (grid = this.grid) => {
    console.log(grid);
    return this.getEmptySquares(grid).length === grid;
  };

  getWinner = (grid = this.grid) => {
    var winningCombos = [];
    if (grid.length === 9) {
      console.log("3..");
      winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      let res = null;
      winningCombos.forEach((el, i) => {
        if (
          grid[el[0]] !== null &&
          grid[el[0]] === grid[el[1]] &&
          grid[el[0]] === grid[el[2]]
        ) {
          res = grid[el[0]];
          this.winningIndex = i;
        } else if (res === null && this.getEmptySquares(grid).length === 0) {
          res = DRAW;
          this.winningIndex = null;
        }
      });
      return res;
    }
    if (grid.length === 16) {
      console.log("4..");
      winningCombos = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12],
      ];
      let res = null;
      winningCombos.forEach((el, i) => {
        if (
          grid[el[0]] !== null &&
          grid[el[0]] === grid[el[1]] &&
          grid[el[0]] === grid[el[2]] &&
          grid[el[0]] === grid[el[3]]
        ) {
          res = grid[el[0]];
          this.winningIndex = i;
        } else if (res === null && this.getEmptySquares(grid).length === 0) {
          res = DRAW;
          this.winningIndex = null;
        }
      });
      return res;
    }
    if (grid.length === 25) {
      console.log("5..");
      winningCombos = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
      ];
      let res = null;
      winningCombos.forEach((el, i) => {
        if (
          grid[el[0]] !== null &&
          grid[el[0]] === grid[el[1]] &&
          grid[el[0]] === grid[el[2]] &&
          grid[el[0]] === grid[el[3]] &&
          grid[el[0]] === grid[el[4]]
        ) {
          res = grid[el[0]];
          this.winningIndex = i;
        } else if (res === null && this.getEmptySquares(grid).length === 0) {
          res = DRAW;
          this.winningIndex = null;
        }
      });
      return res;
    }
  };

  clone = () => {
    return new Board(this.grid.concat());
  };
}
