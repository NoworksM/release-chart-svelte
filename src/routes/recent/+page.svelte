<script lang="ts">
    import type {PageData} from './$types'
    import ReleaseGrid from '../ReleaseGrid.svelte'

    export let data: PageData
</script>

<ReleaseGrid releases={data.releases} />