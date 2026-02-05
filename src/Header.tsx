import type { GameState } from "./tic-tac-toe"
import type { JSX } from "react"

export const Header = (
    { gameState, reset }: {
        gameState: GameState
        reset: () => void
    }
): JSX.Element => {
    if ((gameState.endState !== null) && gameState.endState !== "tie")
        return (
            <div className="header">
                <p>{gameState.endState === "X" ? "RED" : "BLUE"} wins!</p>
                <button className="reset-btn" onClick={reset}>
                    Play again?
                </button>
            </div>
        )
    if (!gameState.board.some(pos => pos === null))
        return (
            <div className="header">
                <p>Tie game!</p>
                <button className="reset-btn" onClick={reset}>
                    Play again?
                </button>
            </div>
        )
    else return (
        <div className="header">
            <p>{gameState.currentPlayer === "X" ? "RED" : "BLUE"}'s move</p>
        </div>
    )
}