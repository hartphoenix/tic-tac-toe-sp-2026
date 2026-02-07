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
  currentPlayer: "X",
  endState: null,
  id: "nullGame"
}

function App() {
  const [view, setView] = useState<View>("lobby")
  const [gameList, setGameList] = useState<GameState[]>([])
  const [gameState, setGameState] = useState<GameState>(nullGame)
  const socket: Ref<WebSocket | null> = useRef(null)

  const createGame = async (): Promise<void> => {
    const response = await fetch('/api/create')
    const newGame = await response.json()
    setGameState(newGame)
  }

  useEffect(() => {
    // if (socket.current === null) {
    const ws = new WebSocket('/ws')
    socket.current = ws

    ws.onopen = (): void => {
      console.log('[open] connection established')
      //ws.send(('message from the client'))
    }

    ws.onmessage = (event): void => {
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

  if (view === "game") {
    return (
      <GameView
        setView={setView}
        gameState={gameState}
        createGame={createGame}
        socket={socket}
      />
    )
  } else if (view === "lobby") {
    return (
      <LobbyView
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
