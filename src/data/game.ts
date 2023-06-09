import type {Release} from './release'
import type {ObjectId} from 'mongodb'
import type {GameDto} from './dto/game-dto'
// eslint-disable-next-line no-duplicate-imports
import {releaseToDto} from './release'

export interface Game {
    _id?: ObjectId
    title: string
    description: string
    imagePath?: string
    releases: Release[]
    developer: string
    publisher: string
    genres: string[]
    posterId?: ObjectId
    createdAt?: Date
    updatedAt?: Date
}

export function gameToDto(game: Game): GameDto {
    return {
        ...game,
        id: game._id?.toString(),
        posterId: game.posterId?.toString(),
        releases: game.releases.map(releaseToDto),
        createdAt: game.createdAt,
        updatedAt: game.updatedAt
    }
}