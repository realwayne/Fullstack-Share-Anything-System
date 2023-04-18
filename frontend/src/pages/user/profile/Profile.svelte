<script>
  import { navigate } from "svelte-routing";
  import { Link } from "svelte-routing";
  import authStore from "../../../stores/authStore";
  if (!$authStore) navigate("/login");
  const token = localStorage.getItem("access-token");
  import userStore from "../../../stores/userStore";
  import PostCard from "../../../components/PostCard.svelte";
  import PostCardSkeleton from "../../../components/PostCardSkeleton.svelte";
  import UserProfileSkeleton from "../../../components/UserProfileSkeleton.svelte";
  import regions, {
    getBarangaysForCity,
    getCitiesForProvince,
    getProvincesForRegion,
    getRegionName,
    getProvinceName,
    getCityName,
    getBarangayName,
  } from "../../../json/index.js";
  import UpdateProfile from "../../../components/modals/UpdateProfile.svelte";
  import FollowersFollowing from "../../../components/modals/FollowersFollowing.svelte";

  import Report from "../../../components/modals/Report.svelte";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  export let userID;
  let user;
  let posts;
  let isFollowed = false;

  let region = "",
    province = "",
    city = "",
    barangay = "";

  // $: console.log("User ID", userID);
  $: {
    userID, fetchUser();
    fetchUserPosts();
  }
  $: {
    if (user) {
      ({ region, province, city, barangay } = user.address);
    }
  }

  let provinces = [];
  let cities = [];
  let barangays = [];

  function regionChange(e) {
    const regCode = e.target.value;
    city = "";
    barangay = "";
    cities = [];
    barangays = [];
    provinces = getProvincesForRegion(regCode);
  }
  function provinceChange(e) {
    const provCode = e.target.value;
    barangay = "";
    barangays = [];
    cities = getCitiesForProvince(provCode);
  }
  function cityChange(e) {
    const citymunCode = e.target.value;
    barangays = getBarangaysForCity(citymunCode);
  }
  function checkIfFollowing() {
    user.followers.forEach((follower) => {
      if (follower._id === $userStore._id) isFollowed = true;
    });
  }

  let gettingUser = false;
  function fetchUser() {
    gettingUser = true;
    fetch(`${backendURL}/api/user/${userID}`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingUser = false;
        user = data.user;
        checkIfFollowing();
        console.log("USER", user);
      })
      .catch((e) => console.log(e));
  }
  let gettingUserPosts = false;
  function fetchUserPosts() {
    gettingUserPosts = true;
    fetch(`${backendURL}/api/user_posts/${userID}`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        gettingUserPosts = false;
        posts = data;
        console.log("POSTS", posts);
      })
      .catch((e) => console.log(e));
  }

  let whatModal;
  let willOpenModal = false;
  let willUpdateProfile = false;
  $: {
    userID, (willOpenModal = false);
    willUpdateProfile = false;
  }
  function openFollowingModal(e) {
    whatModal = "Following";
    willOpenModal = true;
  }
  function openFollowersModal(e) {
    whatModal = "Followers";
    willOpenModal = true;
  }
  function followOrUnfollow(e) {
    isFollowed = !isFollowed;
    let action = !isFollowed ? "unfollow" : "follow";
    fetch(`${backendURL}/api/user/${userID}/${action}`, {
      method: "PATCH",
      mode: "cors",
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        user = data.newUser;
        console.log("POSTS", data);
      })
      .catch((e) => console.log(e));
  }

  function userUpdated(e) {
    const { updatedUser } = e.detail;
    user = { ...user, ...updatedUser };
    $userStore = user;
  }

  function postDeleted(e) {
    const deletedPost = e.detail.deletedPost;
    console.log("DELETED POST", deletedPost);
    posts = posts.filter((post) => {
      return post._id != deletedPost._id;
    });
  }

  let willCreateReport = false;
</script>

<svelte:head><title>Profile</title></svelte:head>

{#if gettingUser}
  <UserProfileSkeleton />
{/if}
{#if !gettingUser}
  {#if user}
    <section id="header">
      <img src={user.avatar} alt={user.firstname} />
      <h2 class="name">{user.firstname} {user.lastname}</h2>
      <h3>{user.email}</h3>
      {#if user.address.region !== "" && user.address.province !== "" && user.address.city !== "" && user.address.barangay !== ""}
        <h4>
          {getRegionName(user.address.region) || "Not set"}. {getProvinceName(
            user.address.province
          ) || "Not set"}.
          {getCityName(user.address.city) || "Not set"}. {getBarangayName(
            user.address.barangay
          ) || "Not set"}.
        </h4>
      {:else}
        <h4>Location Not set</h4>
      {/if}

      <p class="about">
        {user.about}
      </p>
      <div class="connects">
        <button on:click={openFollowingModal}>
          <i class="fa fa-users" />
          {user.following.length} Following
        </button>
        <button on:click={openFollowersModal}>
          <i class="fa fa-users" />
          {user.followers.length} Followers
        </button>
        {#if userID === $userStore._id}
          <button on:click={(e) => (willUpdateProfile = true)}>
            <i style="margin-right: .25rem;" class="fa fa-edit" /> Edit Profile
          </button>
        {:else}
          <Link to={`/user/messages/${userID}`}>
            <button
              ><i
                style="margin-right: .25rem;"
                class="fa fa-commenting"
              />Message</button
            >
          </Link>
          <button on:click={followOrUnfollow}>
            {#if isFollowed}
              <i class="fa fa-user-times" />
            {:else}
              <i class="fa fa-user-plus" />
            {/if}
            {isFollowed ? "Unfollow" : "Follow"}
          </button>
          <button
            on:click|preventDefault={(e) =>
              (willCreateReport = !willCreateReport)}
          >
            <i style="margin-right: .2rem;" class="fa fa-flag" /> Report
          </button>
        {/if}
      </div>
    </section>
  {:else}
    <h2>Loading user</h2>
  {/if}
{/if}

{#if gettingUserPosts}
  <section id="post">
    <h1>Posts</h1>
    <div class="wrapper">
      {#each Array(4) as e}
        <PostCardSkeleton />
      {/each}
    </div>
  </section>
{/if}
{#if !gettingUserPosts}
  {#if posts}
    <section id="post">
      <h1>Posts</h1>
      <div class="wrapper">
        {#each posts as post}
          <PostCard
            on:postDeletedEvent={postDeleted}
            yourPost={post}
            id={post._id}
          />
        {:else}
          <h2>Share anything you like</h2>
        {/each}
      </div>
    </section>
  {/if}
{/if}

<!-- MODAL FOR REPORTING USER -->
{#if willCreateReport}
  <Report type="USER" {userID} close={(e) => (willCreateReport = false)} />
{/if}

<!-- MODAL FOR SHOWING FOLLOWERS|FOLLOWING -->
{#if willOpenModal}
  <FollowersFollowing
    close={(e) => (willOpenModal = false)}
    {whatModal}
    following={user.following}
    followers={user.followers}
  />
{/if}

<!-- MODAL FOR UPDATING PROFILE -->
{#if willUpdateProfile}
  <UpdateProfile
    close={(e) => (willUpdateProfile = false)}
    on:userUpdated={userUpdated}
    {user}
    {regionChange}
    {regions}
    {provinceChange}
    {provinces}
    {cityChange}
    {cities}
    {barangays}
  />
{/if}

<style>
  #header {
    padding: 2rem 1rem;
    margin: 1rem 0;
  }
  #header .about {
    margin-bottom: 1rem;
  }
  #header .connects {
    padding: 0.5rem;
  }
  #header > img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
  }
  #header {
    text-align: center;
  }
  section#post {
    max-width: 1200px;
    margin: 0 auto;
  }
  section#post .wrapper {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
  }
  #header button {
    background-color: blue;
    outline: none;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    margin: 0.2rem;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
  }
</style>
