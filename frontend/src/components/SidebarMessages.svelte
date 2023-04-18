<script>
  import moment from "moment";
  import { Link } from "svelte-routing";
  export let conversations;
  export let conversationId;
  export let deleteConversation;
  import ChatMessageSkeleton from "./ChatMessageSkeleton.svelte";

  let tempConversations;
  let searchUserName = "";
  let searchingUser = false;
  function searchUser(e) {
    searchingUser = true;
    tempConversations = conversations.filter((conversation) => {
      return (
        conversation.reciever.firstname.toLowerCase().indexOf(searchUserName) >
          -1 ||
        conversation.reciever.lastname.toLowerCase().indexOf(searchUserName) >
          -1
      );
    });
  }
</script>

<div class="side-bar">
  <div class="search-chats">
    <input
      type="text"
      placeholder="Search chats"
      on:keyup={searchUser}
      on:focusout={(e) => {
        searchingUser = false;
        searchUserName = "";
      }}
      bind:value={searchUserName}
    />
  </div>
  <div class="chats">
    {#if conversations}
      {#if searchingUser}
        {#each tempConversations as conversation}
          <Link to={`/user/messages/${conversation.reciever._id}`}>
            <div
              class="message"
              class:active={conversation.reciever._id === conversationId}
            >
              <div class="image">
                <img
                  src={conversation.reciever.avatar}
                  alt={conversation.reciever.firstname}
                />
              </div>
              <div class="name">
                <p>
                  <b>
                    {`${conversation.reciever.firstname} ${conversation.reciever.lastname}`}
                  </b>
                </p>
                <p class="last-interaction">
                  {moment(conversation.updatedAt).fromNow()}
                </p>
              </div>
              <div class="delete-convo">
                <button on:click={deleteConversation}>X</button>
              </div>
            </div>
          </Link>
        {/each}
      {:else}
        {#each conversations as conversation}
          {#if conversation.reciever}
            <Link to={`/user/messages/${conversation.reciever._id}`}>
              <div
                class="message"
                class:active={conversation.reciever._id === conversationId}
              >
                <div class="image">
                  <img
                    src={conversation.reciever.avatar}
                    alt={conversation.reciever.firstname}
                  />
                </div>
                <div class="name">
                  <p>
                    <b>
                      {`${conversation.reciever.firstname} ${conversation.reciever.lastname}`}
                    </b>
                  </p>
                  <p class="last-interaction">
                    {moment(conversation.updatedAt).fromNow()}
                  </p>
                </div>
                <div class="delete-convo">
                  <button on:click={deleteConversation}>X</button>
                </div>
              </div>
            </Link>
          {/if}
        {/each}
      {/if}
    {:else}
      <div>
        <h3 style="padding-left: .5rem;">Loading your messages</h3>
        {#each Array(5) as e}
          <ChatMessageSkeleton />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .side-bar {
    max-width: 300px;
    width: 100%;
    border: 1px solid;
    border-radius: 1rem;
    margin: 0.5rem;
    height: 100%;
  }
  p.last-interaction {
    font-size: 0.7rem;
  }
  .delete-convo {
    position: absolute;
    height: 2rem;
    width: 2rem;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
    right: 0;
  }
  .delete-convo button {
    height: 100%;
    width: 100%;
    background-color: rgb(221, 75, 75);
    color: white;
    border-radius: 50%;
    border: none;
  }
  .message {
    padding: 0.25rem;
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 1rem;
  }
  .message.active {
    background-color: #81c784;
  }
  .name {
    padding-left: 0.4rem;
  }
  .search-chats input {
    display: block;
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-bottom: 1px solid grey;
    border-radius: 1rem;
  }
  .image img {
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
  }
</style>
