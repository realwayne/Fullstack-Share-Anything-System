<script>
  import { getContext, onDestroy } from "svelte";
  import Modal from "./../../Modal.svelte";

  const backendURL = getContext("backendURL");

  export let close;
  export let category;
  export let updateCategory;

  let name = category.name;
  let description = category.description;

  let updatingCategory = false;

  async function handleUpdateCategory(e) {
    if (updatingCategory) return;
    if (name.trim() == "") {
      alert("Please provide category name");
      return;
    }
    updatingCategory = true;
    updateCategory(category._id, name, description);
  }

  onDestroy(() => {
    updatingCategory = false;
    close();
  });
</script>

<Modal on:close={close}>
  <h2 slot="header">Create Category</h2>
  <form on:submit|preventDefault={handleUpdateCategory}>
    <input
      type="text"
      bind:value={name}
      placeholder="Enter new Category Name"
    />
    <textarea
      bind:value={description}
      cols="30"
      rows="10"
      placeholder="Give some description of this category"
    />
    <button type="submit">
      {updatingCategory ? "Updating Category" : "Update Category"}
    </button>
  </form>
</Modal>

<style>
  textarea,
  input {
    margin: 0.25rem 0;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }
  button {
    display: block;
    margin: 0.75rem auto 0.25rem;
    padding: 0.5rem 1rem;
    background-color: blue;
    color: white;
    border: none;
    outline: none;
  }
</style>
