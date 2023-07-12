<script lang="ts">
    import SaveFooter from '$lib/components/SaveFooter.svelte'
    import OutlinedTextField from '$lib/components/OutlinedTextField.svelte'
    import type {GenreDto} from '$lib/data/genre'
    import {enhance} from '$app/forms'

    let saving = false

    let genre: GenreDto = {
        name: '',
        shortName: ''
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
    <title>RCAdmin: Add Genre</title>
</svelte:head>

<form method="post" use:enhance={onSubmit}>
    <h1 class="col-span-2 text-4xl pb-4 px-2">Edit Genre {genre.name}</h1>

    <OutlinedTextField label="Name" name="name" bind:value={genre.name}/>
    <OutlinedTextField label="Short Name" name="shortName" bind:value={genre.shortName}/>

    <SaveFooter show={true} {saving}/>
</form>

<style lang="postcss">
    form {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto auto repeat(3, 1fr);
        @apply mx-auto my-8;
    }
</style>