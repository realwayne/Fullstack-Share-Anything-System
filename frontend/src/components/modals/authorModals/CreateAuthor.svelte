<script>
  import { onDestroy } from "svelte";
  import Modal from "../../Modal.svelte";

  export let close;
  export let addNewAuthor;

  let shortDescription = "";
  let fullname = "";
  let creatingAuthor = false;
  let pictureFileInput;
  let picture = "";

  async function createAuthor(e) {
    if (creatingAuthor) return;
    if (fullname.trim() == "") {
      alert("Please provide category name");
      return;
    }
    creatingAuthor = true;
    addNewAuthor(fullname, shortDescription, picture);
  }

  async function uploadNewProfilePicture(newProfilePicture) {
    const imageData = new FormData();
    imageData.append("file", newProfilePicture);
    imageData.append("upload_preset", "profiles");
    imageData.append("cloud_name", "dtgv0kheh");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dtgv0kheh/image/upload",
      { method: "POST", body: imageData }
    );
    const data = await res.json();
    return data.url;
  }

  async function updateProfileImage(e) {
    pictureFileInput.src = URL.createObjectURL(e.target.files[0]);
    const pictureURL = await uploadNewProfilePicture(e.target.files[0]);
    picture = pictureURL;
  }

  onDestroy(() => {
    creatingAuthor = false;
    close();
  });
</script>

<Modal on:close={close}>
  <h2 slot="header">Create Author</h2>
  <form on:submit|preventDefault={createAuthor}>
    <img class="author-picture-preview" bind:this={pictureFileInput} />
    <input
      on:change={updateProfileImage}
      type="file"
      name="picture"
      accept="images/*"
      required
    />
    <input
      type="text"
      bind:value={fullname}
      placeholder="Enter Category Name"
    />
    <textarea
      bind:value={shortDescription}
      cols="30"
      rows="10"
      placeholder="Give some shortDescription of this category"
    />
    <button type="submit">
      {creatingAuthor ? "Creating Author" : "Create Author"}
    </button>
  </form>
</Modal>

<style>
  textarea,
  input {
    margin: 0.25rem 0;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }
  button {
    display: block;
    margin: 0.75rem auto 0.25rem;
    padding: 0.5rem 1rem;
    background-color: blue;
    color: white;
    border: none;
    outline: none;
  }

  img.author-picture-preview {
    display: inline-block;
    width: 100px;
    height: 70px;
    margin: 0.5rem auto;
  }
</style>
