<script>
  import Modal from "../Modal.svelte";
  import { getContext } from "svelte";

  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  export let close, addNewAdmin;

  let searchResults = [];
  let searchUser = "";
  let selectedUserID = null;

  function getAllMembers() {
    fetch(`${backendURL}/api/admin/get-candidates-admin?search=${searchUser}`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          searchResults = data.data;
        }
      })
      .catch((err) => console.log(err));
  }
</script>

<Modal on:close={close}>
  <h2 slot="header">Add New Admin</h2>
  <form
    on:submit|preventDefault={(e) => {
      if (!selectedUserID) {
        alert("Please select user");
        return;
      }
      addNewAdmin(selectedUserID);
    }}
  >
    <div>
      <label for="">Search admin name</label>
      <input
        on:keyup={getAllMembers}
        type="text"
        bind:value={searchUser}
        placeholder="Search your new Admin"
      />
    </div>
    <button type="submit">Add Admin</button>
  </form>
  <div class="result">
    {#each searchResults as result}
      <div
        class="user-container"
        on:click={(e) => (selectedUserID = result._id)}
      >
        <label for={result._id}>
          <img src={result.avatar} alt={result.firstname} />
          {`${result.firstname} ${result.lastname}`}
        </label>
        <input
          name="new_selected_admin"
          type="radio"
          id={result._id}
          readonly
        />
      </div>
    {/each}
  </div>
</Modal>

<style>
  .user-container {
    display: flex;
    align-items: center;
    padding: 2px;
    justify-content: space-between;
  }
  .user-container img {
    display: inline-block;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.4rem;
  }
  .user-container label {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .user-container input {
    display: inline-block;
    width: 2rem;
    height: 2rem;
  }
  input {
    width: 100%;
  }
  button {
    display: block;
    margin: 0.75rem auto 0.25rem;
    padding: 0.5rem 1rem;
    background-color: blue;
    color: white;
    border: none;
    outline: none;
  }
</style>
