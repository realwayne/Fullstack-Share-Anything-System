<script>
  import { getContext } from "svelte";
  import Modal from "../Modal.svelte";

  const backendURL = getContext("backendURL");

  export let close;
  export let postID;
  export let commentID;
  export let userID;

  export let type;

  let reportMessage = "";
  let sendingReport = false;

  async function submitReport(e) {
    if (sendingReport) return;
    if (reportMessage.trim() == "") {
      alert("Please provide report message");
      return;
    }

    sendingReport = true;
    const reportData = await fetch(`${backendURL}/api/report`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({
        reportType: type,
        reportMessage,
        post: postID,
        comment: commentID,
        user: userID,
      }),
    }).then((res) => res.json());
    sendingReport = false;
    console.log(reportData);
    close();
    window.alert(reportData.message);
  }
</script>

<Modal on:close={close}>
  <h2 slot="header">Report {type}</h2>
  <form on:submit|preventDefault={submitReport}>
    <textarea
      bind:value={reportMessage}
      cols="30"
      rows="10"
      placeholder="Say something about your report"
    />
    <button type="submit"
      >{sendingReport ? "Sending your Report" : "Send Report"}</button
    >
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
