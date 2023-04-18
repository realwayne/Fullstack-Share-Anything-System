<script>
  import Modal from "../Modal.svelte";

  import StarRating from "../ratings/StarRating.svelte";

  export let rating;
  export let close;
  export let feedback;
  export let confirmRecieved;
</script>

<Modal on:close={close}>
  <h2 slot="header">Feedback</h2>
  <form
    on:submit|preventDefault={(e) => {
      confirmRecieved();
      close();
    }}
  >
    <label for="">Please rate the post you have recieved</label>
    <StarRating bind:rating />
    {#if rating}
      <p>
        You've selected {rating} stars, please tell us why you gave us this rating
      </p>
    {/if}
    <textarea
      bind:value={feedback}
      cols="30"
      rows="10"
      placeholder="Say something about the item you have recieved"
    />
    <button type="submit">Send Feedback</button>
  </form>
</Modal>

<style>
  textarea {
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
