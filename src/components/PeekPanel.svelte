<script>
  import { peekStack, peekPop, closePeek, peekWidth } from "../stores/ui.js";
  import { fly, fade } from "svelte/transition";
  import { derived } from "svelte/store";
  import { onDestroy, afterUpdate } from "svelte";

  // Local copy of peek stack for template rendering.
  let stack = [];
  const unsub = peekStack.subscribe((s) => (stack = s));
  const isOpen = derived(peekStack, ($peekStack) => $peekStack.length > 0);

  // Compute responsive peek width so services content fits without
  // collapsing the left menu; uses viewport heuristics and sensible clamps.
  let desiredWidth = 480; // fallback for SSR

  function computeDesiredWidth() {
    try {
      if (typeof window === "undefined") return desiredWidth;
      const w = window.innerWidth || 1024;
      if (w < 640) {
        // Small screens: nearly full width but allow left menu offset.
        return Math.max(280, Math.floor(w * 0.85));
      }
      // Larger screens: proportionally sized but clamped to avoid excessive width.
      return Math.min(680, Math.max(420, Math.floor(w * 0.36)));
    } catch (e) {
      return desiredWidth;
    }
  }

  // set initial desired width and update on resize
  desiredWidth = computeDesiredWidth();
  let resizeTimer = null;
  if (typeof window !== "undefined") {
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        desiredWidth = computeDesiredWidth();
        // if peek is currently open, update the store so CSS vars change
        peekWidth.update((v) => (v > 0 ? desiredWidth : v));
        resizeTimer = null;
      }, 120);
    };
    window.addEventListener("resize", onResize);
    // cleanup will be performed in onDestroy
    onDestroy(() => {
      window.removeEventListener("resize", onResize);
    });
  }

  let unsubWidth = isOpen.subscribe((open) => {
    try {
      peekWidth.set(open ? desiredWidth : 0);
    } catch (e) {
      // ignore SSR
    }
  });

  function handleBack() {
    // pop last page; if stack becomes empty, close peek
    peekPop();
  }

  function handleClose() {
    closePeek();
  }

  onDestroy(() => {
    unsub();
    unsubWidth();
  });
</script>

{#if stack.length > 0}
  <aside
    class="peek-panel shadow-xl border-l overflow-auto"
    style="background-color:var(--color-surface); border-color:var(--color-border); color:var(--color-text)"
    in:fly={{ x: 20, duration: 220 }}
    out:fade={{ duration: 160 }}
  >
    <div class="p-4 border-b flex items-center justify-between">
      <div class="flex items-center gap-3">
        {#if stack.length > 1}
          <button class="px-3 py-1 text-sm" on:click={handleBack}
            >◀ Back</button
          >
        {/if}
        <h2 class="text-lg font-semibold">
          {#if stack.length}
            {#if stack[stack.length - 1].type === "service"}
              <!-- for individual service entries show the service title (no duplicate prefix) -->
              {stack[stack.length - 1].props.service.title}
            {:else}
              <!-- map peek root types to the Minga.<name> pattern -->
              {#if stack[stack.length - 1].type === "services"}
                Minga.works
              {:else if stack[stack.length - 1].type === "projects"}
                Minga.projects
              {:else if stack[stack.length - 1].type === "hands"}
                Minga.hands
              {:else}
                {stack[stack.length - 1].type}
              {/if}
            {/if}
          {/if}
        </h2>
      </div>
      <div>
        <button class="px-3 py-1 text-lg" on:click={handleClose}>X</button>
      </div>
    </div>

    <div class="p-6">
      {#if stack.length}
        {#if stack[stack.length - 1].type === "service"}
          <div>
            <h3 class="text-xl font-semibold">
              {stack[stack.length - 1].props.service.title}
            </h3>
            <p class="text-sm text-gray-600 mt-2">
              {stack[stack.length - 1].props.service.body}
            </p>
            <div class="mt-6">
              <h4 class="font-semibold">Details</h4>
              <p class="text-sm text-gray-700 mt-2">
                Individual service detail content goes here. Replace or expand
                with images, case studies, or additional UI as needed.
              </p>
            </div>
          </div>
        {:else if stack[stack.length - 1].type === "services"}
          <slot name="services-root" />
        {:else if stack[stack.length - 1].type === "projects"}
          <slot name="projects-root" />
        {:else if stack[stack.length - 1].type === "hands"}
          <slot name="hands-root" />
        {:else}
          <div>Unknown peek page</div>
        {/if}
      {/if}
    </div>
  </aside>
{/if}

<style>
  .peek-panel {
    pointer-events: auto;
    box-sizing: border-box;
    position: relative;
    grid-column: 2;
    height: 100%;
    width: 100%;
    transition:
      width 300ms ease,
      transform 220ms ease;
    z-index: 30; /* sit above left menu (20) and above main content (10) */
    border-left: 1px solid rgba(0, 0, 0, 0.06);
    background: white;
    overflow: auto; /* allow internal scroll inside peek panel */
  }

  @media (max-width: 640px) {
    .peek-panel {
      position: fixed;
      width: calc(100vw - var(--left-menu-offset));
      left: var(--left-menu-offset);
    }
  }
  /* ensure peek panel sits under any global overlays but above main content */
</style>
