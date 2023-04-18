<script>
  import Chart from "chart.js/auto";
  import { Jumper } from "svelte-loading-spinners";
  import { onMount } from "svelte";
  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");
  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import moment from "moment";
  import { SkeletonBlock, SkeletonAvatar } from "skeleton-elements/svelte";
  let SKELETON_EFFECT = "wave";

  let gettingDataFromServer = true;
  let dashboardData = {};

  // FOR LOADING INSIGHTS
  onMount(() => {
    fetch(`${backendURL}/api/admin/insights`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dashboardData = data;
        gettingDataFromServer = false;
      })
      .catch((err) => console.log(err));
  });

  let gettingRecentsData = true;
  let recentsData = null;
  // FOR LOADING RECENTS
  onMount(() => {
    fetch(`${backendURL}/api/admin/recents`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        recentsData = data;
        console.log(recentsData);
        gettingRecentsData = false;
      })
      .catch((err) => console.log(err));
  });

  let myChartData = {
    labels: [],
    datasets: [
      {
        label: "POST DATA PER CATEGORY",
        data: [],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(204, 209, 228)",
          "rgb(22, 45, 106)",
          "rgb(255, 140, 50)",
          "rgb(20, 63, 107)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  let config = {
    type: "doughnut",
    data: myChartData,
  };

  let myChart;
  let mostRecievedCategories;
  function initChart() {
    myChart = new Chart(myChart, config);
  }
  let topSearchedCategoriesChart;
  function initTopSearchChart(labels, data) {
    let myChartData = {
      labels: labels,
      datasets: [
        {
          label: "POST DATA PER CATEGORY",
          data: data,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(204, 209, 228)",
            "rgb(22, 45, 106)",
            "rgb(255, 140, 50)",
            "rgb(20, 63, 107)",
            "rgb(115, 60, 60)",
            "rgb(51, 60, 131)",
            "rgb(255, 107, 107)",
          ],
          hoverOffset: 4,
        },
      ],
    };
    let config = {
      type: "doughnut",
      data: myChartData,
    };

    topSearchedCategoriesChart = new Chart(topSearchedCategoriesChart, config);
  }

  function initMostRecievedCategoriesChart(labels, data) {
    let myChartData = {
      labels: labels,
      datasets: [
        {
          label: "POST DATA PER CATEGORY",
          data: data,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(204, 209, 228)",
            "rgb(22, 45, 106)",
            "rgb(255, 140, 50)",
            "rgb(20, 63, 107)",
            "rgb(115, 60, 60)",
            "rgb(51, 60, 131)",
            "rgb(255, 107, 107)",
          ],
          hoverOffset: 4,
        },
      ],
    };
    let config = {
      type: "doughnut",
      data: myChartData,
    };

    mostRecievedCategories = new Chart(mostRecievedCategories, config);
  }

  let gettingAnalyticsData = true;
  let analyticsData = null;
  // FOR LOADING ANALYTICS AND VISUALIZATION
  onMount(() => {
    fetch(`${backendURL}/api/admin/analytics`, {
      mode: "cors",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        analyticsData = data;
        console.log("ANALYTICS", analyticsData);
        gettingAnalyticsData = false;

        if (analyticsData.categoriesData.length > 0) {
          // SETTING DOUGNUT LABELS
          myChartData.labels = analyticsData.categoriesData.map(
            (category) => category.name
          );
          // SETTING DOUGNUT DATA
          myChartData.datasets[0].data = analyticsData.categoriesData.map(
            (category) => category.postsCount
          );
          // INITIALISE THE DOUGHNUT CHART
          initChart();
        }
        if (analyticsData.topSearchCategories.length > 0) {
          const labels = analyticsData.topSearchCategories.map(
            (category) => category.name
          );
          const data = analyticsData.topSearchCategories.map(
            (category) => category.searchsCount
          );
          initTopSearchChart(labels, data);
        }

        if (analyticsData.recievedPostsPerCategory.length > 0) {
          const labels = analyticsData.recievedPostsPerCategory.map(
            (category) => category.name
          );
          const data = analyticsData.recievedPostsPerCategory.map(
            (category) => category.recievedPostsCount
          );
          initMostRecievedCategoriesChart(labels, data);
        }
      })
      .catch((err) => console.log(err));
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/skeleton-elements.css" />
  <title>Dashboard</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="admin-page-title">
      <h1>DASHBOARD</h1>
    </div>

    <section id="insights">
      <div class="introduction-data">
        <div class="data-card member-card">
          <i class="fa fa-users" />
          <h1>
            Members <br />
            <span>
              {#if gettingDataFromServer}
                <Jumper size="60" color="#ffffff" unit="px" duration="1s" />
              {:else}
                {dashboardData.members}
              {/if}
            </span>
          </h1>
        </div>
        <div class="data-card posts-card">
          <i class="fa fa-sticky-note" />
          <h1>
            Posts <br />
            <span>
              {#if gettingDataFromServer}
                <Jumper size="60" color="#ffffff" unit="px" duration="1s" />
              {:else}
                {dashboardData.posts}
              {/if}
            </span>
          </h1>
        </div>
        <div class="data-card reports-card">
          <i class="fa fa-flag" />
          <h1>
            Reports <br />
            <span>
              {#if gettingDataFromServer}
                <Jumper size="60" color="#ffffff" unit="px" duration="1s" />
              {:else}
                {dashboardData.reportedPosts}
              {/if}
            </span>
          </h1>
        </div>
        <div class="data-card admins-card">
          <i class="fa fa-user" />
          <h1>
            Admins <br />
            <span>
              {#if gettingDataFromServer}
                <Jumper size="60" color="#ffffff" unit="px" duration="1s" />
              {:else}
                {dashboardData.admins}
              {/if}
            </span>
          </h1>
        </div>
        <div class="data-card recieved-post-card">
          <i class="fa fa-check-square-o" />
          <h1>
            Recieved Posts <br />
            <span>
              {#if gettingDataFromServer}
                <Jumper size="60" color="#ffffff" unit="px" duration="1s" />
              {:else}
                {dashboardData.recievedPosts}
              {/if}
            </span>
          </h1>
        </div>
      </div>
    </section>

    <section id="recents-activities">
      <!-- RECENT POSTS -->
      <article class="recent-posts">
        <h2>Recent Posts</h2>
        {#if recentsData}
          <table>
            <tr>
              <th>Author</th>
              <th>Title</th>
              <th class="post-description">Description</th>
              <th class="post-likes">Likes</th>
              <th>View</th>
            </tr>
            {#each recentsData.recentPosts as post}
              <tr>
                <td class="author-cell-name">
                  <a
                    href={`${frontendURL}/user/${post.author?._id}`}
                    target="_blank"
                  >
                    <img
                      src={post.author?.avatar}
                      alt={post.author?.firstname}
                    />
                    {post.author?.firstname}
                    {post.author?.lastname}
                  </a>
                </td>
                <td>{post.title}</td>
                <td class="post-description"
                  >{post.description.substring(0, 100)}</td
                >
                <td class="post-likes">{post.likes.length}</td>
                <td>
                  <a href={`${frontendURL}/post/${post._id}`} target="_blank">
                    View post
                  </a>
                </td>
              </tr>
            {/each}
          </table>
        {:else}
          <div class="recent-posts-skeltons">
            <SkeletonBlock
              height="3rem"
              borderRadius=".5rem"
              width="70%"
              effect={SKELETON_EFFECT}
            />
            <SkeletonBlock
              height="3rem"
              borderRadius=".5rem"
              width="80%"
              effect={SKELETON_EFFECT}
            />
            <SkeletonBlock
              height="3rem"
              borderRadius=".5rem"
              width="100%"
              effect={SKELETON_EFFECT}
            />
            <SkeletonBlock
              height="3rem"
              borderRadius=".5rem"
              width="100%"
              effect={SKELETON_EFFECT}
            />
          </div>
        {/if}
      </article>
      <!-- RECENT POSTS END-->

      <section class="recent-comments-user-container">
        <!-- RECENT COMMENTS -->

        <article class="recent-comments">
          <h2>Recent Comments</h2>
          {#if recentsData}
            <table>
              <tr>
                <th>Author</th>
                <th>Comment</th>
                <th>View Posts</th>
              </tr>
              {#each recentsData.recentComments as comment}
                <tr>
                  <td class="author-cell-name">
                    {#if comment.user}
                      <a
                        href={`${frontendURL}/user/${comment.user._id}`}
                        target="_blank"
                      >
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.firstname}
                        />
                        {comment.user.firstname}
                        {comment.user.lastname}
                      </a>
                    {/if}
                  </td>
                  <td>{comment.content}</td>
                  <td>
                    <a
                      href={`${frontendURL}/post/${comment.postId}`}
                      target="_blank"
                    >
                      View post
                    </a>
                  </td>
                </tr>
              {/each}
            </table>
          {:else}
            <div class="recent-comments-skeletons" style="padding: .75rem;">
              <SkeletonBlock
                height="10rem"
                borderRadius=".5rem"
                width="100%"
                effect={SKELETON_EFFECT}
              />
            </div>
          {/if}
        </article>
        <!-- RECENT COMMENTS END-->

        <!-- RECENT USERS -->
        <article class="recent-user">
          <h2>Recent Users</h2>
          {#if recentsData}
            <table>
              <tr>
                <th>Joined At</th>
                <th>Author</th>
                <th>Email</th>
              </tr>
              {#each recentsData.recentMembers as member}
                <tr>
                  <td>{moment(member.createdAt).fromNow()}</td>
                  <td class="author-cell-name">
                    <a
                      href={`${frontendURL}/user/${member._id}`}
                      target="_blank"
                    >
                      <img src={member.avatar} alt={member.firstname} />
                      {member.firstname}
                      {member.lastname}
                    </a>
                  </td>
                  <td>{member.email}</td>
                </tr>
              {/each}
            </table>
          {:else}
            <div class="recent-comments-skeletons" style="padding: .75rem;">
              <SkeletonBlock
                height="10rem"
                borderRadius=".5rem"
                width="100%"
                effect={SKELETON_EFFECT}
              />
            </div>
          {/if}
        </article>
        <!-- RECENT USERS END-->
      </section>
    </section>

    <section id="analytics">
      <h1 style="text-transform: uppercase;">Analytics and Visualization</h1>

      <div class="container">
        <div class="top-sharer-users">
          <div class="top-sharer-userss">
            <h2>Top Sharers</h2>
            {#if analyticsData}
              <table>
                <tr>
                  <th>Name</th>
                  <th>Shared Items</th>
                  <th>View User Profile</th>
                </tr>
                {#each analyticsData.topSharerUsers as member}
                  <tr>
                    <td class="user-profile">
                      <a
                        href={`${frontendURL}/user/${member._id}`}
                        target="_blank"
                      >
                        <img src={member.avatar} alt={member.firstname} />
                        {member.firstname}
                        {member.lastname}
                      </a>
                    </td>
                    <td>{member.postsCount}</td>
                    <td>
                      <a
                        href={`${frontendURL}/user/${member._id}`}
                        target="_blank"
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                {/each}
              </table>
            {:else}
              <div class="top-sharers-skeletons">
                {#each [1, 1, 1, 1, 1] as e}
                  <div class="user-skeleton">
                    <SkeletonAvatar effect={SKELETON_EFFECT} />
                    <SkeletonBlock
                      height="2.25rem"
                      borderRadius="1rem"
                      effect={SKELETON_EFFECT}
                    />
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <div id="chart-container">
          <h2 style="text-align: center;">Post Visualization per Category..</h2>
          <canvas
            class:hide={!analyticsData}
            id="myChart"
            bind:this={myChart}
          />
          {#if !analyticsData}
            <div style="padding: .5rem;display: grid; place-items: center;">
              <SkeletonBlock
                height="25rem"
                width="25rem"
                borderRadius="50%"
                effect={SKELETON_EFFECT}
              />
            </div>
          {/if}
        </div>
      </div>

      <div class="container">
        <div class="top-liked-posts">
          <h2>Most-Liked Posts</h2>
          {#if analyticsData}
            <table>
              <tr>
                <th class="user-profile">Author</th>
                <th>Post Title</th>
                <th>Category</th>
                <th>Likes</th>
                <th>View Post</th>
              </tr>
              {#each analyticsData.topLikedPosts as post}
                <tr>
                  <td class="user-profile">
                    {#if post.author}
                      <a
                        href={`${frontendURL}/user/${post.author._id}`}
                        target="_blank"
                      >
                        <img
                          src={post.author.avatar}
                          alt={post.author.firstname}
                        />
                        {post.author.firstname}
                        {post.author.lastname}
                      </a>
                    {:else}
                      User Not Found
                    {/if}
                  </td>
                  <td>{post.title}</td>
                  <td>{post.category?.name}</td>
                  <td>{post.likes.length}</td>
                  <td>
                    <a href={`${frontendURL}/post/${post._id}`} target="_blank"
                      >View Post</a
                    >
                  </td>
                </tr>
              {/each}
            </table>
          {:else}
            <div class="posts-per-category-skeloton">
              {#each [1, 1, 1, 1, 1] as e}
                <div style="display: flex; gap: .5rem; align-items: center;">
                  <div class="avatar" style="width: 50px; height: 50px">
                    <SkeletonAvatar size={48} effect={SKELETON_EFFECT} />
                  </div>
                  <SkeletonBlock
                    height="2rem"
                    width="20%"
                    borderRadius=".5rem"
                    effect={SKELETON_EFFECT}
                  />
                  <SkeletonBlock
                    height="2rem"
                    width="25%"
                    borderRadius=".5rem"
                    effect={SKELETON_EFFECT}
                  />
                  <SkeletonBlock
                    height="2rem"
                    width="50%"
                    borderRadius=".5rem"
                    effect={SKELETON_EFFECT}
                  />
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <div class="container" style="padding-top: 1rem;">
        <div class="col">
          <h2 style="text-align: center;">Most Searched Categories</h2>
          <canvas
            class:hide={!analyticsData}
            bind:this={topSearchedCategoriesChart}
          />
          {#if !analyticsData}
            <div style="padding: .5rem;display: grid; place-items: center;">
              <SkeletonBlock
                height="25rem"
                width="25rem"
                borderRadius="50%"
                effect={SKELETON_EFFECT}
              />
            </div>
          {/if}
        </div>
        <div class="col">
          <h2 style="text-align: center;">Most Recieved Categories</h2>
          <canvas
            class:hide={!analyticsData}
            bind:this={mostRecievedCategories}
          />
          {#if !analyticsData}
            <div style="padding: .5rem;display: grid; place-items: center;">
              <SkeletonBlock
                height="25rem"
                width="25rem"
                borderRadius="50%"
                effect={SKELETON_EFFECT}
              />
            </div>
          {/if}
        </div>
      </div>
    </section>
  </main>
</section>

<style>
  table {
    border-radius: 0.5rem;
  }
  canvas.hide {
    height: 0;
  }
  .posts-per-category-skeloton {
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .user-skeleton {
    padding: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .recent-posts-skeltons {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .top-liked-posts {
    padding-top: 1rem;
  }
  .top-liked-posts tr {
    display: flex;
  }
  .top-liked-posts th,
  .top-liked-posts td {
    flex: 1;
  }
  .recieved-post-card {
    background-color: #00afc1;
    color: white;
  }
  .member-card {
    background-color: #143f6b;
    color: white;
  }
  .posts-card {
    background-color: #4caf50;
    color: white;
  }
  .reports-card {
    background-color: #f55353;
    color: white;
  }
  .admins-card {
    background-color: #ff8c32;
    color: white;
  }
  .admin-page-title h1 {
    padding-left: 1.5rem;
  }
  .top-sharer-users {
    width: 50%;
  }
  .top-sharer-users th,
  .top-sharer-users td {
    display: flex;
    align-items: center;
  }
  .user-profile a {
    display: flex;
    align-items: center;
  }
  .user-profile img {
    width: 50px;
    border-radius: 50%;
    height: 50px;
    margin-right: 0.5rem;
    display: inline-block;
  }
  #analytics {
    padding: 1rem;
  }
  #analytics h1 {
    padding-bottom: 1rem;
    font-size: 1.5rem;
  }
  #analytics .container {
    display: flex;
    gap: 1rem;
  }
  #analytics .container > * {
    flex: 1;
  }
  .recent-comments-user-container {
    display: flex;
    padding: 1rem;
    gap: 1rem;
  }
  .recent-comments-user-container > * {
    flex: 1;
  }
  .recent-posts {
    padding: 1rem;
  }
  .author-cell-name a {
    display: flex;
    align-items: center;
  }
  .post-description {
    flex: 2;
  }
  .post-likes {
    width: 50px;
    text-align: center;
  }
  .author-cell-name img {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #eeeeee;
  }
  tr {
    display: flex;
  }
  tr:hover {
    background-color: #ddd;
  }
  tr > * {
    flex: 1;
  }
  #chart-container {
    display: block;
    width: 50%;
  }
  * {
    box-sizing: border-box;
  }
  main {
    flex: 2;
  }
  .admin-main-container {
    display: flex;
    height: 100%;
  }
  .introduction-data {
    padding: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .data-card {
    padding: 1.5rem;
    width: calc(calc(100% / 3) - 1rem);
    height: 150px;
    display: grid;
    place-items: center;
    text-align: center;
    display: flex;
    justify-content: space-between;
    border-radius: 0.5rem;
  }
  @media (max-width: 1000px) {
    .data-card {
      padding: 1.5rem;
      width: calc(calc(100% / 2) - 1rem);
      height: 150px;
      display: grid;
      place-items: center;
      text-align: center;
      display: flex;
      justify-content: space-between;
      border-radius: 0.5rem;
    }
  }
  .data-card i {
    flex: 2;
    font-size: 5rem;
  }
  .data-card span {
    font-size: 3.5rem;
  }
</style>
