import { useState, useEffect } from "react";
import type { GameState, Player } from "./tic-tac-toe"
import { createGame } from "../gameStore";
// import { Board } from "./Board";
import { Header } from "./Header";
import { Board3D } from "./Board3D";

function App() {
  const [gameState, setGameState] = useState(createGame())
  const reset = async (): Promise<void> => {
    const response = await fetch('/api/create')
    const newGame = await response.json()
    setGameState(newGame)
  }

  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch('/api/create')
      const initialState = await response.json()
      setGameState(initialState)
    }
    fetchGame()
  }, [])

  const sendMove = async (move: { player: Player, position: number }): Promise<GameState> => {
    const response = await fetch(`/api/move/${gameState.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(move)
    })
    const updatedState = await response.json()
    return updatedState
  }

  const handleCellClick = async (index: number) => {
    // Ignore clicks on occupied cells or if game is over
    if (gameState.board[index] !== null || gameState.endState !== null) return
    try {
      const newState = await sendMove({ player: gameState.currentPlayer, position: index })
      setGameState(newState)
    } catch (err) {
      console.error('Move failed:', err)
    }
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
