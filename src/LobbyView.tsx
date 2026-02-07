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
    .map((game, index) => {
      return (
        <button
          className="game-btn"
          key={game.id}
          onClick={() => loadGame(game.id)}>
          Game {index + 1}:
        </button>
      )
    })

  return (
    <div className="lobby">
      <p>Welcome to</p>
      <h1>Tic-Tac-Toe</h1>
      <button className="newgame-btn" onClick={startGame}>New Game</button>
      {listElements}
    </div>
  )
}