// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type {UserInfoHash} from '$lib/server/data/user-info'
import type {SessionHash} from '$lib/server/data/session'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserInfoHash | null
			session: SessionHash | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
