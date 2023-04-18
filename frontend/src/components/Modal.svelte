<script>
  import { createEventDispatcher, onDestroy } from "svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  let modal;

  const handle_keydown = (e) => {
    if (e.key === "Escape") {
      close();
      return;
    }

    if (e.key === "Tab") {
      // trap focus
      const nodes = modal.querySelectorAll("*");
      const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

      let index = tabbable.indexOf(document.activeElement);
      if (index === -1 && e.shiftKey) index = 0;

      index += tabbable.length + (e.shiftKey ? -1 : 1);
      index %= tabbable.length;

      tabbable[index].focus();
      e.preventDefault();
    }
  };

  const previously_focused =
    typeof document !== "undefined" && document.activeElement;

  if (previously_focused) {
    onDestroy(() => {
      previously_focused.focus();
    });
  }
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="modal-background" on:click|self={close}>
  <div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
    <div class="modal-header"><slot name="header" /></div>
    <br />
    <div class="modal-body">
      <slot />
    </div>
    <br />
  </div>
</div>

<style>
  .modal::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  .modal::-webkit-scrollbar-track {
    background: grey;
  }

  /* Handle */
  .modal::-webkit-scrollbar-thumb {
    background: #4caf50;
  }

  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
  }

  .modal {
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(100vw - 4em);
    max-width: 32em;
    max-height: calc(100vh - 4em);
    overflow: auto;
    transform: translate(-50%, -50%);
    padding: 1em;
    border-radius: 0.2em;
    background: white;
    border-radius: 1rem;
    overflow-x: hidden;
    z-index: 20;
  }

  .modal-header {
    position: relative;
    width: calc(100% + 2rem);
    top: -1rem;
    left: -1rem;
    padding: 1rem;
    background-color: #4caf50;
    color: white;
  }
</style>
