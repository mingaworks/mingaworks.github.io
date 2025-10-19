<script>
  import { onMount, onDestroy } from "svelte";
  import { peekWidth, leftMenuOffset } from "../stores/ui.js";

  let unsubPeek = null;
  let unsubLeft = null;

  function applyVars(peek, left) {
    try {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      if (typeof peek === "number") {
        root.style.setProperty("--peek-width", `${peek}px`);
      }
      if (typeof left === "number") {
        root.style.setProperty("--left-menu-offset", `${left}px`);
      }
    } catch (e) {
      // SSR: gracefully skip DOM updates
    }
  }

  onMount(() => {
    unsubPeek = peekWidth.subscribe((v) => {
      applyVars(v, undefined);
    });
    unsubLeft = leftMenuOffset.subscribe((v) => {
      applyVars(undefined, v);
    });
    // Apply CSS vars immediately so initial paint matches store
    let p, l;
    const upPeek = (v) => (p = v);
    const upLeft = (v) => (l = v);
    const t1 = peekWidth.subscribe(upPeek);
    const t2 = leftMenuOffset.subscribe(upLeft);
    applyVars(p ?? 0, l ?? 64);
    t1();
    t2();
  });

  onDestroy(() => {
    if (unsubPeek) unsubPeek();
    if (unsubLeft) unsubLeft();
  });
</script>

<style>
  /* no visual output */
</style>
