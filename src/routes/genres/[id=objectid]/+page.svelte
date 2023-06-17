<script lang="ts">
    import type {PageData} from './$types'
    import OutlinedTextField from '$lib/components/OutlinedTextField.svelte'
    import SaveFooter from '$lib/components/SaveFooter.svelte'
    import {enhance} from '$app/forms'
    import {cloneDeep, isEqual} from 'lodash'

    export let data: PageData

    let saving = false
    let dirty = false
    let start = cloneDeep(data?.genre)

    if (start && !start.shortName) {
        start.shortName = ''
    }

    $: {
        if (!start && data?.genre) {
            start = cloneDeep(data?.genre)
        }

        dirty = !isEqual(start, data?.genre)
    }

    function onSubmit() {
        saving = true

        return async ({update}) => {
            await update()
            saving = false
        }
    }
</script>

<svelte:head>
    <title>RCAdmin: Edit Genre {data.genre.name}</title>
</svelte:head>

<form method="post" use:enhance={onSubmit}>
    <h1 class="col-span-2 text-4xl pb-4 px-2">Edit Genre {data.genre.name}</h1>

    <OutlinedTextField label="Name" name="name" bind:value={data.genre.name}/>
    <OutlinedTextField label="Short Name" name="shortName" bind:value={data.genre.shortName}/>

    <SaveFooter show={dirty} {saving}/>
</form>

<style lang="postcss">
    form {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto auto repeat(3, 1fr);
        @apply mx-auto my-8;
    }
</style>