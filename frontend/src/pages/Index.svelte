<script>
  import { onMount } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import authStore from "../stores/authStore";
  import { Accordion, AccordionItem } from "svelte-accessible-accordion";
  $authStore && navigate("/user");

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  console.log(`${backendURL}/api/data`);

  let usersCount = 0;
  let sharedPosts = 0;
  let availablePosts = 0;
  onMount(() => {
    fetch(`${backendURL}/api/data`)
      .then((res) => res.json())
      .then((data) => {
        usersCount = data.users;
        sharedPosts = data.sharedPosts;
        availablePosts = data.availablePosts;
      })
      .catch((err) => console.log(err));
  });

  let fetchingAuthors = true;
  let authors = [];
  let fetchingAuthorsErrorStatus = null;
  let fetchingAuthorsError = false;
  onMount(() => {
    fetch(`${backendURL}/api/authors`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          fetchingAuthorsErrorStatus = true;
          fetchingAuthorsError = data.errors;
          return;
        }
        authors = data.data.authors;
        fetchingAuthors = false;
      })
      .catch((err) => console.log(err));
  });

  let fetchingFAQS = true;
  let FAQS = [];
  let fetchingFAQSErrorStatus = null;
  let fetchingFAQSError = false;
  onMount(() => {
    fetch(`${backendURL}/api/faq`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          fetchingFAQSErrorStatus = true;
          fetchingFAQSError = data.errors;
          return;
        }
        FAQS = data.data.questions;
        fetchingFAQS = false;
      })
      .catch((err) => console.log(err));
  });
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    crossorigin="anonymous"
  />
  <link rel="stylesheet" href="./css/reset.css" />
  <link rel="stylesheet" href="./css/index.css" />
  <title>FoodSharePH</title>
</svelte:head>

<header class="heroBanner container-fluid">
  <div class="container">
    <div class="row">
      <div class="logo text-center">
        <h1>FoodSharePh</h1>
      </div>
      <div class="h4 sometext col-lg-8 mx-auto">
        <h3 style="text-align: center; font-size: 3rem;">
          Let's start Sharing
        </h3>
      </div>
      <div class="links col-md-10 col-lg-8 col-xl-7 mx-auto text-center">
        <Link
          to={"/login"}
          class="btn btn-success btn-block btn-lg"
          href="login.html"
          role="button"
        >
          Log In
        </Link>
        <Link
          to={"/register"}
          class="btn btn-success btn-block btn-lg"
          href="signup.html"
          role="button"
        >
          Sign Up
        </Link>
      </div>
    </div>
  </div>
</header>

<!-- Features -->
<section class="features-icons bg-success text-center">
  <div class="container">
    <div class="row">
      <div class="col-lg-4">
        <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
          <div class="features-icons-icon d-flex" />
          <h3 class="reason-text">Share your surplus foods</h3>
          <p class="lead mb-0">
            Are you somebody who have tons of surplus foods everytime you eat?
            Share them here at FoodSharePh so it won't go to waste.
          </p>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
          <div class="features-icons-icon d-flex" />
          <h3 class="reason-text">Request others surplus foods</h3>
          <p class="lead mb-0">
            Is it a hardtime right now? Nothing to eat? or just saving up? View
            some of other peoples food and enjoy them later.
          </p>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="features-icons-item mx-auto mb-0 mb-lg-3">
          <div class="features-icons-icon d-flex" />
          <h3 class="reason-text">Help minimize food trash</h3>
          <p class="lead mb-0">
            About 1.3 billion tons of fruits, vegetables, meat, dairy, seafood,
            and grains that either never leave the farm, get lost or spoiled
            during distribution, or are thrown away in hotels, grocery stores,
            restaurants, schools, or home kitchens.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Verse -->
<section class="verse">
  <div class="container-fluid bg-light text-dark">
    <div
      class="row text-center d-flex align-items-center justify-content-center"
    >
      <div class="img1 col-xl-6" />
      <div class="col-xl-6">
        <div class="v1 row">
          <h2 class="col-7 mx-auto">2 Corinthians 9:6-8</h2>
          <div class="col-7 mx-auto">
            Each of you should give what you have decided in your heart to give,
            not reluctantly or under compulsion, for God loves a cheerful giver.
            And God is able to bless you abundantly, so that in all things at
            all times, having all that you need, you will abound in every good
            work.
          </div>
        </div>
      </div>
      <div class="x col-xl-6  ">
        <div class="v2 row">
          <h2 class="col-7 mx-auto">Luke 6:38</h2>
          <div class="col-7 mx-auto">
            Give, and it will be given to you. A good measure, pressed down,
            shaken together and running over, will be poured into your lap. For
            with the measure you use, it will be measured to you.
          </div>
        </div>
      </div>
      <div class="img2 col-xl-6" />
    </div>
  </div>
</section>

<div class="divider py-1 bg-dark" />

<!-- Datas -->
<section class="datasharing bg-light text-center">
  <div class="container">
    <div class="h1">Join us in making a difference</div>
    <div class="row">
      <div class="col-lg-4">
        <div class=" mx-auto mb-5 mb-lg-0 mb-lg-3">
          <div class="h2 text-success">{sharedPosts}</div>
          <p class="lead mb-0">Numbers of Items shared</p>
        </div>
      </div>
      <div class="col-lg-4">
        <div class=" mx-auto mb-5 mb-lg-0 mb-lg-3">
          <div class="h2 text-success">{usersCount}</div>
          <p class="lead mb-0">Users</p>
        </div>
      </div>
      <div class="col-lg-4">
        <div class=" mx-auto mb-0 mb-lg-3">
          <div class="h2 text-success">{availablePosts}</div>
          <p class="lead mb-0">Available Items on the system</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Us -->
<section class="us bg-dark text-center">
  <div class="container">
    <div class="h2 text-center text-success text-uppercase">
      People behind FoodSharePH
    </div>
    <div class="row text-success">
      {#if !fetchingAuthors}
        {#each authors as author}
          <div class="col-lg-4">
            <div class=" mx-auto mb-5 mb-lg-0 mb-lg-3">
              <img
                class="d-inline-block"
                src={author.picture}
                alt={author.fullname}
              />
              <p class="lead mb-0">{author.fullname}</p>
              <p class="mt-4 text-white text-sm">
                <small>{author.shortDescription}</small>
              </p>
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-center text-white">Loading authors</p>
      {/if}
    </div>
  </div>
</section>

<section id="FAQ">
  <h1
    style="text-align: center; padding: 1.5rem 1rem; font-size: 2rem; font-weight: 900;"
  >
    Frequently asked questions
  </h1>
  <div class="container">
    <Accordion multiselect>
      {#each FAQS as faq}
        <AccordionItem title={faq.question}>
          <div class="accordion-item-content">
            <small>{@html faq.answer}</small>
          </div>
        </AccordionItem>
      {/each}
      <!-- <AccordionItem title="What can I share?">
        <div class="accordion-item-content">
          <h2>Foods</h2>
          <strong>
            Most Foods can be shared! but their are some restrictions
          </strong>
          <p>
            Fruits and vegetables can be shared <br />
            Homemade and Leftover foods -- if you are sharing some homemade or leftover
            make sure that the food is not rotten. if you're doubting then better
            share it as Foodwaste to avoid unexpected happenings. <br />
            Instants [Canned, Noodles] -- if your sharing this kind of things make
            sure that its not expired.
          </p>
          <hr />
          <h2>Non-Foods</h2>
          <strong>All non-foods can be shared! ex...</strong>
          <ul>
            <li>Books</li>
            <li>Clothes</li>
            <li>kitchenwares</li>
            <li>Old appliances</li>
            <li>etc...</li>
          </ul>
          <hr />

          <h2>Foodwastes</h2>
          <strong>All kinds of foodwaste can be shared!</strong>
          <p>
            This will be collected by thoes people that are interested in either
            feeding for animals or converting this foodwastes to fertilizers for
            plants...
          </p>
          <hr />
        </div>
      </AccordionItem>
      <AccordionItem title="What can't i share?">
        <div class="accordion-item-content">
          <h2>Foods</h2>
          <strong>Please dont share rotten foods</strong>
          <hr />
          <h2>Non-Foods</h2>
          <strong
            >The following things are not allowed to be shared at the platform</strong
          >
          <ul>
            <li>Drugs</li>
            <li>Cigarretes</li>
            <li>Alcohols</li>
            <li>Fire arms</li>
            <li>Please note to report if found any illegal activities</li>
          </ul>
          <hr />
        </div>
      </AccordionItem>
      <AccordionItem title="Covid 19 Do's / Dont's">
        <div class="accordion-item-content">
          <h1><strong>Do's</strong></h1>
          <p>When picking up the Item make sure to follow social distancing</p>
          <p>
            Practice washing your hands whenever in contact with other people
          </p>
          <p>Always were face mask</p>
          <p>Always have a proper hygiene</p>
          <hr />

          <h1><strong>Dont's</strong></h1>
          <p>
            Dont share or request for things when you have symptoms of covid
          </p>
          <p>Dont go out without wearing mask ang sanitising your hands</p>
          <p>Always were face mask</p>
          <hr />
        </div>
      </AccordionItem> -->
    </Accordion>
  </div>
</section>

<footer>
  <div class="container">
    <div class="row">
      <div class="col-md-4 footer-column">
        <h1 style="font-size: 2rem;">Foodshare.ph</h1>
        <p><small>A platform for sharing</small></p>
      </div>
    </div>

    <div class="row text-center justify-content-between">
      <div class="col-md-4 box">
        <span class="copyright quick-links text-white"
          >Copyright &copy; Your Website
        </span>
      </div>
      <div class="col-md-4 box">
        <ul class="list-inline quick-links">
          <li class="list-inline-item">
            <a href={"#"}>Privacy Policy</a>
          </li>
          <li class="list-inline-item">
            <a href={"#"}>Terms of Use</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>

<style>
  h1,
  h2,
  h3 {
    font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 700;
  }
  #FAQ {
    padding: 3rem 1rem;
  }
  #FAQ :global(button) {
    display: block;
    width: 100%;
    background-color: transparent;
    padding: 1rem;
    text-align: left;
    font-size: 1.2rem;
    font-weight: 800;
    border: none;
    margin: 0.5rem 0;
    border-bottom: 1px solid grey;
  }
  .accordion-item-content {
    padding: 1rem 2rem;
  }

  header.heroBanner {
    position: relative;
    background-color: #09ff00;
    background: url("../images/masterhead.jpg") no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    padding-top: 8rem;
    padding-bottom: 8rem;
  }

  header.heroBanner .sometext {
    padding-top: 2rem;
    padding-bottom: 2rem;
    font-weight: 700;
    text-shadow: 0px 4px 3px rgba(255, 255, 255, 0.4),
      0px 8px 13px rgba(255, 255, 255, 0.1),
      0px 18px 23px rgba(255, 255, 255, 0.1);
  }
  header.heroBanner h1 {
    font-family: "Pacifico", cursive;
    font-size: 5rem;
    color: #047400b9;
    text-shadow: 0px 3px 0px #444444, 0px 14px 10px rgba(0, 0, 0, 0.15),
      0px 24px 2px rgba(0, 0, 0, 0.1), 0px 24px 30px rgba(0, 0, 0, 0.1);
  }
  .features-icons,
  .datasharing,
  .us {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  .reason-text {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .features-icons .features-icons-item {
    max-width: 20rem;
  }

  .datasharing p {
    font-weight: 700;
  }
  .us img {
    height: 250px;
    border-radius: 50%;
    padding: 50px 10px 20px 10px;
  }

  .img1 {
    height: 400px;
    position: relative;
    background-color: #09ff00;
    background: url("../images/photo-1461354464878-ad92f492a5a0.jpg") no-repeat
      center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    padding-top: 8rem;
    padding-bottom: 8rem;
  }
  .img2 {
    height: 400px;
    position: relative;
    background-color: #09ff00;
    background: url("../images/photo-1582213782179-e0d53f98f2ca.jpg") no-repeat
      center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    padding-top: 8rem;
    padding-bottom: 8rem;
  }
  .verse h2 {
    font-family: "Pacifico", cursive;
    font-size: 2rem;
    padding: 2rem;
  }
  .verse {
    font-size: 1.2rem;
  }
  .v1,
  .v2 {
    padding: 2rem;
  }
  @media (max-width: 992px) {
    header.heroBanner h1 {
      font-size: 3rem;
    }
  }
  @media only screen and (max-width: 1200px) {
    .img2 {
      order: 3;
    }
    .x {
      order: 4;
    }
  }

  a {
    color: #ffffff;
    text-decoration: none;
  }

  a:hover {
    color: #ffffff;
    text-decoration: none;
  }
  ::selection {
    background: #ffffff;
    text-shadow: none;
  }
  footer {
    padding: 2rem 0;
    position: relative;
    background-color: #000000;
    color: white;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  .footer-column:not(:first-child) {
    padding-top: 2rem;
  }
  @media (min-width: 768px) {
    .footer-column:not(:first-child) {
      padding-top: 0rem;
    }
  }
  .footer-column {
    text-align: center;
  }

  @media (min-width: 768px) {
    footer .quick-links {
      font-size: 90%;
      line-height: 40px;
      margin-bottom: 0;
      text-transform: none;
      font-family: Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    .copyright {
      color: rgb(0, 0, 0);
    }
  }
</style>
