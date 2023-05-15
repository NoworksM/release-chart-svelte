import type { AggregationCursor } from 'mongodb'


/**
 * Returns the first element of an aggregation cursor or null if the cursor is empty.
 * @param aggregationCursor The aggregation cursor to retrieve the first element from.
 * @returns The first element of the aggregation cursor or null if the cursor is empty.
 */
export async function aggregateFirst<T>(aggregationCursor: AggregationCursor<T>): Promise<T | null> {
    const result = await aggregationCursor.toArray()

    if (result.length > 0) {
        return result[0]
    } else {
        return null
    }
}

