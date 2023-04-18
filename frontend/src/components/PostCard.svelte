<script>
  import moment from "moment";
  import { createEventDispatcher } from "svelte";
  import Carousel from "svelte-carousel";
  import { Link, navigate } from "svelte-routing";
  import userStore from "../stores/userStore";
  import EditPost from "./modals/EditPost.svelte";
  import Report from "./modals/Report.svelte";
  import StarRating from "svelte-star-rating";

  import RequestsModal from "./modals/RequestsModal.svelte";

  import { getContext } from "svelte";
  import Feedback from "./modals/Feedback.svelte";
  const backendURL = getContext("backendURL");

  const dispatch = createEventDispatcher();

  export let id;
  export let yourPost;
  let openActionButtons = false;
  let willEditPost = false;
  let showRequestsModal = false;
  let postLiked = yourPost.likes.includes($userStore._id);

  let updatingProfile = false;

  function likeUnlikePost(e) {
    let endPoint = postLiked ? "unlike" : "like";
    fetch(`${backendURL}/api/post/${yourPost._id}/${endPoint}`, {
      mode: "cors",
      method: "PATCH",
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        if (postLiked) {
          postLiked = false;
          yourPost.likes = yourPost.likes.filter(
            (likeId) => likeId !== $userStore._id
          );
        } else {
          postLiked = true;
          yourPost.likes = [$userStore._id, ...yourPost.likes];
        }
        console.log(data);
      });
  }

  let feedback = "";
  let rating;
  let willOpenFeedbackModal = false;
  function confirmRecievedPost(e) {
    if (!rating) return alert("Please enter your Rating");

    fetch(`${backendURL}/api/post/${id}/request/confirm-recieved`, {
      mode: "cors",
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedback, rating }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("CONFIRMED POST RECIEVED", data);
        yourPost = { ...yourPost, ...data.data };
      });
  }

  function deletePost(e) {
    fetch(`${backendURL}/api/post/${id}`, {
      mode: "cors",
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const deletedPost = data.post;
        dispatch("postDeletedEvent", { deletedPost });
      });
    openActionButtons = false;
  }

  function editPost(newPostContent) {
    updatingProfile = true;

    async function editPostFetch(content) {
      const res = await fetch(`${backendURL}/api/post/${yourPost._id}`, {
        mode: "cors",
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("access-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...content }),
      }).then((res) => res.json());
      yourPost = { ...yourPost, ...res.newPost };
      console.log(res);
      console.log(yourPost);
    }

    editPostFetch(newPostContent);
    updatingProfile = false;
    willEditPost = false;
  }

  let willReportPost = false;
  let willRequestPost = false;
  let postRequestedCount = 1;
  $: {
    if (postRequestedCount > yourPost.quantity) {
      postRequestedCount = yourPost.quantity;
    }
  }

  async function requestPost(e) {
    if (!yourPost.isAvailable || yourPost.quantity <= 0) {
      return window.alert("Post Not available");
    }

    if (yourPost.author._id !== $userStore._id) {
      const postData = await fetch(
        `${backendURL}/api/post/${yourPost._id}/request`,
        {
          mode: "cors",
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("access-token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postRequestedCount }),
        }
      ).then((res) => res.json());

      willRequestPost = false;
      yourPost.requests = postData.post.requests;

      console.log(postData, yourPost);
    }
  }

  async function cancelRequest() {
    const postData = await fetch(
      `${backendURL}/api/post/${yourPost._id}/request/cancel`,
      {
        mode: "cors",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("access-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postRequestedCount }),
      }
    ).then((res) => res.json());
    if (postData.status) {
      yourPost = { ...yourPost, ...postData.data };
    }
    console.log("CANCEL REQUEST", yourPost);
  }

  let userInPostRequests = false;
  let userInPostRecieves = false;
  let userInPostAccepts = false;

  $: {
    yourPost;
    userInPostRequests = postRequestsContainsUser();
    userInPostRecieves = postRecieversContainsUser();
    userInPostAccepts = postAcceptedRequestsContainsUser();
  }
  function postRequestsContainsUser() {
    return yourPost.requests.find((request) => {
      if (String(request.requester?._id) == String($userStore._id)) {
        return true;
      }
      return false;
    });
  }
  function postRecieversContainsUser() {
    return yourPost.recievers.find((reciever) => {
      if (reciever.requester?._id == $userStore._id) {
        return true;
      }
    });
  }
  function postAcceptedRequestsContainsUser() {
    return yourPost.acceptedRequests.find((acceptedRequest) => {
      if (acceptedRequest.requester._id == $userStore._id) {
        return true;
      }
    });
  }

  function newPostContent(e) {
    console.log("NEW POST CONTENT", e);
    yourPost = { ...yourPost, ...e.detail.post };
  }
</script>

<div class="card">
  <!-- IMAGES CAROUSEL -->
  <div class="images">
    <Carousel autoplay={true} arrows={false}>
      {#each yourPost.imageUrls as src}
        <img src={src.url} alt={src.public_id} />
      {/each}
    </Carousel>
  </div>
  <!-- IMAGES CAROUSEL END -->

  <!-- NAME , CATEGORY , TAGS -->
  <div class="author-name">
    {#if yourPost.author}
      <Link to={`/user/${yourPost.author._id}`}>
        <div class="author">
          <img
            src={`${yourPost.author.avatar}`}
            alt={`${yourPost.author.firstname}`}
          />
          <h3>{yourPost.author.firstname} {yourPost.author.lastname}</h3>
        </div>
      </Link>
    {:else}
      <h3>User Not Found</h3>
    {/if}
    <p>
      {yourPost.category?.name} - {moment(yourPost.createdAt).fromNow()} - {yourPost.quantity}
      Items
    </p>
    <p class="tags">
      {#each yourPost.tags as tag}
        <span class="tag">#{tag}</span>
      {/each}
    </p>
  </div>
  <!-- NAME , CATEGORY , TAGS  END-->

  <!-- CONTENTS, TITLE, DESCRIPTION, THREE DOTS -->
  <div class="content">
    <!-- TITLE, DESCRIPTION -->
    <div class="description">
      <h1>{yourPost && yourPost.title}</h1>
      <p>{yourPost && yourPost.description.substr(0, 250)}</p>
      <div style="display: flex;align-items: center;">
        <StarRating rating={yourPost.ratings} />
        <span class="ratings-count">Ratings {yourPost.ratings}</span>
      </div>
      <Link to={`/post/${yourPost._id}`}>See Post</Link>
    </div>

    <!-- THREE DOTS BTN WITH EDIT REMOVE POST -->
    <div class="actions">
      <button
        style="background-color: transparent;"
        on:click={(e) => (openActionButtons = !openActionButtons)}
      >
        <i class="fa fa-ellipsis-v" />
      </button>
      <div class="action-buttons" class:openActionButtons>
        {#if yourPost.author}
          {#if yourPost.author === $userStore._id || yourPost.author._id === $userStore._id}
            <button on:click={(e) => (willEditPost = true)}>
              <i style="margin-right: .2rem;" class="fa fa-edit" />Edit Post
            </button>
            <button on:click={deletePost}>
              <i style="margin-right: .2rem;" class="fa fa-trash" /> Remove Post
            </button>
          {:else}
            <button on:click={(e) => (willReportPost = !willReportPost)}>
              <i style="margin-right: .2rem;" class="fa fa-flag" />Report Post
            </button>
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <!-- REQUEST ACCEPTED NOTE CONTAINER -->
  {#if yourPost.author?._id !== $userStore._id && userInPostAccepts}
    <div class="request-accepted-note-container">
      <p>
        Your request for this post has been accepted. <br />
        You can now pick up this Post Item.
      </p>
    </div>
  {/if}

  <!-- ACTIONS BUTTONS -->
  <div class="buttons">
    <!-- LIKE BUTTON -->
    <button on:click={likeUnlikePost}>
      {yourPost.likes.length}
      <i class="fa fa-thumbs-up" />
      {yourPost.likes.length <= 1 ? `Like` : ` Likes`}
    </button>
    <!-- LIKE BUTTON -->

    <!-- COMMENT BUTTON -->
    <button on:click={(e) => navigate("/post/" + yourPost._id)}>
      {yourPost.comments.length}
      <i class="fa fa-comments" />
      {yourPost.comments.length <= 1 ? `Comment` : ` Comments`}
    </button>
    <!--  COMMENT BUTTON END -->

    <!--  REQUEST BUTTON -->
    {#if yourPost.author?._id === $userStore._id}
      <button
        on:click={(e) => (showRequestsModal = true)}
        class="request-post-button"
      >
        {yourPost.requests.length}
        <i class="fa fa-dropbox" />
        View requests
      </button>
    {/if}
    {#if yourPost.author?._id != $userStore._id}
      {#if yourPost.isAvailable}
        {#if userInPostRequests}
          {#if userInPostRecieves}
            <button on:click={(e) => alert("You have recieved this post")}>
              <i class="fa fa-check" />
              Recieved
            </button>
          {:else if userInPostAccepts}
            <button on:click={(e) => (willOpenFeedbackModal = true)}>
              <i class="fa fa-check" />
              Confirm Recieved
            </button>
            <button
              on:click={(e) => cancelRequest()}
              class="request-post-button"
            >
              <i class="fa fa-dropbox" />
              Cancel Request
            </button>
          {:else if userInPostRequests}
            <button
              on:click={(e) => cancelRequest()}
              class="request-post-button"
            >
              <i class="fa fa-dropbox" />
              Cancel Request
            </button>
          {/if}
        {:else}
          <button
            on:click|self={(e) => (willRequestPost = !willRequestPost)}
            class="request-post-button"
          >
            {#if willRequestPost}
              <div class="request-post-popover">
                <button
                  on:click|self|preventDefault={(e) =>
                    (postRequestedCount =
                      postRequestedCount == 1 ? 1 : postRequestedCount - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={yourPost.quantity}
                  bind:value={postRequestedCount}
                />
                <button
                  on:click|self|preventDefault={(e) =>
                    (postRequestedCount = postRequestedCount + 1)}
                >
                  +
                </button>
                <button on:click|self|preventDefault={requestPost}>Send</button>
              </div>
            {/if}
            <i class="fa fa-dropbox" />
            Request
          </button>
        {/if}
      {/if}
      {#if !yourPost.isAvailable}
        {#if postRecieversContainsUser()}
          <button on:click={(e) => alert("You have recieved this post")}>
            <i class="fa fa-check" />
            Recieved
          </button>
        {:else if postAcceptedRequestsContainsUser()}
          <button on:click={(e) => (willOpenFeedbackModal = true)}>
            <i class="fa fa-check" />
            Confirm Recieved
          </button>
          <button on:click={(e) => cancelRequest()} class="request-post-button">
            <i class="fa fa-dropbox" />
            Cancel Request
          </button>
        {:else}
          <button
            on:click={(e) => alert("Post not available")}
            class="request-post-button"
          >
            <i class="fa fa-dropbox" />
            Post Not Available
          </button>
        {/if}
      {/if}
    {/if}
  </div>

  <!-- ACTIONS BUTTONS END -->
</div>

<!-- REPORT POST MODAL -->
{#if willReportPost}
  <Report
    type="POST"
    postID={yourPost._id}
    close={(e) => (willReportPost = false)}
  />
{/if}

<!-- EDIT POST MODAL -->
{#if willEditPost}
  <EditPost
    {yourPost}
    {editPost}
    close={(e) => (willEditPost = false)}
    {updatingProfile}
  />
{/if}

<!-- SHOW REQUESTS OF POST MODAL -->
{#if showRequestsModal}
  <RequestsModal
    postId={yourPost._id}
    post={yourPost}
    on:newPostContent={newPostContent}
    close={(e) => (showRequestsModal = false)}
  />
{/if}

<!-- SHOW FEEDBACK MODAL -->
{#if willOpenFeedbackModal}
  <Feedback
    close={(e) => (willOpenFeedbackModal = false)}
    bind:feedback
    bind:rating
    confirmRecieved={confirmRecievedPost}
  />
{/if}

<style>
  .ratings-count {
    margin-bottom: 14px;
  }
  .request-accepted-note-container {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #4caf50;
    color: white;
    font-size: 0.9rem;
  }
  .request-post-button {
    position: relative;
  }
  .request-post-popover {
    position: absolute;
    bottom: 100%;
    right: 0;
    width: 100%;
    display: flex;
  }
  .request-post-popover input::-webkit-outer-spin-button,
  .request-post-popover input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .request-post-popover input {
    width: 3rem;
    text-align: center;
  }
  p.tags {
    display: flex;
  }
  span.tag {
    padding: 0 0.2rem;
    font-size: 1rem;
    margin: 0 0.15rem;
    border-radius: 0.25rem;
    background-color: #4caf50;
    color: white;
  }
  .author-name .author {
    display: flex;
    align-items: center;
  }
  .author-name .author h3 {
    padding-left: 0.5rem;
    flex-grow: 1;
  }
  .author-name .author img {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    object-fit: cover;
  }
  .content {
    display: flex;
  }
  .description {
    flex-grow: 1;
  }
  .actions {
    position: relative;
  }
  .action-buttons {
    position: absolute;
    bottom: 100%;
    right: 0;
    display: block;
    padding: 0.3rem;
    background-color: #81c784;
    display: none;
  }
  .actions .action-buttons.openActionButtons {
    display: block;
    background: #4caf50;
    color: white;
    border-radius: 0.2rem;
  }
  .action-buttons button {
    padding: 0.2rem 0.4rem;
    display: block;
    width: 100%;
    border-radius: 0.2rem;
    color: #4caf50;
    background-color: white;
  }
  .action-buttons button:hover {
    background-color: transparent;
    color: white;
    border: 1px solid white;
  }
  .buttons {
    display: flex;
    margin-top: 0.5rem;
  }
  .buttons button {
    flex: 1;
    background-color: #4caf50;
    color: white;
    outline: none;
    border: 1px solid grey;
  }
  .buttons button i {
    color: white;
  }
  .card {
    padding: 1rem;
  }
  .card {
    width: calc(50% - 0rem);
  }
  img {
    display: block;
    object-fit: contain;
    width: 100%;
    height: 250px;
    object-fit: cover;
  }
  @media (max-width: 800px) {
    .card {
      width: calc(100% - 0rem);
    }
  }
</style>
