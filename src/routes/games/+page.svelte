<script lang="ts">
    import '../../styles/buttons.pcss'
    import '../../styles/forms.pcss'
    import PageSelector from './page-selector.svelte'
    import type {PageData} from './$types'

    let currentPage = 1
    let query = ''
    export let data: PageData
</script>

<div class="flex justify-center w-full">
    <div class="max-w-screen-2xl w-full mt-4">
        <div class="flex justify-end max-w mb-4">
            <a href="/games/new" class="button primary">New</a>
        </div>
        <div class="flex flex-row justify-between items-center mb-4">
            <PageSelector bind:currentPage={currentPage} pages={data.pages}/>
            <input type="search" bind:value={query}/>
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
                {#each data.data as game}
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