import { useState, useEffect } from "react";
import "./App.css";

type TCell = {
  rowIndex: number;
  colIndex: number;
};

function shuffleCells(array2D: number[][]) {
  const rows = array2D.length;
  const cols = array2D[0].length;

  for (let i = rows - 1; i > 0; i--) {
    for (let j = cols - 1; j > 0; j--) {
      const randomRowIndex = Math.floor(Math.random() * (i + 1));
      const randomColIndex = Math.floor(Math.random() * (j + 1));

      // Swap cells
      [array2D[i][j], array2D[randomRowIndex][randomColIndex]] = [
        array2D[randomRowIndex][randomColIndex],
        array2D[i][j],
      ];
    }
  }
  return array2D;
}

function App() {
  const [grid, setGrid] = useState<number[][]>([
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ]);

  const [previousClick, setPreviousClick] = useState<TCell>();

  const [revealedGrid, setRevealedGrid] = useState<boolean[][]>(
    new Array(grid?.length)
      .fill("")
      .map(() => new Array(grid[0].length).fill(false))
  );

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    // determine number of tiles. Must total even number
    const size = 4;
    const numOfTiles = size * size;

    // create matching pairs and put into 2d array
    const grid = new Array(size).fill("").map(() => new Array(size).fill(""));
    let rowCounter = 0;
    for (let i = 0; i < numOfTiles; i++) {
      grid[rowCounter][i % size] =
        i > numOfTiles / 2 - 1 ? (i % (numOfTiles / 2)) + 1 : i + 1;

      // if reached last column, go to next row
      if (i % size === size - 1) rowCounter++;
    }
    // randomise 2d array and set state
    setGrid(shuffleCells(grid));
  };

  function handleCardClicked(rowIndex: number, colIndex: number) {
    // if clicked tile is already displayed do nothing
    if (revealedGrid[rowIndex][colIndex]) return;

    // show clicked tile
    const newRevealedGrid = [...revealedGrid];
    newRevealedGrid[rowIndex][colIndex] = true;
    setRevealedGrid(newRevealedGrid);

    const clickedCell: TCell = { rowIndex, colIndex };
    const clickedNumber: number = grid[rowIndex][colIndex];

    if (previousClick) {
      const previousClickedNumber: number =
        grid[previousClick.rowIndex][previousClick.colIndex];
      // second click of two
      if (previousClickedNumber !== clickedNumber) {
        // hide both tiles after 1 second
        setTimeout(() => {
          newRevealedGrid[rowIndex][colIndex] = false;
          newRevealedGrid[previousClick.rowIndex][previousClick.colIndex] =
            false;
          setRevealedGrid([...newRevealedGrid]);
        }, 1000);
      } else {
        // they match
      }
      setPreviousClick(undefined);
    } else {
      // first click of two
      setPreviousClick(clickedCell);
    }
  }

  return (
    <div className="app">
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((number, colIndex) => (
              <div
                className="card"
                key={colIndex}
                onClick={() => handleCardClicked(rowIndex, colIndex)}
              >
                {revealedGrid[rowIndex][colIndex] ? number : " "}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
