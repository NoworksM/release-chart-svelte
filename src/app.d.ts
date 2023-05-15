// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type {UserInfoHash} from './data/user-info'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserInfoHash | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
