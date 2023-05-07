<script lang="ts">
    import type {PageData} from './$types'
    import UpsertGame from '../UpsertGame.svelte'

    export let data: PageData
</script>

<svelte.head>
    <title>RCAdmin: Edit {data.game.title}</title>
    <meta name="description" content="Release Chart: Edit Game - {data.game.title}" />
</svelte.head>

<UpsertGame game={data.game} regions={data.regions} platforms={data.platforms} genres={data.genres} />