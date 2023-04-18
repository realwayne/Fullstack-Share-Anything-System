<script>
  import { onMount, getContext } from "svelte";
  import userStore from "../../stores/userStore";
  const backendURL = getContext("backendURL");

  import PostCardSkeleton from "../../components/PostCardSkeleton.svelte";
  import PostCard from "../../components/PostCard.svelte";

  let requestedposts = null;
  onMount(() => {
    getAllUserRequestedPosts();
  });

  let gettingAllRequestedPosts = false;
  function getAllUserRequestedPosts() {
    gettingAllRequestedPosts = true;
    fetch(`${backendURL}/api/users/${$userStore._id}/requestedposts`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllRequestedPosts = false;
        console.log("REQUESTED POSTS", data);
        requestedposts = data.data;
      });
  }
</script>

<svelte:head><title>Your Requested Posts</title></svelte:head>

<h1 class="page-title">Your Requested Posts</h1>

<main>
  <div class="wrapper">
    {#if gettingAllRequestedPosts}
      {#each Array(6) as e}
        <PostCardSkeleton />
      {/each}
    {/if}
    {#if !gettingAllRequestedPosts}
      {#if requestedposts}
        {#each requestedposts as post}
          <PostCard id={post._id} yourPost={post} />
        {:else}
          <h2>You don't have any requested posts</h2>
        {/each}
      {/if}
    {/if}
  </div>
</main>

<style>
  .page-title {
    background-color: #81c784;
    padding: 1rem;
    font-size: 1.5rem;
    border-radius: 1rem;
  }
  .wrapper {
    max-width: 1200px;
    margin: 1rem auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
</style>
