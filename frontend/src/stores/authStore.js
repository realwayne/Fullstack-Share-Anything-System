import { writable } from "svelte/store";

const authStore = writable(null);

export default authStore;