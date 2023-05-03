<script lang="ts">
    import type {RegionalReleaseDto} from '../data/dto/regional-release-dto'
    import Chip from './Chip.svelte'
    import {DateTime} from 'luxon'
    import type {PlatformDto} from '../data/dto/platform-dto'

    export let release: RegionalReleaseDto
    export let platforms: PlatformDto[]

    const date = DateTime.fromISO(release.releaseDate)
</script>

<div class="card">
    <div class="header">
        <h1>{release.title}</h1>
    </div>
    <div class="body">
        <div class="poster-container">
            <img src={`/games/${release.gameId}/poster`} alt={release.title} class="poster"/>
        </div>
        <div class="info">
            <div class="release-info">
                <h2>{date.toFormat('MMM, dd')}</h2>

                <div class="creators">{release.developer}</div>
            </div>
            <div class="platforms">
                {#each release.platforms.map(p => {return {name: p, info: platforms.find(x => x.shortName === p)}}) as platform (platform.name)}
                    {#if platform.info}
                        <div class="platform">
                            <span class="tooltip">{platform.info.name}</span>
                            <img src={`/${platform.name}.svg`} alt={platform.info.name}/>
                        </div>
                    {:else}
                        <img src={`/${platform.name}.svg`} alt={platform.name}/>
                    {/if}
                {/each}
            </div>
            <p class="description">{release.description}</p>
            <div class="genres">
                {#each release.genres as genre}
                    <Chip>{genre}</Chip>
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .card {
        @apply drop-shadow-lg;
    }

    .card .body {
        @apply flex flex-row bg-slate-400 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-b-md drop-shadow-md;
        width: 450px;
        height: 300px;
    }

    .card .poster {
        @apply rounded-bl-md;
        width: 200px;
        height: 300px;
        object-fit: cover;
    }

    .info {
        @apply flex flex-col flex-1;
        width: 186px;
    }

    .card .header {
        @apply bg-slate-500 dark:bg-slate-700 rounded-t-md flex flex-row justify-between items-center;
    }

    .platforms {
        @apply flex flex-row py-1;
    }

    .tooltip {
        @apply hidden rounded-md p-1 shadow-lg bg-slate-500 dark:bg-slate-700 relative top-0 left-0;
    }

    .platform:hover .tooltip {
        @apply visible z-10;
    }

    .platforms .platform,
    .platforms img {
        min-width: 16px;
        max-width: 64px;
        height: 16px;
    }

    .platforms img {
        object-fit: fill;
        filter: brightness(0%) saturate(0%)  invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media(prefers-color-scheme: dark) {
        .platforms img {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }

    .platforms img {
        @apply mr-2;
    }

    h1 {
        @apply px-2 py-1 text-ellipsis overflow-hidden w-full flex-1 whitespace-nowrap;
        font-size: 1.2rem;
    }

    .release-info {
        @apply flex flex-row justify-between;
    }

    .release-info h2 {
        @apply text-2xl;
    }

    .creators {
        @apply text-right text-sm text-ellipsis overflow-hidden whitespace-nowrap;
    }

    .description, .release-info, .platforms {
        @apply px-2 py-1;
    }

    .description {
        @apply text-ellipsis overflow-hidden w-full flex-1 px-2 py-1;
        font-size: 0.7rem;
    }

    .genres {
        @apply px-2 py-1 bg-slate-500 dark:bg-slate-700 rounded-br-md flex flex-row;
        @apply drop-shadow-md;
    }
</style>