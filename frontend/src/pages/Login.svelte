<script>
  import { onMount } from "svelte";
  import { navigate, Link } from "svelte-routing";
  import authStore from "../stores/authStore.js";
  import userStore from "../stores/userStore.js";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  onMount(() => {
    if ($authStore) {
      navigate("/user");
    }
  });

  let email = "",
    password = "";
  let firstname = "",
    lastname = "";

  async function login(e) {
    if (email === "" || password === "") return alert("Enter you credentials");

    const res = await fetch(`${backendURL}/api/login`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { access_token, user } = await res.json();
      localStorage.setItem("access-token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      $authStore = true;
      $userStore = user;

      console.log("USER LOGGING IN", user);
      console.log("Response stored on LOCALSTORAGE");
      navigate("/user");
    } else {
      const { msg } = await res.json();
      window.alert(msg);
    }
  }

  async function register(e) {
    const res = await fetch(`${backendURL}/api/register`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, firstname, lastname, password }),
    });

    const { msg } = await res.json();
    window.alert(msg);
  }
  let container;
  let containerClasses = "";
  function signUpButtonClicked(e) {
    containerClasses = "right-panel-active";
  }
  function logInButtonClicked(e) {
    containerClasses = "";
  }
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/css/login.css" />
  <title>Login</title>
</svelte:head>

<div
  class={`container ${containerClasses}`}
  id="container"
  bind:this={container}
>
  <div class="form-container sign-up-container">
    <form on:submit|preventDefault={register}>
      <h1>Create Account</h1>
      <input type="text" placeholder="Firstname" bind:value={firstname} />
      <input type="text" placeholder="Lastname" bind:value={lastname} />
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button>Sign Up</button>
    </form>
  </div>
  <div class="form-container log-in-container">
    <form on:submit|preventDefault={login}>
      <h1>Log in</h1>
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button>Log In</button>
      <Link to="forgot-password">Forgot your password?</Link>
    </form>
  </div>
  <div class="overlay-container">
    <div class="overlay">
      <div class="overlay-panel overlay-left">
        <h1>Welcome Back!</h1>
        <p>To keep connected with us please login with your personal info</p>
        <button class="ghost" id="logIn" on:click={logInButtonClicked}
          >Log In</button
        >
      </div>
      <div class="overlay-panel overlay-right">
        <h1>Hello, Friend!</h1>
        <p>Enter your personal details and start journey with us</p>
        <button class="ghost" id="signUp" on:click={signUpButtonClicked}
          >Sign Up</button
        >
      </div>
    </div>
  </div>
</div>
