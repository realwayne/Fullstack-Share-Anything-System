<script>
  import { Route, Router } from "svelte-routing";

  import Navbar from "./components/Navbar.svelte";
  import NotFound from "./pages/404.svelte";

  // PUBLIC PAGES
  import ForgotPassword from "./pages/ForgotPassword.svelte";
  import ResetPassword from "./pages/ResetPassword.svelte";
  import Index from "./pages/Index.svelte";
  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";
  import AccountActivation from "./pages/AccountActivation.svelte";
  // PUBLIC PAGES END

  // USER PAGES
  import Find from "./pages/user/Find.svelte";
  import Home from "./pages/user/Home.svelte";
  import Message from "./pages/user/message/Message.svelte";
  import Messages from "./pages/user/Messages.svelte";
  import Requests from "./pages/user/Requests.svelte";
  import People from "./pages/user/People.svelte";
  import Post from "./pages/user/post/Post.svelte";
  import Profile from "./pages/user/profile/Profile.svelte";
  // USER PAGES END

  // ADMIN PAGES
  import AdminIndex from "./pages/admin/Index.svelte";
  import Admins from "./pages/admin/Admins.svelte";
  import Members from "./pages/admin/Members.svelte";
  import Categories from "./pages/admin/Categories.svelte";
  import Posts from "./pages/admin/Posts.svelte";
  import Comments from "./pages/admin/Comments.svelte";
  import Reports from "./pages/admin/Reports.svelte";
  import Authors from "./pages/admin/Authors.svelte";
  import FaQs from "./pages/admin/FAQs.svelte";
  // ADMIN PAGES END

  // STORES
  import userStore from "./stores/userStore";
  import authStore from "./stores/authStore";
  import ROLE from "./stores/roleStore";
  // STORES END

  // SETTING URL CONTEXT
  import { setContext } from "svelte";
  setContext("frontendURL", "http://localhost:5000");
  setContext("backendURL", "http://localhost:1000");
  // setContext("frontendURL", "https://eloquent-leavitt-4d0ce5.netlify.app/");
  // setContext("backendURL", "https://foodshareph.herokuapp.com");

  // console.log("App page", $authStore, $userStore, $ROLE);
  console.log("App page", $authStore, $ROLE);
</script>

<Router>
  {#if $authStore}
    <Navbar />
    {#if $ROLE != 3}
      <!-- ADMIN PAGES -->
      <Route path="/admin/"><AdminIndex /></Route>
      <Route path="/admin/members"><Members /></Route>
      <Route path="/admin/categories"><Categories /></Route>
      <Route path="/admin/posts"><Posts /></Route>
      <Route path="/admin/comments"><Comments /></Route>
      <Route path="/admin/reports"><Reports /></Route>
      <Route path="/admin/faqs"><FaQs /></Route>
      <!-- ADMIN PAGES ONLY -->

      <!-- SUPER ADMIN PAGES ONLY -->
      {#if $ROLE == 1}
        <Route path="/admin/admins"><Admins /></Route>
        <Route path="/admin/authors"><Authors /></Route>
      {/if}
      <!-- SUPER ADMIN PAGES ONLY END-->

      <!-- USER PAGES ARE ACCESSABLE BY ADMINS ASWELL  -->
      <Route path="/user"><Home /></Route>
      <Route path="/user/find"><Find /></Route>
      <Route path="/user/people"><People /></Route>
      <Route path="/user/messages"><Messages /></Route>
      <Route path="/user/requests"><Requests /></Route>
      <Route path="/post/:postID" let:params>
        <Post postID={params.postID} />
      </Route>
      <Route path="/user/messages/:messageID" let:params>
        <Message messageID={params.messageID} />
      </Route>
      <Route path="/user/:userID" let:params>
        <Profile userID={params.userID} />
      </Route>
      <!--user pages  end-->

      <!-- 404 page -->
      <Route component={NotFound} />
    {:else}
      <Route path="/user"><Home /></Route>
      <Route path="/user/find"><Find /></Route>
      <Route path="/user/people"><People /></Route>
      <Route path="/user/messages"><Messages /></Route>
      <Route path="/user/requests"><Requests /></Route>

      <Route path="/post/:postID" let:params>
        <Post postID={params.postID} />
      </Route>
      <Route path="/user/messages/:messageID" let:params>
        <Message messageID={params.messageID} />
      </Route>
      <Route path="/user/:userID" let:params>
        <Profile userID={params.userID} />
      </Route>

      <Route component={NotFound} />
    {/if}
  {:else}
    <Route path="/" component={Index} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/account-activation/:userID/:token" let:params>
      <AccountActivation userID={params.userID} token={params.token} />
    </Route>

    <Route path="/forgot-password"><ForgotPassword /></Route>
    <Route path="/forgot-password/:token" let:params>
      <ResetPassword userID={params.token} token={params.token} />
    </Route>
    <Route component={NotFound} />
  {/if}
</Router>
