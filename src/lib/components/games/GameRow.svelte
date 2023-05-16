<script lang="ts">
    import type {GameDto} from '$lib/data/game'
    import ConfirmModal from '$lib/components/ConfirmModal.svelte'

    let deleteForm: HTMLFormElement

    let deleting = false
    export let game: GameDto

    function confirmDelete() {
        deleting = true
    }

    function cancelDelete() {
        deleting = false
    }

    function deleteGame() {
        deleteForm.submit()
    }
</script>

<tr class="h-12 border-b dark:border-slate-500">
    <td>{game.title}</td>
    <td>{game.developer}</td>
    <td>{game.publisher}</td>
    <td class="flex flex-row items-center">
        <span class="flex-1">{game.updatedAt}</span>
        <a href={`/games/${game.id}`} class="button warning">Edit</a>
        <button class="button danger" on:click={confirmDelete}>Delete</button>
        <form action={`/games/${game.id}?/delete`} method="post" bind:this={deleteForm}></form>
        {#if deleting}
            <ConfirmModal on:cancel={cancelDelete} on:confirm={deleteGame}>
                Are you sure you want to delete {game.title}?<br/>This cannot be undone.
            </ConfirmModal>
        {/if}
    </td>
</tr>

<style lang="postcss">
    td {
        @apply p-2;
    }

    .button.warning {
        @apply mr-1;
    }
</style>