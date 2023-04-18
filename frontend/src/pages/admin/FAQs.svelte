<script>
  import { onMount } from "svelte";
  import { Datatable } from "svelte-simple-datatables";
  import AdminSpinner from "../../components/AdminSpinner.svelte";

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");
  const frontendURL = getContext("frontendURL");

  import AdminSidebar from "../../components/AdminSidebar.svelte";
  import CreateFAQ from "../../components/modals/faqModals/CreateFAQ.svelte";
  import UpdateFAQ from "../../components/modals/faqModals/UpdateFAQ.svelte";

  const settings = { columnFilter: false, blocks: { searchInput: false } };
  let rows;

  let faqs = [];
  onMount(() => {
    getAllFAQs();
  });

  let gettingAllFAQs = false;
  function getAllFAQs() {
    gettingAllFAQs = true;

    fetch(`${backendURL}/api/faq`, {
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        gettingAllFAQs = false;
        faqs = data.data.questions;
      })
      .catch((err) => console.log(err));
  }

  let willCreateNewFAQ = false;
  function addNewFAQ(question, answer) {
    fetch(`${backendURL}/api/faq`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({ question, answer }),
    })
      .then((res) => res.json())
      .then((data) => {
        willCreateNewFAQ = false;
        if (data.status) {
          faqs = [data.data.faq, ...faqs];
        }
      })
      .catch((err) => console.log(err));
  }

  function deleteFAQ(faqID) {
    fetch(`${backendURL}/api/faq/${faqID}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("access-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          // faqs = faqs.filter(
          //   (author) => author._id != data.data.deletedAuthor._id
          // );
          getAllFAQs();
        }
      })
      .catch((err) => console.log(err));
  }

  let willUpdateFAQ = false;
  let faqToUpdate = null;
  function updateFAQ(faqID, question, answer) {
    fetch(`${backendURL}/api/faq/${faqID}`, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("access-token"),
      },
      body: JSON.stringify({ question, answer }),
    })
      .then((res) => res.json())
      .then((data) => {
        willUpdateFAQ = false;
        if (data.status) {
          faqs = faqs.map((faq) => {
            if (faq._id == data.data.faq._id) {
              return data.data.faq;
            } else {
              return faq;
            }
          });
        }
      })
      .catch((err) => console.log(err));
  }
</script>

<svelte:head>
  <title>FAQ's</title>
</svelte:head>

<section class="admin-main-container">
  <AdminSidebar />
  <main>
    <div class="faqs-page-title">
      <h1>FREQUENLTY ASKED QUESTIONS</h1>
      <button
        class="add-author"
        on:click={(e) => (willCreateNewFAQ = !willCreateNewFAQ)}
      >
        <i class="fa fa-plus-circle" />
        Add New Question
      </button>
    </div>
    <div class="table-container">
      <Datatable {settings} data={faqs} bind:dataRows={rows}>
        <thead>
          <th data-key="question">Question</th>
          <th data-key="answer">Answer</th>
          <th data-key="actions">Actions</th>
        </thead>
        <tbody>
          {#if rows}
            {#if gettingAllFAQs}
              <AdminSpinner title="faqs" />
            {:else}
              {#each $rows as row}
                <tr>
                  <td>{row.question}</td>
                  <td>{row.answer.substring(0, 100)}...</td>
                  <td class="post-actions">
                    <button
                      class="edit-btn"
                      on:click={(e) => {
                        faqToUpdate = row;
                        willUpdateFAQ = true;
                      }}
                    >
                      <i class="fa fa-edit" />
                      Edit FAQ
                    </button>
                    <button
                      class="delete-btn"
                      on:click={(e) => deleteFAQ(row._id)}
                    >
                      <i class="fa fa-remove" />
                      Delete FAQ
                    </button>
                  </td>
                </tr>
              {/each}
            {/if}
          {/if}
        </tbody>
      </Datatable>
    </div>
  </main>
</section>

<!-- MODAL FOR CREATING NEW author -->
{#if willCreateNewFAQ}
  <CreateFAQ {addNewFAQ} close={(e) => (willCreateNewFAQ = false)} />
{/if}
<!-- MODAL FOR CREATING NEW author END -->

<!-- MODAL FOR UPDATING   author -->
{#if willUpdateFAQ}
  <UpdateFAQ
    {updateFAQ}
    faq={faqToUpdate}
    close={(e) => (willUpdateFAQ = false)}
  />
{/if}

<!-- MODAL FOR UPDATING author END -->
<style>
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }
  .edit-btn {
    background-color: #143f6b;
    color: white;
    outline: none;
    border-radius: 0.3rem;
  }
  .delete-btn {
    background-color: #f55353;
    color: white;
    outline: none;
    border-radius: 0.3rem;
  }
  .add-author {
    background-color: #4caf50;
    color: white;
    outline: none;
    border-radius: 0.3rem;
    border: none;
  }
  .faqs-page-title {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .faqs-page-title button {
    margin: 0;
  }
  .post-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    align-items: center;
  }
  main {
    flex: 1;
  }
  .admin-main-container {
    display: flex;
    height: 100%;
  }
  td {
    text-align: center;
    padding: 4px 0;
  }
  .admin-main-container {
    display: flex;
    height: 90%;
    width: 100%;
  }
  .table-container {
    height: 90%;
    widows: 90%;
    margin: auto;
  }
  main {
    flex: 1;
    width: calc(100% - 300px);
  }
  main h1 {
    padding: 0.5rem 1rem;
  }
  :global(#svelte-simple-datatable section.dt-search) {
    margin: 0;
    padding: 0;
  }
  :global(#svelte-simple-datatable section.dt-search input) {
    min-width: 300px;
  }
</style>
