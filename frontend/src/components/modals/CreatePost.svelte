<script>
  import Modal from "../Modal.svelte";
  import Tags from "svelte-tags-input";
  import mapboxgl from "../../utils/mapbox";
  import { onDestroy, onMount } from "svelte";
  import Categories from "../Categories.svelte";
  export let close,
    createNewPost,
    previewDiv,
    previewImages,
    uploading,
    tags = [];
  export let quantity;

  export let marker;
  let mapContainer;
  let map;
  export let category;

  function load() {
    console.log("load function");
    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [118.7363092274897, 9.790653308703995],
      zoom: 14,
    });
    if (marker) {
      marker.addTo(map);
    }

    map.on("click", function (e) {
      console.log("Map clicked", e);
      const lngLat = e.lngLat.wrap();
      if (!marker) {
        marker = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lngLat.lng, lngLat.lat])
          .addTo(map);

        marker.on("dragend", function (e) {
          console.log("marker dragged", e);
          const newlngLat = marker.getLngLat();
          marker.setLngLat(newlngLat);
        });
      } else {
        marker.setLngLat([lngLat.lng, lngLat.lat]);
      }
    });
  }

  onDestroy(() => {
    if (map) map.remove();
  });

  function handleTags(event) {
    tags = event.detail.tags;
    console.log(tags);
  }

  function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    today = `${yyyy}-${mm}-${dd}`;
    return today;
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css"
    on:load={load}
  />
</svelte:head>

<Modal on:close={close}>
  <h2 slot="header">Create Post</h2>
  <form on:submit|preventDefault={createNewPost}>
    <div>
      <label for="">Title</label>
      <input type="text" name="title" placeholder="What are you sharing?" />
    </div>

    <div>
      <label for="">Say something about your post</label>
      <textarea
        name="description"
        rows="5"
        placeholder="Enter some description"
      />
    </div>

    <div>
      <label for="">Please select category</label>
      <Categories bind:category />
    </div>

    <div class="tags">
      <label for="">Tags</label>
      <Tags
        name="tags"
        {tags}
        onlyUnique={true}
        on:tags={handleTags}
        placeholder="Tags"
      />
    </div>

    <div class="input-container">
      <div>
        <label for="file-input">Choose Images</label>
        <input
          id="file-input"
          name="images"
          accept="images/*"
          on:change={previewImages}
          type="file"
          multiple
        />
      </div>
      <div>
        <label for="quantity-input">Enter Quantity</label>
        <input
          type="number"
          id="quantity-input"
          min="1"
          bind:value={quantity}
        />
      </div>
    </div>

    <div class="expiration-container">
      <label for="postExpirationDate">Expiration Date</label>
      <input
        type="date"
        min={getCurrentDate()}
        name="postExpirationDate"
        id="postExpirationDate"
      />
    </div>

    <div id="preview" bind:this={previewDiv} />

    <div class="map" id="map" bind:this={mapContainer} />

    <button type="submit">
      {uploading ? "Uploading Post" : "Create Post"}
    </button>
  </form>
</Modal>

<style>
  input#postExpirationDate {
    width: 100%;
  }
  .input-container {
    display: flex;
    gap: 0.5rem;
  }
  .input-container > div {
    flex: 1;
  }
  .input-container > div > * {
    display: block;
    width: 100%;
  }
  input[type="file"] {
    width: 100%;
  }
  #map {
    height: 250px;
    width: 100%;
  }
  .tags {
    margin-bottom: 0.5rem;
  }
  .tags :global(.svelte-tags-input-tag) {
    background: #81c784 !important;
  }

  .tags :global(.svelte-tags-input-layout) {
    background: white;
  }
  #preview {
    display: flex;
    justify-content: evenly;
    flex-wrap: wrap;
  }
  textarea,
  input[name="title"] {
    width: 100%;
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
