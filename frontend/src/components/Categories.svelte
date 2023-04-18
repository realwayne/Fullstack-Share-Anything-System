<script>
  import { getContext, onMount } from "svelte";
  const backendURL = getContext("backendURL");

  export let category;
  let categories = [];
  let gettingAllCategories = false;

  onMount(() => {
    getAllCategories();
  });

  function getAllCategories() {
    gettingAllCategories = true;
    fetch(`${backendURL}/api/categories`, {
      mode: "cors",
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllCategories = false;
        if (data.status) {
          categories = data.data;
        }
      });
  }
</script>

<select bind:value={category} name="category">
  {#if gettingAllCategories}
    <option value="" selected disabled>Loading All Categories</option>
  {:else}
    <option value="" selected disabled hidden>Choose Category</option>
    {#each categories as c}
      <option value={c._id} selected={c._id == category}>
        {c.name}
      </option>
    {:else}
      <option value="" selected disabled hidden> No Categories </option>
    {/each}
  {/if}
</select>

<style>
  select {
    width: 100%;
  }
</style>
