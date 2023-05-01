import {error} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {getGame} from '../../../../data/access/games'
import {ObjectId} from 'mongodb'
import {filesCollection, imagesBucket} from '../../../../data'

export const GET = (async ({params}) => {
    const game = await getGame(new ObjectId(params.id))

    if (!game?.posterId) {
        throw error(404, 'Game not found')
    }

    const file = await filesCollection.findOne({_id: game.posterId})

    if (!file) {
        throw error(404, 'Poster not found')
    }

    const fs = imagesBucket.openDownloadStream(file._id)
    

    // NOTE: This code works just fine for returning the data, for whatever reason GridFSBucketReadStream's type doesn't
    // specify it's a ReadableStream
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Response(fs, {headers: {'Content-Type': file.contentType}})
}) satisfies RequestHandler