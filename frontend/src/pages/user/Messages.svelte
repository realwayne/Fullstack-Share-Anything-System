<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import SidebarMessages from "../../components/SidebarMessages.svelte";
  import authStore from "../../stores/authStore";
  import userStore from "../../stores/userStore.js";
  if (!$authStore) navigate("/login");

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  let conversations = null;
  onMount(() => {
    fetch(`${backendURL}/api/messages`, {
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        conversations = data.conversation;

        conversations.forEach((conversation) => {
          conversation.members.forEach((member) => {
            if (member._id !== $userStore._id) {
              conversation.reciever = member;
            }
          });
        });

        console.log("Conversations", data);
      })
      .catch((error) => console.log(error));
  });
</script>

<svelte:head><title>Your Messages</title></svelte:head>
<h1>Messages</h1>
<main>
  <SidebarMessages {conversations} />
  <div class="start-chatting">
    <h1>Start Chatting other users</h1>
  </div>
</main>

<style>
  * {
    box-sizing: border-box;
  }

  h1 {
    background-color: #81c784;
    color: black;
    margin-bottom: 0.5rem;
    padding: 1rem 1rem;
    font-size: 1.5rem;
    border-radius: 1rem;
  }
  main {
    display: flex;
    max-width: 1200px;
    height: 90vh;
    margin: 0 auto;
    margin-bottom: 2rem;
    padding: 1rem;
  }

  .start-chatting {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
