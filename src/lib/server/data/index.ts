import {GridFSBucket} from 'mongodb'
import initializeMongoDb from './mongo'
import type {Game} from './game'
import type Region from './region'
import type Platform from './platform'
import type Genre from './genre'
import type UserInfo from './user-info'
import type Session from './session'

const {client, db, mongoClientPromise} = initializeMongoDb()

const gamesCollection = db.collection<Game>('games')
const regionsCollection = db.collection<Region>('regions')
const platformsCollection = db.collection<Platform>('platforms')
const genresCollection = db.collection<Genre>('genres')

const filesCollection = db.collection('fs.files')

const userInfoCollection = db.collection<UserInfo>('userInfo')

const sessionCollection = db.collection<Session>('sessions')

const imagesBucket = new GridFSBucket(db)

export {
    db,
    gamesCollection,
    platformsCollection,
    regionsCollection,
    filesCollection,
    genresCollection,
    userInfoCollection,
    sessionCollection,
    imagesBucket,
    mongoClientPromise
}