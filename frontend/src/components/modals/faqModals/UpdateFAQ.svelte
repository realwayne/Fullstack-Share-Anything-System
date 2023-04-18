<script>
  import { getContext, onDestroy } from "svelte";
  import Modal from "../../Modal.svelte";
  import format from "html-format";

  const backendURL = getContext("backendURL");

  export let close;
  export let faq;
  export let updateFAQ;

  let question = faq.question;
  let answer = faq.answer;

  let updatingFAQ = false;

  async function handleUpdateFAQ(e) {
    if (updatingFAQ) return;
    if (question.trim() == "" || answer.trim() == "") {
      alert("Please provide faq content");
      return;
    }
    updatingFAQ = true;
    updateFAQ(faq._id, question, answer);
  }

  onDestroy(() => {
    updatingFAQ = false;
    close();
  });
</script>

<Modal on:close={close}>
  <h2 slot="header">Create faq</h2>
  <form on:submit|preventDefault={handleUpdateFAQ}>
    <input type="text" bind:value={question} placeholder="Enter new faq" />
    <textarea
      on:change={(e) => (answer = e.target.value)}
      cols="30"
      value={format(answer)}
      rows="10"
      placeholder="Give some answer of this faq"
    />
    <button type="submit">
      {updatingFAQ ? "Updating faq" : "Update faq"}
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
