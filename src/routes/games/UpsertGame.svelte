<script lang="ts">
    import '../../styles/forms.pcss'
    import '../../styles/buttons.pcss'

    import type {GenreDto} from '$lib/data/genre'
    import type {GameDto} from '$lib/data/game'
    import type {RegionDto} from '$lib/data/region'
    import type {PlatformDto} from '$lib/data/platform'
    import {enhance} from '$app/forms'
    import {DateTime} from 'luxon'
    import SaveFooter from '$lib/components/SaveFooter.svelte'
    import {isEqual, cloneDeep} from 'lodash'

    export let game: GameDto
    export let regions: RegionDto[]
    export let platforms: PlatformDto[]
    export let genres: GenreDto[]

    let fileUpload: HTMLInputElement
    let fileReader: FileReader | undefined
    let uploadPreview: string | undefined

    let dirty = false
    let previous: GameDto | undefined

    $: {
        if (!previous) {
            previous = cloneDeep(game)
        }

        dirty = !isEqual(previous, game)
    }

    function addRelease() {
        game.releases = [...game.releases, {releaseDate: DateTime.now().toFormat('yyyy-MM-dd'), platforms: [], regions: []}]
    }

    function removeRelease(idx: number) {
        game.releases = game.releases.filter((_, i) => i !== idx)
    }

    function selectFile() {
        fileUpload.click()
    }

    function onFileDrop(event: DragEvent) {
        const dataTransfer = event.dataTransfer

        if (dataTransfer.files.length === 0) {
            return
        }

        fileUpload.files = dataTransfer.files

        onFileChange(dataTransfer)
    }
    
    function onFileChange(event: InputEvent | DataTransfer) {
        let file: File
        if ('target' in event) {
            const fileInput = (<InputEvent> event).target as HTMLInputElement

            if (fileInput.files.length === 0 || !fileInput.files?.[0]) {
                uploadPreview = undefined
                return
            }

            file = <File>fileInput.files?.[0]
        } else {
            const dataTransfer = <DataTransfer> event

            if (dataTransfer.files.length === 0 || !dataTransfer.files[0]) {
                uploadPreview = undefined
                return
            }

            file = dataTransfer.files[0]
        }

        if (!fileReader) {
            fileReader = new FileReader()
        }

        fileReader.addEventListener('load', () => {
            if (fileReader?.result) {
                uploadPreview = fileReader?.result as string
            }

            fileReader = undefined
        })

        fileReader.readAsDataURL(file)
    }

    function onFormSubmit() {
        return async ({update}: {update: () => Promise<void>}) => {
            await update()
        }
    }
</script>

<form method="POST" enctype="multipart/form-data" action="?/save" use:enhance={onFormSubmit}>
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
                    <button class="button primary" on:click={() => addRelease()} type="button">Add</button>
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
                            <select name={`releases[${idx}].platforms`} bind:value={release.platforms} class="input" multiple>
                                {#each platforms as platform (platform.id)}
                                    <option value={platform.shortName}>{platform.name}</option>
                                {/each}
                            </select>
                        </label>
                        <label>
                            <span>Regions</span>
                            <select name={`releases[${idx}].regions`} bind:value={release.regions} class="input" multiple>
                                {#each regions as region (region.id)}
                                    <option value={region.shortName}>{region.name}</option>
                                {/each}
                            </select>
                        </label>
                        <div class="flex flex-row justify-end">
                            <button class="button danger" on:click={() => removeRelease(idx)} type="button">Remove</button>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="column">
                <div class="section poster">
                    {#if uploadPreview}
                        <img src={uploadPreview} alt={`${game.title} Game Poster`} class="poster-image" on:click={selectFile} on:keypress={selectFile} on:drop|preventDefault={onFileDrop} on:dragover|preventDefault/>
                    {:else if game.posterId}
                        <img src={`/games/${game.id}/poster/large`} alt={`${game.title} Game Poster`} class="poster-image" on:click={selectFile} on:keypress={selectFile} on:drop|preventDefault={onFileDrop} on:dragover|preventDefault/>
                    {:else}
                        <img src="/img/icons/add_photo.svg" alt="Upload Game Poster" class="placeholder" on:click={selectFile} on:keypress={selectFile} on:drop|preventDefault={onFileDrop} on:dragover|preventDefault/>
                    {/if}
                    <input name="poster" type="file" bind:this={fileUpload} on:change={onFileChange} />
                </div>
                <div class="section">
                    <label>
                        <span class="sr-only">Genres</span>
                        <select id="genres" name="genres" bind:value={game.genres} class="input" multiple>
                            {#each genres as genre (genre.name)}
                                <option value={genre.name}>{genre.name}</option>
                            {/each}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <SaveFooter show={dirty}/>
</form>

<style lang="postcss">
    .column {
        @apply flex flex-col m-4 pb-16;
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

    img.poster-image, img.placeholder {
        @apply hover:cursor-pointer;
    }

    img.placeholder {
        filter: brightness(0%) saturate(0%)  invert(5%) sepia(15%) saturate(6058%) hue-rotate(199deg) brightness(99%) contrast(93%);
    }

    @media(prefers-color-scheme: dark) {
        img.placeholder {
            filter: brightness(0%) saturate(0%) invert(100%) sepia(28%) saturate(5131%) hue-rotate(179deg) brightness(109%) contrast(88%);
        }
    }

    input[type=file] {
        @apply hidden;
    }
</style>