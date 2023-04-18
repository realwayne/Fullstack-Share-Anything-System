<script>
  import { onMount } from "svelte";
  import AdminSpinner from "../../components/AdminSpinner.svelte";
  import moment from "moment";
  import { Datatable } from "svelte-simple-datatables";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import CreateAuthor from "../../components/modals/authorModals/CreateAuthor.svelte";
  import UpdateAuthor from "../../components/modals/authorModals/UpdateAuthor.svelte";

  const settings = { columnFilter: false, blocks: { searchInput: false } };
  let rows;

  let authors = [];
  onMount(() => {
    getAllAuthors();
  });

  let gettingAllAuthors = false;
  function getAllAuthors() {
    gettingAllAuthors = true;

    fetch(`${backendURL}/api/authors`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllAuthors = false;
        if (data.status) {
          authors = data.data.authors;
        }
      })
      .catch((err) => console.log(err));
  }

  let willCreateNewAuthor = false;
  function addNewAuthor(fullname, shortDescription, picture) {
    fetch(`${backendURL}/api/authors`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({ fullname, shortDescription, picture }),
    })
      .then((res) => res.json())
      .then((data) => {
        willCreateNewAuthor = false;
        if (data.status) {
          authors = [data.data.author, ...authors];
        }
      })
      .catch((err) => console.log(err));
  }

  function deleteAuthor(authorID) {
    fetch(`${backendURL}/api/authors/${authorID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          authors = authors.filter(
            (author) => author._id != data.data.deletedAuthor._id
          );
        }
      })
      .catch((err) => console.log(err));
  }

  let willUpdateAuthor = false;
  let authorToUpdate = null;
  function updateAuthor(authorID, fullname, shortDescription, picture) {
    fetch(`${backendURL}/api/authors/${authorID}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({ fullname, shortDescription, picture }),
    })
      .then((res) => res.json())
      .then((data) => {
        willUpdateAuthor = false;
        if (data.status) {
          authors = authors.map((author) => {
            if (author._id == data.data.author._id) {
              return data.data.author;
            } else {
              return author;
            }
          });
        }
      })
      .catch((err) => console.log(err));
  }
</script>

<svelte:head>
  <title>Authors</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="authors-page-title">
      <h1>SITE AUTHORS</h1>
      <button
        class="add-author"
        on:click={(e) => (willCreateNewAuthor = !willCreateNewAuthor)}
      >
        <i class="fa fa-plus-circle" />
        Add New Author
      </button>
    </div>
    <div class="table-container">
      <Datatable {settings} data={authors} bind:dataRows={rows}>
        <thead>
          <th data-key="picture">Picture</th>
          <th data-key="fullname">Name</th>
          <th data-key="shortDescription">Description</th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllAuthors}
              <AdminSpinner title="authors" />
            {:else}
              {#each $rows as row}
                <tr>
                  <td
                    ><img
                      src={row.picture}
                      alt={row.fullname}
                      style="display: inline-block; width: 70px; height: 40px;"
                    /></td
                  >
                  <td>{row.fullname}</td>
                  <td>{row.shortDescription}</td>
                  <td class="post-actions">
                    <button
                      class="edit-btn"
                      on:click={(e) => {
                        authorToUpdate = row;
                        willUpdateAuthor = true;
                      }}
                    >
                      <i class="fa fa-edit" />
                      Edit Author
                    </button>
                    <button
                      class="delete-btn"
                      on:click={(e) => deleteAuthor(row._id)}
                    >
                      <i class="fa fa-remove" />
                      Delete Author
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

<!-- MODAL FOR CREATING NEW author -->
{#if willCreateNewAuthor}
  <CreateAuthor {addNewAuthor} close={(e) => (willCreateNewAuthor = false)} />
{/if}
<!-- MODAL FOR CREATING NEW author END -->

<!-- MODAL FOR UPDATING   author -->
{#if willUpdateAuthor}
  <UpdateAuthor
    {updateAuthor}
    author={authorToUpdate}
    close={(e) => (willUpdateAuthor = false)}
  />
{/if}

<!-- MODAL FOR UPDATING author END -->
<style>
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }
  .edit-btn {
    background-color: #143f6b;
    color: white;
    outline: none;
    border-radius: 0.3rem;
  }
  .delete-btn {
    background-color: #f55353;
    color: white;
    outline: none;
    border-radius: 0.3rem;
  }
  .add-author {
    background-color: #4caf50;
    color: white;
    outline: none;
    border-radius: 0.3rem;
    border: none;
  }
  .authors-page-title {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .authors-page-title button {
    margin: 0;
  }
  .post-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    align-items: center;
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
