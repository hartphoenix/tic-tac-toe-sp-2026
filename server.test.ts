import { describe, it, expect } from "vitest"
import request from 'supertest'
import app from './server.ts'
import type { GameState } from './src/tic-tac-toe.ts'

describe('GET /create', () => {
    it('responds with json containing new game', async () => {
        const response = await request(app)
            .get('/create')
            .expect('Content-Type', /json/)
            .expect(200)
        expect(response.body.board).toEqual(Array(27).fill(null))
        expect(response.body.currentPlayer).toEqual("X")
        expect(response.body.endState).toEqual(null)
        expect(response.body.id).toBeTypeOf('string')
        expect(response.body.id.length).toBeGreaterThan(0)
    })

    it('generates unique IDs for each game', async () => {
        const game1 = await request(app).get('/create')
        const game2 = await request(app).get('/create')
        expect(game1.body.id).not.toEqual(game2.body.id)
    })
})

describe('GET /list', () => {
    it('returns a JSON array of unique GameState objects', async () => {
        await request(app).get('/create')
        await request(app).get('/create')

        const response = await request(app)
            .get('/list')
            .expect('Content-Type', /json/)
            .expect(200)

        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBeGreaterThanOrEqual(2)

        for (const game of response.body) {
            expect(game).toHaveProperty('board')
            expect(game).toHaveProperty('currentPlayer')
            expect(game).toHaveProperty('endState')
            expect(game).toHaveProperty('id')
        }

        const ids = response.body.map((g: GameState) => g.id)
        expect(new Set(ids).size).toBe(ids.length)
    })
})

describe('GET /game/:id', () => {
    it('returns a valid JSON GameState object with the specified ID', async () => {
        const createResponse = await request(app).get('/create')
        const gameResponse = await request(app)
            .get(`/game/${createResponse.body.id}`)
            .expect('Content-Type', /json/)
            .expect(200)
        expect(gameResponse.body).toEqual(createResponse.body)
    })

    it('responds with 404 to an invalid ID', async () => {
        const response = await request(app)
            .get('/game/2340dsdfzjascd')
            .expect(404)
        expect(response.body.error).toEqual('Game ID not found')
    })
})

describe('POST /move/:id', () => {
    it('updates the gameState correctly and returns it', async () => {
        const createResponse = await request(app)
            .get('/create')
        const moveResponse = await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ player: "X", position: 20 })
            .expect('Content-Type', /json/)
            .expect(200)
        expect(moveResponse.body.board[20]).toEqual("X")
        expect(moveResponse.body.currentPlayer).toEqual("O")
        expect(moveResponse.body.endState).toEqual(null)
        expect(moveResponse.body.id).toEqual(createResponse.body.id)
    })

    it('updates only the game with the specified ID', async () => {
        const game1 = await request(app).get('/create')
        const game2 = await request(app).get('/create')

        await request(app)
            .post(`/move/${game1.body.id}`)
            .send({ player: "X", position: 0 })
            .expect(200)

        const listResponse = await request(app).get('/list')
        const updatedGame1 = listResponse.body.find((g: GameState) => g.id === game1.body.id)
        const updatedGame2 = listResponse.body.find((g: GameState) => g.id === game2.body.id)

        expect(updatedGame1.board[0]).toEqual("X")
        expect(updatedGame2.board).toEqual(Array(27).fill(null))
    })

    it('responds with 400 if position already taken', async () => {
        const createResponse = await request(app)
            .get('/create')
        await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ player: "X", position: 0 })
        const response = await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ player: "O", position: 0 })
            .expect(400)
        expect(response.body.error).toEqual("Position is already occupied")
    })

    it('responds with 404 to an invalid ID', async () => {
        const response = await request(app)
            .post('/move/23qwfdvxiddf')
            .send({ player: "X", position: 0 })
            .expect(404)
        expect(response.body.error).toEqual('Game ID not found')
    })

    it('responds with 400 if wrong player turn', async () => {
        const createResponse = await request(app).get('/create')
        const response = await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ player: "O", position: 0 })
            .expect(400)
        expect(response.body.error).toEqual("It's X's turn")
    })

    it('responds with 400 if position out of range', async () => {
        const createResponse = await request(app).get('/create')
        const response = await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ player: "X", position: 27 })
            .expect(400)
        expect(response.body.error).toEqual("Position must be between 0 and 26")
    })

    it('responds with 400 if position is negative', async () => {
        const createResponse = await request(app).get('/create')
        const response = await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ player: "X", position: -1 })
            .expect(400)
        expect(response.body.error).toEqual("Position must be between 0 and 26")
    })

    it('responds with 400 if game already over', async () => {
        const createResponse = await request(app).get('/create')
        const id = createResponse.body.id
        // Play a winning line for X: positions 0, 1, 2 (top row of first layer)
        await request(app).post(`/move/${id}`).send({ player: "X", position: 0 })
        await request(app).post(`/move/${id}`).send({ player: "O", position: 9 })
        await request(app).post(`/move/${id}`).send({ player: "X", position: 1 })
        await request(app).post(`/move/${id}`).send({ player: "O", position: 10 })
        await request(app).post(`/move/${id}`).send({ player: "X", position: 2 }) // X wins

        const response = await request(app)
            .post(`/move/${id}`)
            .send({ player: "O", position: 11 })
            .expect(400)
        expect(response.body.error).toEqual("Game is already over")
    })

    it('responds with 400 if player field missing', async () => {
        const createResponse = await request(app).get('/create')
        const response = await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ position: 0 })
            .expect(400)
        expect(response.body.error).toEqual("Player field missing")
    })

    it('responds with 400 if position field missing', async () => {
        const createResponse = await request(app).get('/create')
        const response = await request(app)
            .post(`/move/${createResponse.body.id}`)
            .send({ player: "X" })
            .expect(400)
        expect(response.body.error).toEqual("Position field missing")
    })
})