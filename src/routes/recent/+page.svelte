<script lang="ts">
    import type {PageData} from './$types'
    import ReleaseGrid from '$lib/components/ReleaseGrid.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>RC: Recent Game Releases</title>
    <meta name="description" content="Recent game releases for PC, PS4, Xbox One, Switch, 3DS, PS Vita, and more.">
</svelte:head>

<ReleaseGrid releases={data.releases} platforms={data.platforms} />