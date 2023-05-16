<script lang="ts">
    import type {PageData} from './$types'
    import RegionCard from '$lib/components/regions/RegionCard.svelte'

    export let data: PageData
</script>

<div class="region-grid">
    {#each data.regions as region (region.id)}
        <RegionCard {region} counts={data.streamed.counts}/>
    {/each}
</div>

<style lang="postcss">
    .region-grid {
        @apply m-4 justify-center;
        display: grid;
        grid-gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-template-rows: repeat(auto-fill, 80px);
    }
</style>