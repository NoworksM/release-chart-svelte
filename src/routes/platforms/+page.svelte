<script lang="ts">
    import type {PageData} from './$types'
    import PlatformCard from './PlatformCard.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>RCAdmin: Platforms</title>
    <meta name="description" content="Release Chart Platforms"/>
</svelte:head>

<div class="grid">
    {#each data.platforms as platform (platform.id)}
        <PlatformCard platform={platform} releaseCount={data.releaseCounts[platform.shortName] ?? 0}/>
    {/each}
</div>

<style lang="postcss">
    .body {
        @apply max-w-screen-2xl w-full mt-4;
    }

    .grid {
        @apply m-4 justify-center;
        display: grid;
        grid-gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-template-rows: repeat(auto-fill, 64px);
    }
</style>