<script lang="ts">
    import type {RegionDto} from '$lib/data/region'
    import type {RegionCountMap} from '$lib/data/count-map'
    import IndeterminateLoadingSpinner from '$lib/components/IndeterminateLoadingSpinner.svelte'

    export let region: RegionDto
    export let counts: Promise<RegionCountMap>
</script>

<div class="region-card">
    <span class="row-span-2 icon">{@html region.iconUnicode}</span>
    <h1>{region.name}</h1>
    <span class="count row-span-2">
        {#await counts}
            <IndeterminateLoadingSpinner/>
        {:then regionCounts}
            {regionCounts[region.shortName]}
        {/await}
    </span>
    <p>{region.shortName}</p>
</div>

<style lang="postcss">
    @font-face {
        font-family: "Noto Color Emoji";
        src: url('$lib/assets/fonts/NotoColorEmoji-Regular.ttf') format("truetype");
    }

    .region-card {
        @apply grid p-4 bg-slate-300 dark:bg-slate-800 rounded-xl drop-shadow-md;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
    }

    .count {
        @apply my-auto;
    }

    .icon {
        font-family: "Noto Color Emoji", sans-serif;
        @apply text-5xl mr-2 my-auto min-w-[60px];
    }
</style>