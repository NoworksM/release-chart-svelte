<script lang="ts">
    import '../../styles/buttons.pcss'
    import {fly} from 'svelte/transition'
    import IndeterminateLoadingSpinner from '$lib/components/IndeterminateLoadingSpinner.svelte'

    export let message = 'Save pending changes?'
    export let saveText = 'Save'
    export let show = true
    export let saving = true
</script>

{#if show}
    <div class="sticky-submit" in:fly="{{y: 200, duration: 250}}" out:fly="{{y: 200, duration: 250}}">
        <div>
            <p>{message}</p>
            <input type="submit" value={saveText} class="button info"/>
        </div>
    </div>
{/if}

<noscript>
    <div class="sticky-submit" in:fly="{{y: 200, duration: 250}}" out:fly="{{y: 200, duration: 250}}">
        <div>
            <p>{message}</p>
            {#if saving}
                <button class="button primary" disabled><IndeterminateLoadingSpinner/> {saveText}</button>
            {:else}
                <input type="submit" value={saveText} class="button info" disabled={saving}/>
            {/if}
        </div>
    </div>
</noscript>

<style lang="postcss">
    .sticky-submit {
        @apply fixed bottom-0 left-0 w-full;
    }

    .sticky-submit div {
        @apply flex flex-row w-[900px] mx-auto justify-between items-center my-4 p-4 bg-slate-300 dark:bg-slate-700 rounded-md drop-shadow-md;
    }
</style>