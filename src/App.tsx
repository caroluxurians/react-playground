import { useState } from "react";

type SquareProps = {
  value: string
  onSquareClick: () => void
  winningLines: number[] | undefined
  squareIndex: number
  isDraw: boolean
};
type BoardProps = {
  xIsNext: boolean
  squares: string[]
  onPlay: (squares: string[]) => void
  colCount: number
  rowCount: number
};

const checkIfDraw = (squares: string[]) => {
  return squares.every((value) => value !== null);
};

const calculateWinner = (squares: string[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: [a, b, c],
      };
    }
  }
  return null;
};

const Square = ({
  value, onSquareClick, winningLines, squareIndex, isDraw,
}: SquareProps) => {
  return (
    <button
      type="button"
      className={
        // eslint-disable-next-line no-nested-ternary
        winningLines?.includes(squareIndex)
          ? "squareWin"
          : (isDraw ? "squareDraw" : "square")
      }
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
};

const Board = ({
  xIsNext, squares, onPlay, colCount, rowCount,
}: BoardProps) => {
  const handleClick = (i: number) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  };

  const winner = calculateWinner(squares)?.winner;
  const lines = calculateWinner(squares)?.lines;

  // const [isDraw, setIsDraw] = useState(false);
  // const result = checkIfDraw(squares);
  // if (result !== isDraw) setIsDraw(result);
  const isDraw = checkIfDraw(squares);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>
        {[...new Array(rowCount)].map((row, rowIndex) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div className="boardRow" key={rowIndex}>
              {[...new Array(colCount)].map((col, colIndex) => {
                const squareIndex = rowIndex * rowCount + colIndex;
                return (
                  <Square
                    key={squareIndex}
                    value={squares[squareIndex]}
                    squareIndex={squareIndex}
                    onSquareClick={() => handleClick(squareIndex)}
                    winningLines={lines}
                    isDraw={isDraw}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

const Game = () => {
  const rowCount = 3;
  const colCount = 3;

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascending, setAscending] = useState(false);

  const handlePlay = (nextSquares: string[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((_, move) => {
    const curhist = history[move];
    const prevhist = history[move - 1];
    if (!prevhist) {
      return null;
    }
    const changedSqIndex = curhist.findIndex((el, index) => prevhist[index] !== el);
    let description;
    const col = 1 + (changedSqIndex % colCount);
    const row = 1 + Math.floor(changedSqIndex / rowCount);
    if (move === currentMove) {
      description = `You are at move #${move}`;
    } else if (move > 0) {
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = "Go to game start";
    }
    return (
      // eslint-disable-next-line react/no-array-index-key
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button type="button" onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="gameBoard">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          colCount={colCount}
          rowCount={rowCount}
        />
      </div>
      <div className="gameInfo">
        <button type="button" className="toggleButton" onClick={() => setAscending(!ascending)}>toggle</button>
        <ol>{!ascending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};

export default Game;
