<script>
  import { getContext, onMount } from "svelte";
  import { Datatable } from "svelte-simple-datatables";
  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import AdminSpinner from "../../components/AdminSpinner.svelte";
  import CreateNewAdmin from "../../components/modals/CreateNewAdmin.svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  const settings = { columnFilter: false };
  let rows;

  let admins = [];
  onMount(() => {
    getAllAdmins();
  });

  let gettingAllAdmins = false;
  function getAllAdmins() {
    gettingAllAdmins = true;
    fetch(`${backendURL}/api/admin/admins`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllAdmins = false;
        if (data.status) {
          admins = data.data;
          console.log("ADMINS", admins);
        }
      })
      .catch((err) => console.log(err));
  }

  function addNewAdmin(userID) {
    fetch(`${backendURL}/api/admin/admins/`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({
        user: userID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        willCreateNewAdmin = false;
        console.log(data);
        if (data.status) {
          admins = [...admins, data.data];
        }
        // alert(data.message);
      })
      .catch((err) => console.log(err));
  }

  function removeAdmin(adminID) {
    fetch(`${backendURL}/api/admin/admins/${adminID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DELETED ADMIN", data);
        if (data.status) {
          admins = admins.filter((admin) => {
            return admin._id != data.data._id;
          });
        }
        // alert(data.message);
      })
      .catch((err) => console.log(err));
  }

  let willCreateNewAdmin = false;
</script>

<svelte:head>
  <title>Admins</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="admin-page-title">
      <h1>Admins</h1>
      <button
        class="add-admin"
        on:click={(e) => (willCreateNewAdmin = !willCreateNewAdmin)}
      >
        <i class="fa fa-user-plus" />
        Add New Admin
      </button>
    </div>
    <div class="table-container">
      <Datatable {settings} data={admins} bind:dataRows={rows}>
        <thead>
          <th data-key="avatar">Profile Picture</th>
          <th data-key="firstname">Firstname</th>
          <th data-key="lastname">Lastname</th>
          <th data-key="email">Email</th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllAdmins}
              <AdminSpinner title="ADMINS" />
            {:else}
              {#each $rows as row}
                <tr>
                  <td>
                    <img
                      class="profile-picture"
                      src={row.avatar}
                      alt={row.firstname}
                    />
                  </td>
                  <td>{row.firstname}</td>
                  <td>{row.lastname}</td>
                  <td>{row.email}</td>
                  <td>
                    <a href={`${frontendURL}/user/${row._id}`} target="_blank">
                      <i class="fa fa-eye" />
                      View Profile
                    </a>
                    <button
                      class="remove-admin"
                      on:click={(e) => removeAdmin(row._id)}
                    >
                      <i class="fa fa-user-times" />
                      Remove Admin
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

{#if willCreateNewAdmin}
  <CreateNewAdmin close={(e) => (willCreateNewAdmin = false)} {addNewAdmin} />
{/if}

<style>
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  tr:hover {
    background-color: #ddd;
  }
  .add-admin {
    background-color: #4caf50;
    color: white;
    outline: none;
    border-radius: 0.3rem;
    border: none;
  }
  .remove-admin {
    background-color: #f55353;
    color: white;
    outline: none;
    border-radius: 0.3rem;
  }
  main {
    flex: 1;
  }
  .admin-page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .admin-page-title button {
    margin: 0;
  }
  .profile-picture {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    object-fit: cover;
  }
  .admin-main-container {
    display: flex;
    height: 100%;
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
