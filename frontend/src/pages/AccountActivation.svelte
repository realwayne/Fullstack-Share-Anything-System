<script>
  import { onMount, getContext } from "svelte";
  const backendURL = getContext("backendURL");
  import { navigate } from "svelte-routing";

  import userStore from "../stores/userStore";
  import authStore from "../stores/authStore";

  export let userID;
  export let token;

  onMount(() => {
    validateAndActivateAccount();
  });

  async function validateAndActivateAccount() {
    fetch(`${backendURL}/api/activate/account`, {
      mode: "cors",
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.status) {
          window.alert(data.message);

          const { access_token, user } = data;
          localStorage.setItem("access-token", access_token);
          localStorage.setItem("user", JSON.stringify(user));
          $authStore = true;
          $userStore = user;
          console.log("Response stored on LOCALSTORAGE");
          navigate("/user");
        } else {
          window.alert(data.message);
          navigate("/");
        }
      });
  }
</script>
