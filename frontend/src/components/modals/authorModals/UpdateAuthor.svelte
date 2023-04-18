<script>
  import { getContext, onDestroy } from "svelte";
  import Modal from "../../Modal.svelte";

  const backendURL = getContext("backendURL");

  export let close;
  export let author;
  export let updateAuthor;

  let fullname = author.fullname;
  let shortDescription = author.shortDescription;
  let picture = author.picture;

  let updatingAuthor = false;
  let pictureFileInput;

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

  async function handleUpdateAuthor(e) {
    if (updatingAuthor) return;
    if (fullname.trim() == "") {
      alert("Please provide author name");
      return;
    }
    updatingAuthor = true;
    updateAuthor(author._id, fullname, shortDescription, picture);
  }

  onDestroy(() => {
    updatingAuthor = false;
    close();
  });
</script>

<Modal on:close={close}>
  <h2 slot="header">Create author</h2>
  <form on:submit|preventDefault={handleUpdateAuthor}>
    <img
      class="author-picture-preview"
      bind:this={pictureFileInput}
      src={picture}
      style="display: inline-block; width: 70px; height: 40px;"
    />
    <input
      on:change={updateProfileImage}
      type="file"
      name="picture"
      accept="images/*"
    />
    <input
      type="text"
      bind:value={fullname}
      placeholder="Enter new author Name"
    />
    <textarea
      bind:value={shortDescription}
      cols="30"
      rows="10"
      placeholder="Give some description of this author"
    />
    <button type="submit">
      {updatingAuthor ? "Updating author" : "Update author"}
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
</style>
