import { Header } from './Header'
import { Board3D } from './Board3D'
import type { JSX, RefObject } from 'react'
import type { GameState, Player } from './tic-tac-toe'
import type { View } from './App'

type GameViewProps = {
  setView: (view: View) => void
  gameState: GameState
  createGame: () => Promise<void>
  socket: RefObject<WebSocket | null>
}

export const GameView = ({
  setView,
  gameState,
  createGame,
  socket }: GameViewProps

): JSX.Element => {

  const sendMove = (move: { player: Player, position: number }): void => {
    if (socket && socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({
        type: 'move',
        id: gameState.id,
        move
      }))
    }
  }

  const handleCellClick = async (index: number) => {
    // Ignore clicks on occupied cells or if game is over
    if (gameState.board[index] !== null
      || gameState.endState !== null)
      return
    sendMove({ player: gameState.currentPlayer, position: index })
  }

  return (
    <div className="game-view">
      <button
        className="lobby-btn"
        onClick={() => setView("lobby")}
      >←</button>
      <Header
        gameState={gameState}
        reset={createGame} />
      <Board3D
        board={gameState.board}
        onCellClick={handleCellClick}
      />
      <div className="scoreboard">
        <h2 className="red-score">
          <span className="red-text">RED:</span> {gameState.score.X}
        </h2>
        <h2 className="blue-score">
          <span className="blue-text">BLUE:</span> {gameState.score.O}
        </h2>
      </div>
    </div>
  )
}
