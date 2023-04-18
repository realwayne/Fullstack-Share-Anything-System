<script>
  import { DoubleBounce } from "svelte-loading-spinners";

  export let title = "";
</script>

<div class="spinner-backdrop">
  <div class="center">
    <DoubleBounce size="70" color="#4caf50" unit="px" duration="1s" />
    <h3>LOADING {title.toUpperCase()}</h3>
  </div>
</div>

<style>
  .spinner-backdrop {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
  }
  .spinner-backdrop .center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h3 {
    padding-top: 1rem;
  }
</style>
