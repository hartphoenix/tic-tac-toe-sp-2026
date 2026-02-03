import { useState } from "react";
import { createGame, makeMove } from "./tic-tac-toe";
import { Board } from "./Board";

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <>
      <div>Hello World! current player: {gameState.currentPlayer}</div>
      <Board gameState={gameState} setGameState={setGameState} />
    </>
    
  )
}

function getInitialGame() {
  let initialGameState = createGame()
  initialGameState = makeMove(initialGameState, 3)
  initialGameState = makeMove(initialGameState, 0)
  return initialGameState
}

export default App;
