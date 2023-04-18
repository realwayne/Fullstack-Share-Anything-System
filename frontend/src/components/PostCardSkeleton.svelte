<script>
  import {
    SkeletonImage,
    SkeletonAvatar,
    SkeletonBlock,
  } from "skeleton-elements/svelte";

  let SKELETON_EFFECT = "wave";
</script>

<div class="post">
  <div class="images">
    <SkeletonImage height="250" width="576" effect={SKELETON_EFFECT} />
  </div>
  <div class="descriptions">
    <div class="icon">
      <SkeletonAvatar effect={SKELETON_EFFECT} />
    </div>
    <div class="name">
      <SkeletonBlock width="50%" height="1.5rem" effect={SKELETON_EFFECT} />
    </div>
  </div>
  <SkeletonBlock width="70%" effect={SKELETON_EFFECT} />
  <br />
  <SkeletonBlock width="100%" effect={SKELETON_EFFECT} />
  <div class="buttons">
    <SkeletonBlock height="2rem" width="100%" effect={SKELETON_EFFECT} />
  </div>
</div>

<style>
  .post {
    width: calc(calc(100% / 2) - 1rem);
    margin: 0.5rem;
  }
  .images {
    height: 250px;
  }
  .descriptions {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
  }
  .icon {
    margin-right: 0.1rem;
  }
  .name {
    flex: 1;
  }
  .buttons {
    padding: 0.25rem 0;
  }
</style>
