<script lang="ts">
    import type {RegionalReleaseDto} from '../data/dto/regional-release-dto'
    import Chip from './Chip.svelte'

    export let release: RegionalReleaseDto
</script>

<div class="card">
    <div class="header">
        <h1>{release.title}</h1>
        <div class="platforms">
            {#each release.platforms as platform (platform)}
                <img src={`/${platform}.svg`} alt={platform}/>
            {/each}
        </div>
    </div>
    <div class="body">
        <img src={`/games/${release.gameId}/poster`} alt={release.title} class="poster"/>
        <div class="info">
            <div class="release-info">
                <!--TODO: Format for next and current year as MMM, dd-->
                <h2>{release.releaseDate}</h2>
                <div class="creators">
                    {#if release.developer === release.publisher}
                        <div class="dev">{release.developer}</div>
                    {:else}
                        <div class="dev">{release.developer}</div>
                        <div class="pub">{release.publisher}</div>
                    {/if}
                </div>
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

    .card .header .platforms {
        @apply flex flex-row;
    }

    .platforms img {
        min-width: 20px;
        max-width: 72px;
        height: 20px;
        object-fit: fill;
        filter: invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media(prefers-color-scheme: dark) {
        .platforms img {
            filter: invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }

    .card .header .platforms > * {
        @apply mr-2;
    }

    h1 {
        @apply px-2 py-1;
    }

    .release-info {
        @apply flex flex-row justify-between px-2;
    }

    .release-info h2 {
        @apply text-lg;
    }

    .dev, .pub {
        @apply text-right text-sm;
    }

    .description {
        @apply text-ellipsis overflow-hidden w-full flex-1 px-2 py-1;
        font-size: 0.8rem;
    }

    .genres {
        @apply px-2 py-1 bg-slate-500 dark:bg-slate-700 rounded-br-md flex flex-row;
        @apply drop-shadow-md;
    }

    h1 {
        font-size: 1.1rem;
        font-weight: bold;
    }
</style>