import App from './App.svelte';
import authStore from "./stores/authStore";
import userStore from "./stores/userStore";
import checkAuth from './utils/checkAuth';
import ROLE from "./stores/roleStore";

authStore.set(checkAuth());
authStore.subscribe(auth => {
	if (auth) {
		userStore.set(JSON.parse(localStorage.getItem("user")));
		userStore.subscribe(user => {
			ROLE.set(user.role);
		});
	}
})

const app = new App({
	target: document.body,
});

export default app;