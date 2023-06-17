<script lang="ts">
    import type {GenreDto} from '$lib/data/genre'
    import ImageCountCard from '$lib/components/ImageCountCard.svelte'
    import IndeterminateLoadingSpinner from '$lib/components/IndeterminateLoadingSpinner.svelte'
    import type {GenreCountMap} from '$lib/data/count-map'

    export let genre: GenreDto
    export let counts: Promise<GenreCountMap>
</script>

<a href={`/genres/${genre.id}`}>
    <ImageCountCard title={genre.name} subtext={genre.shortName ?? genre.name} clickable={true}>
        <span slot="image" class="icon"></span>
        <span slot="count">
            {#await counts}
                <IndeterminateLoadingSpinner/>
            {:then regionCounts}
                {regionCounts[genre.name] ?? '0'}
            {/await}
        </span>
    </ImageCountCard>
</a>

<style lang="postcss">
</style>