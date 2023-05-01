<script lang="ts">
    import ReleaseCard from './ReleaseCard.svelte'
    import type {RegionalReleaseDto} from '../data/dto/regional-release-dto'

    export let releases: RegionalReleaseDto[]
</script>

<div class="card-grid">
    {#each releases as release (`${release.id}:${release.releaseDate}:${release.regions.join(',')}${release.platforms.join(',')}`)}
        <ReleaseCard {release} />
    {/each}
</div>

<style lang="postcss">
    .card-grid {
        @apply justify-center m-8 grid gap-8;
        grid-template-columns: repeat(auto-fill, 450px);
        grid-template-rows: repeat(auto-fill, 335px);
    }
</style>