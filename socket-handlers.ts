import type { WebSocket } from 'ws'
import type { Player } from './src/tic-tac-toe'
import { makeMove, games } from './gameStore'

export const handleMove = (
  ws: WebSocket,
  broadcast: (msg: string) => void,
  data: {
    id: string,
    move: { player: Player, position: number }
  }
): void => {
  const id = data.id
  const game = games.get(id)
  if (!game) {
    ws.send(JSON.stringify({
      type: 'error',
      error: "Game ID not found"
    }))
    return
  }

  const { player, position }: {
    player: Player, position: number
  } = data.move

  if (player === undefined) {
    ws.send(JSON.stringify({
      type: 'error',
      error: "Player field missing"
    }))
    return
  }
  if (position === undefined) {
    ws.send(JSON.stringify({
      type: 'error',
      error: "Position field missing"
    }))
    return
  }
  if (player !== game.currentPlayer) {
    ws.send(JSON.stringify({
      type: 'error',
      error: `It's ${game.currentPlayer}'s turn`
    }))
    return
  }
  try {
    const newState = makeMove(game, position)
    broadcast(JSON.stringify({
      type: 'game-update',
      gameState: newState
    }))
  } catch (err) {
    ws.send(JSON.stringify({
      type: 'error',
      error: (err as Error).message
    }))
  }
}

export const handleJoinGame = (_ws: WebSocket, _data: { gameId: string }): void => {
  // TODO: implement join-game logic
}

export const handleLeaveGame = (_ws: WebSocket, _data: { gameId: string }): void => {
  // TODO: implement leave-game logic
}