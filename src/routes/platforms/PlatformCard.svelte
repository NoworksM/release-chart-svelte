<script lang="ts">
    import type {PlatformDto} from '../../data/dto/platform-dto.js'

    export let platform: PlatformDto
    export let releaseCount: number
</script>

<a href={`/platforms/${platform.id}`}>
    <div class="platform">
        {#if platform.hasIcon}
            <img src={`/${platform.shortName}.svg`} alt={platform.name}/>
        {:else}
            <img src="/platform_placeholder.svg" alt={platform.name}/>
        {/if}
        <div class="flex-1">
            <h3>{platform.name}</h3>
            <p>{platform.manufacturer}</p>
        </div>
        <div class="count">{releaseCount}</div>
    </div>
</a>

<style lang="postcss">
    .platform {
        @apply flex flex-row rounded-md bg-slate-200 dark:bg-slate-800 p-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer;
    }

    .platform h3 {
        @apply text-lg font-semibold;
    }

    .count {
        @apply text-2xl text-slate-500 dark:text-slate-400 align-baseline;
    }

    .platform p {
        @apply text-sm text-slate-500 dark:text-slate-400;
    }

    .platform img {
        @apply w-12 h-12 mr-4;
        filter: brightness(0%) saturate(0%) invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media (prefers-color-scheme: dark) {
        .platform img {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }
</style>