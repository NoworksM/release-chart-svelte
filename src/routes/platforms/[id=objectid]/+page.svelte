<script lang="ts">
    import type {PageData} from './$types'
    import '../../../styles/forms.pcss'
    import '../../../styles/buttons.pcss'

    export let data: PageData
</script>

<svelte:head>
    <title>RCAdmin: {data.platform.name}</title>
    <meta name="description" content={`Edit Platform ${data.platform.name}`}/>
</svelte:head>

<form>
    <div class="info">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" bind:value={data.platform.name} required/>
        <label id="shortName" for="shortName">Short Name</label>
        <input name="shortName" type="text" bind:value={data.platform.shortName} required/>
        <label id="manufacturer" for="manufacturer">Manufacturer</label>
        <input name="manufacturer" type="text" bind:value={data.platform.manufacturer} required/>
    </div>
    <div class="column">
        {#if data.platform.hasIcon}
            <img src={`/${data.platform.shortName}.svg`} alt="Logo"/>
        {:else}
            <img src="/platform_placeholder.svg" alt="Logo"/>
        {/if}
    </div>
    <div class="col-span-2 flex flex-row justify-end">
        <input type="submit" value="Save" class="button primary"/>
    </div>
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

    .info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(auto-fill, minmax(40px, 1fr));
        align-items: baseline;
    }

    .info label {
        @apply ml-auto mr-1;
    }
</style>