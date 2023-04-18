<script>
  import { Link } from "svelte-routing";
  import authStore from "../stores/authStore";
  export let location;
</script>

<h1>Can't Find the page {location.pathname}</h1>
<Link to={$authStore ? "/user" : "/"}>Home</Link>
