<script>
  import { Link } from "svelte-routing";
  import Modal from "../Modal.svelte";

  export let close;
  export let whatModal;
  export let following;
  export let followers;
</script>

<Modal on:close={close}>
  <h1 slot="header">{whatModal}</h1>
  {#if whatModal === "Following"}
    {#each following as followedUser}
      <Link to={`/user/${followedUser._id}`}>
        <div class="user-name">
          <img src={followedUser.avatar} alt={followedUser.firstname} />
          <span>
            {followedUser.firstname}
            {followedUser.lastname}
          </span>
        </div>
      </Link>
    {:else}
      <h3>No followed users</h3>
    {/each}
  {:else if whatModal === "Followers"}
    {#each followers as followerUser}
      <Link to={`/user/${followerUser._id}`}>
        <div class="user-name">
          <img src={followerUser.avatar} alt={followerUser.firstname} />
          <span>
            {followerUser.firstname}
            {followerUser.lastname}.
          </span>
        </div>
      </Link>
    {:else}
      <h3>No Followers</h3>
    {/each}
  {/if}
</Modal>

<style>
  .user-name {
    display: flex;
    padding: 0.25rem 0;
    align-items: center;
  }
  .user-name img {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  .user-name span {
    flex-grow: 1;
    font-size: 1.2rem;
  }
</style>
