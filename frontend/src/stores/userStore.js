import { writable } from "svelte/store";

const userStore = writable(null);

export default userStore;