<script>
  import { SkeletonImage, SkeletonBlock } from "skeleton-elements/svelte";
  let SKELETON_EFFECT = "wave";
</script>

<section id="header">
  <SkeletonImage
    effect={SKELETON_EFFECT}
    width="200"
    height="200"
    borderRadius="50%"
  />

  <div class="details">
    <SkeletonBlock effect={SKELETON_EFFECT} width="200px" />
    <SkeletonBlock effect={SKELETON_EFFECT} width="250px" />
    <SkeletonBlock effect={SKELETON_EFFECT} width="450px" />
    <SkeletonBlock effect={SKELETON_EFFECT} width="300px" />
  </div>

  <div class="buttons">
    <SkeletonBlock
      effect={SKELETON_EFFECT}
      width="calc(calc(100% / 3) - 1rem)"
      height="2.25rem"
    />
    <SkeletonBlock
      effect={SKELETON_EFFECT}
      width="calc(calc(100% / 3) - 1rem)"
      height="2.25rem"
    />
    <SkeletonBlock
      effect={SKELETON_EFFECT}
      width="calc(calc(100% / 3) - 1rem)"
      height="2.25rem"
    />
  </div>
</section>

<style>
  #header {
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .buttons {
    display: inline-flex;
    max-width: 400px;
    width: 100%;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .details {
    padding: 0.5rem;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    max-width: 500px;
  }
</style>
