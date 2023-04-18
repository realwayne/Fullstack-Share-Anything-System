import authStore from "../stores/authStore"

// this function will remove auths from localStorage and App State
function removeAuth() {
  localStorage.removeItem("access-token");
  localStorage.removeItem("user");
  authStore.set(false);
}

export default removeAuth;