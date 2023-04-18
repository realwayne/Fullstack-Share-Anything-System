<script>
  import { onDestroy } from "svelte";
  import Modal from "./../../Modal.svelte";

  export let close;
  export let addNewCategory;

  let description = "";
  let name = "";
  let creatingCategory = false;

  async function createCategory(e) {
    if (creatingCategory) return;
    if (name.trim() == "") {
      alert("Please provide category name");
      return;
    }
    creatingCategory = true;
    addNewCategory(name, description);
  }

  onDestroy(() => {
    creatingCategory = false;
    close();
  });
</script>

<Modal on:close={close}>
  <h2 slot="header">Create Category</h2>
  <form on:submit|preventDefault={createCategory}>
    <input type="text" bind:value={name} placeholder="Enter Category Name" />
    <textarea
      bind:value={description}
      cols="30"
      rows="10"
      placeholder="Give some description of this category"
    />
    <button type="submit">
      {creatingCategory ? "Creating Category" : "Create Category"}
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
