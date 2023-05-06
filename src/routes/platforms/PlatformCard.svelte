<script lang="ts">
    import type {PlatformDto} from '../../data/dto/platform-dto.js'
    import {pathToPlatformIcon} from '../../data/platform'

    export let platform: PlatformDto
    export let releaseCount: number
</script>

<a href={`/platforms/${platform.id}`}>
    <div class="platform">
        <img src={pathToPlatformIcon(platform, '/img/platforms/placeholder.svg')} alt={platform.name}/>
        <h3>{platform.name}</h3>
        <div class="count">{releaseCount}</div>
        <p>{platform.manufacturer}</p>
    </div>
</a>

<style lang="postcss">
    .platform {
        @apply grid rounded-md bg-slate-200 dark:bg-slate-800 p-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer;
        grid-template-columns: auto minmax(200px, 1fr) auto;
        grid-template-rows: 1fr auto;
        height: 64px;
    }

    .platform h3 {
        @apply text-lg font-semibold text-ellipsis overflow-hidden whitespace-nowrap;
    }

    .count {
        @apply text-2xl text-slate-500 dark:text-slate-400 align-baseline row-span-2;
    }

    .platform p {
        @apply text-sm text-slate-500 dark:text-slate-400;
    }

    .platform img {
        @apply w-12 h-12 mr-4 row-span-2;
        filter: brightness(0%) saturate(0%) invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media (prefers-color-scheme: dark) {
        .platform img {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }
</style>