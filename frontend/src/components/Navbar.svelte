<script>
  import { onMount } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import userStore from "../stores/userStore";
  import ROLE from "../stores/roleStore";
  import removeAuth from "../utils/removeAuth";
  import NotificationContainer from "./NotificationsContainer.svelte";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  let scrollY = 0;
  let user = $userStore;

  onMount(() => fetchNotifications());

  async function logout(e) {
    removeAuth();
    navigate("/");
    console.log("auth removed");
  }

  let openNotificationsContainer = false;
  let notifications = [];
  function fetchNotifications(e) {
    fetch(`${backendURL}/api/notifications`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        notifications = data.notifications;
        // console.log("FETCHING NOTIFICATIONS", notifications);
      })
      .catch((err) => console.log(err));
  }
  let openLinks = false;
</script>

<svelte:window bind:scrollY />

<nav class={scrollY > 10 && "change-background"}>
  <Link to="/user"><h1>FOODSHARE.PH</h1></Link>
  <div class="menu" on:click={(e) => (openLinks = !openLinks)}>
    {#if openLinks}
      <i class="fa fa-close" />
    {:else}
      <i class="fa fa-bars" />
    {/if}
  </div>
  <div
    class="links"
    class:active={openLinks}
    on:click={(e) => (openLinks = !openLinks)}
  >
    <Link to="/user/"><span> Home</span></Link>
    <Link to="/user/find"><span>Find</span></Link>
    <Link to="/user/messages"><span>Messages</span></Link>
    <Link to="/user/requests"><span>Requests</span></Link>
    <span
      class="notification-menu"
      on:mouseenter={fetchNotifications}
      on:click={(e) => {
        e.stopPropagation();
        openNotificationsContainer = !openNotificationsContainer;
      }}
      ><p id="text">Notifications</p>
      {#if notifications.length > 0}
        <span id="count">{notifications.length}</span>
      {/if}
      {#if openNotificationsContainer}
        <NotificationContainer bind:notifications />
      {/if}
    </span>
    <Link to="/user/people"><span>People</span></Link>
    <div class="profile-actions">
      <Link to={`/user/${user._id}`}>
        <span class="profile-link">
          <img id="avatar" src={user.avatar} alt={user.firstname} />
          {user.firstname.toUpperCase()}
        </span>
      </Link>
      <div class="hover-content">
        {#if $ROLE !== 3}
          <Link to="/admin">Admin Dashboard</Link>
        {/if}
        <button id="logout-btn" on:click={logout}>Logout</button>
      </div>
    </div>
  </div>
</nav>

<style>
  .hover-content {
    border-radius: 0.25rem;
    padding: 0.25rem;
    background-color: white;
    position: absolute;
    top: 100%;
    right: 0;
    width: max-content;
    z-index: 10;
    display: none;
  }

  .hover-content > * {
    display: block;
    padding: 0.5rem;
    margin: 2px 0;
    width: 100%;
  }
  .profile-actions {
    position: relative;
  }
  .profile-actions:hover .hover-content {
    display: block;
  }
  button {
    margin: 0;
    padding: 0.5rem 1rem;
    border: 1px solid grey;
    font-weight: 900;
    color: white;
    background-color: #4caf50;
    border-radius: 0.5rem;
  }
  .links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  span.notification-menu {
    position: relative;
    display: flex;
    align-items: center;
  }
  span.notification-menu #text {
    display: inline;
    color: rgb(0, 100, 200);
  }
  span.notification-menu:hover #text {
    text-decoration: underline;
  }
  span#count {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
    color: white;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    border: none;
    padding: 0 0.2rem;
    margin-top: -0.5rem;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem 0;
    justify-content: space-between;
    align-items: center;
  }
  nav .profile-link {
    display: flex;
    align-items: center;
  }
  nav img#avatar {
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
  }
  nav.change-background span {
    color: white;
    font-weight: 600;
    border: 1px solid white;
  }
  nav.change-background p#text,
  nav.change-background h1 {
    color: white;
  }
  nav.change-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem 1rem;
    color: white;
    border-radius: 1rem;
    background-color: #4caf50;
    z-index: 10;
  }
  nav.change-background button {
    background-color: white;
    border-color: white;
    color: black;
    text-transform: uppercase;
    margin-left: 0.2rem;
  }
  nav.change-background .hover-content {
    background-color: #4caf50;
    color: white;
  }
  :global(nav.change-background .hover-content > a) {
    color: white;
  }
  span {
    margin: 0 0.2rem;
    border: 1px solid grey;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .menu {
    display: none;
  }
  @media (max-width: 800px) {
    .hover-content {
      display: block;
      position: static;
      width: 100%;
      background: none;
    }
    :global(.hover-content a) {
      color: white;
      padding: 0.5rem;
      display: block;
    }
    .menu {
      display: block;
    }
    .links {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      text-align: left;
      display: none;
    }
    .links.active {
      display: flex;
    }
    .links span {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0.25rem 0.5rem;
      border: none;
    }
    .links span#count {
      display: inline-block;
      width: fit-content;
    }
    nav .profile-link {
      display: flex;
      align-items: center;
    }
    nav.change-background span {
      border: none;
    }
  }
</style>
