<script lang="ts">
    import '../../styles/forms.pcss'
    import '../../styles/buttons.pcss'

    import type {GenreDto} from '../../data/dto/genre-dto'
    import type {GameDto} from '../../data/dto/game-dto'
    import type {RegionDto} from '../../data/dto/region-dto'
    import type {PlatformDto} from '../../data/dto/platform-dto'

    export let game: GameDto
    export let regions: RegionDto[]
    export let platforms: PlatformDto[]
    export let genres: GenreDto[]

    function addRelease() {
        game.releases = [...game.releases, {releaseDate: '', platforms: [], regions: []}]
    }

    function removeRelease(idx: number) {
        game.releases = game.releases.filter((_, i) => i !== idx)
    }
</script>

<form method="POST">
    <div class="flex justify-center mt-6">
        <div class="flex flex-row">
            <div class="column">
                <h4 class="text-xl mb-4">Game Info</h4>
                <label>
                    <span>Title</span>
                    <input name="title" bind:value={game.title} class="input" type="text" placeholder="Title"/>
                </label>
                <label>
                    <span>Developer</span>
                    <input name="developer" bind:value={game.developer} class="input" type="text"
                           placeholder="Developer"/>
                </label>
                <label>
                    <span>Publisher</span>
                    <input name="publisher" bind:value={game.publisher} class="input" type="text"
                           placeholder="Publisher"/>
                </label>
                <label>
                    <span>Description</span>
                    <textarea name="description" bind:value={game.description} class="input"
                              placeholder="Description"></textarea>
                </label>
                <div class="flex flex-row justify-between mb-4">
                    <h4 class="text-2xl">Releases</h4>
                    <button class="button primary" on:click={addRelease}>Add</button>
                </div>
                {#each game.releases as release, idx (idx)}
                    <div class="section">
                        <h5 class="text-lg mb-4">Release {idx + 1}</h5>
                        <label>
                            <span>Release Date</span>
                            <input name={`releases[${idx}].releaseDate`} bind:value={release.releaseDate} type="date"
                                   class="input"/>
                        </label>
                        <label>
                            <span>Platforms</span>
                            <select bind:value={release.platforms} class="input" multiple>
                                {#each platforms as platform (platform.id)}
                                    <option value={platform.shortName}>{platform.name}</option>
                                {/each}
                            </select>
                        </label>
                        <label>
                            <span>Regions</span>
                            <select bind:value={release.regions} class="input" multiple>
                                {#each regions as region (region.id)}
                                    <option value={region.name}>{region.name}</option>
                                {/each}
                            </select>
                        </label>
                        <div class="flex flex-row justify-end">
                            <button class="button danger" on:click={() => removeRelease(idx)}>Remove</button>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="column">
                <div class="section poster">
                    {#if game.posterId}
                        <img src={`/games/${game.id}/poster`} alt={`${game.title} Game Cover`} class="poster-image"/>
                    {:else}
                        <img src="/img/icons/add_photo.svg" alt="Upload Game Cover" class="placeholder"/>
                    {/if}
                </div>
                <div class="section">
                    <label>
                        <span class="sr-only">Genres</span>
                        <select bind:value={game.genres} class="input" multiple>
                            {#each genres as genre (genre.name)}
                                <option value={genre.name}>{genre.name}</option>
                            {/each}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    </div>
</form>

<style lang="postcss">
    .column {
        @apply flex flex-col m-4;
        width: 450px;
    }

    .column .section {
        @apply mb-6 flex flex-col w-full;
    }

    label {
        @apply mb-4;
    }

    .input {
        @apply w-full;
    }

    textarea, select {
        @apply min-h-[200px] px-2 py-1;
    }

    img {
        @apply w-full rounded-md;
        height: 600px;
    }

    .poster {
        @apply bg-slate-300 dark:bg-slate-800 rounded-md;
    }

    img.poster-image {
        object-fit: cover;
    }

    img.placeholder {
        filter: brightness(0%) saturate(0%)  invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media(prefers-color-scheme: dark) {
        img.placeholder {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }
</style>