import type {ObjectId} from 'mongodb'


export default interface Platform {
    _id: ObjectId
    name: string
    shortName: string
    manufacturer: string
}