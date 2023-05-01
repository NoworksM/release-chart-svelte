import type {WithId} from 'mongodb'
import type Region from '../region'
import {regionsCollection} from '../index'
import type {RegionDto} from '../dto/region-dto'


export async function getRegions(): Promise<WithId<Region>[]> {
    return await regionsCollection.find().sort({name: 1}).toArray()
}

export async function getRegionsAsDto(): Promise<RegionDto[]> {
    return await regionsCollection.aggregate<RegionDto>([
        {
            $sort: {name: 1}
        },
        {
            $project: {
                _id: 0,
                id: {$toString: '$_id'},
                name: 1,
                shortName: 1,
            }
        }
    ]).toArray()
}