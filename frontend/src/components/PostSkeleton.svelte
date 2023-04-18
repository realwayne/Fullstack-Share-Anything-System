<script>
  import {
    SkeletonImage,
    SkeletonAvatar,
    SkeletonBlock,
  } from "skeleton-elements/svelte";

  let SKELETON_EFFECT = "wave";
</script>

<div class="wrapper">
  <div class="card">
    <div class="images">
      <SkeletonImage width="1200" height="500" effect={SKELETON_EFFECT} />
    </div>
    <div class="author-actions-container">
      <div class="author">
        <div class="icon"><SkeletonAvatar effect={SKELETON_EFFECT} /></div>
        <div class="name"><SkeletonBlock effect={SKELETON_EFFECT} /></div>
      </div>
      <div class="actions">
        <SkeletonBlock
          height="2rem"
          width="calc(100% / 3)"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          height="2rem"
          width="calc(100% / 3)"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          height="2rem"
          width="calc(100% / 3)"
          effect={SKELETON_EFFECT}
        />
      </div>
    </div>

    <SkeletonBlock height="4rem" effect={SKELETON_EFFECT} />

    <br />
    <hr />
    <br />

    <div class="map">
      <SkeletonBlock height="15rem" effect={SKELETON_EFFECT} />
    </div>
    <div class="comments">
      {#each Array(6) as e}
        <div class="comment">
          <div class="icon"><SkeletonAvatar effect={SKELETON_EFFECT} /></div>
          <div class="name"><SkeletonBlock effect={SKELETON_EFFECT} /></div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .comment {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .comments {
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .wrapper {
    max-width: 1200px;
    width: 100%;
    margin: 2rem auto;
  }
  .author-actions-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .author {
    display: flex;
    align-items: center;
  }
  .icon {
    padding-right: 1rem;
  }
  .name {
    flex: 1;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
