<script lang="ts">
    import {DateTime} from 'luxon'
    import range from 'lodash/fp/range'

    export let currentMonth: number
    export let currentYear: number
    export let startYear: number
    export let endYear: number

    const years = range(startYear, endYear + 1)

    const months = range(1, 13).map(m => DateTime.fromObject({year: currentYear, month: m, day: 1}))
</script>

<div class="picker-container">
    <ul class="years">
        {#each years as year (year)}
            <li class:current={year === currentYear}>
                <a href={`/${year}/${currentMonth.toString().padStart(2, '0')}`}>{year}</a>
            </li>
        {/each}
    </ul>
    <ul class="months">
        {#each months as month (month.month)}
            <li class:current={month.month === currentMonth}>
                <a href={month.toFormat('/yyyy/MM')} class="small">{month.toFormat('MMM')}</a>
                <a href={month.toFormat('/yyyy/MM')} class="large">{month.toFormat('MMMM')}</a>
            </li>
        {/each}
    </ul>
</div>

<style lang="postcss">
    .picker-container {
        @apply mt-8 mb-4 mx-auto max-w-screen-xl;
    }

    .months, .years {
        @apply hidden md:flex flex-row gap-4;
    }

    .months {
        @apply justify-between w-full text-2xl;
    }

    .years {
        @apply justify-center w-full text-2xl mb-4;
    }

    .small {
        @apply hidden sm:block xl:hidden;
    }

    .large {
        @apply hidden xl:block;
    }

    li {
        @apply text-slate-600 dark:text-slate-400;
    }

    li.current {
        @apply text-slate-900 dark:text-slate-100;
    }
</style>