import {MongoClient, ServerApiVersion} from 'mongodb'
import {env} from '$env/dynamic/private'

export default function initializeMongoDb() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const client = new MongoClient(env.CONNECTION_STRING!, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: false,
            deprecationErrors: true
        }
    })

    const db = client.db(env.DATABASE_NAME)

    let mongoClientPromise: Promise<MongoClient>
    if (env.NODE_ENV === 'development') {
        const globalCase = <{_mongoClientPromise?: Promise<MongoClient>}> global

        mongoClientPromise = globalCase._mongoClientPromise = globalCase._mongoClientPromise ?? client.connect()
    } else {
        mongoClientPromise = client.connect()
    }

    return {client, db, mongoClientPromise}
}