<script lang="ts">
    import {browser} from '$app/environment'

    export let label: string
    export let value: boolean
    export let id: string | undefined
    export let name: string

    function check() {
        value = !value
    }
</script>

<div>
    <div class="flex flex-row justify-between px-2 py-7">
        <label for={id ?? name}>{label}</label>

        {#if browser}
            <div class="switch" class:active={value} on:click={check} on:keypress={check}>
                <div class="toggle"></div>
            </div>
            <!--suppress XmlDuplicatedId -->
            <input id={id ?? name} type="checkbox" class="hidden" bind:value={value}>
        {:else}
            <noscript>
                <!--suppress XmlDuplicatedId -->
                <input id={id ?? name} type="checkbox" bind:value={value}>
            </noscript>
        {/if}
    </div>
</div>

<style lang="postcss">
    .switch {
        @apply w-12 h-6 rounded-full border-[3px] border-slate-200 dark:border-slate-700;
        @apply cursor-pointer;
        transition: background-color;
        transition-timing-function: ease-in-out;
        transition-duration: 150ms;
    }

    .switch.active {
        @apply bg-slate-200 dark:bg-slate-700;
    }

    .switch .toggle {
        @apply w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 my-auto;
        position: relative;
        top: 3px;
        left: 3px;
        transition: background-color, left;
        transition-duration: 150ms;
        transition-timing-function: ease-in-out;
    }

    .switch.active .toggle {
        @apply w-4 h-4 bg-slate-800 dark:bg-slate-200;
        top: 1.5px;
        left: 24px;
    }
</style>