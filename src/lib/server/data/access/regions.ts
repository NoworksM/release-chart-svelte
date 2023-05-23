import type {ObjectId, WithId} from 'mongodb'
import type Region from '../region'
import {gamesCollection, regionsCollection} from '..'
import type {RegionDto} from '$lib/data/region'
import type {RegionCountMap} from '$lib/data/count-map'
import {aggregateFirst} from '$lib/server/data/access/index'

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
                iconUnicode: 1
            }
        }
    ]).toArray()
}

/**
 * Returns all regions as an array of RegionDto objects.
 * Regions are sorted by name in ascending order.
 * @returns {Promise<RegionDto[]>} - An array of RegionDto objects.
 */
export async function getRegionAsDto(id: ObjectId): Promise<RegionDto | null> {
    return await aggregateFirst(regionsCollection.aggregate<RegionDto>([
        {
            $match: {_id: id}
        },
        {
            $project: {
                _id: 0,
                id: {$toString: '$_id'},
                name: 1,
                shortName: 1,
                iconUnicode: 1
            }
        }
    ]))
}

/**
 * Gets the release counts as a map of the region id to the count
 * @returns {Promise<RegionCountMap>} of the release counts
 */
export async function getReleaseCountsForRegions() {
    const counts = await gamesCollection.aggregate<{ region: string, count: number }>([
        {
            $unwind: '$releases'
        },
        {
            $unwind: '$releases.regions'
        },
        {
            $group: {
                _id: '$releases.regions',
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                count: 1,
                region: '$_id'
            }
        }
    ]).toArray()

    const map: RegionCountMap = {}

    for (const count of counts) {
        map[count.region] = count.count
    }

    return map
}