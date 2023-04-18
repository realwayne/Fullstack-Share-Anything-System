<script>
  import { getContext } from "svelte";
  import { Link } from "svelte-routing";
  const backendURL = getContext("backendURL");

  export let token = "";
  let email = "";
  let newPassword = "";
  let pageActionResult = "";

  async function resetPassword() {
    const data = await fetch(`${backendURL}/api/forgot-password/${token}`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    }).then((res) => res.json());

    if (data.status) {
      pageActionResult = data.msg;
    } else {
      pageActionResult = data.msg;
    }
  }
</script>

<main>
  <div class="home"><Link to="/"><i class="fa fa-home" /></Link></div>
  <div class="reset-password-form">
    <h1>Change your password</h1>
    <form on:submit|preventDefault={resetPassword}>
      <p>{pageActionResult}</p>
      <input
        type="email"
        bind:value={email}
        placeholder="Enter your existing email address"
      />
      <input
        type="password"
        bind:value={newPassword}
        placeholder="Enter your new Password"
      />

      <button type="submit">Change Password</button>
    </form>
  </div>
</main>

<style>
  * {
    box-sizing: border-box;
  }
  main {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
  }
  .home {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 3rem;
    height: 3rem;
    color: #047400b9;
  }
  .home i {
    font-size: 2.5rem;
    color: #047400b9;
  }
  .reset-password-form {
    box-shadow: 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%);
    max-width: 450px;
    width: 100%;
    background-color: #047400b9;
    color: white;
    border-radius: 0.5rem;
    padding: 2rem 1rem 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  h1 {
    margin-bottom: 0.75rem;
  }
  input,
  button {
    outline: none;
    border-radius: 0.25rem;
  }
  button {
    background-color: transparent;
    color: white;
    font-weight: 700;
    border: 2px solid white;
    padding: 0.25rem;
  }
  button:hover {
    background-color: white;
    color: #047400b9;
    font-weight: 700;
  }
  p {
    margin-bottom: 0.25rem;
  }
</style>
