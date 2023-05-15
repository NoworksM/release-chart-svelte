<script lang="ts">
    import type {PageData} from './$types'
    import ReleaseGrid from '$lib/components/ReleaseGrid.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>Release Chart: Your Place for Upcoming Video Game Releases</title>
    <meta name="description" content="Release Chart is your place for upcoming video game releases. Get the latest release dates, watch trailers, see screenshots, and learn more about the games you care about.">
</svelte:head>

<ReleaseGrid releases={data.releases} platforms={data.platforms} />