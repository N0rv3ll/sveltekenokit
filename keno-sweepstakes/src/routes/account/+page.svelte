<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
  
    let user = null;
    let email = '';
    let password = '';
  
    onMount(async () => {
      const { data } = await supabase.auth.getUser();
      user = data.user;
      if (user) {
        // Fetch user's game data here
      }
    });
  
    async function signUp() {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('Check your email for verification link');
    }
  
    async function signIn() {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else user = data.user;
    }
  
    async function signOut() {
      await supabase.auth.signOut();
      user = null;
    }
  </script>
  
  {#if user}
    <h1>Welcome, {user.email}</h1>
    <button on:click={signOut}>Sign Out</button>
  {:else}
    <h1>Account</h1>
    <input bind:value={email} type="email" placeholder="Email" />
    <input bind:value={password} type="password" placeholder="Password" />
    <button on:click={signUp}>Sign Up</button>
    <button on:click={signIn}>Sign In</button>
  {/if}