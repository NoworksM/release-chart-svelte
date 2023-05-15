import type {ObjectId} from 'mongodb'


export default interface Region {
    _id: ObjectId
    name: string
    shortName: string
}