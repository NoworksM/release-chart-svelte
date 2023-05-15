<div class="chip [word-wrap: break-word] hover:!shadow-none">
    <slot/>
</div>

<style lang="postcss">
    .chip {
        @apply my-[2px] flex h-[24px] items-center;
        @apply justify-center rounded-[16px] bg-slate-400 px-[8px] py-0 text-[10px] font-normal normal-case leading-loose;
        @apply text-slate-900 shadow-none transition-[opacity] duration-300 ease-linear;
        @apply dark:bg-slate-800 dark:text-slate-300 select-none mr-1;
    }
</style>