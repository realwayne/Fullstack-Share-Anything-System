<script>
  import { onMount } from "svelte";
  import AdminSpinner from "../../components/AdminSpinner.svelte";
  import moment from "moment";
  import { Datatable } from "svelte-simple-datatables";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import CreateCategory from "../../components/modals/categoryModals/CreateCategory.svelte";
  import UpdateCategory from "../../components/modals/categoryModals/UpdateCategory.svelte";

  const settings = { columnFilter: false, blocks: { searchInput: false } };
  let rows;

  let categories = [];
  onMount(() => {
    getAllCategories();
  });

  let gettingAllCategories = false;
  function getAllCategories() {
    gettingAllCategories = true;
    fetch(`${backendURL}/api/categories`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("CATEGORIES", data.data);
        gettingAllCategories = false;
        if (data.status) {
          categories = data.data;
        }
      })
      .catch((err) => console.log(err));
  }

  let willCreateNewCategory = false;
  function addNewCategory(name, description) {
    fetch(`${backendURL}/api/categories`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({ name, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        willCreateNewCategory = false;
        if (data.status) {
          console.log("NEW CATEGORY", data.data);
          categories = [data.data, ...categories];
        }

        // FOR TOAST DISPLAY
        // alert(data.message);
      })
      .catch((err) => console.log(err));
  }

  function deleteCategory(categoryID) {
    fetch(`${backendURL}/api/categories/${categoryID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          console.log("DELETED CATEGORY", data.data);
          categories = categories.filter(
            (category) => category._id != data.data._id
          );
        }

        // FOR TOAST DISPLAY
        // alert(data.message);
      })
      .catch((err) => console.log(err));
  }

  let willUpdateCategory = false;
  let categoryToUpdate = null;
  function updateCategory(categoryID, newName, newDescription) {
    fetch(`${backendURL}/api/categories/${categoryID}`, {
      mode: "cors",
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({ newName, newDescription }),
    })
      .then((res) => res.json())
      .then((data) => {
        willUpdateCategory = false;
        if (data.status) {
          console.log("UPDATED CATEGORY", data.data);
          categories = categories.map((category) => {
            if (category._id == data.data._id) {
              return data.data;
            } else {
              return category;
            }
          });
        }

        // FOR TOAST DISPLAY
        // alert(data.message);
      })
      .catch((err) => console.log(err));
  }
</script>

<svelte:head>
  <title>Categories</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="categories-page-title">
      <h1>CATEGORIES</h1>
      <button
        class="add-category"
        on:click={(e) => (willCreateNewCategory = !willCreateNewCategory)}
      >
        <i class="fa fa-plus-circle" />
        Add New Category
      </button>
    </div>
    <div class="table-container">
      <Datatable {settings} data={categories} bind:dataRows={rows}>
        <thead>
          <!-- <th data-key="_id">ID</th> -->
          <th data-key="createdAt">Created At</th>
          <th data-key="name">Name</th>
          <th data-key="description">Description</th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllCategories}
              <AdminSpinner title="CATEGORIES" />
            {:else}
              {#each $rows as row}
                <tr>
                  <!-- <td>{row._id}</td> -->
                  <td>{moment(rows.createdAt).fromNow()}</td>
                  <td>{row.name}</td>
                  <td>{row.description}</td>
                  <td class="post-actions">
                    <button
                      class="edit-btn"
                      on:click={(e) => {
                        willUpdateCategory = !willUpdateCategory;
                        categoryToUpdate = row;
                      }}
                    >
                      <i class="fa fa-edit" />
                      Edit Category
                    </button>
                    <button
                      class="delete-btn"
                      on:click={(e) => deleteCategory(row._id)}
                    >
                      <i class="fa fa-remove" />
                      Delete Category
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

<!-- MODAL FOR CREATING NEW CATEGORY -->
{#if willCreateNewCategory}
  <CreateCategory
    {addNewCategory}
    close={(e) => (willCreateNewCategory = false)}
  />
{/if}
<!-- MODAL FOR CREATING NEW CATEGORY END -->

<!-- MODAL FOR UPDATING   CATEGORY -->
{#if willUpdateCategory}
  <UpdateCategory
    {updateCategory}
    category={categoryToUpdate}
    close={(e) => (willUpdateCategory = false)}
  />
{/if}

<!-- MODAL FOR UPDATING CATEGORY END -->
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
  .add-category {
    background-color: #4caf50;
    color: white;
    outline: none;
    border-radius: 0.3rem;
    border: none;
  }
  .categories-page-title {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .categories-page-title button {
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
