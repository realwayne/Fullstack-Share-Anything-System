<script>
  import moment from "moment";
  import { getContext, onDestroy, onMount } from "svelte";
  import Carousel from "svelte-carousel";
  import { Link, navigate } from "svelte-routing";
  import StarRating from "svelte-star-rating";
  import CommentCard from "../../../components/CommentCard.svelte";
  import EditPost from "../../../components/modals/EditPost.svelte";
  import Feedback from "../../../components/modals/Feedback.svelte";
  import Report from "../../../components/modals/Report.svelte";
  import RequestsModal from "../../../components/modals/RequestsModal.svelte";
  import PostSkeleton from "../../../components/PostSkeleton.svelte";
  import userStore from "../../../stores/userStore";
  import mapboxgl from "../../../utils/mapbox";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  export let postID;

  let container;
  let map, marker;

  function resetMapWithNewCoordinates(coordinates) {
    if (!map) {
      map = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/streets-v9",
        center: [coordinates?.lng || 121.774, coordinates?.lat || 12.8797],
        zoom: 10,
      });
      marker = new mapboxgl.Marker()
        .setLngLat([coordinates?.lng || 121.774, coordinates?.lat || 12.8797])
        .addTo(map);

      return;
    }
    map.setCenter([coordinates?.lng, coordinates?.lat]);
    marker.setLngLat([coordinates?.lng, coordinates?.lat]);
  }

  let post;
  let postLiked;
  let requestAccepted;
  onMount(() => {
    getCurrentPost();
  });

  let gettingCurrentPost = false;
  function getCurrentPost() {
    gettingCurrentPost = true;
    fetch(`${backendURL}/api/post/${postID}`, {
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingCurrentPost = false;
        post = data.post;
        postLiked = post.likes.includes($userStore._id);
        requestAccepted = post.recievers.find(
          (reciever) => reciever._id === $userStore._id
        )
          ? true
          : false;
        resetMapWithNewCoordinates(post.coordinates);
        console.log("POST", post);
      })
      .catch((err) => console.log(err));
  }

  let newComment = "";
  function createComment() {
    fetch(`${backendURL}/api/comments`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({
        postId: post._id,
        content: newComment,
        postUserId: post.author._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        post = { ...post, ...data.updatedPost };
        newComment = "";
      });
  }

  function likeUnlikePost(e) {
    let endPoint = postLiked ? "unlike" : "like";
    fetch(`${backendURL}/api/post/${post._id}/${endPoint}`, {
      mode: "cors",
      method: "PATCH",
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        if (postLiked) {
          postLiked = false;
          post.likes = post.likes.filter((likeId) => likeId !== $userStore._id);
        } else {
          postLiked = true;
          post.likes = [$userStore._id, ...post.likes];
        }
        console.log(data);
      });
  }

  function commentDeleted(e) {
    const id = e.detail.id;
    post.comments = post.comments.filter((comment) => comment._id !== id);
  }
  function commentEdited(e) {
    const newComment = e.detail.newComment;
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id === newComment._id
    );
    if (commentIndex !== -1) post.comments[commentIndex] = { ...newComment };
  }

  async function requestPost(e) {
    if (post.author._id !== $userStore._id) {
      const postData = await fetch(
        `${backendURL}/api/post/${post._id}/request`,
        {
          mode: "cors",
          method: "POST",
          headers: { Authorization: localStorage.getItem("access-token") },
        }
      ).then((res) => res.json());
      console.log(postData);
      if (postData.msg.includes("added")) {
        getCurrentPost();
        // post = { ...post, ...postData.post };
      }
    }
  }

  function deletePost(e) {
    fetch(`${backendURL}/api/post/${post._id}`, {
      mode: "cors",
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate(`/user`);
      });
  }

  function likeUnlikeComment(e) {
    const { commentId, type } = e.detail;
    const comment = post.comments.find((comment) => comment._id === commentId);
    if (type === "Like") {
      comment.likes = [
        ...comment.likes,
        {
          _id: $userStore._id,
          firstname: $userStore.firstname,
          lastname: $userStore.lastname,
        },
      ];
    } else {
      comment.likes = comment.likes.filter(
        (like) => like._id !== $userStore._id
      );
    }
    console.log(comment);
  }

  function confirmRecievedPost(e) {
    if (!rating) {
      alert("Please enter your Rating");
      return;
    }

    fetch(`${backendURL}/api/post/${post._id}/request/confirm-recieved`, {
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
        // post = { ...post, ...data.data };
        getCurrentPost();
      });
  }

  let showRequestsModal = false;
  let willEditPost = false;
  let willOpenFeedbackModal = false;
  let feedback = "";
  let rating;

  function editPost(newPostContent) {
    async function editPostFetch(content) {
      const res = await fetch(`${backendURL}/api/post/${post._id}`, {
        mode: "cors",
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("access-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...content }),
      }).then((res) => res.json());
      // post = { ...post, ...res.newPost };
      getCurrentPost();
    }

    editPostFetch(newPostContent);
    willEditPost = false;
  }

  onDestroy(() => {
    if (map) map.remove();
  });

  let willCreateReport = false;
  let postRequestedCount = 1;
  let willRequestPost = false;
  let userInPostRequests = false;
  let userInPostRecieves = false;
  let userInPostAccepts = false;
  $: {
    post;
    userInPostRequests = postRequestsContainsUser();
    userInPostRecieves = postRecieversContainsUser();
    userInPostAccepts = postAcceptedRequestsContainsUser();
  }
  function postRequestsContainsUser() {
    return post?.requests.find((request) => {
      if (String(request.requester?._id) == String($userStore._id)) {
        return true;
      }
      return false;
    });
  }
  function postRecieversContainsUser() {
    return post?.recievers.find((reciever) => {
      if (reciever.requester?._id == $userStore._id) {
        return true;
      }
    });
  }
  function postAcceptedRequestsContainsUser() {
    return post?.acceptedRequests.find((acceptedRequest) => {
      if (acceptedRequest.requester._id == $userStore._id) {
        return true;
      }
    });
  }

  async function cancelRequest() {
    const postData = await fetch(
      `${backendURL}/api/post/${post._id}/request/cancel`,
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
      // post = { ...post, ...postData.data };
    }
    getCurrentPost();
    console.log("CANCEL REQUEST", post);
  }
  function newPostContent(e) {
    console.log("NEW POST CONTENT", e);
    // post = { ...post, ...e.detail.post };
    getCurrentPost();
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css"
  />
</svelte:head>

{#if gettingCurrentPost}
  <PostSkeleton />
{/if}
{#if !gettingCurrentPost}
  {#if post}
    <div class="wrapper">
      <div class="card">
        <div class="images">
          <Carousel autoplay={true} arrows={false}>
            {#each post.imageUrls as url}
              <img class="carousel-image" src={url.url} alt={url.public_id} />
            {/each}
          </Carousel>
        </div>
        <div class="author-actions-container">
          <div class="author">
            {#if post.author}
              <Link to={`/user/${post.author._id}`}>
                <div class="author-name">
                  <img src={post.author.avatar} alt={post.author.firstname} />
                  <h1>{post.author.firstname} {post.author.lastname}</h1>
                </div>
              </Link>
            {:else}
              <h3>User Not Found</h3>
            {/if}
          </div>
          <div class="actions">
            <button on:click={likeUnlikePost}>
              {post.likes.length}
              <i class="fa fa-thumbs-up" />
              {post.likes.length <= 1 ? ` Like` : ` Likes`}
            </button>
            {#if post.author}
              {#if post.author._id !== $userStore._id}
                {#if post.isAvailable}
                  {#if userInPostRequests}
                    {#if userInPostRecieves}
                      <button
                        on:click={(e) => alert("You have recieved this post")}
                      >
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
                      on:click|self={(e) =>
                        (willRequestPost = !willRequestPost)}
                      class="request-post-button"
                    >
                      {#if willRequestPost}
                        <div class="request-post-popover">
                          <button
                            on:click|self|preventDefault={(e) =>
                              (postRequestedCount =
                                postRequestedCount == 1
                                  ? 1
                                  : postRequestedCount - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={post.quantity}
                            bind:value={postRequestedCount}
                          />
                          <button
                            on:click|self|preventDefault={(e) =>
                              (postRequestedCount = postRequestedCount + 1)}
                          >
                            +
                          </button>
                          <button on:click|self|preventDefault={requestPost}
                            >Send
                          </button>
                        </div>
                      {/if}
                      <i class="fa fa-dropbox" />
                      Request
                    </button>
                  {/if}
                {:else if !post.isAvailable}
                  {#if postRecieversContainsUser()}
                    <button
                      on:click={(e) => alert("You have recieved this post")}
                    >
                      <i class="fa fa-check" />
                      Recieved
                    </button>
                  {:else if postAcceptedRequestsContainsUser()}
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
                  {:else}
                    <button
                      on:click={(e) => alert("Post not available")}
                      class="request-post-button"
                    >
                      <i class="fa fa-dropbox" />
                      Post Not Available
                    </button>
                  {/if}{/if}

                <button
                  on:click={(e) => (willCreateReport = !willCreateReport)}
                >
                  <i style="margin-right: .2rem;" class="fa fa-flag" /> Report
                </button>
              {:else}
                <button on:click={(e) => (showRequestsModal = true)}>
                  {post.requests.length}
                  <i style="margin-right: .2rem;" class="fa fa-dropbox" />
                  View Requests
                </button>
                <button on:click={(e) => (willEditPost = true)}>
                  <i style="margin-right: .2rem;" class="fa fa-edit" /> Edit
                </button>
                <button on:click={deletePost}>
                  <i style="margin-right: .2rem;" class="fa fa-trash" />Remove
                </button>
              {/if}
            {/if}
          </div>
        </div>

        <!-- CATEGORY, QUANTITY, TAGS, RATINGS -->
        <div>
          <p class="updated-at">{moment(post.createdAt).fromNow()}</p>
          Category: {post.category.name} <br />
          Available: <span class="available">{post.quantity} </span><br />
          Tags:
          {#each post.tags as tag}
            <span class="tag">#{tag}</span>
          {/each}
          <div class="ratings">
            Ratings: <b>{post.ratings}</b>
            <StarRating rating={post.ratings} />
          </div>
          {#if post.expirationDate}
            Expiration Date: <b
              >{new Date(post.expirationDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</b
            >
          {/if}
        </div>
        <br />
        <hr />
        <br />

        <!-- TITLE _ DESCRIPTION -->
        <div class="post">
          <h1 class="title">{post.title}</h1>
          <p class="description">{post.description}</p>
        </div>
      </div>
    </div>
  {/if}
{/if}

<section id="map-container">
  <div class="wrapper" id="map" bind:this={container} />
</section>

<!-- FEEDBACKS AND COMMENTS -->
{#if !gettingCurrentPost}
  {#if post}
    <section id="feedbacks" class="wrapper">
      <h1>Feedbacks on this post.</h1>

      {#each post.feedbacks as feedback}
        <div class="feedback-container">
          <Link to={`/user/${feedback.from._id}`}>
            <div class="author">
              <img
                src={feedback.from.avatar}
                alt={feedback.from.firstname}
                style="display: inline-block;margin-right: .5rem;"
              />
              {feedback.from.firstname}
              {feedback.from.lastname}
              <small style="margin-left: .5rem;">
                {moment(feedback.createdAt).fromNow()}
              </small>
            </div>
          </Link>
          <StarRating rating={feedback.rating} />
          <p>{feedback.feedbackMessage}</p>
        </div>
      {:else}
        <h5>Currently no feedbacks on this post</h5>
      {/each}
    </section>

    <section id="comments" class="wrapper">
      {#if post.author}
        <div class="create-comment">
          <img src={$userStore.avatar} alt={$userStore.firstname} />
          <input
            bind:value={newComment}
            type="text"
            placeholder="Say something about this post"
          />
          <button on:click={createComment}>
            <i style="margin-right: .2rem;" class="fa fa-send" />Comment
          </button>
        </div>
      {/if}
      <div>
        <h1>Comments on this post.</h1>
        {#each [...post.comments].reverse() as comment}
          <CommentCard
            on:likeUnlikeComment={likeUnlikeComment}
            on:commentEdited={commentEdited}
            on:commentDeleted={commentDeleted}
            {comment}
          />
        {/each}
      </div>
    </section>
  {/if}
{/if}

<!-- MODAL FOR REPORTING THE POST -->
{#if willCreateReport}
  <Report type="POST" {postID} close={(e) => (willCreateReport = false)} />
{/if}

<!-- MODAL FOR EDITING POST -->
{#if willEditPost}
  <EditPost yourPost={post} {editPost} close={(e) => (willEditPost = false)} />
{/if}

<!-- MODAL FOR SHOWING REQUEST OF POST -->
{#if showRequestsModal}
  <RequestsModal
    postId={post._id}
    bind:post
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
  #feedbacks .author {
    display: flex;
    align-items: center;
  }
  #map {
    height: 300px;
  }
  button {
    border-radius: 0.2rem;
    color: white;
    background-color: #4caf50;
  }
  .author-actions-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  span.tag {
    padding: 0 0.25rem;
    font-size: 0.8rem;
    margin: 0 0.2rem;
    border-radius: 0.5rem;
  }
  span.available {
    background-color: #4caf50;
    color: white;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }
  .wrapper {
    max-width: 1200px;
    width: 100%;
    margin: 2rem auto;
  }
  img {
    height: 500px;
  }
  .author-name {
    display: flex;
    align-items: center;
  }
  div.author img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin: 0.2rem;
  }
  p.updated-at {
    font-size: 0.8rem;
  }
  section#comments {
    padding: 1rem 0 2rem;
  }
  .create-comment {
    display: flex;
    align-items: center;
  }
  .create-comment img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  .create-comment input {
    flex: 1;
    margin: 0;
  }
  .create-comment button {
    padding: 0.5rem 1rem;
    margin-bottom: 0;
  }
  img.carousel-image {
    object-fit: cover;
  }
</style>
