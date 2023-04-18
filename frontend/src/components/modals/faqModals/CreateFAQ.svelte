<script>
  import { onDestroy } from "svelte";
  import Modal from "../../Modal.svelte";

  export let close;
  export let addNewFAQ;

  let question = "";
  let answer = "";
  let creatingFAQ = false;

  async function createFAQ(e) {
    if (creatingFAQ) return;
    if (answer.trim() == "" || question.trim() == "") {
      alert("Please provide content");
      return;
    }
    creatingFAQ = true;
    addNewFAQ(question, answer);
  }

  onDestroy(() => {
    creatingFAQ = false;
    close();
  });
</script>

<Modal on:close={close}>
  <h2 slot="header">Create FAQ</h2>
  <form on:submit|preventDefault={createFAQ}>
    <input type="text" bind:value={question} placeholder="Enter Questino " />
    <textarea
      bind:value={answer}
      cols="30"
      rows="10"
      placeholder="Give some answer"
    />
    <button type="submit">
      {creatingFAQ ? "Creating FAQ" : "Create FAQ"}
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
