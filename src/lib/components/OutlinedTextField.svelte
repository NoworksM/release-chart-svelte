<script lang="ts">
    export let value = ''
    export let type: 'text' | 'number' | 'password' | 'email' = 'text'
    export let label = ''

    export let id = ''

    export let name: string

    export let error: string | undefined = undefined

    let inputRef: HTMLInputElement | undefined = undefined

    function typeAction(node) {
        node.type = type
    }

    function selectInput() {
        if (inputRef) {
            inputRef.focus()
        }
    }
</script>

<div class="relative">
    <label for={id ?? name} class:error={error} on:click={selectInput} on:keypress={selectInput}>{label}</label>
    <input id={id ?? name} {name} use:typeAction bind:value={value} class="mat-input" placeholder={label} class:error={error} bind:this={inputRef}>
    {#if error}
        <span class="error-message">{error}</span>
    {/if}
</div>

<style lang="postcss">
    .mat-input {
        @apply border-2 border-solid border-slate-200 dark:border-slate-700 bg-transparent rounded-md;
        @apply px-5 py-2 mx-2 my-5;
        @apply hover:border-2 hover:border-solid;
        @apply active:border-2 active:border-solid;
        @apply focus:border-2 focus:border-solid;
        @apply outline-0 outline-offset-2 focus:outline-1 outline-slate-200 dark:outline-slate-700;
    }

    .mat-input.error {
        @apply border-red-500;
    }

    label:has(+ input.mat-input) {
        position: absolute;
        top: 13px;
        left: 20px;
        @apply bg-slate-100 dark:bg-slate-950 px-1.5 text-xs;
        transition-property: top, left, font-size;
        transition: ease-in-out;
        transition-duration: 100ms;
        user-select: none;
        cursor: text;
    }

    label.error:has(+ input.mat-input) {
        @apply text-red-500;
    }

    label:has(+ input.mat-input:placeholder-shown:not(:focus)) {
        position: absolute;
        top: 29px;
        left: 24px;
        @apply text-lg;
    }

    ::placeholder {
        color: transparent;
    }

    .error-message {
        position: absolute;
        bottom: 2px;
        left: 24px;
        @apply text-red-500 text-xs;
    }
</style>