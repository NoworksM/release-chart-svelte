<script lang="ts">
    import type {PageData} from './$types'
    import GenreCard from '$lib/components/genres/GenreCard.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>RCAdmin: Genres</title>
    <meta name="description" content="Release Chart Genres"/>
</svelte:head>

<div class="grid">
    {#each data.genres as genre (genre.id)}
        <GenreCard {genre} counts={data.counts}/>
    {/each}
</div>

<style lang="postcss">
    .grid {
        @apply m-4 justify-center;
        display: grid;
        grid-gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-template-rows: repeat(auto-fill, 80px);
    }
</style>