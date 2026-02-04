import { useState } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";
// import { Board } from "./Board";
import { Header } from "./Header";
import { Board3D } from "./Board3D";

function App() {
  const [gameState, setGameState] = useState(createGame())
  const reset = (): void => setGameState(createGame())

  const handleCellClick = (index: number) => {
    // Ignore clicks on occupied cells or if game is over
    if (gameState.board[index] !== null || getWinner(gameState) !== null) return
    setGameState(makeMove(gameState, index))
  }

  return (
    <>
      <Header gameState={gameState} reset={reset} />
      {/* <Board gameState={gameState} setGameState={setGameState} /> */}
      <Board3D board={gameState.board} onCellClick={handleCellClick} />
    </>

  )
}

export default App;
