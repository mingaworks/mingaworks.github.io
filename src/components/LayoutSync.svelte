<script>
  import { onMount, onDestroy } from 'svelte';
  import { peekWidth, leftMenuOffset } from '../stores/ui.js';

  let unsubPeek = null;
  let unsubLeft = null;

  function applyVars(peek, left) {
    try {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      if (typeof peek === 'number') {
        root.style.setProperty('--peek-width', `${peek}px`);
      }
      if (typeof left === 'number') {
        root.style.setProperty('--left-menu-offset', `${left}px`);
      }
    } catch (e) {
      // noop in SSR
    }
  }

  onMount(() => {
    unsubPeek = peekWidth.subscribe((v) => {
      applyVars(v, undefined);
    });
    unsubLeft = leftMenuOffset.subscribe((v) => {
      applyVars(undefined, v);
    });
    // initial apply
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

<!-- This component only runs on the client and syncs layout stores to CSS variables -->

<style>
  /* no visual output */
</style>
