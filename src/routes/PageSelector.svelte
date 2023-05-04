<script lang="ts">
    import '../styles/backgrounds.pcss'
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()
    
    export let currentPage = 1
    export let pages = 1

    function selectPage(page: number) {
        currentPage = page
        dispatch('pageSelected', page)
    }
</script>

<div class="flex flex-row">
    {#if currentPage > 1 && pages > 1}
        <button class="bg-primary" on:click={() => selectPage(currentPage - 1)}>&lt;</button>
    {:else}
        <div class="bg-primary">&lt;</div>
    {/if}
    {#each {length: pages} as _, i}
        <button class="bg-primary" on:click={() => selectPage(i + 1)}>{i + 1}</button>
    {/each}
    {#if currentPage < pages - 1 && pages > 1}
        <button class="bg-primary" on:click={() => selectPage(currentPage + 1)}>&gt;</button>
    {:else}
        <div class="bg-primary">&gt;</div>
    {/if}
</div>

<style lang="postcss">
    div button,
    div div {
        @apply px-3 py-1;
    }

    div div {
        @apply text-slate-600 dark:text-slate-400 cursor-auto select-none;
    }

    div button:first-child,
    div div:first-child {
        @apply rounded-l-md;
    }

    div button:last-child,
    div div:last-child {
        @apply rounded-r-md;
    }
</style>