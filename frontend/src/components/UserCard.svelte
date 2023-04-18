<script>
  export let avatar, firstname, lastname, address, about, email;
</script>

<div class="user">
  <div class="profile">
    <img src={avatar} alt={firstname} />
  </div>
  <div class="name">
    <h2>{firstname} {lastname}</h2>
    <p><small>{email}</small></p>
    <small>{about.substr(0, 100)}...</small>
  </div>
</div>

<style>
  .user {
    display: flex;
    border: 1px solid grey;
    border-radius: 1rem;
  }
  .profile {
    width: 30%;
  }
  .name {
    flex: 1;
    padding: 0.5rem;
  }
  img {
    border-radius: 1rem;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  p,
  p:hover,
  small,
  small:hover {
    text-decoration: none;
  }
</style>
