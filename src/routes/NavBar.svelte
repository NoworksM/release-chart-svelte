<nav>
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

<style lang="postcss">
    nav {
        @apply bg-slate-800 text-slate-300 px-4 py-2 flex flex-row justify-between items-center drop-shadow-lg;
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