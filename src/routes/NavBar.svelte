<nav class="desktop">
    <ul>
        <li><a href="/">ReleaseChart</a></li>
        <li><a href="/upcoming">Upcoming</a></li>
        <li><a href="/recent">Recent</a></li>
    </ul>
    <ul>
        <li><a href="/platforms">Platforms</a></li>
        <li><a href="/regions">Regions</a></li>
        <li><a href="/genres">Genres</a></li>
        <li><a href="/games">Games</a></li>
    </ul>
</nav>
<nav class="mobile">
    <a href="/"><img src="/home.svg" alt="Home"></a>
    <a href="/upcoming"><img src="/upcoming.svg" alt="Upcoming"></a>
    <a href="/recent"><img src="/recent.svg" alt="Recent"></a>
    <a href="/month"><img src="/month.svg" alt="This Month"></a>
</nav>

<style lang="postcss">
    nav.desktop {
        @apply bg-slate-800 text-slate-300 px-4 py-2 flex-row justify-between items-center drop-shadow-lg;
        @apply hidden md:flex;
    }

    nav.mobile {
        @apply bg-slate-800 text-slate-300 px-4 py-2 flex-row justify-between items-center drop-shadow-lg;
        @apply flex md:hidden;
        @apply fixed bottom-0 left-0 w-full z-50 drop-shadow-md;
    }

    nav.mobile img {
        filter: brightness(0%) saturate(0%) invert(48%) sepia(16%) saturate(576%) hue-rotate(176deg) brightness(90%) contrast(92%);
    }

    nav ul {
        @apply flex flex-row;
    }

    nav ul li {
        @apply mr-6;
    }

    nav ul li a {
        @apply hover:text-slate-800 hover:dark:text-slate-100;
    }
</style>