const { useState, useEffect } = React;

const clickSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3");
const winSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3");

export function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [dark, setDark] = useState(true);
  const [bot, setBot] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });

  useEffect(() => {
    if (bot && !isXNext && !gameOver) {
      setTimeout(botMove, 500);
    }
  }, [isXNext, bot, gameOver]);

  function handleClick(i) {
    if (squares[i] || gameOver) return;

    clickSound.play();

    const newSquares = [...squares];
    newSquares[i] = isXNext ? 'X' : 'O';

    updateGame(newSquares);
  }

  function botMove() {
    let empty = squares.map((v, i) => v === null ? i : null).filter(v => v !== null);
    let move = empty[Math.floor(Math.random() * empty.length)];
    if (move !== undefined) handleClick(move);
  }

  function updateGame(newSquares) {
    setSquares(newSquares);
    setIsXNext(!isXNext);

    const win = calculateWinner(newSquares);
    if (win) {
      winSound.play();
      setScore({ ...score, [win]: score[win] + 1 });
      setGameOver(true);
    } else if (newSquares.every(v => v)) {
      setGameOver(true);
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) status = `Winner: ${winner}`;
  else if (squares.every(v => v)) status = "It's a draw!";
  else status = `Next: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className={dark ? "game-container" : "game-container light"}>
      <h1>Tic Tac Toe</h1>

      <div className="controls">
        <button onClick={() => setDark(!dark)}>🌗 Theme</button>
        <button onClick={() => setBot(!bot)}>{bot ? "🤖 Bot ON" : "👤 2 Player"}</button>
      </div>

      <div className="status">{status}</div>

      <div className="board">
        {squares.map((v, i) => (
          <button key={i} className="square" onClick={() => handleClick(i)}>
            {v}
          </button>
        ))}
      </div>

      <button id="reset" onClick={resetGame}>Reset</button>

      <div className="score">
        <div>X : {score.X}</div>
        <div>O : {score.O}</div>
      </div>
    </div>
  );
}

function calculateWinner(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return sq[a];
    }
  }
  return null;
}
