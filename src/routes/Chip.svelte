<div class="chip [word-wrap: break-word] hover:!shadow-none">
    <slot/>
</div>

<style lang="postcss">
    .chip {
        @apply my-[5px] flex h-[32px] items-center;
        @apply justify-center rounded-[16px] bg-slate-400 px-[12px] py-0 text-[13px] font-normal normal-case leading-loose;
        @apply text-slate-900 shadow-none transition-[opacity] duration-300 ease-linear;
        @apply dark:bg-slate-800 dark:text-slate-300 select-none mr-1;
    }
</style>