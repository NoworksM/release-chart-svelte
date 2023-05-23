<script lang="ts">
    import type {RegionDto} from '$lib/data/region'
    import type {RegionCountMap} from '$lib/data/count-map'
    import IndeterminateLoadingSpinner from '$lib/components/IndeterminateLoadingSpinner.svelte'
    import ImageCountCard from '$lib/components/ImageCountCard.svelte'

    export let region: RegionDto
    export let counts: Promise<RegionCountMap>
</script>

<a href={`/regions/${region.id}`}>
    <ImageCountCard title={region.name} subtext={region.shortName} clickable={true}>
        <span slot="image" class="icon">{@html region.iconUnicode}</span>
        <span slot="count">
        {#await counts}
            <IndeterminateLoadingSpinner/>
        {:then regionCounts}
            {regionCounts[region.shortName]}
        {/await}
    </span>
    </ImageCountCard>
</a>

<style lang="postcss">
    @font-face {
        font-family: "Noto Emoji";
        src: url('$lib/assets/fonts/NotoEmoji-Regular.ttf') format("truetype");
        font-display: swap;
    }

    .icon {
        font-family: "Noto Emoji", sans-serif;
        @apply text-5xl mr-2 my-auto min-w-[60px];
    }
</style>