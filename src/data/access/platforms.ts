import {platformsCollection} from '../index'
import type {PlatformDto} from '../dto/platform-dto'


export async function getPlatforms() {
    return await platformsCollection.find().sort({manufacturer: 1, name: 1}).toArray()
}

export async function getPlatformsAsDto(): Promise<PlatformDto[]> {
    return await platformsCollection.aggregate<PlatformDto>([
        {$sort: {manufacturer: 1, name: 1}},
        {$project: {_id: 0, id: {$toString: '$_id'}, name: 1, manufacturer: 1, shortName: 1}}
    ]).toArray()
}