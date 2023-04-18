<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../Modal.svelte";
  const dispatch = createEventDispatcher();
  import {
    getBarangaysForCity,
    getCitiesForProvince,
    getProvincesForRegion,
  } from "../../json/index.js";
  export let close;
  export let user;
  user.password = "";
  let updatingProfile = false;

  import { getContext } from "svelte";
  const backendURL = getContext("backendURL");

  export let regionChange, regions;
  export let provinceChange, provinces;
  export let cityChange, cities;
  export let barangays;

  let { region, province, city, barangay } = user.address;

  $: provinces = getProvincesForRegion(region);
  $: cities = getCitiesForProvince(province);
  $: barangays = getBarangaysForCity(city);

  let profilePicture;
  let uploadingNewProfile = false;
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
    uploadingNewProfile = true;
    profilePicture.src = URL.createObjectURL(e.target.files[0]);
    const newProfileUrl = await uploadNewProfilePicture(e.target.files[0]);
    user.avatar = newProfileUrl;
    uploadingNewProfile = false;
  }

  async function updateProfile(e) {
    updatingProfile = true;
    if (!uploadingNewProfile) {
      const res = await fetch(`${backendURL}/api/user/`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("access-token"),
        },
        body: JSON.stringify({
          ...user,
          address: { region, province, city, barangay },
        }),
      });
      const data = await res.json();
      updatingProfile = false;
      const updatedUser = {
        avatar: data.newUser.avatar,
        firstname: data.newUser.firstname,
        lastname: data.newUser.lastname,
        address: data.newUser.address,
        about: data.newUser.about,
        email: data.newUser.email,
      };
      dispatch("userUpdated", { updatedUser });
      close();
    }
  }
</script>

<Modal on:close={close}>
  <h1 slot="header">Update Profile Information</h1>
  <form class="update-profile-form" on:submit|preventDefault={updateProfile}>
    <div class="profile-picture">
      <img bind:this={profilePicture} src={user.avatar} alt={user.firstname} />
      <input
        on:change={updateProfileImage}
        type="file"
        name="picture"
        accept="images/*"
      />
    </div>
    <div class="fullname">
      <label>
        Firstname
        <input type="text" bind:value={user.firstname} />
      </label>
      <label>
        Lastname
        <input type="text" bind:value={user.lastname} />
      </label>
    </div>
    <div class="credentials">
      <label>
        Email
        <input name="email" bind:value={user.email} />
      </label>
      <label>
        Password
        <input
          bind:value={user.password}
          type="password"
          placeholder="Enter new Password"
        />
      </label>
    </div>
    <div class="about">
      <label for="about-self">Write something about your self</label>
      <textarea bind:value={user.about} />
    </div>
    <div class="address">
      <label>
        Region
        <select bind:value={region} on:change={regionChange}>
          {#each regions as region}
            <option value={region.regCode}>
              {region.regDesc}
            </option>
          {:else}
            <option value="">Select Region</option>
          {/each}
        </select>
      </label>
      <label>
        Province
        <select bind:value={province} on:change={provinceChange}>
          {#each provinces as province}
            <option value={province.provCode}>
              {province.provDesc}
            </option>
          {:else}
            <option value="">Select Province</option>
          {/each}
        </select>
      </label>
      <label>
        City
        <select bind:value={city} on:change={cityChange}>
          {#each cities as city}
            <option value={city.citymunCode}>
              {city.citymunDesc}
            </option>
          {:else}
            <option value="">Select City</option>
          {/each}
        </select>
      </label>
      <label>
        Barangay
        <select bind:value={barangay}>
          {#each barangays as barangay}
            <option value={barangay.brgyCode}>
              {barangay.brgyDesc}
            </option>
          {:else}
            <option value="">Select barangay</option>
          {/each}
        </select>
      </label>
    </div>
    <button type="submit">
      {uploadingNewProfile
        ? "Uploading Image"
        : updatingProfile
        ? "Updating your profile"
        : "Update Profile"}
    </button>
  </form>
</Modal>

<style>
  form.update-profile-form button[type="submit"] {
    display: block;
    text-align: center;
    margin: 0.75rem auto 0.25rem;
    background-color: blue;
    color: white;
    padding: 0.5rem 1rem;
    outline: none;
    border: none;
  }
  form.update-profile-form .fullname,
  form.update-profile-form .credentials {
    display: flex;
    justify-content: space-between;
  }
  form.update-profile-form .about textarea {
    display: block;
    min-width: 100%;
    min-height: 100px;
    height: 100px;
    width: 100%;
  }
  form.update-profile-form .fullname > *,
  form.update-profile-form .credentials > * {
    width: 49%;
  }
  form.update-profile-form .fullname > * input,
  form.update-profile-form .credentials > * input {
    display: block;
    width: 100%;
  }
  form.update-profile-form .address {
    margin-bottom: 1rem;
  }
  form.update-profile-form .address label,
  form.update-profile-form .address select {
    display: block;
    width: 100%;
  }
  .profile-picture {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .profile-picture input {
    display: inline-block;
    margin: 0.5rem 0;
  }
  .profile-picture img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: inline-block;
  }
</style>
