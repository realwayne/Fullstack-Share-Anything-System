<script>
  import { onMount } from "svelte";
  import PostCard from "../../components/PostCard.svelte";
  import PostCardSkeleton from "../../components/PostCardSkeleton.svelte";
  import { navigate } from "svelte-routing";
  import authStore from "../../stores/authStore";
  if (!$authStore) navigate("/login");
  import SectionTitle from "../../components/SectionTitle.svelte";
  import Categories from "../../components/Categories.svelte";

  import userStore from "../../stores/userStore";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  let category;
  let activePosts = [];

  onMount(() => {
    getAllActivePosts();
  });

  let gettingActivePosts = false;
  function getAllActivePosts() {
    gettingActivePosts = true;
    fetch(`${backendURL}/api/posts/allActivePost`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingActivePosts = false;
        activePosts = data;
        console.log("POSTS", activePosts);
      });
  }

  let fetchNextPage = false;
  let searchKeyword = "";
  let currentPage = 1;
  let theresMore = false;

  function findPost(e) {
    gettingActivePosts = false;
    gettingActivePosts = true;
    fetch(`${backendURL}/api/posts/search?page=${currentPage}`, {
      mode: "cors",
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        searchKeyword,
      }),
    })
      .then((res) => res.json())
      .then(({ data }) => {
        gettingActivePosts = false;
        console.log(data);
        if (fetchNextPage) {
          activePosts = [...activePosts, ...data];
        } else {
          activePosts = [...data];
        }
        if (data.length <= 0) theresMore = false;
        else theresMore = true;
      });
  }
</script>

<svelte:head>
  <title>Find what you like</title>
</svelte:head>

<section id="filters-container">
  <form
    on:submit|preventDefault={(e) => {
      currentPage = 1;
      fetchNextPage = false;
      findPost();
    }}
  >
    <input
      bind:value={searchKeyword}
      type="text"
      placeholder="Search posts.., ex. banana"
    />
    <div class="filter-by-category">
      <Categories bind:category />
    </div>
    <button type="submit">Search</button>
  </form>
</section>

<!-- SEARCHED POST RESULTS -->
<section>
  <SectionTitle title="Find any post" />
  <div class="wrapper">
    {#if gettingActivePosts}
      {#each Array(6) as e}
        <PostCardSkeleton />
      {/each}
    {:else}
      {#each activePosts as post}
        <PostCard yourPost={post} id={post.author?._id} />
      {:else}
        <h2>No posts available</h2>
      {/each}
    {/if}
  </div>
</section>

<!-- LOAD MORE BUTTON -->
<section>
  <div class="wrapper loadmore">
    <button
      class="load-more"
      on:click={theresMore
        ? (e) => {
            currentPage = currentPage + 1;
            fetchNextPage = true;
            findPost();
          }
        : (e) => {
            alert("No more posts");
          }}
    >
      {theresMore ? "Load more" : "No more posts"}
    </button>
  </div>
</section>

<style>
  * {
    box-sizing: border-box;
  }
  button {
    border-radius: 0.5rem;
    border: none;
    outline: none;
  }
  #filters-container {
    padding: 1rem;
    background-color: #81c784;
    border-radius: 1rem;
  }
  :global(#filters-container form *) {
    margin: 0;
  }
  #filters-container input {
    width: 350px;
  }
  #filters-container form {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
  }
  button[type="submit"] {
    background-color: blue;
    color: white;
    padding: 0.5rem 2rem;
    border: none;
    outline: none;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 1rem auto;
  }

  button.load-more {
    display: inline-block;
    margin: 0.5rem auto;
    padding: 0.5rem 1rem;
    transform: scale(1);
    border: none;
    outline: none;
    color: white;
    background-color: blue;
    border-radius: 0.5rem;
  }
  button.load-more:hover {
    transform: scale(1.1);
  }
  .wrapper.loadmore {
    padding: 1rem 0.5rem;
  }
</style>
