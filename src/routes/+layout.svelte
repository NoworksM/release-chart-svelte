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
    @font-face {
        font-family: "Roboto Flex";
        src: url('$lib/assets/fonts/RobotoFlex-Regular.ttf') format("truetype");
        font-display: swap;
    }

    @font-face {
        font-family: "Roboto Flex Variable";
        src: url('$lib/assets/fonts/RobotoFlex-VariableFont.ttf') format("truetype");
        font-display: swap;
    }

    :global(html) {
        @apply text-slate-900 dark:text-slate-100;
        @apply bg-slate-100 dark:bg-slate-950;
        font-family:"Roboto Flex Variable", "Roboto Flex", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    :global(body) {
        @apply flex flex-col min-h-screen;
    }

    :global(main) {
        @apply flex-1 flex flex-col items-stretch;
    }
</style>