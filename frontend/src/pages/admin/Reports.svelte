<script>
  import moment from "moment";
  import { getContext, onMount } from "svelte";
  import { Datatable } from "svelte-simple-datatables";
  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import AdminSpinner from "../../components/AdminSpinner.svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  const settings = { columnFilter: true };
  let rows;

  let posts = [];
  onMount(() => {
    getAllReportedPosts();
  });

  let gettingAllReports = false;
  function getAllReportedPosts() {
    gettingAllReports = true;
    fetch(`${backendURL}/api/admin/reported-posts`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllReports = false;
        if (data.status) {
          posts = data.data;
          console.log("REPORTS", posts);
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

  function deleteUser(userID) {
    fetch(`${backendURL}/api/admin/members/${userID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          posts = posts.filter((post) => {
            if (post.reportType == "USER" && post.user._id != userID) {
              return post;
            }
          });
        }
        alert(data.message);
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
          posts = posts.filter((post) => {
            if (post.reportType == "COMMENT" && post.comment._id != commentID) {
              return post;
            }
          });
        }
      })
      .catch((err) => console.log(err));
  }

  function removeReport(reportID) {
    fetch(`${backendURL}/api/admin/reported-posts/${reportID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const deletedReport = data.data;
          posts = posts.filter((post) => post._id != deletedReport._id);
        }
      })
      .catch((err) => console.log(err));
  }

  function blockUser(userID) {
    fetch(`${backendURL}/api/users/${userID}/block`, {
      mode: "cors",
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("BLOCKED USER", data);
        if (data.status) {
          const theUser = data.data;

          posts.forEach((post) => {
            if (post.user?._id == theUser._id) {
              post.user = { ...post.user, ...theUser };
              posts = [...posts];
            }
          });
        }
      })
      .catch((err) => console.log(err));
  }
</script>

<svelte:head>
  <title>Reported Things</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="admin-page-title">
      <h1>REPORTS</h1>
    </div>
    <div class="table-container">
      <Datatable {settings} data={posts} bind:dataRows={rows}>
        <thead>
          <th data-key="createdAt">Report Date</th>
          <th data-key="reportMessage">Report Message</th>
          <th data-key="reportType">Report Type</th>
          <th data-key="(row)=>row.user?.firstname + ' ' + row.user?.lastname ">
            User
          </th>
          <th data-key="(row)=>row.post? row.post.title: ''">Post Title</th>
          <th data-key="(row)=>row.comment? row.comment.content: ''">Comment</th
          >
          <th
            data-key="(row)=>row.reporter.firstname + ' ' +  row.reporter.lastname"
          >
            Reporter Name
          </th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllReports}
              <AdminSpinner title="REPORTS" />
            {:else}
              {#each $rows as row}
                <tr>
                  <td>{moment(row.createdAt).fromNow()}</td>
                  <td>{row.reportMessage}</td>
                  <td>{row.reportType}</td>
                  <td>
                    {#if row.user && row.user != ""}
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
                    {/if}
                  </td>
                  <td>{row.post && row.post.title}</td>
                  <td>{row.comment && row.comment.content}</td>
                  <td>
                    <div class="author-container">
                      <img
                        class="author-profile-image"
                        src={row.reporter.avatar}
                        alt={row.reporter.firstname}
                      />
                      <a
                        href={`${frontendURL}/user/${row.reporter._id}`}
                        target="_blank"
                      >
                        {row.reporter.firstname}
                        {row.reporter.lastname}
                      </a>
                    </div>
                  </td>
                  <td>
                    {#if row.reportType == "USER"}
                      {#if row.user && row.user != ""}
                        <a
                          href={`${frontendURL}/user/${row.user._id}`}
                          target="_blank"
                        >
                          <i class="fa fa-eye" />
                          View Profile
                        </a>
                        <button
                          class="block-btn"
                          on:click={(e) => blockUser(row.user._id)}
                        >
                          <i class="fa fa-trash" />
                          {row.user.isBlocked ? "Un-Block User" : " Block User"}
                        </button>
                      {:else}
                        User Not Found
                      {/if}
                    {:else if row.reportType == "POST"}
                      {#if row.post && row.post != ""}
                        <a
                          href={`${frontendURL}/post/${row.post._id}`}
                          target="_blank"
                        >
                          <i class="fa fa-eye" />
                          View Post
                        </a>
                        <button
                          class="delete-btn"
                          on:click={(e) => deletePost(row.post._id)}
                        >
                          <i class="fa fa-trash" />
                          Delete Post
                        </button>
                      {:else}
                        Post Not Found
                      {/if}
                    {:else if row.reportType == "COMMENT"}
                      {#if row.comment && row.comment != ""}
                        <a
                          href={`${frontendURL}/post/${row.comment.postId}`}
                          target="_blank"
                        >
                          <i class="fa fa-eye" />
                          View Comment
                        </a>
                        <button
                          class="delete-btn"
                          on:click={(e) => deleteComment(row.comment._id)}
                        >
                          <i class="fa fa-trash" />
                          Delete Comment
                        </button>
                      {:else}
                        Comment Not Found
                      {/if}
                    {/if}
                    <button
                      class="delete-btn"
                      on:click={(e) => removeReport(row._id)}
                    >
                      <i class="fa fa-trash" />
                      Delete Report
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
  .block-btn {
    background-color: #143f6b;
    color: white;
    outline: none;
    border-radius: 0.3rem;
  }
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
  main {
    flex: 1;
  }
  .admin-main-container {
    display: flex;
    height: 100%;
  }
  .author-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: fit-content;
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
