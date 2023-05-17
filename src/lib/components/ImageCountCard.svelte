<script lang="ts">
    export let title: string
    export let subtext: string
    export let clickable = false
</script>

<div class="card" class:clickable={clickable}>
    <div class="icon">
        <slot name="image"/>
    </div>
    <h1 class="title">{title}</h1>
    <div class="count">
        <slot name="count"/>
    </div>
    <p class="subtext">{subtext}</p>
</div>

<style lang="postcss">
    .card {
        @apply grid p-4 bg-slate-300 dark:bg-slate-800 rounded-xl drop-shadow-md;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
    }

    .count {
        @apply text-2xl text-slate-500 dark:text-slate-400 align-baseline row-span-2 my-auto;
    }

    .icon {
        font-family: "Noto Color Emoji", sans-serif;
        @apply text-5xl mr-2 my-auto min-w-[60px] row-span-2;
    }

    .title {
        @apply text-lg font-semibold text-ellipsis overflow-hidden whitespace-nowrap;
    }

    .subtext {
        @apply text-sm text-slate-500 dark:text-slate-400;
    }

    .clickable {
        @apply hover:bg-slate-400 hover:dark:bg-slate-700;
        transition: background-color 250ms ease-in-out;
    }
</style>