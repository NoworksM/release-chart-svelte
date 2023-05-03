<script lang="ts">
    import type {PageData} from './$types'
    import ReleaseGrid from '../ReleaseGrid.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>RC: Upcoming Game Releases</title>
    <meta name="description" content="A list of upcoming game releases, including release dates, platforms, and more.">
</svelte:head>

<ReleaseGrid releases={data.releases} platforms={data.platforms} />