import { useState } from "react";

type SquareProps = {
  value: string
  onSquareClick: () => void
};
type BoardProps = {
  xIsNext: boolean
  squares: string[]
  onPlay: (squares: string[]) => void
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
      return squares[a];
    }
  }
  return null;
};

const Square = ({ value, onSquareClick }: SquareProps) => {
  return (
    <button type="button" className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};

const Board = ({ xIsNext, squares, onPlay }: BoardProps) => {
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

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  const rowCount = 3;
  const colCount = 3;

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
                    onSquareClick={() => handleClick(squareIndex)}
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

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
    } else if (move > 0) {
      description = `Go to move #${move}`;
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="gameInfo">
        <button type="button" className="toggleButton" onClick={() => setAscending(!ascending)}>toggle</button>
        <ol>{!ascending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};

export default Game;
