import { useState } from "react";
import { createGame } from "./tic-tac-toe";
import { Board } from "./Board";
import { Header } from "./Header";

function App() {
  const [gameState, setGameState] = useState(createGame())
  const reset = (): void => setGameState(createGame())
  return (
    <>
      <Header gameState={gameState} reset={reset} />
      <Board gameState={gameState} setGameState={setGameState} />
    </>

  )
}

export default App;
