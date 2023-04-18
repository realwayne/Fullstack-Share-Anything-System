<script>
  import { navigate } from "svelte-routing";
  import Modal from "../Modal.svelte";
  import userStore from "../../stores/userStore";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let postId;
  export let post;
  export let close;

  import { getContext, onMount } from "svelte";
  const backendURL = getContext("backendURL");

  function postRequestsContainsUser(userID) {
    return post.requests.find((request) => {
      if (request.requester._id == userID) {
        return true;
      }
    });
  }
  function postRecieversContainsUser(userID) {
    return post.recievers.find((reciever) => {
      if (reciever.requester._id == userID) {
        return true;
      }
    });
  }
  function postAcceptedRequestsContainsUser(userID) {
    return post.acceptedRequests.find((acceptedRequest) => {
      if (acceptedRequest.requester._id == userID) {
        return true;
      }
    });
  }

  function dispatchNewPostContent(post) {
    dispatch("newPostContent", { post });
  }

  async function acceptRequest(requestId) {
    console.log("ACCEPTING REQUEST", requestId);

    const res = await fetch(`${backendURL}/api/post/${postId}/request/accept`, {
      mode: "cors",
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),
    }).then((res) => res.json());

    console.log(res);

    // dispatch new Post Contents
    dispatchNewPostContent(res.data);
  }
  async function cancelAcceptRequest(requestId) {
    console.log("CANCEL REQUEST", requestId);
    const res = await fetch(
      `${backendURL}/api/post/${postId}/request/accept/cancel`,
      {
        mode: "cors",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("access-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      }
    ).then((res) => res.json());

    console.log(res);

    dispatchNewPostContent(res.data);
  }
</script>

<Modal on:close={close}>
  <h1 slot="header">Requests</h1>
  {#each post.requests as request}
    <div class="requesting-user">
      <img src={request.requester.avatar} alt={request.requester.firstname} />
      <p
        on:click={(e) => {
          close();
          navigate(`/user/${request.requester._id}`);
        }}
      >
        {request.requester.firstname}
        {request.requester.lastname} | Quantity: {request.quantity}
      </p>

      {#if postRecieversContainsUser(request.requester._id)}
        <button
          on:click={(e) =>
            alert(
              `Your post was recieve by ${request.requester.firstname} ${request.requester.lastname}`
            )}
        >
          Recieved
        </button>
      {:else if postAcceptedRequestsContainsUser(request.requester._id)}
        <button on:click={(e) => cancelAcceptRequest(request._id)}>
          Accepted
        </button>
      {:else}
        <button on:click={(e) => acceptRequest(request._id)}> Accept </button>
      {/if}
    </div>
  {:else}
    <h3>No Requesting user</h3>
  {/each}
</Modal>

<style>
  button {
    margin: 0;
  }
  .requesting-user {
    display: flex;
    align-items: center;
    padding: 0.25rem;
  }
  .requesting-user img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  .requesting-user p {
    font-size: 1.2rem;
    flex-grow: 1;
  }
  p {
    flex: 1;
  }
  p:hover {
    text-decoration: underline;
  }
</style>
