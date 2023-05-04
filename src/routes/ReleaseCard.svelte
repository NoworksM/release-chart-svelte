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
    <div class="poster-container">
        <img src={`/games/${release.gameId}/poster`} alt={release.title} class="poster"/>
    </div>
    <h2>{date.toFormat('MMM, dd')}</h2>
    <div class="creators">{release.developer}</div>
    <div class="platforms">
        {#each release.platforms.map(p => {
            return {name: p, info: platforms.find(x => x.shortName === p)}
        }) as platform (platform.name)}
            {#if platform.info}
                <div class="platform">
                    <img src={`/img/platforms/${platform.name}.svg`} alt={platform.info.name}/>
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

<style lang="postcss">
    .card {
        display: grid;
        grid-template-columns: 4fr 5fr;
        grid-template-rows: auto auto auto auto 1fr auto;
        height: 250px;
        @apply rounded-md bg-slate-400 dark:bg-slate-800 text-slate-900 dark:text-slate-200 drop-shadow-md;;
    }

    h1 {
        @apply px-2 py-1 text-ellipsis overflow-hidden w-full flex-1 whitespace-nowrap;
        font-size: 1.2rem;
    }

    h2 {
        @apply text-2xl;
    }

    .header {
        @apply bg-slate-500 dark:bg-slate-700 rounded-t-md flex flex-row justify-between items-center;
        @apply col-span-2;
    }

    .poster-container {
        @apply row-span-5;
    }

    .poster-container img {
        @apply h-full rounded-bl-md w-full;
        object-fit: cover;
    }

    .platforms {
        @apply flex flex-row py-1 overflow-auto;
    }

    .platforms .platform,
    .platforms img {
        min-width: 10px;
        max-width: 48px;
        height: 10px;
    }

    @media(min-width: 640px) {
        .card {
            height: 335px;
        }

        .platforms .platform,
        .platforms img {
            min-width: 16px;
            max-width: 64px;
            height: 16px;
        }
    }

    .platforms img {
        @apply mr-2;
        object-fit: fill;
        filter: brightness(0%) saturate(0%)  invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media(prefers-color-scheme: dark) {
        .platforms img {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }

    .description, .creators, .platforms, h2 {
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