<script>
  import { navigate } from "svelte-routing";
  import ChatMessage from "../../../components/ChatMessage.svelte";
  import MessageSkeleton from "../../../components/MessageSkeleton.svelte";
  import SidebarMessages from "../../../components/SidebarMessages.svelte";
  import userStore from "../../../stores/userStore";
  export let messageID;
  let user;
  let conversations = null;
  let messages = null;

  import { getContext, onDestroy } from "svelte";
  const backendURL = getContext("backendURL");

  $: messageID, fetchConversations();

  function checkMessageIdInConversations() {
    const messageIdInConversation = conversations.find(
      (conversation) => conversation.reciever._id === messageID
    );
    if (messageIdInConversation) {
      return true;
    }
    return false;
  }

  function fetchConversations() {
    fetch(`${backendURL}/api/messages`, {
      headers: { Authorization: localStorage.getItem("access-token") },
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
        console.log("CONVERSATIONS", conversations);
        if (checkMessageIdInConversations()) {
          console.log("INSIDE CONVERSATION");
          user = null;
          fetchMessages();
        } else {
          console.log("NOT IN CONVERSATION");
          fetchUserDetails();
        }
      })
      .catch((error) => console.log(error));
  }
  function fetchUserDetails() {
    fetch(`${backendURL}/api/user/${messageID}`, {
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => {
        if (!res.ok) {
          return navigate("/user/messages");
        }

        return res.json();
      })
      .then((data) => {
        user = data.user;
      })
      .catch((error) => {
        console.log(error);
        navigate("/user/messages");
      });
  }

  let gettingAllMessages = false;
  function fetchMessages() {
    gettingAllMessages = true;
    fetch(`${backendURL}/api/messages/${messageID}`, {
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllMessages = false;
        console.log(data);
        messages = data.conversation[0].messages || [];
        console.log("MESSAGES", messages, data);
        fetchMessagesSSE();
      })
      .catch((error) => console.log(error));
  }

  let evtSource;
  function fetchMessagesSSE() {
    evtSource = new EventSource(`${backendURL}/api/messages/sse/${messageID}`);

    evtSource.onmessage = function (event) {
      const messageData = JSON.parse(event.data);
      messages = [...messages, messageData];
    };
  }
  onDestroy(() => {
    if (evtSource) evtSource.close();
  });

  let newMessage = "";
  function sendMessage(e) {
    if (newMessage.trim() == "") return;
    fetch(`${backendURL}/api/messages/${messageID}`, {
      mode: "cors",
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        newMessage = "";
        if (user) {
          data.conversation.members.forEach((member) => {
            if (member._id !== $userStore._id) {
              data.conversation.reciever = member;
            }
          });
          conversations = [...conversations, data.conversation];
          messages = [...data.conversation.messages];
          user = null;
          return;
        }
        console.log(data);
        messages = data.conversation.messages;
      })
      .catch((error) => console.log(error));
  }
  function deleteConversation(e) {
    fetch(`${backendURL}/api/messages/${messageID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const idOfDeletedConversation = data.conversation._id;
        conversations = conversations.filter(
          (conversation) => conversation._id != idOfDeletedConversation
        );
        navigate("/user/messages");
      })
      .catch((error) => console.log(error));
  }
</script>

<svelte:head><title>Your Messages</title></svelte:head>
<h1 class="page-title">Messages</h1>
<main>
  <div class="sidebar">
    {#if user}
      <div style="text-align: center;">
        <img
          src={user.avatar}
          alt={user.firstname}
          style="height: 5rem; width: 5rem; border-radius: 50%;"
        />
        <p style="font-size: 1.2rem;">{user.firstname} {user.lastname}</p>
      </div>
    {/if}
    <SidebarMessages
      {conversations}
      conversationId={messageID}
      {deleteConversation}
    />
  </div>
  <div class="messages">
    <div class="chats">
      {#if gettingAllMessages}
        {#each Array(10) as e}
          <MessageSkeleton />
        {/each}
      {/if}
      {#if !gettingAllMessages}
        {#if messages}
          {#each messages as message}
            <ChatMessage {message} />
          {/each}
        {/if}
      {/if}
    </div>
    <form on:submit|preventDefault={sendMessage}>
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Enter your messages here"
      />
      <button type="submit">Send</button>
    </form>
  </div>
</main>

<style>
  * {
    box-sizing: border-box;
  }
  h1.page-title {
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
    margin: 0 auto;
    height: 90vh;
    padding: 0.5rem;
  }
  main .messages {
    flex: 1;
  }
  .messages .chats {
    border: 1px solid;
    border-radius: 1rem;
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    padding: 1.5rem;
    height: calc(100% - 4rem);
  }

  .messages {
    flex: 1;
    position: relative;
  }
  form {
    position: absolute;
    display: block;
    height: 4rem;
    border: 1px solid;
    border-radius: 1rem;
    width: calc(100% - 1rem);
    padding: 0;
    margin: 0;
    left: 0.5rem;
    bottom: 0;
    display: flex;
  }
  form input {
    flex: 1;
    margin: 0;
  }
  form button {
    background-color: #81c784;
    font-weight: 700;
    padding: 1rem 2rem;
  }
  form input:active {
    border: 1px solid #81c784;
  }
</style>
