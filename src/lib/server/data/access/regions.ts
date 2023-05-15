import type {WithId} from 'mongodb'
import type Region from '../region'
import {regionsCollection} from '..'
import type {RegionDto} from '../../../data/dto/region-dto'



/**
 * Returns all regions as an array of Region objects with MongoDB IDs.
 * Regions are sorted by name in ascending order.
 * @returns {Promise<WithId<Region>[]>} - An array of Region objects with MongoDB IDs.
 */
export async function getRegions(): Promise<WithId<Region>[]> {
    return await regionsCollection.find().sort({name: 1}).toArray()
}

/**
 * Returns all regions as an array of RegionDto objects.
 * Regions are sorted by name in ascending order.
 * @returns {Promise<RegionDto[]>} - An array of RegionDto objects.
 */
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

