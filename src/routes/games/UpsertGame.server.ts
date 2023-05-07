import type {RequestEvent as NewRequestEvent} from './new/$types'
import type {RequestEvent as UpdateRequestEvent} from './[id=objectid]/$types'
// eslint-disable-next-line no-duplicate-imports
import type {GridFSFile} from 'mongodb'
import {ObjectId} from 'mongodb'
import {gamesCollection, imagesBucket} from '../../data'
import {fail} from '@sveltejs/kit'
// eslint-disable-next-line no-duplicate-imports
import {GameDtoSchema} from '../../data/dto/game-dto'
import * as z from 'zod'
import {omit} from 'lodash'
import type {Game} from '../../data/game'
import {DateTime} from 'luxon'
import type {ReleaseDto} from '../../data/dto/release-dto'

const winFakepathPrefix = 'C:\\fakepath\\'

const UpsertBaseSchema = GameDtoSchema
    .omit({id: true, posterId: true, createdAt: true, updatedAt: true})

async function uploadPoster(poster: File) {
    const name = poster.name.startsWith(winFakepathPrefix)
        ? poster.name.substring(winFakepathPrefix.length)
        : poster.name

    const stream = (poster as Blob).stream()

    const uploadStream = imagesBucket.openUploadStream(name, {
        contentType: poster.type
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await stream.pipeTo(uploadStream)

    return await new Promise<GridFSFile>((resolve, reject) => {
        uploadStream.end((err, file) => {
            if (err) {
                reject(err)
            } else {
                resolve(file as GridFSFile)
            }
        })
    })
}

export default async function upsertGame({request, params}: NewRequestEvent | UpdateRequestEvent) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = params.id ? new ObjectId(params.id) : undefined

    if (id) {
        if (await gamesCollection.countDocuments({_id: id}) === 0) {
            return fail(404, {})
        }
    }

    const upsertSchema = id
        ? UpsertBaseSchema.extend({poster: z.instanceof(File).optional()})
        : UpsertBaseSchema.extend({poster: z.instanceof(File)})

    const formData = await request.formData()

    const formDataObject = Object.fromEntries(formData)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formDataObject['genres'] = formData.getAll('genres') as string[]

    const releases: ReleaseDto[] = []

    const generateNamesForIndex = (index: number) => {
        const baseName = `releases[${index}]`
        const releaseDateName = baseName + '.releaseDate'
        const platformsName = baseName + '.platforms'
        const regionsName = baseName + '.regions'
        return {baseName, releaseDateName, platformsName, regionsName}
    }

    for (let idx = 0; Object.values(generateNamesForIndex(idx)).some(s => formData.has(s)); idx++) {
        const {releaseDateName, platformsName, regionsName} = generateNamesForIndex(idx)

        releases.push({
            releaseDate: formData.get(releaseDateName) as string,
            platforms: formData.getAll(platformsName) as string[],
            regions: formData.getAll(regionsName) as string[]
        })

        delete formDataObject[releaseDateName]
        delete formDataObject[platformsName]
        delete formDataObject[regionsName]
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formDataObject['releases'] = releases

    const bodyResult = await upsertSchema.safeParseAsync(formDataObject)

    if (!bodyResult.success) {
        return fail(400, {error: bodyResult.error})
    }

    const body = bodyResult.data

    let posterFile: GridFSFile | undefined
    if (body.poster) {
        posterFile = await uploadPoster(body.poster)
    }

    const now = new Date()

    const data: Game = {
        ...omit(body, ['poster', 'releases']),
        releases: body.releases.map(release => {
            return {
                ...omit(release, ['releaseDate']),
                releaseDate: DateTime.fromISO(release.releaseDate).toJSDate()
            }
        }),
        updatedAt: now
    }

    if (id) {
        data.createdAt = now
    }

    if (posterFile) {
        data.posterId = posterFile._id
    }

    if (id) {
        await gamesCollection.updateOne({_id: id}, {$set: data})
    } else {
        const inserted = await gamesCollection.insertOne(data)
        return {id: inserted.insertedId.toString()}
    }
}