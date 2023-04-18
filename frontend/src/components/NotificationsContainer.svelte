<script>
  import { Link, navigate } from "svelte-routing";
  import moment from "moment";
  export let notifications = [];

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  function readNotification(notificationID) {
    console.log("marked us read", notificationID);
    fetch(`${backendURL}/api/notifications/${notificationID}`, {
      mode: "cors",
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        notifications = notifications.filter(
          ({ _id }) => _id !== data.notification._id
        );
      })
      .catch((err) => console.log(err));
  }
  function readAndNavigate(notificationID, link) {
    readNotification(notificationID);
    navigate(link);
  }
</script>

<div class="notifications-container">
  <h2>Your Notifications</h2>
  <div class="notifications">
    {#each notifications as notification}
      <div
        class="notification-item"
        on:click={(e) => {
          if (e.target.nodeName === "BUTTON") {
            return readNotification(notification._id);
          }
          readAndNavigate(notification._id, notification.link);
        }}
      >
        <div>
          {@html notification.content}
          <small id="notification-date" style="width: 100%;">
            {moment(notification.createdAt).fromNow()}
          </small>
        </div>
        <button class="mark-as-read">
          <i style="margin-right: .2rem;" class="fa fa-check-circle" /> Mark as read
        </button>
      </div>
    {:else}
      <b>You dont have any notifications for now</b>
    {/each}
  </div>
</div>

<style>
  button.mark-as-read {
    padding: 0.1rem 0.2rem;
    font-size: 0.8rem;
    border-radius: 0.2rem;
    color: white;
    background-color: #4caf50;
  }
  .notification-item {
    display: flex;
    align-items: center;
    padding: 0.2rem;
    border-radius: 1rem;
  }
  .notification-item:hover {
    background-color: #b4cfb0;
  }
  :global(.notification-item img) {
    display: inline-block;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    margin: 0.1rem;
  }
  :global(.notification-item > div *),
  :global(.notification-item > div),
  :global(.notifications-container h2) {
    color: black;
  }
  :global(.notification-item > div) {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  small#notification-date {
    color: rgb(104, 104, 194);
  }
  .notifications-container {
    position: absolute;
    top: 100%;
    left: 50%;
    display: block;
    transform: translateX(-50%);
    width: 400px;
    padding: 0.5rem;
    z-index: 10;
    background-color: white;
    height: 70vh;
    overflow-y: scroll;
  }
</style>
