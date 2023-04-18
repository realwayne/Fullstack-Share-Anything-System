<script>
  import { SkeletonBlock } from "skeleton-elements/svelte";

  let min = 5;
  let max = 20;

  let allignment = Math.round(Math.random());
  let chatSkeletonSize = Math.floor(Math.random() * (max - min)) + min;
</script>

<div class={allignment ? "left" : "right"}>
  <SkeletonBlock
    borderRadius="1rem"
    width={`${chatSkeletonSize}rem`}
    height={`${chatSkeletonSize / 2}rem`}
    effect="wave"
  />
</div>

<style>
  div {
    padding: 0.5rem;
    border-radius: 1rem;
    margin: 0.5rem;
  }
  .left {
    align-self: flex-start;
    background-color: rgb(196, 186, 186);
  }
  .right {
    align-self: flex-end;
    background-color: #81c784;
    text-align: right;
  }
</style>
