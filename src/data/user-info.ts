export default interface UserInfo {
    externalId: string
    roles: string[]
    name: string
    email: string
    createdAt?: Date
    updatedAt?: Date
}