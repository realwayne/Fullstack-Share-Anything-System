<script>
  import { getContext } from "svelte";
  import { Link, navigate } from "svelte-routing";
  const backendURL = getContext("backendURL");

  let email = "";
  let pageActionResult = "";
  async function sendEmail() {
    const data = await fetch(`${backendURL}/api/forgot-password`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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

  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div id="logo" class="text-center">
          <h1>FoodSharePh</h1>
        </div>
        <div class="forgot-password-form">
          <h1>Forgot your password?</h1>
          <form on:submit|preventDefault={sendEmail}>
            <p>{pageActionResult}</p>
            <input
              type="email"
              bind:value={email}
              placeholder="Enter your email address"
            />
            <button type="submit">Send Me a Reset Link</button>
          </form>
        </div>
      </div>
    </div>
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
    justify-content: center;
    position: relative;
  }
  #logo h1 {
    font-family: "Pacifico", cursive;
    font-size: 3rem !important;
    text-align: center;
    color: #047400b9;
    text-shadow: 0px 3px 0px #444444, 0px 14px 10px rgb(0 0 0 / 15%),
      0px 24px 2px rgb(0 0 0 / 10%), 0px 24px 30px rgb(0 0 0 / 10%);
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
  .forgot-password-form {
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
