<script>
  import userStore from "../stores/userStore";
  import moment from "moment";
  export let message;
</script>

<div
  class={message.sender !== $userStore._id
    ? "left chat-item"
    : "right chat-item"}
>
  <p class="time-created">{moment(message.createdAt).fromNow()}</p>
  <p class="message"><b>{message.message}</b></p>
</div>

<style>
  .chat-item {
    padding: 0.5rem;
    margin: 0.25rem;
    border-radius: 0.75rem;
  }
  p.time-created {
    font-size: 0.8rem;
  }
  p.message {
    font-weight: 500;
  }
  .left {
    align-self: flex-start;
    background-color: rgb(196, 186, 186);
  }
  .right {
    align-self: flex-end;
    background-color: #81c784;
    text-align: right;
  }
</style>
