import type { GameState } from './tic-tac-toe'
import type { JSX } from 'react'
import type { View } from './App'

type LobbyProps = {
  createGame: () => void
  gameList: GameState[]
  setGameList: (gameList: GameState[]) => void
  setGameState: (gameState: GameState) => void
  setView: (view: View) => void
}

export const LobbyView = (props: LobbyProps) => {
  const startGame = () => {
    props.createGame()
    props.setView("game")
  }
  const loadGame = (id: string) => {
    const game = props.gameList.find(game => game.id === id)
    if (!game) {
      console.error("Game ID reference invalid")
      return
    }
    props.setGameState(game)
    props.setView("game")
  }
  const listElements: JSX.Element[] = props.gameList
    .filter(game => game.endState === null)
    .map((game) => {
      const turns = game.board.filter((cell) => cell !== null).length
      const player = game.currentPlayer === "X" ? "Red" : "Blue"
      const dotColor = game.currentPlayer === "X" ? "red" : "blue"
      return (
        <button
          className="game-btn"
          key={game.id}
          onClick={() => loadGame(game.id)}>
          <span className={`turn-dot ${dotColor}`} />
          {turns} Move{turns !== 1 ? "s" : ""} | {player}'s Turn
        </button>
      )
    })

  return (
    <div className="lobby">
      <div className="lobby-title">
        <h1>Triple-Tac-Toe</h1>
      </div>
      <div className="lobby-content">
        <button className="newgame-btn" onClick={startGame}>New Game</button>
        {listElements}
      </div>
      <div className="footer lobby-content"><p>[Pinch/Scroll to Expand & Contract the Cube]</p></div>
    </div>
  )
}