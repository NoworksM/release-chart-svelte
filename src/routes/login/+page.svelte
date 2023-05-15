<script lang="ts">
    import '../../styles/buttons.pcss'
    import '../../styles/forms.pcss'
</script>


<form method="post">
    <label for="username">Username</label>
    <input id="username" name="username" type="text" required/>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required/>
    <input type="submit" value="Login" class="button info"/>
</form>

<style lang="postcss">
    form {
        @apply flex flex-col gap-2 bg-slate-300 dark:bg-slate-700 m-auto p-4 rounded-md drop-shadow-lg;
    }

    input[type=submit] {
        @apply mt-4;
    }
</style>