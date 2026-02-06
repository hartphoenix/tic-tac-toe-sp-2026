import { useState, useEffect, useRef, type Ref } from "react";
import type { GameState, Player } from "./tic-tac-toe"
import { Header } from "./Header";
import { Board3D } from "./Board3D";
import { Lobby } from "./Lobby";

export type View = "lobby" | "game"

const nullGame: GameState = {
  board: [
    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null
  ],
  currentPlayer: "X",
  endState: null,
  id: "nullGame"
}

function App() {
  const [gameState, setGameState] = useState<GameState>(nullGame)
  const [view, setView] = useState<View>("lobby")
  const [gameList, setGameList] = useState<GameState[]>([])
  const socket: Ref<WebSocket | null> = useRef(null)

  const createGame = async (): Promise<void> => {
    const response = await fetch('/api/create')
    const newGame = await response.json()
    setGameState(newGame)
  }

  useEffect(() => {
    // if (socket.current === null) {
    const ws = new WebSocket('ws://localhost:3000/ws')
    socket.current = ws

    ws.onopen = () => {
      console.log('[open] connection established')
      ws.send('message from the client')
    }

    ws.onmessage = (event) => {
      console.log('message received:', event.data)
    }

    ws.onclose = function (event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        console.log('[close] Connection died');
      }
    }
    // Cleanup on unmount
    // return () => {
    //   ws.close();
    // };
    //}
  }, [])

  useEffect(() => {
    const fetchList = async () => {
      const response = await fetch('/api/list')
      const newList = await response.json()
      setGameList(newList)
    }
    fetchList()
  }, [view])

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
    if (gameState.board[index] !== null
      || gameState.endState !== null)
      return
    try {
      const newState = await sendMove({ player: gameState.currentPlayer, position: index })
      setGameState(newState)
    } catch (err) {
      console.error('Move failed:', err)
    }
  }

  if (view === "game") {
    return (
      <>
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
      </>

    )
  } else if (view === "lobby") {
    return (
      <Lobby
        createGame={createGame}
        gameList={gameList}
        setGameList={setGameList}
        setGameState={setGameState}
        setView={setView}
      />
    )
  }
}

export default App;
