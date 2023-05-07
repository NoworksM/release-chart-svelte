<script lang="ts">
    import type {PageData} from './$types'
    import UpsertGame from '../UpsertGame.svelte'
    import type {GameDto} from '../../../data/dto/game-dto'
    import type {ReleaseDto} from '../../../data/dto/release-dto'
    import {DateTime} from 'luxon'

    export let data: PageData

    let game: GameDto = {
        title: '',
        description: '',
        developer: '',
        publisher: '',
        releases: <ReleaseDto[]>[{
            platforms: [],
            regions: [],
            releaseDate: DateTime.now().toFormat('yyyy-MM-dd')
        }],
        genres: <string[]>[],
    }
</script>

<svelte:head>
    <title>RCAdmin: Create New Game</title>
    <meta name="description" content="Create a new game for Release Chart"/>
</svelte:head>

<UpsertGame game={game} regions={data.regions} platforms={data.platforms} genres={data.genres}/>