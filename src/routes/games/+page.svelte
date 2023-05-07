<script lang="ts">
    import '../../styles/buttons.pcss'
    import '../../styles/forms.pcss'
    import PageSelector from '../PageSelector.svelte'
    import type {PageData} from './$types'
    import type {GamePage} from '../../data/dto/game-dto'
    import {writable} from 'svelte/store'
    import {browser} from '$app/environment'

    let currentPage = writable(1)
    let query = writable('')
    export let data: PageData
    let gamePage: GamePage = data

    async function loadGames() {
        if (browser) {
            const res = await fetch(`/api/games?page=${$currentPage}&q=${$query}`)

            gamePage = await res.json() as GamePage
        }
    }

    currentPage.subscribe(loadGames)
    query.subscribe(loadGames)
</script>

<div class="flex justify-center w-full">
    <div class="max-w-screen-2xl w-full mt-4">
        <div class="flex justify-end max-w mb-4">
            <a href="/games/new" class="button primary">New</a>
        </div>
        <div class="flex flex-row justify-between items-center mb-4">
            <PageSelector bind:currentPage={$currentPage} pages={gamePage.pages}/>
            <input type="search" bind:value={$query}/>
        </div>
        <table class="w-full table-fill">
            <thead class="border-b font-medium dark:border-slate-500">
                <tr>
                    <th>Title</th>
                    <th>Developer</th>
                    <th>Publisher</th>
                    <th>Updated At</th>
                </tr>
            </thead>
            <tbody>
                {#each gamePage.data as game (game.id)}
                    <tr class="h-12 border-b dark:border-slate-500">
                        <td>{game.title}</td>
                        <td>{game.developer}</td>
                        <td>{game.publisher}</td>
                        <td class="flex flex-row items-center">
                            <span class="flex-1">{game.updatedAt}</span>
                            <a href={`/games/${game.id}`} class="button warning">Edit</a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style lang="postcss">
    td {
        @apply p-2;
    }
</style>