<script>
  import moment from "moment";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { Link } from "svelte-routing";
  import userStore from "../stores/userStore";
  export let comment;
  let willUpdateComment = false;
  let newComment = comment.content;
  let commentLiked = comment.likes.find((like) => like._id === $userStore._id)
    ? true
    : false;
  console.log(comment, commentLiked);

  import Report from "../components/modals/Report.svelte";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  function updateComment(e) {
    fetch(`${backendURL}/api/comments/${comment._id}`, {
      mode: "cors",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({
        content: newComment,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        willUpdateComment = false;
        dispatch("commentEdited", { newComment: data.newComment });
      });
  }
  function deleteComment(e) {
    fetch(`${backendURL}/api/comments/${comment._id}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch("commentDeleted", { id: comment._id });
      });
  }
  function likeUnlikeComment() {
    let endpoint = commentLiked ? "unlike" : "like";
    fetch(`${backendURL}/api/comments/${comment._id}/${endpoint}`, {
      mode: "cors",
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.includes("Liked")) {
          dispatch("likeUnlikeComment", {
            commentId: comment._id,
            type: "Like",
          });
        } else {
          dispatch("likeUnlikeComment", {
            commentId: comment._id,
            type: "Unlike",
          });
        }
      });
  }

  let willCreateReport = false;
</script>

<div>
  <div class="author">
    <Link to={`/user/${comment.user._id}`}>
      {comment.user.firstname}
      {comment.user.lastname}
    </Link>
    <p class="created-at">
      {moment(comment.updatedAd).fromNow()}
    </p>
  </div>
  <div class="content">
    {#if willUpdateComment}
      <div class="update-comment">
        <input type="text" bind:value={newComment} />
        <button on:click={updateComment}>
          <i style="margin-right: .2rem;" class="fa fa-folder-open" />Update
        </button>
      </div>
    {:else}
      {comment.content}
    {/if}
  </div>
  <div class="actions">
    <button on:click={likeUnlikeComment}>
      {comment.likes.length}
      <i style="margin-right: .2rem;" class="fa fa-thumbs-up" />
      {comment.likes.length <= 1 ? "Like" : "Likes"}
    </button>
    {#if comment.user._id === $userStore._id}
      <button on:click={(e) => (willUpdateComment = !willUpdateComment)}>
        {willUpdateComment ? "Cancel" : "Edit"}
        {#if willUpdateComment}
          <i style="margin-right: .2rem;" class="fa fa-ban" />
        {:else}
          <i style="margin-right: .2rem;" class="fa fa-edit" />
        {/if}
      </button>
      <button on:click={deleteComment}>
        <i style="margin-right: .2rem;" class="fa fa-trash" />Delete
      </button>
    {:else}
      <button
        on:click|preventDefault={(e) => (willCreateReport = !willCreateReport)}
      >
        <i style="margin-right: .2rem;" class="fa fa-flag" />Report
      </button>
    {/if}
  </div>
</div>

{#if willCreateReport}
  <Report
    type="COMMENT"
    commentID={comment._id}
    close={(e) => (willCreateReport = false)}
  />
{/if}

<style>
  button {
    border-radius: 0.2rem;
    color: white;
    border: none;
    background-color: #4caf50;
    margin: 0 0.1rem;
  }
  p.created-at {
    display: inline-block;
    font-size: 0.8rem;
  }
  .content {
    padding: 0.4rem 0;
  }
  .content .update-comment {
    display: flex;
  }
  .content .update-comment input {
    flex: 1;
  }
  .actions {
    padding: 0rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
