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
        <>
            <p>{getWinner(gameState)} wins!</p>
            <button
                onClick={reset}>
                Play again?
            </button>
        </>
    )
    else return (
        <p>{gameState.currentPlayer}'s move:</p>
    )
}