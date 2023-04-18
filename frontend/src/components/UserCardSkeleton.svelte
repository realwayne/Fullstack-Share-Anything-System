<script>
  import { SkeletonAvatar, SkeletonBlock } from "skeleton-elements/svelte";
</script>

<div class="user-card-skeleton">
  <div class="avatar">
    <SkeletonAvatar size={120} effect="wave" />
  </div>
  <div class="descriptions">
    <SkeletonBlock
      width="100%"
      borderRadius=".3rem"
      height="1.4rem"
      effect="wave"
    />
    <SkeletonBlock
      width="100%"
      borderRadius=".3rem"
      height="3rem"
      effect="wave"
    />
  </div>
</div>

<style>
  .user-card-skeleton {
    padding: 1rem;
    display: flex;
    gap: 0.25rem;
    width: calc(calc(100% / 3) - 1rem);
  }
  .avatar {
    flex: 1;
  }
  .descriptions {
    padding-top: 0.75rem;
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
</style>
