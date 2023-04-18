<script>
  import { Link, navigate } from "svelte-routing";
  import authStore from "../../stores/authStore";
  if (!$authStore) navigate("/login");
  import Modal from "../../components/Modal.svelte";
  import PostCard from "../../components/PostCard.svelte";
  import PostCardSkeleton from "../../components/PostCardSkeleton.svelte";
  import SectionTitle from "../../components/SectionTitle.svelte";
  import { onMount } from "svelte";
  import CreatePost from "../../components/modals/CreatePost.svelte";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  let yourActivePosts = [];
  let yourFollowedPeoplePosts = [];
  onMount(() => {
    getCurrentUsersActivePost();
  });
  onMount(() => {
    getFollowedUsersActivePosts();
  });

  let gettingCurrentUsersActivePosts = false;
  function getCurrentUsersActivePost() {
    gettingCurrentUsersActivePosts = true;
    fetch(`${backendURL}/api/posts/active`, {
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingCurrentUsersActivePosts = false;
        yourActivePosts = data;
        console.log("YOUR ACTIVE POSTS", data);
      })
      .catch((error) => console.log(error));
  }

  let gettingFollowedUsersActivePosts = false;
  let currentPage = 1;
  let theresMore = true;
  function getFollowedUsersActivePosts() {
    gettingFollowedUsersActivePosts = true;
    fetch(`${backendURL}/api/posts/followed-users-post?page=${currentPage}`, {
      headers: { Authorization: localStorage.getItem("access-token") },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingFollowedUsersActivePosts = false;
        if (data.data.length <= 0) {
          theresMore = false;
          return;
        }
        yourFollowedPeoplePosts = [...yourFollowedPeoplePosts, ...data.data];
        console.log("POST BY PEOPLE YOU FOLLOW ", data);
      })
      .catch((error) => console.log(error));
  }

  let category;
  let willCreateNewPost = false;
  let previewDiv;
  let uploading = false;
  function previewImages(e) {
    previewDiv.innerHTML = "";
    if (this.files) {
      [].forEach.call(this.files, readAndPreview);
    }
    function readAndPreview(file) {
      if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
        //FILE NOT IMAGE
        return alert(file.name + " is not an image");
      }
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        var image = new Image();
        image.height = 100;
        image.title = file.name;
        image.src = this.result;
        previewDiv.appendChild(image);
      });
      reader.readAsDataURL(file);
    }
  }
  async function uploadImages(images) {
    const imageArray = [];
    for (const image of images) {
      const imageData = new FormData();
      imageData.append("file", image);
      imageData.append("upload_preset", "foodshare");
      imageData.append("cloud_name", "dtgv0kheh");
      const data = await fetch(
        "https://api.cloudinary.com/v1_1/dtgv0kheh/image/upload",
        { method: "POST", body: imageData }
      ).then((res) => res.json());
      imageArray.push({ public_id: data.public_id, url: data.secure_url });
    }
    return imageArray;
  }
  let tags = [];
  let marker = null;
  let quantity = 1;
  async function createNewPost({ target }) {
    if (!marker) {
      window.alert("Please add your post location using map");
      return;
    }

    uploading = true;

    const title = target.title.value;
    const description = target.description.value;
    const expirationDate = target.postExpirationDate.value;
    const imageUrls = await uploadImages(target.images.files);
    const data = await fetch(`${backendURL}/api/posts`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        category,
        imageUrls,
        tags,
        expirationDate,
        coordinates: marker.getLngLat(),
        quantity,
      }),
    }).then((res) => res.json());
    console.log(data);
    if (data.msg.includes("add")) {
      uploading = false;
      willCreateNewPost = false;
      return alert(data.msg);
    }
    uploading = false;
    yourActivePosts = [data.newPost, ...yourActivePosts];
    willCreateNewPost = false;
  }

  function postDeleted(e) {
    const deletedPost = e.detail.deletedPost;
    yourActivePosts = yourActivePosts.filter((post) => {
      if (post._id !== deletedPost._id) return post;
    });
  }
</script>

<svelte:head><title>Home</title></svelte:head>

<section id="create-post">
  <h1>Wanna share something?</h1>
  <button on:click={(e) => (willCreateNewPost = true)}>Create Post</button>
</section>

<section id="your-active-posts">
  <SectionTitle title="Your active posts" />
  <div class="wrapper">
    {#if gettingCurrentUsersActivePosts}
      {#each Array(4) as e}
        <PostCardSkeleton />
      {/each}
    {:else}
      {#each yourActivePosts as yourPost (yourPost._id)}
        <PostCard
          on:postDeletedEvent={postDeleted}
          bind:yourPost
          id={yourPost._id}
        />
      {:else}
        <h3>Share anything you want</h3>
      {/each}
    {/if}
  </div>
</section>

<section id="people-you-follow-posts">
  <SectionTitle title="Posts by People you follow" />
  <div class="wrapper">
    {#if gettingFollowedUsersActivePosts}
      {#each Array(6) as e}
        <PostCardSkeleton />
      {/each}
    {:else}
      {#each yourFollowedPeoplePosts as followedPost (followedPost._id)}
        <PostCard yourPost={followedPost} id={followedPost._id} />
      {:else}
        <h3>
          Follow other users to have something in here
          <Link to="/user/people">click here</Link>
        </h3>
      {/each}
    {/if}
  </div>
  {#if yourFollowedPeoplePosts.length > 0}
    <div class="load-more-container">
      <button
        class="load-more"
        on:click={theresMore
          ? (e) => {
              currentPage = currentPage + 1;
              getFollowedUsersActivePosts();
            }
          : (e) => alert("No more post")}
        >{theresMore ? "Load more" : "No more post"}</button
      >
    </div>
  {/if}
</section>

{#if willCreateNewPost}
  <CreatePost
    bind:tags
    {previewImages}
    bind:previewDiv
    {createNewPost}
    bind:uploading
    bind:marker
    bind:category
    bind:quantity
    close={(e) => (willCreateNewPost = false)}
  />
{/if}

<style>
  #create-post {
    border-radius: 1rem;
    align-items: center;
    /* background-color: #90a4ae; */
    background-color: #81c784;
    display: flex;
    padding: 1rem 1rem;
    justify-content: space-between;
  }

  #create-post button,
  button.load-more {
    padding: 0.5rem 1rem;
    transform: scale(1);
    border: none;
    outline: none;
    color: white;
    background-color: blue;
    border-radius: 0.5rem;
  }
  #create-post button:hover,
  button.load-more:hover {
    transform: scale(1.1);
  }
  #create-post button:active,
  button.load-more:active {
    transform: scale(1);
  }
  #create-post button {
    margin-bottom: 0;
  }
  .wrapper {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 1rem auto;
  }
  button.load-more {
    display: block;
    margin: 1rem auto 2rem;
  }
  div.load-more-container {
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
    display: block;
    width: 100%;
  }
  @media (max-width: 600px) {
  }
</style>
