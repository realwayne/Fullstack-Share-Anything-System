<script>
  import { Link } from "svelte-routing";

  import userStore from "../stores/userStore";
  import ROLE from "../stores/roleStore";
</script>

<aside>
  <div class="admin-profile">
    <img src={$userStore.avatar} alt={userStore.firstname} />
  </div>
  <div class="admin-links">
    <ul>
      <li>
        <Link to="admin/">
          <i class="fa fa-dashboard" />Dashboard
        </Link>
      </li>
      <li>
        <Link to="admin/members">
          <i class="fa fa-users" />Members
        </Link>
      </li>
      <li>
        <Link to="admin/categories">
          <i class="fa fa-list-alt" />Categories
        </Link>
      </li>
      <li>
        <Link to="admin/posts">
          <i class="fa fa-sticky-note" /> Posts
        </Link>
      </li>
      <li>
        <Link to="admin/comments">
          <i class="fa fa-comments" /> Comments
        </Link>
      </li>
      <li>
        <Link to="admin/reports">
          <i class="fa fa-flag" /> Reports
        </Link>
      </li>
      <li>
        <Link to="admin/faqs">
          <i class="fa fa-question" /> FAQ's
        </Link>
      </li>
      <!-- SUPER ADMIN ONLY -->
      {#if $ROLE == 1}
        <li>
          <Link to="admin/authors">
            <i class="fa fa-at" /> Authors
          </Link>
        </li>
        <li>
          <Link to="admin/admins">
            <i class="fa fa-user" /> Admins
          </Link>
        </li>
      {/if}
    </ul>
  </div>
</aside>

<style>
  .admin-profile {
    text-align: center;
  }
  .admin-profile img {
    height: 250px;
    width: 250px;
    border: 1px solid;
    text-align: center;
    border-radius: 50%;
  }
  aside {
    max-width: 300px;
    width: 100%;
    border-right: 1px solid grey;
  }

  .admin-links {
    margin-top: 0.5rem;
  }
  .admin-links i {
    font-size: 2rem;
    padding-right: 0.5rem;
  }
  li {
    display: block;
    margin: 0.2rem 0;
  }
  :global(li > a) {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    text-transform: uppercase;
  }

  @media (max-width: 1000px) {
    .admin-profile img {
      height: 100px;
      width: 100px;
      border: 1px solid;
      text-align: center;
      border-radius: 50%;
    }
    li i {
      display: block;
    }
  }
</style>
