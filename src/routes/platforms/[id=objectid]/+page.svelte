<script lang="ts">
    import type {PageData} from './$types'
    import '../../../styles/forms.pcss'
    import '../../../styles/buttons.pcss'
    import {pathToPlatformIcon, type PlatformDto} from '$lib/data/platform'
    import SaveFooter from '$lib/components/SaveFooter.svelte'
    import {cloneDeep, isEqual} from 'lodash'
    import OutlinedTextField from '$lib/components/OutlinedTextField.svelte'
    import Switch from '$lib/components/Switch.svelte'

    export let data: PageData

    let dirty = false
    let start: PlatformDto | undefined

    $: {
        if (!start) {
            start = cloneDeep(data.platform)
        }

        dirty = !isEqual(start, data.platform)
    }
</script>

<svelte:head>
    <title>RCAdmin: {data.platform.name}</title>
    <meta name="description" content={`Edit Platform ${data.platform.name}`}/>
</svelte:head>

<form method="post">
    <h1 class="text-4xl">Edit Platform</h1>
    {#if data.platform.hasIcon}
        <img src={pathToPlatformIcon(data.platform)} alt="Logo" class="col-span-2"/>
    {:else}
        <img src="/img/platforms/placeholder.svg" alt="Logo" class="col-span-2"/>
    {/if}
    <OutlinedTextField name="name" label="Name" bind:value={data.platform.name}/>
    <OutlinedTextField name="shortName" label="Short Name" bind:value={data.platform.shortName}/>
    <OutlinedTextField name="manufacturer" label="Manufacturer" bind:value={data.platform.manufacturer}/>
    <Switch name="hasIcon" label="Has Icon" bind:value={data.platform.hasIcon}/>
    <OutlinedTextField name="priority" label="Priority" bind:value={data.platform.priority} type="number" min={0}/>
    <SaveFooter show={dirty}/>
</form>

<style lang="postcss">
    label {
        @apply mb-4;
    }

    .column {
        @apply flex flex-col m-4;
    }

    img {
        @apply w-48 h-48 mx-auto;
        filter: brightness(0%) saturate(0%) invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media (prefers-color-scheme: dark) {
        img {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }

    form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto;
        @apply max-w-screen-lg mx-auto pt-16;
    }
</style>