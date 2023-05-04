<script lang="ts">
    import type {PageData} from './$types'
    export let data: PageData
</script>

<svelte:head>
    <title>RCAdmin: {data.platform.name}</title>
    <meta name="description" content={`Edit Platform ${data.platform.name}`}/>
</svelte:head>

<form>
    <label>
        Name
        <input type="text" bind:value={data.platform.name} required/>
    </label>
    <label>
        Short Name
        <input type="text" bind:value={data.platform.shortName} required/>
    </label>
    <label>
        Manufacturer
        <input type="text" bind:value={data.platform.manufacturer} required/>
    </label>

    <div class="flex flex-row justify-end">
        <input type="submit" value="Save" class="button primary"/>
    </div>
</form>