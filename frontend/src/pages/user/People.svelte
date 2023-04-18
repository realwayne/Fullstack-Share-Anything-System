<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import SectionTitle from "../../components/SectionTitle.svelte";
  import UserCard from "../../components/UserCard.svelte";
  import UserCardSkeleton from "../../components/UserCardSkeleton.svelte";

  let userToSearch = "";
  let suggestedUsers = [];
  let matchedUsers;

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  onMount(() => {
    getSuggestedUsers();
  });

  let showSuggestedUser = false;
  let gettingSuggestedUsers = false;
  function getSuggestedUsers() {
    gettingSuggestedUsers = true;
    fetch(`${backendURL}/api/users/suggestedUsers`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => {
        if (!res.ok) return (suggestedUsers = []);
        return res.json();
      })
      .then((data) => {
        gettingSuggestedUsers = false;
        suggestedUsers = data.users;
        console.log("SUGGESTED USERS", suggestedUsers);
      });
  }

  let searchingUser = false;
  function searchUser(e) {
    searchingUser = true;
    fetch(`${backendURL}/api/users/search`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({ name: userToSearch }),
    })
      .then((res) => {
        if (!res.ok) return (matchedUsers = []);
        return res.json();
      })
      .then((data) => {
        searchingUser = false;
        matchedUsers = data;
        console.log("SEARCH USERS", matchedUsers);
      });
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/skeleton-elements.css" />
  <title>Find people you know</title>
</svelte:head>

<section id="search-container">
  <h1>Search anyone you know</h1>
  <form on:submit|preventDefault={searchUser}>
    <input
      bind:value={userToSearch}
      type="text"
      name="user"
      placeholder="Ex. Firstname"
    />
    <button type="submit">Search User</button>
  </form>
</section>

<section id="suggested-users">
  <div class="suggested-users-title">
    <h1>Suggested Users</h1>
    <button on:click={(e) => (showSuggestedUser = !showSuggestedUser)}>
      {showSuggestedUser ? "Hide" : "Show"} Suggested Users
    </button>
  </div>
  {#if showSuggestedUser}
    <div class="wrapper">
      {#if gettingSuggestedUsers}
        {#each Array(6) as e}
          <UserCardSkeleton />
        {/each}
      {:else}
        {#each suggestedUsers as user}
          <Link to={`user/${user._id}`}>
            <UserCard
              avatar={user.avatar}
              firstname={user.firstname}
              lastname={user.lastname}
              about={user.about}
              address={user.address}
              email={user.email}
            />
          </Link>
        {:else}
          <h3>No suggested users</h3>
        {/each}
      {/if}
    </div>
  {/if}
</section>
<section id="matched-users">
  <SectionTitle title="Matched Users" />
  <div class="wrapper">
    {#if searchingUser}
      {#each Array(6) as e}
        <UserCardSkeleton />
      {/each}
    {/if}

    {#if !searchingUser}
      {#if matchedUsers}
        {#each matchedUsers as user}
          <Link to={`user/${user._id}`}>
            <UserCard
              avatar={user.avatar}
              firstname={user.firstname}
              lastname={user.lastname}
              about={user.about}
              address={user.address}
              email={user.email}
            />
          </Link>
        {:else}
          <h3>Try searching again...</h3>
        {/each}
      {:else}
        <h3>Search users</h3>
      {/if}
    {/if}
  </div>
</section>

<style>
  .suggested-users-title {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid grey;
  }
  .suggested-users-title button {
    padding: 0.25rem 0.6rem;
    border: 2px solid #81c784;
    background-color: transparent;
    font-weight: 800;
    font-size: 0.8rem;
  }
  .wrapper {
    max-width: 1200px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 1rem;
    margin: 1rem auto;
  }
  :global(.wrapper > a) {
    padding: 0.5rem;
    width: calc(calc(100% / 3) - 2rem);
  }
  @media (max-width: 800px) {
    :global(.wrapper > a) {
      padding: 0.5rem;
      width: calc(50% - 2rem);
    }
  }
  @media (max-width: 600px) {
    :global(.wrapper > a) {
      padding: 0.5rem;
      width: calc(100% - 2rem);
    }
  }
  #search-container {
    text-align: center;
    background-color: #81c784;
    padding: 1rem;
    border-radius: 1.5rem;
  }
  #search-container h1 {
    margin-bottom: 1rem;
  }
  #search-container form {
    width: 100%;
  }
  #search-container input {
    width: 50%;
    border-radius: 0.5rem;
  }
  #search-container button {
    background-color: blue;
    color: white;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }
</style>
