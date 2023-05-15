import type {LayoutLoad} from './$types'

export const load = (async ({fetch}) => {
    return {
        user: fetch('/api/users/me').then(r => {
            if (r.status === 200) {
                return r.json()
            } else {
                return null
            }
        })
    }
}) satisfies LayoutLoad