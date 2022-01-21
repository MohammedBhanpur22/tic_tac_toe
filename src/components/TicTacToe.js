import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMS,
} from "./constants";
import Board from "./Board";
import { getRandomInt, switchPlayer } from "./utils";
import { ResultModal } from "./ResultModal";
import { border } from "./styles";

const arr = new Array(DIMS ** 2).fill(null);
const board = new Board();
console.log(DIMS);

const TicTacToe = () => {
  const [players, setPlayers] = useState({ human: null, computer: null });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(new Array(3 ** 2).fill(null));
  const [winner, setWinner] = useState(null);
  const [nextMove, setNextMove] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(3);
  let [dim, setDim] = useState(3);
  let [timer, setTimer] = useState(60);

  const maze_3 = () => {
    setGrid(new Array(3 ** 2).fill(null));
    setDim(3);
    setMode(3);
    setTimer(60);
  };
  const maze_4 = () => {
    setGrid(new Array(4 ** 2).fill(null));
    setDim(4);
    setMode(4);
    setTimer(120);
  };
  const maze_5 = () => {
    setGrid(new Array(5 ** 2).fill(null));
    setDim(5);
    setMode(5);
    setTimer(180);
  };

  const countdown = () => {
    if (timer) {
      setTimer(--timer);
      var time = setTimeout(countdown, 1000);
    } else {
      if (winner == null) {
        setWinner("It's a draw");
        setTimeout(() => setModalOpen(true), 300);
      }
      clearTimeout(time);
    }
  };

  useEffect(() => {
    const winner = board.getWinner(grid);
    const declareWinner = (winner) => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          if (players.human === 1) {
            winnerStr = "Congratulations! you have won.";
          } else {
            winnerStr = "You Did Good, Better Luck next time";
          }
          break;
        case PLAYER_O:
          if (players.human === 2) {
            winnerStr = "Congratulations! you have won.";
          } else {
            winnerStr = "You Did Good, Better Luck next time";
          }
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
      // Slight delay for the modal so there is some time to see the last move
      setTimeout(() => setModalOpen(true), 300);
      // clearTimeout(timer);
    };

    if (winner !== null && gameState !== GAME_STATES.over) {
      declareWinner(winner);
    }
  }, [gameState, grid, nextMove]);

  const move = useCallback(
    (index, player) => {
      if (player && gameState === GAME_STATES.inProgress) {
        setGrid((grid) => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState]
  );

  const computerMove = useCallback(() => {
    // Important to pass a copy of the grid here
    const board = new Board(grid.concat());
    const emptyIndices = board.getEmptySquares(grid);
    let index;
    switch (mode) {
      case 3:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
      case 4:
        do {
          index = getRandomInt(0, 15);
        } while (!emptyIndices.includes(index));
        break;
      case 5:
        do {
          index = getRandomInt(0, 24);
        } while (!emptyIndices.includes(index));
        break;
      default:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
    }
    if (!grid[index]) {
      move(index, players.computer);
      setNextMove(players.human);
    }
  }, [move, grid, players, mode]);

  useEffect(() => {
    let timeout;
    if (
      nextMove !== null &&
      nextMove === players.computer &&
      gameState !== GAME_STATES.over
    ) {
      // Delay computer moves to make them more natural
      timeout = setTimeout(() => {
        computerMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, computerMove, players.computer, gameState]);

  const humanMove = (index) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.computer);
    }
  };

  const choosePlayer = (option) => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextMove(PLAYER_X);
    countdown();
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(arr);
    setModalOpen(false);
  };

  return gameState === GAME_STATES.notStarted ? (
    <Screen>
      <Inner>
        <ChooseText>Choose Maze</ChooseText>
        <ButtonRow>
          <button onClick={maze_3}>3</button>
          <p>or</p>
          <button onClick={maze_4}>4</button>
          <p>or</p>
          <button onClick={maze_5}>5</button>
        </ButtonRow>
      </Inner>
      <Inner>
        <ChooseText>Choose your player</ChooseText>
        <ButtonRow>
          <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
          <p>or</p>
          <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
        </ButtonRow>
      </Inner>
    </Screen>
  ) : (
    <>
      {timer}
      <Container dims={dim}>
        {grid.map((value, index) => {
          const isActive = value !== null;

          return (
            <Square
              data-testid={`square_${index}`}
              key={index}
              onClick={() => humanMove(index)}
            >
              {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
            </Square>
          );
        })}

        <ResultModal
          isOpen={modalOpen}
          winner={winner}
          close={() => setModalOpen(false)}
          startNewGame={startNewGame}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  ${border};

  &:hover {
    cursor: pointer;
  }
`;

Square.displayName = "Square";

const Marker = styled.p`
  font-size: 68px;
`;

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Screen = styled.div``;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const ChooseText = styled.p``;

export default TicTacToe;
