<script lang="ts">
    import '../styles/app.pcss'
    import NavBar from '$lib/components/NavBar.svelte'
    import type {LayoutData} from './$types'

    export let data: LayoutData
</script>

<NavBar user={data.user}/>
<main>
    <slot/>
</main>

<style lang="postcss">
    :global(html) {
        @apply text-slate-900 dark:text-slate-100;
        @apply bg-slate-100 dark:bg-slate-950;
    }

    :global(body) {
        @apply flex flex-col min-h-screen;
    }

    :global(main) {
        @apply flex-1 flex flex-col items-stretch;
    }
</style>