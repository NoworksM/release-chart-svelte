<script lang="ts">
    import Modal from '$lib/components/Modal.svelte'
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()

    export let title = 'Confirm Action'
    export let confirmValue = 'Confirm'
    export let cancelValue = 'Cancel'

    function cancel() {
        dispatch('cancel')
    }

    function confirm() {
        dispatch('confirm')
    }
</script>

<Modal>
    <h1 slot="header" class="header">{title}</h1>
    <div slot="body" class="body">
        <slot/>
    </div>
    <div slot="footer" class="footer">
        <button class="button primary" on:click={cancel}>{cancelValue}</button>
        <button class="button danger" on:click={confirm}>{confirmValue}</button>
    </div>
</Modal>

<style lang="postcss">
    .footer {
        @apply flex flex-row justify-end;
    }

    .footer button {
        @apply ml-2;
    }

    .body {
        @apply mb-2;
    }

    .header {
        @apply text-2xl mb-2;
    }
</style>