<script lang="ts">
    import type {PageData} from './$types'
    import ReleaseGrid from '$lib/components/ReleaseGrid.svelte'
    import MonthPicker from './MonthPicker.svelte'

    export let data: PageData
</script>

<svelte:head>
    <title>RC: Upcoming Game Releases</title>
    <meta name="description" content="A list of upcoming game releases, including release dates, platforms, and more.">
</svelte:head>

<MonthPicker currentYear={data.year} currentMonth={data.month} startYear={data.yearRange.min} endYear={data.yearRange.max}/>

<ReleaseGrid releases={data.releases} platforms={data.platforms}/>