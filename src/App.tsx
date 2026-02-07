import { useState, useEffect, useRef, type Ref } from "react";
import type { GameState } from "./tic-tac-toe"
import { GameView } from "./GameView";
import { LobbyView } from "./LobbyView";

export type View = "lobby" | "game"

const nullGame: GameState = {
  board: [
    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null
  ],
  score: { X: 0, O: 0 },
  rowsClaimed: new Map(),
  currentPlayer: "X",
  endState: null,
  id: "nullGame"
}

function App() {
  const [view, setView] = useState<View>("lobby")
  const [transitioning, setTransitioning] = useState(false)
  const [gameList, setGameList] = useState<GameState[]>([])
  const [gameState, setGameState] = useState<GameState>(nullGame)
  const socket: Ref<WebSocket | null> = useRef(null)

  const changeView = (newView: View) => {
    setTransitioning(true)
    setTimeout(() => {
      setView(newView)
      setTransitioning(false)
    }, 300)
  }

  const createGame = async (): Promise<void> => {
    const response = await fetch('/api/create')
    const newGame = await response.json()
    setGameState(newGame)
  }

  useEffect(() => {
    // if there is an active socket, we don't need to do anything.
    if (socket.current) return

    const ws = new WebSocket('/ws')
    socket.current = ws

    ws.onopen = (): void => {
      console.log('[open] connection established')
      //ws.send(('message from the client'))
    }

    ws.onmessage = (event): void => {
      console.log("received message")
      const data = JSON.parse(event.data)
      if (data.type === 'game-update') {
        setGameState(data.gameState)
      }
    }

    ws.onclose = (event): void => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        console.log('[close] Connection died');
      }
    }

    // Cleanup on unmount
    return () => {
      ws.close()
      socket.current = null
    };
  }, [])

  useEffect(() => {
    const fetchList = async () => {
      const response = await fetch('/api/list')
      const newList = await response.json()
      setGameList(newList)
    }
    fetchList()
  }, [view])

  return (
    <div className={`view-container ${transitioning ? 'fade-out' : ''}`}>
      {view === "game" ? (
        <GameView
          setView={changeView}
          gameState={gameState}
          createGame={createGame}
          socket={socket}
        />
      ) : (
        <LobbyView
          createGame={createGame}
          gameList={gameList}
          setGameList={setGameList}
          setGameState={setGameState}
          setView={changeView}
        />
      )}
    </div>
  )
}

export default App;
