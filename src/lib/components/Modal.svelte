<script lang="ts">
    import {createEventDispatcher} from 'svelte'

    export let cancellable = true

    const dispatch = createEventDispatcher()

    function onBackgroundClick() {
        if (cancellable) {
            dispatch('cancel')
        }
    }
</script>

<div class="background" on:click={onBackgroundClick} on:keypress={onBackgroundClick} on:cancel on:confirm>
    <div class="modal">
        <slot name="header"/>
        <slot name="body"/>
        <slot name="footer"/>
    </div>
</div>

<style lang="postcss">
    .background {
        @apply fixed w-full h-full top-0 left-0 flex flex-row justify-center items-center z-50;
        background-color: rgba(0, 0, 0, 60%);
    }

    .modal {
        @apply m-auto bg-slate-300 dark:bg-slate-800 p-4 rounded-xl;
    }
</style>