<script>
  import { SkeletonBlock, SkeletonAvatar } from "skeleton-elements/svelte";
</script>

<div class="chat-skeleton">
  <div class="icon">
    <SkeletonAvatar effect="wave" />
  </div>
  <div class="name">
    <SkeletonBlock effect="wave" />
  </div>
</div>

<style>
  .chat-skeleton {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .name {
    flex: 1;
  }
</style>
