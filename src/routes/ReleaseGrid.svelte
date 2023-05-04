<script lang="ts">
    import ReleaseCard from './ReleaseCard.svelte'
    import type {RegionalReleaseDto} from '../data/dto/regional-release-dto'
    import type {PlatformDto} from '../data/dto/platform-dto'

    export let releases: RegionalReleaseDto[]
    export let platforms: PlatformDto[]
</script>

<div class="card-grid">
    {#each releases as release (`${release.id}:${release.releaseDate}:${release.regions.join(',')}${release.platforms.join(',')}`)}
        <ReleaseCard {release} platforms={platforms} />
    {/each}
</div>

<style lang="postcss">
    .card-grid {
        @apply justify-center m-8 grid gap-8;
        grid-template-columns: repeat(auto-fill, minmax(250px, 350px));
        grid-template-rows: repeat(auto-fill, 250px);
    }

    @media(min-width: 640px) {
        .card-grid {
            grid-template-rows: repeat(auto-fill, 335px);
            grid-template-columns: repeat(auto-fill, 450px);;
        }
    }
</style>