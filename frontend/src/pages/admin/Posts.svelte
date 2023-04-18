<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import AdminSpinner from "../../components/AdminSpinner.svelte";
  import { Datatable } from "svelte-simple-datatables";
  import StarRating from "svelte-star-rating";
  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");
  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import RequestsModal from "../../components/modals/RequestsModal.svelte";
  const settings = { columnFilter: true };
  let rows;

  let posts = [];
  onMount(() => {
    getAllPosts();
  });

  let gettingAllPosts = false;
  function getAllPosts() {
    gettingAllPosts = true;
    fetch(`${backendURL}/api/admin/posts`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllPosts = false;
        if (data.status) {
          posts = data.data;
          console.log("POST", posts);
        }
      })
      .catch((err) => console.log(err));
  }
  function deletePost(postID) {
    fetch(`${backendURL}/api/admin/posts/${postID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          posts = posts.filter((post) => post._id != data.data._id);
        }
        alert(data.message);
      })
      .catch((err) => console.log(err));
  }
</script>

<svelte:head>
  <title>Posts</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="admin-page-title">
      <h1>POSTS</h1>
    </div>
    <div class="table-container">
      <Datatable {settings} data={posts} bind:dataRows={rows}>
        <thead>
          <th data-key="createdAt">Created At</th>
          <th data-key="(row)=>row.imageUrls.join(' ')">Images</th>
          <th data-key="title">Title</th>
          <th data-key="description">Description</th>
          <th data-key="quantity">Qty</th>
          <th data-key="(row)=>row.tags.join(' ')">Tags</th>
          <th data-key="(row)=>row.category.name">Category</th>
          <th data-key="isAvailable">Availability</th>
          <th data-key="(row)=>row.author.firstname +' '+ row.author.lastname">
            Author
          </th>
          <th data-key="ratings">Ratings</th>
          <th data-key="(row)=>row.feedbacks.length">Feedbacks</th>
          <th data-key="(row)=>row.likes.length">Likes</th>
          <th data-key="(row)=>row.comments.length">Comments</th>
          <th data-key="(row)=>row.requests.length">Requests</th>
          <th data-key="(row)=>row.acceptedRequests.length"
            >Accepted Requests</th
          >
          <th data-key="(row)=>row.recievers.length">Recieves</th>
          <th data-key="(row)=>row.reports.length">Num Reports</th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllPosts}
              <AdminSpinner title="POSTS" />
            {:else}
              {#each $rows as row}
                <tr>
                  <td>{moment(row.createdAt).fromNow()}</td>
                  <td>
                    {#each row.imageUrls as imageUrl}
                      <img
                        class="post-image"
                        src={imageUrl.url}
                        alt={imageUrl.public_id}
                      />
                    {/each}
                  </td>
                  <td>{row.title}</td>
                  <td>{row.description}</td>
                  <td>{row.quantity}</td>
                  <td>{row.tags.join(", ")}</td>
                  <td>{row.category.name}</td>
                  <td>{row.isAvailable ? "Available" : "Not available"}</td>
                  <td>
                    <div class="author-container">
                      <img
                        class="author-profile-image"
                        src={row.author.avatar}
                        alt={row.author.firstname}
                      />
                      <a
                        href={`${frontendURL}/user/${row.author._id}`}
                        target="_blank"
                      >
                        {row.author.firstname}
                        {row.author.lastname}
                      </a>
                    </div>
                  </td>
                  <td style="text-align: center;">
                    <StarRating rating={row.ratings} />
                    <b>{row.ratings}</b>
                  </td>
                  <td>{row.feedbacks.length}</td>
                  <td>{row.likes.length}</td>
                  <td>{row.comments.length}</td>
                  <td>{row.requests.length}</td>
                  <td>{row.acceptedRequests.length}</td>
                  <td>{row.recievers.length}</td>
                  <td>{row.reports.length}</td>
                  <td class="post-actions">
                    <a href={`${frontendURL}/post/${row._id}`} target="_blank">
                      <i class="fa fa-eye" />
                      View Post
                    </a>
                    <button
                      class="delete-btn"
                      on:click={(e) => deletePost(row._id)}
                    >
                      <i class="fa fa-trash" />
                      Delete Post
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
  .post-image,
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
