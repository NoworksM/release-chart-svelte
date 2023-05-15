import {error} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {getGame} from '$lib/server/data/access/games'
import {ObjectId} from 'mongodb'
import {filesCollection, imagesBucket} from '$lib/server/data'
import redis from '$lib/server/data/cache'
import {commandOptions} from 'redis'
import {env} from '$env/dynamic/private'
import sharp from 'sharp'

function posterKey(id: string) {
    return `poster:${id}`
}

export const GET = (async ({params}) => {
    const gameId = new ObjectId(params.id)
    const cacheKey = posterKey(params.id)

    if (redis) {
        try {
            const cached = await redis.hGetAll(commandOptions({returnBuffers: true}), cacheKey)

            if (cached['contentType'] && cached['data']) {
                const contentType = cached['contentType'].toString()
                const data = cached['data']

                return new Response(data, {
                    headers: {
                        'Content-Type': contentType,
                        'Cache-Control': `maxage=${env.CACHE_MAX_AGE}, stale-while-revalidate=${env.CACHE_SWR_AGE}`
                    }
                })
            }
        } catch {
            // ignore
        }
    }

    const game = await getGame(gameId)

    if (!game?.posterId) {
        throw error(404, 'Game not found')
    }

    const file = await filesCollection.findOne({_id: game.posterId})

    if (!file) {
        throw error(404, 'Poster not found')
    }


    const buffer = await new Promise<Buffer>((resolve, reject) => {
        const fs = imagesBucket.openDownloadStream(file._id)

        const buffers: Buffer[] = []
        fs.on('data', (data) => {
            buffers.push(data)
        })

        fs.on('end', () => {
            const buffer = Buffer.concat(buffers)

            if (buffer.length === 0) {
                reject(error(500, 'Invalid Image Data'))
                return
            }

            sharp(buffer)
                .resize(200, 300, {fit: 'cover'})
                .webp({quality: 75})
                .toBuffer()
                .then((resizedBuffer) => {
                    if (redis) {
                        Promise.all([
                            redis.hSet(cacheKey, 'contentType', Buffer.from('image/webp')),
                            redis.hSet(cacheKey, 'data', resizedBuffer)
                        ])
                            .then(() => {
                                resolve(resizedBuffer)
                            })
                            .catch(() => {
                                resolve(resizedBuffer)
                            })
                    } else {
                        resolve(resizedBuffer)
                    }
                })
        })

        fs.on('error', reject)
    })

    return new Response(buffer, {
        headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': `maxage=${env.CACHE_MAX_AGE}, stale-while-revalidate=${env.CACHE_SWR_AGE}`
        }
    })
}) satisfies RequestHandler