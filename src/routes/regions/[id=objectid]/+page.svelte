<script lang="ts">
    import '../../../styles/forms.pcss'
    import '../../../styles/buttons.pcss'
    import type {PageData} from './$types'
    import {enhance} from '$app/forms'
    import SaveFooter from '$lib/components/SaveFooter.svelte'
    import type {RegionDto} from '$lib/data/region'
    import {cloneDeep, isEqual} from 'lodash'
    import OutlinedTextField from '$lib/components/OutlinedTextField.svelte'

    const unicodeCharacterRegex = /^(&#[0-9]+;)+$/

    export let data: PageData

    let start: RegionDto | undefined
    let dirty = false
    let saving = false

    $: {
        if (!start && data?.region) {
            start = cloneDeep(data.region)
        }

        dirty = !isEqual(start, data.region)
    }

    $: safeIconUnicode = unicodeCharacterRegex.test(data.region.iconUnicode) ? data.region.iconUnicode : ''

    const onSubmit = () => {
        saving = true

        return async ({update}) => {
            await update()
            saving = false
        }
    }
</script>

<svelte:head>
    <title>RCAdmin: Edit {data.region.name} Region</title>
</svelte:head>

<form method="post" use:enhance={onSubmit}>
    <h1 class="col-span-2 mx-2 text-2xl">Edit Region</h1>
    {#if safeIconUnicode}
        <span class="icon-display">{@html safeIconUnicode}</span>
    {:else}
        <span class="icon-display">󠀠󠀠&#0020;</span>
    {/if}
    <OutlinedTextField name="name" label="Name" bind:value={data.region.name}/>
    <OutlinedTextField name="shortName" label="Short Name" bind:value={data.region.shortName}/>
    <OutlinedTextField name="iconUnicode" label="Icon Unicode" bind:value={data.region.iconUnicode}/>

    <SaveFooter show={dirty || saving} saving={saving}/>
</form>

<style lang="postcss">
    @font-face {
        font-family: "Noto Emoji";
        src: url('$lib/assets/fonts/NotoEmoji-Regular.ttf') format("truetype");
        font-display: swap;
    }

    form {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto auto repeat(3, 1fr);
        @apply mx-auto my-8;
    }

    .icon-display {
        @apply col-span-2 mx-auto my-4 text-9xl;
        font-family: "Noto Emoji", sans-serif;
    }
</style>