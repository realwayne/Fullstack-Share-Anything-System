<script>
  import Modal from "../Modal.svelte";
  import { onDestroy } from "svelte";
  import mapboxgl from "../../utils/mapbox";
  import Tags from "svelte-tags-input";
  import Categories from "../Categories.svelte";

  export let close, editPost, yourPost;
  let {
    title,
    description,
    category,
    imageUrls,
    isAvailable,
    coordinates,
    quantity,
    expirationDate,
  } = yourPost;
  let newCategory = category._id;

  let uploadingToCloudinary = false;

  console.log(yourPost);

  async function uploadUpdatedImages(images) {
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

  let tags = yourPost.tags;

  function handleTags(event) {
    tags = event.detail.tags;
    console.log(tags);
  }

  let mapContainer;
  let map;
  let marker = new mapboxgl.Marker().setLngLat([
    coordinates?.lng || 121.774,
    coordinates?.lat || 12.8797,
  ]);
  function load() {
    console.log("load function");
    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [coordinates?.lng || 121.774, coordinates?.lat || 12.8797],
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
          .setLngLat([lngLat?.lng || 121.774, lngLat?.lat || 12.8797])
          .addTo(map);

        marker.on("dragend", function (e) {
          console.log("marker dragged", e);
          const newlngLat = marker.getLngLat();
          marker.setLngLat(newlngLat);
        });
      } else {
        marker.setLngLat([lngLat?.lng || 121.774, lngLat?.lat || 12.8797]);
      }
    });
  }

  onDestroy(() => {
    if (map) map.remove();
  });

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
  <h2 slot="header">Edit Post</h2>
  <form
    on:submit|preventDefault={(e) => {
      if (!uploadingToCloudinary) {
        editPost({
          title,
          description,
          category: newCategory,
          imageUrls,
          isAvailable,
          tags,
          coordinates: marker.getLngLat(),
          quantity,
        });
      }
    }}
  >
    <div>
      <label for="">Title</label>
      <input type="text" name="title" bind:value={title} />
    </div>
    <div>
      <label for="">Say something about your post</label>
      <textarea bind:value={description} name="description" rows="5" />
    </div>
    <div style="display: flex; gap: .5rem;">
      <div style="flex: 1;">
        <label for="">Please select category</label>
        <Categories bind:category={newCategory} />
      </div>
      <div style="flex: 1;">
        <label for="isAvailable">Availabilty</label>
        <select name="isAvailable" bind:value={isAvailable}>
          <option value={true}>Available</option>
          <option value={false}>Not Available</option>
        </select>
      </div>
    </div>
    <div class="tags">
      <label for="">Tags</label>
      <Tags {tags} onlyUnique={true} on:tags={handleTags} placeholder="Tags" />
    </div>

    <div class="input-container">
      <div>
        <label for="file-input">Choose Images</label>
        <input
          name="images"
          accept="images/*"
          type="file"
          multiple
          on:change={async (e) => {
            console.log("BEFORE", imageUrls);
            uploadingToCloudinary = true;
            imageUrls = await uploadUpdatedImages(e.target.files);
            uploadingToCloudinary = false;
            console.log("AFTER", imageUrls);
          }}
        />
      </div>
      <div>
        <label for="quantity-input">Enter Quantity</label>
        <input
          type="number"
          id="quantity-input"
          min="0"
          bind:value={quantity}
        />
      </div>
    </div>

    <div class="expiration-container">
      <label for="postExpirationDate">Expiration Date</label>
      <input
        type="date"
        value={expirationDate?.split("T")[0]}
        min={getCurrentDate()}
        name="postExpirationDate"
        id="postExpirationDate"
      />
    </div>

    <div id="preview">
      {@html imageUrls.map(
        ({ url, public_id }) => `<img src="${url}" alt="${public_id}" />`
      )}
    </div>
    <div class="map" id="map" bind:this={mapContainer} />
    <button type="submit">
      {uploadingToCloudinary ? "Uploading images" : "Edit Post"}
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
  .tags {
    margin-bottom: 0.5rem;
  }
  .tags :global(.svelte-tags-input-tag) {
    background: #81c784 !important;
  }
  #map {
    height: 250px;
    width: 100%;
  }
  .tags :global(.svelte-tags-input-layout) {
    background: white;
  }
  #preview {
    display: flex;
    justify-content: evenly;
    flex-wrap: wrap;
    margin: 0.25rem 0;
  }
  :global(#preview > img) {
    width: calc(100% / 3);
    height: 90px;
  }
  textarea,
  select,
  input[name="title"],
  input[type="file"] {
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
