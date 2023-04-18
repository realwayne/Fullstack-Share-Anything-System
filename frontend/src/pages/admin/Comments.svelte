<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import { Datatable } from "svelte-simple-datatables";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import AdminSpinner from "../../components/AdminSpinner.svelte";
  const settings = { columnFilter: true };
  let rows;

  let comments = [];
  onMount(() => {
    getAllComments();
  });

  let gettingAllComments = false;
  function getAllComments() {
    gettingAllComments = true;
    fetch(`${backendURL}/api/admin/comments`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllComments = false;
        if (data.status) {
          comments = data.data;
          console.log("COMMENTS", comments);
        }
      })
      .catch((err) => console.log(err));
  }

  function deleteComment(commentID) {
    fetch(`${backendURL}/api/admin/comments/${commentID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          comments = comments.filter((comment) => comment._id != data.data._id);
          console.log("DELETED COMMENTS", data.data);
        }
      })
      .catch((err) => console.log(err));
  }
</script>

<svelte:head>
  <title>Comments</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="admin-page-title">
      <h1>COMMENTS</h1>
    </div>
    <div class="table-container">
      <Datatable {settings} data={comments} bind:dataRows={rows}>
        <thead>
          <th data-key="createdAt">Created At</th>
          <th data-key="content">Comment</th>
          <th data-key="(row)=>row.user.firstname + ' '+ row.user.lastname">
            Comment Author Name
          </th>
          <th data-key="(row)=>row.likes.length">Likes</th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllComments}
              <AdminSpinner title="COMMENTS" />
            {:else}
              {#each $rows as row}
                <tr>
                  <td>{moment(row.createdAt).fromNow()}</td>
                  <td>{row.content}</td>
                  <td>
                    <div class="author-container">
                      <img
                        class="author-profile-image"
                        src={row.user.avatar}
                        alt={row.user.firstname}
                      />
                      <a
                        href={`${frontendURL}/user/${row.user._id}`}
                        target="_blank"
                      >
                        {row.user.firstname}
                        {row.user.lastname}
                      </a>
                    </div>
                  </td>
                  <td>{row.likes.length}</td>
                  <td class="post-actions">
                    {#if row.postId}
                      <a
                        href={`${frontendURL}/post/${row.postId._id}`}
                        target="_blank"
                      >
                        <i class="fa fa-eye" />
                        View Post
                      </a>
                    {/if}
                    <button
                      class="delete-btn"
                      on:click={(e) => deleteComment(row._id)}
                    >
                      <i class="fa fa-trash" />
                      Delete Comment
                    </button>
                  </td>
                </tr>
              {/each}
            {/if}
          {/if}
        </tbody>
      </Datatable>
    </div>
  </main>
</section>

<style>
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }
  .delete-btn {
    background-color: #f55353;
    color: white;
    outline: none;
    border-radius: 0.3rem;
    border: none;
  }
  .author-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: fit-content;
  }
  .post-actions {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }
  .author-profile-image {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 2px;
  }
  main {
    flex: 1;
  }
  .admin-main-container {
    display: flex;
    height: 100%;
  }
  td {
    text-align: center;
    padding: 4px 0;
  }
  .admin-main-container {
    display: flex;
    height: 90%;
    width: 100%;
  }
  .table-container {
    height: 90%;
    widows: 90%;
    margin: auto;
  }
  main {
    flex: 1;
    width: calc(100% - 300px);
  }
  main h1 {
    padding: 0.5rem 1rem;
  }
  :global(#svelte-simple-datatable section.dt-search) {
    margin: 0;
    padding: 0;
  }
  :global(#svelte-simple-datatable section.dt-search input) {
    min-width: 300px;
  }
</style>
