<script lang="ts">
    import '../../../styles/forms.pcss'
    import '../../../styles/buttons.pcss'
    import type {PageData} from './$types'

    export let data: PageData

    function addRelease() {
        data.game.releases = [...data.game.releases, {releaseDate: '', platforms: [], regions: []}]
    }

    function removeRelease(idx: number) {
        data.game.releases = data.game.releases.filter((_, i) => i !== idx)
    }
</script>

<form method="POST">
    <div class="flex justify-center mt-6">
        <div class="flex flex-row">
            <div class="column">
                <h4 class="text-xl mb-4">Game Info</h4>
                <label>
                    <span class="sr-only">Title</span>
                    <input name="title" bind:value={data.game.title} class="input" type="text" placeholder="Title"/>
                </label>
                <label>
                    <span class="sr-only">Developer</span>
                    <input name="developer" bind:value={data.game.developer} class="input" type="text"
                           placeholder="Developer"/>
                </label>
                <label>
                    <span class="sr-only">Publisher</span>
                    <input name="publisher" bind:value={data.game.publisher} class="input" type="text"
                           placeholder="Publisher"/>
                </label>
                <label>
                    <span class="sr-only">Title</span>
                    <textarea name="description" bind:value={data.game.description} class="input"
                              placeholder="Description"></textarea>
                </label>
                <div class="flex flex-row justify-between mb-4">
                    <h4 class="text-2xl">Releases</h4>
                    <button class="button primary" on:click={addRelease}>Add</button>
                </div>
                {#each data.game.releases as release, idx (idx)}
                    <div class="section">
                        <h5 class="text-lg mb-4">Release {idx + 1}</h5>
                        <label>
                            <span class="sr-only">Release Date</span>
                            <input name={`releases[${idx}].releaseDate`} bind:value={release.releaseDate} type="date"
                                   class="input"/>
                        </label>
                        <label>
                            <span class="sr-only">Platforms</span>
                            <select bind:value={release.platforms} class="input" multiple>
                                {#each data.platforms as platform (platform.id)}
                                    <option value={platform.shortName}>{platform.name}</option>
                                {/each}
                            </select>
                        </label>
                        <label>
                            <span class="sr-only">Regions</span>
                            <select bind:value={release.regions} class="input" multiple>
                                {#each data.regions as region (region.id)}
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
                <div class="section">
                    {#if data.game.posterId}
                        <img src={`/games/${data.game.id}/poster`} alt={`${data.game.title} Game Cover`}/>
                    {:else}
                        <img src="/add_photo.svg" alt="Upload Game Cover"/>
                    {/if}
                </div>
                <div class="section">
                    <label>
                        <span class="sr-only">Genres</span>
                        <select bind:value={data.game.genres} class="input" multiple>
                            {#each data.genres as genre (genre.name)}
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
        @apply flex flex-col w-96 m-4;
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
        @apply w-full bg-slate-300 dark:bg-slate-800 rounded-md;
        height: 500px;
        object-fit: fill;
    }
</style>