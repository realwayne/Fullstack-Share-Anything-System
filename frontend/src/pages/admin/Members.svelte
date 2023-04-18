<script>
  import { getContext, onMount } from "svelte";
  import AdminSpinner from "../../components/AdminSpinner.svelte";
  import moment from "moment";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");
  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import { Datatable } from "svelte-simple-datatables";

  const settings = { columnFilter: false };
  let rows;

  let members = [];
  onMount(() => {
    getAllMembers();
  });

  let gettingAllMembers = false;
  function getAllMembers() {
    gettingAllMembers = true;
    fetch(`${backendURL}/api/admin/members`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllMembers = false;
        members = data.members;
        console.log("MEMBERS", members);
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
          members = members.filter((member) => member._id != data.data._id);
        }
        alert(data.message);
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
          members = members.map((member) => {
            if (member._id == theUser._id) {
              member.isBlocked = theUser.isBlocked;
              return member;
            }
            return member;
          });
        }
        // alert(data.message);
      })
      .catch((err) => console.log(err));
  }
</script>

<svelte:head><title>Members</title></svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <h1>MEMBERS</h1>
    <div class="table-container">
      <Datatable {settings} data={members} bind:dataRows={rows}>
        <thead>
          <th data-key="createdAt">Join Date</th>
          <th data-key="avatar">Profile Picture</th>
          <th data-key="firstname">Firstname</th>
          <th data-key="lastname">Lastname</th>
          <th data-key="email">Email</th>
          <th data-key="role">Role</th>
          <th data-key="isActive">Activated</th>
          <th data-key="(row)=>row.reports.length">Reported Count</th>
          <th data-key="postsCount">Shared Items</th>
          <th data-key="recievedCount">Recieved Items</th>
          <th data-key="(row)=>row.followers.length">Followers</th>
          <th data-key="(row)=>row.following.length">Following</th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllMembers}
              <AdminSpinner title="MEMBERS" />
            {:else}
              {#each $rows as row}
                <tr>
                  <td>{moment(row.createdAt).fromNow()}</td>
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
                    {row.role == 1
                      ? "SUPER ADMIN"
                      : row.role == 2
                      ? "ADMIN"
                      : "USER"}
                  </td>
                  <td>{row.isActive ? "Active" : "Not Active"}</td>
                  <td>{row.reports.length}</td>
                  <td>{row.postsCount}</td>
                  <td>{row.recievedCount}</td>
                  <td>{row.followers.length}</td>
                  <td>{row.following.length}</td>
                  <td class="actions">
                    <a href={`${frontendURL}/user/${row._id}`} target="_blank">
                      <i class="fa fa-eye" />
                      View Profile
                    </a>
                    <button
                      class="block-btn"
                      on:click={(e) => blockUser(row._id)}
                    >
                      <i class="fa fa-user-times" />
                      {row.isBlocked ? "UnBlock" : "Block"}
                    </button>
                    <button
                      class="delete-btn"
                      on:click={(e) => deleteUser(row._id)}
                    >
                      <i class="fa fa-trash" />
                      Delete
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

  .block-btn {
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
  .actions {
    display: flex;
  }
  .actions > * {
    flex: 1;
    margin: 2px;
  }
  .profile-picture {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    object-fit: cover;
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
