import type { GameState } from "./tic-tac-toe"
import { getWinner } from "./tic-tac-toe"
import type { JSX } from "react"

export const Header = (
    { gameState, reset }: {
        gameState: GameState
        reset: () => void
    }
): JSX.Element => {
    if (getWinner(gameState) !== null) return (
        <div className="header">
            <p>{getWinner(gameState)} wins!</p>
            <button className="reset-btn" onClick={reset}>
                Play again?
            </button>
        </div>
    )
    if (!gameState.board.some(pos => pos === null)) return (
        <div className="header">
            <p>Tie game!</p>
            <button className="reset-btn" onClick={reset}>
                Play again?
            </button>
        </div>
    )
    else return (
        <div className="header">
            <p>{gameState.currentPlayer}'s move</p>
        </div>
    )
}