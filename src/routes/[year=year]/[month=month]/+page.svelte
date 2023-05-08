<script lang="ts">
    import type {PageData} from './$types'
    import ReleaseGrid from '../../ReleaseGrid.svelte'
    import MonthPicker from './MonthPicker.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>RC: Upcoming Game Releases</title>
    <meta name="description" content="A list of upcoming game releases, including release dates, platforms, and more.">
</svelte:head>

<MonthPicker currentYear={data.year} currentMonth={data.month} startYear={2018} endYear={2023}/>

<ReleaseGrid releases={data.releases} platforms={data.platforms}/>