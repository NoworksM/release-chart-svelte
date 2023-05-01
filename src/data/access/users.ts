import {userInfoCollection} from '../index'

export async function getUser(userId: string) {
    return await userInfoCollection.findOne({externalId: userId})
}

export async function getUsers() {

}