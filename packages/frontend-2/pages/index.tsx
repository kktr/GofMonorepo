// import { GameOfLife, IBoard } from '@game-of-life-new/gof-tsc';
import { useEffect, useState } from 'react';
import { GofAPI, IBoard } from '../helpers/gofAPI';
import styles from './index.module.css';
export function Index() {
  const [numberOfCols, _setNumberOfCols] = useState(3);
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>(null);
  const [board, setBoard] = useState<IBoard | any>(null);
  const [isGameReset, setIsGameReset] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [tickInterval, _setTickInterval] = useState<number>(100);

  useEffect(() => {
    GofAPI.getBoard().then((newBoard) => setBoard(newBoard));
  }, []);

  const tickGameOfLife = () => {
    GofAPI.tick().then((newBoard) => setBoard(newBoard));
    setCount((prevCount) => prevCount + 1);
    setIsGameRunning(true);
  };

  const autoTickGameOfLife = () => {
    const newIntervalId = setInterval(() => {
      GofAPI.tick().then((newBoard) => setBoard(newBoard));
      setCount((prevCount) => prevCount + 1);
    }, tickInterval);
    setIntervalId(newIntervalId);
    setIsGameRunning(true);
  };

  const pauseGameOfLife = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }
    const newIntervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, tickInterval);
    setIntervalId(newIntervalId);
  };

  const resetGameOfLife = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsGameRunning(false);
      return;
    }
    setIsGameReset(() => true);
    setCount(0);
  };

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  return (
    <div className={styles.page} onClick={() => console.log(board)}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome gof-next 👋
            </h1>
          </div>

          <div>Number of ticks {count && count}</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${numberOfCols}, 20px)`,
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            {board &&
              board.map((rows, i) =>
                rows.map((_col, k) => (
                  <div
                    key={`${i}-${k}`}
                    onClick={() => {
                      setIsGameRunning(false);
                      GofAPI.toggleCell({ row: i, col: k });
                      const newGrid = JSON.parse(JSON.stringify(board));
                      newGrid[i][k] = board[i][k] ? 0 : 1;
                      setBoard(newGrid);
                    }}
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: board[i][k] ? '#00ffa3' : undefined,
                      border: '1px solid #595959',
                    }}
                  />
                ))
              )}
          </div>

          <button onClick={tickGameOfLife}>PLAY</button>
          <button onClick={autoTickGameOfLife}>AUTO</button>
          <button onClick={pauseGameOfLife}>PAUSE</button>
          <button onClick={resetGameOfLife}>RESET</button>

          <p id="love">
            Carefully crafted with
            <svg
              fill="currentColor"
              stroke="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Index;
