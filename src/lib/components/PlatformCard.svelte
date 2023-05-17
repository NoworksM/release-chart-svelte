<script lang="ts">
    import {pathToPlatformIcon, type PlatformDto} from '$lib/data/platform'
    import ImageCountCard from '$lib/components/ImageCountCard.svelte'

    export let platform: PlatformDto
    export let releaseCount: number
</script>

<a href={`/platforms/${platform.id}`}>
    <ImageCountCard title={platform.name} subtext={platform.manufacturer} clickable={true}>
        <img slot="image" src={pathToPlatformIcon(platform, '/img/platforms/placeholder.svg')} alt={platform.name}/>
        <div slot="count">{releaseCount}</div>
    </ImageCountCard>
</a>

<style lang="postcss">
    img {
        @apply w-12 h-12 mr-4 row-span-2;
        filter: brightness(0%) saturate(0%) invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media (prefers-color-scheme: dark) {
        img {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }
</style>