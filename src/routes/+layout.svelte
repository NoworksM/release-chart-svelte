<script>
    import '../styles/app.pcss'
    import NavBar from './NavBar.svelte'
</script>

<NavBar/>
<main>
    <slot/>
</main>

<style lang="postcss">
    :global(html) {
        @apply text-slate-900 dark:text-slate-100;
        @apply bg-slate-100 dark:bg-slate-950;
    }
</style>