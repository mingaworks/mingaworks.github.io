<script>
  import { onMount, onDestroy } from "svelte";
  import { fly } from 'svelte/transition';
  import { get } from "svelte/store";
  import { leftMenuOffset, peekStack } from "../stores/ui.js";
  import { contactOpen } from '../stores/contactModal.js';
  import theme, { toggleTheme } from '../stores/theme.js';

  let menuEl;
  let measureEl;
  // focused menu key for keyboard/aria
  let focusedKey = null;
  // hovered menu item (for pointer hover on individual items)
  let hoveredKey = null;
  // whether the left menu is expanded (true when hovered or keyboard-focused)
  let expanded = false;
  // whether any peek panel is open; when true, keep the left menu expanded
  let peekOpen = false;
  // decide if a key shows the Minga prefix (keyboard focus or route match only)
  function showMingaFor(key) {
    // map visual keys to routes
    const routeMap = {
      base: "/",
      works: "/works",
      projects: "/projects",
      hands: "/hands",
    };

  // focused by keyboard or route match (hover no longer triggers the Minga prefix)
  const isFocused = focusedKey === key;
    let routeMatch = false;
    if (typeof window !== "undefined") {
      try {
        routeMatch = window.location.pathname === routeMap[key];
      } catch (e) {
        routeMatch = false;
      }
    }

    return isFocused || routeMatch;
  }

  // visual focus (used for styling) should include hovered items and keyboard focus
  function isVisuallyFocused(key) {
    const isFocused = focusedKey === key;
    const isHovered = hoveredKey === key;
    // route match should also count as visual focus for the active page
    let routeMatch = false;
    if (typeof window !== "undefined") {
      try {
        const routeMap = { base: '/', works: '/works', projects: '/projects', hands: '/hands' };
        routeMatch = window.location.pathname === routeMap[key];
      } catch (e) {
        routeMatch = false;
      }
    }
    return isFocused || isHovered || routeMatch;
  }

  const COLLAPSED_WIDTH = 64;

  function measureAndSetOffset(isExpanded = false) {
    try {
      if (typeof window === "undefined") return;
      requestAnimationFrame(() => {
        if (!isExpanded) {
          // collapsed state — keep compact width so layout doesn't reserve expanded space
          leftMenuOffset.set(COLLAPSED_WIDTH);
          if (menuEl) {
            menuEl.style.width = `${COLLAPSED_WIDTH}px`;
            menuEl.style.minWidth = `${COLLAPSED_WIDTH}px`;
            menuEl.style.maxWidth = `${COLLAPSED_WIDTH}px`;
          }
          return;
        }

        // expanded: measure based on the hidden measurement element (intrinsic
        // content) so the menu grows to a stable target width. The measurement
        // element is a full sample of a menu item (icon + padding + label), so
        // it reflects the true rendered width and we don't add any manual
        // padding buffers which hardcode spacing assumptions.
          let contentIntrinsic = COLLAPSED_WIDTH;
          if (measureEl) {
            const children = Array.from(measureEl.children || []);
            for (const c of children) {
              try {
                contentIntrinsic = Math.max(contentIntrinsic, c.scrollWidth || 0);
              } catch (e) {}
            }
          }

          // add a small buffer to allow breathing room for padding/icons
          const EXTRA_BUFFER = 28; // px
          contentIntrinsic += EXTRA_BUFFER;

        // available width and clamping
        const available = Math.max(window.innerWidth, 0);
          const max = Math.min(available * 0.7, 720);
          const min = 180; /* slightly larger minimum so the left menu is roomier */
          // clamp measured width between min and max
          const measured = Math.min(Math.max(contentIntrinsic, min), max);

        // write to store; LayoutSync syncs to CSS vars
        leftMenuOffset.set(measured);

        if (menuEl) {
          menuEl.style.maxWidth = `${max}px`;
          menuEl.style.minWidth = `${min}px`;
          // animate to measured width
          menuEl.style.width = `${measured}px`;
        }
      });
    } catch (e) {
      // ignore in SSR
    }
  }

  const ICONS = {
    base: `/icons/base.svg`,
    works: `/icons/works.svg`,
    projects: `/icons/project.svg`,
    hands: `/icons/hands.svg`,
  };

  // canonical visible labels used across the menu; used by the hidden
  // measurement element to compute the widest required menu width.
  // Menu items no longer change to the 'Minga.*' prefix — that pattern is
  // reserved exclusively for the PeekPanel title. Keep measurement labels in
  // the short form to match the visible text.
  const MENU_LABELS = [
    '.base',
    '.works',
    '.projects',
    '.hands'
  ];

  // measure on mount and on resize
  onMount(() => {
    // initial measurement
    // collapsed by default
    measureAndSetOffset(false);

    // re-measure on window resize
    let resizeTimer = null;
    const debouncedMeasure = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measureAndSetOffset(expanded);
        resizeTimer = null;
      }, 100);
    };
    if (typeof window !== "undefined")
      window.addEventListener("resize", debouncedMeasure);

    return () => {
      if (typeof window !== "undefined")
        window.removeEventListener("resize", debouncedMeasure);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  });

  // subscribe to peekStack so the left menu stays expanded while a peek panel is open
  const unsubPeek = peekStack.subscribe((s) => {
    const open = (s.length || 0) > 0;
    peekOpen = open;
    try {
      if (open) {
        // force expanded state when a peek is open
        expanded = true;
        measureAndSetOffset(true);
      } else {
        // when peek closes, restore hover/focus-driven behavior; if the
        // cursor is currently over the menu or focus is inside, keep expanded
        if (typeof window !== 'undefined') {
          const shouldExpand = menuEl && (menuEl.matches(':hover') || menuEl.contains(document.activeElement));
          expanded = !!shouldExpand;
          measureAndSetOffset(expanded);
        }
      }
    } catch (e) {
      // ignore SSR
    }
  });

  // if the contact modal opens, collapse/unfocus the left menu so it doesn't
  // visually compete with the modal. This also removes keyboard focus from
  // the menu to ensure modal receives focus.
  const unsubContact = contactOpen.subscribe((open) => {
    if (!open) return;
    try {
      expanded = false;
      hoveredKey = null;
      focusedKey = null;
      measureAndSetOffset(false);
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        // blur any focused element to avoid keeping the menu visually expanded
        document.activeElement.blur();
      }
    } catch (e) {
      // ignore SSR
    }
  });

  onDestroy(() => {
    try { unsubPeek(); } catch (e) {}
    try { unsubContact(); } catch (e) {}
  });

  function handleSelect(service) {
    // set selectedService handled by store caller; closeMenu kept separate
    // For now, keep selection in store
    // Do nothing else; the host page may react to selectedService
  }
</script>

<div class="left-menu" style="grid-column: 1 / 2;">
  <div
    class="menu-inner transition-all duration-300 ease-in-out shadow-lg pointer-events-auto flex flex-col min-w-0 box-border"
    class:expanded={expanded}
    bind:this={menuEl}
    role="navigation"
    aria-label="Left menu"
    style="height: 100%; box-sizing: border-box; position: relative;"
    on:mouseenter={() => {
      expanded = true;
      measureAndSetOffset(true);
    }}
    on:mouseleave={() => {
      // only collapse when no keyboard focus is present AND no peek panel is open
      if (peekOpen) return;
      expanded = false;
      hoveredKey = null;
      measureAndSetOffset(false);
    }}
    on:focusin={() => {
      expanded = true;
      measureAndSetOffset(true);
    }}
    on:focusout={(e) => {
      // if focus moved outside the menu, collapse
      const related = e.relatedTarget;
      if (!menuEl.contains(related) && !peekOpen) {
        expanded = false;
        hoveredKey = null;
        measureAndSetOffset(false);
      }
    }}
  >
    <!-- hidden measurement element: renders a full sample menu item (icon + label)
         so expansion width accounts for icon + gaps + label naturally. Kept
         visually hidden and absolute so it doesn't affect layout. -->
    <div aria-hidden="true" bind:this={measureEl} class="invisible absolute left-0 top-0 pointer-events-none" style="position:absolute; width:auto; white-space:nowrap;">
      {#each MENU_LABELS as label}
        <span style="display:inline-flex; align-items:center; gap:8px; padding:8px 12px;">
          <!-- measurement icon size to match visible icons (24px) -->
          <img src="/icons/project.svg" alt="" style="width:24px;height:24px;display:inline-block;" class="menu-icon" />
          <span class="menu-label">{label}</span>
        </span>
      {/each}
    </div>
    <nav class="p-3 flex-1 overflow-auto min-w-0">
      <ul class="space-y-2">
        <!-- Top: .base as primary home link -->
        <li>
          <a
            href="/"
            class="block p-2 rounded font-medium flex items-center"
            style="background-color:transparent"
            on:mouseenter={() => { hoveredKey = 'base'; expanded = true; measureAndSetOffset(true); }}
            on:mouseleave={() => (hoveredKey = null)}
            on:focus={() => (focusedKey = "base")}
            on:blur={() => (focusedKey = null)}
          >
            <img
              src={ICONS.base}
              alt=""
              class="inline-block w-6 h-6 mr-2 align-middle menu-icon"
              aria-hidden="true"
              class:active={isVisuallyFocused('base')}
            />
            <span class="menu-label" class:focused={isVisuallyFocused('base')} class:faded={!isVisuallyFocused('base')} aria-hidden={!expanded}>
              .base
            </span>
          </a>
        </li>

        <!-- Rest of the menu -->
        <li>
          <button
            class="w-full text-left p-2 rounded flex items-center"
            on:click={() => {
              // toggle the services page in the peek stack root
              import("../stores/ui.js").then(
                ({ openPeek, closePeek, peekStack }) => {
                  const s = get(peekStack);
                  const top = s[s.length - 1];
                  if (top && top.type === "services") {
                    closePeek();
                  } else {
                    openPeek("services");
                  }
                },
              );
            }}
            on:mouseenter={() => { hoveredKey = 'works'; expanded = true; measureAndSetOffset(true); }}
            on:mouseleave={() => (hoveredKey = null)}
            on:focus={() => (focusedKey = "works")}
            on:blur={() => (focusedKey = null)}
          >
            <img
              src={ICONS.works}
              alt=""
              class="inline-block w-6 h-6 mr-2 align-middle menu-icon"
              aria-hidden="true"
              class:active={isVisuallyFocused('works')}
            />
            <span class="menu-label" class:focused={isVisuallyFocused('works')} class:faded={!isVisuallyFocused('works')} aria-hidden={!expanded}>
              .works
            </span>
          </button>
        </li>

        <li>
          <button
            class="w-full text-left p-2 rounded flex items-center"
            on:click={() =>
              import("../stores/ui.js").then(
                ({ openPeek, closePeek, peekStack }) => {
                  const s = get(peekStack);
                  const top = s[s.length - 1];
                  if (top && top.type === "projects") {
                    closePeek();
                  } else {
                    openPeek("projects");
                  }
                },
              )}
            on:mouseenter={() => { hoveredKey = 'projects'; expanded = true; measureAndSetOffset(true); }}
            on:mouseleave={() => (hoveredKey = null)}
            on:focus={() => (focusedKey = "projects")}
            on:blur={() => (focusedKey = null)}
          >
            <img
              src={ICONS.projects}
              alt=""
              class="inline-block w-6 h-6 mr-2 align-middle menu-icon"
              aria-hidden="true"
              class:active={isVisuallyFocused('projects')}
            />
            <span class="menu-label" class:focused={isVisuallyFocused('projects')} class:faded={!isVisuallyFocused('projects')} aria-hidden={!expanded}>
              .projects
            </span>
          </button>
        </li>

        <li>
          <button
            class="w-full text-left p-2 rounded flex items-center"
            on:click={() =>
              import("../stores/ui.js").then(
                ({ openPeek, closePeek, peekStack }) => {
                  const s = get(peekStack);
                  const top = s[s.length - 1];
                  if (top && top.type === "hands") {
                    closePeek();
                  } else {
                    openPeek("hands");
                  }
                },
              )}
            on:mouseenter={() => { hoveredKey = 'hands'; expanded = true; measureAndSetOffset(true); }}
            on:mouseleave={() => (hoveredKey = null)}
            on:focus={() => (focusedKey = "hands")}
            on:blur={() => (focusedKey = null)}
          >
            <img
              src={ICONS.hands}
              alt=""
              class="inline-block w-6 h-6 mr-2 align-middle menu-icon"
              aria-hidden="true"
              class:active={isVisuallyFocused('hands')}
            />
            <span class="menu-label" class:focused={isVisuallyFocused('hands')} class:faded={!isVisuallyFocused('hands')} aria-hidden={!expanded}>
              .hands
            </span>
          </button>
        </li>
      </ul>

      <!-- left menu no longer renders the services submenu; all content is shown in the PeekPanel stack -->
    </nav>
    {#if expanded}
      <!-- Theme toggle (only visible when menu is expanded) -->
      <div class="p-3" style="background-color:var(--color-surface); border-color:transparent">
        <!-- align the toggle to the right side of the expanded menu -->
            <div class="flex items-center justify-end" style="width:100%; padding-right:6px;">
              <!-- animate entrance from the right with a small fade/slide -->
              <div in:fly={{ x: 8, duration: 220 }} out:fly={{ x: 8, duration: 180 }}>
          <button
            class="relative inline-flex items-center h-7 w-14 rounded-full transition-colors focus:outline-none"
            on:click={() => toggleTheme()}
            aria-label="Toggle theme"
            style="outline-color:transparent"
          >
            <span class="sr-only">Toggle theme</span>
            <!-- track -->
            <span class="absolute inset-0 transition-colors rounded-full" style="background-color:var(--color-switch-track)"></span>
            <!-- knob -->
            <span class="relative z-10 inline-block h-6 w-6 transform rounded-full shadow transition-transform duration-200 ease-in-out"
              class:translate-x-7={$theme === 'dark'}
              style="left: 4px; background-color:var(--color-switch-knob);"
            >
              <!-- icon inside knob -->
              {#if $theme === 'dark'}
                <img src="/icons/moon.svg" alt="Dark" class="w-4 h-4 m-1 menu-icon toggle-icon" aria-hidden="true" />
              {:else}
                <img src="/icons/sun.svg" alt="Light" class="w-4 h-4 m-1 menu-icon toggle-icon" aria-hidden="true" />
              {/if}
            </span>
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* ensure the menu sits on top */
  .left-menu {
    width: auto;
    z-index: 20; /* keep left menu beneath peek (30) and above main (10) */
    grid-column: 1;
  }

  /* menu label transition: keep labels in the DOM to avoid mounting flashes,
     but animate opacity and translate when the menu expands/collapses. */
  .menu-label {
    display: inline-block;
    transform-origin: left center;
    transition: opacity 180ms ease, transform 220ms cubic-bezier(.2,.9,.2,1);
    opacity: 1;
    transform: translateX(0) scaleX(1);
    white-space: nowrap;
  }

  /* hidden state: visually collapse but keep in DOM */
  .menu-inner:not(.expanded) .menu-label {
    opacity: 0;
    transform: translateX(-6px) scaleX(.98);
    pointer-events: none;
  }

  /* when expanded, ensure labels are visible */
  .menu-inner.expanded .menu-label {
    opacity: 1;
    transform: translateX(0) scaleX(1);
    pointer-events: auto;
  }
  /* animate width explicitly for smoother transitions */
  .menu-inner {
    transition:
      width 300ms ease-in-out,
      max-width 300ms ease-in-out;
    /* max-width is controlled via inline style set by measurement logic */
    min-width: 64px;
    box-sizing: border-box;
    /* don't force overflow hidden here — allow the menu content to be visible
       during transitions so text doesn't get clipped by the inner wrapper. */
    overflow: visible;
    z-index: 20; /* keep left menu beneath peek (30) and above main (10) */
   /* use the shared semantic border token so both light and dark themes
     render the separator consistently. Also ensure the menu surface is
     explicitly set so the border contrasts against it in both themes. */
   background-color: var(--color-surface);
   border-right: 1px solid var(--color-border);
   /* subtle dual inset shadow to make the separator perceptible on both
     light and dark backgrounds (dark tint + light tint) */
   box-shadow: inset -1px 0 0 0 rgba(0,0,0,0.06), inset -1px 0 0 0 rgba(255,255,255,0.04);
  }
  /* allow nav text to wrap so long item labels can fit instead of being cropped */
  .left-menu nav a,
  .left-menu nav button {
    /* Prefer a single line with ellipsis; measurement logic will grow the menu
       when expanded so labels can be visible. This prevents aggressive
       breaking of words (e.g., "Minga.works" splitting into many lines).
    */
    /* prefer a single line with ellipsis, but allow the layout to grow when
       expanded; don't force hard wrapping rules that might interact poorly
       with the grid sizing. */
   /* prefer a single line with ellipsis, but allow wrapping when the layout
     requires it (e.g., very narrow screens). We set nowrap by default so
     measurement is consistent, but allow overflow to auto if necessary. */
   white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: normal;
    overflow-wrap: normal;
  }

  /* label inside menu items (hidden when collapsed) */
  .menu-label {
    display: inline-block;
    /* match the menu's duration so labels animate in sync with the column resize */
    transition: opacity 300ms ease, transform 300ms ease, color 300ms ease;
    opacity: 1;
    transform: translateX(0);
    color: var(--color-text);
    margin-left: 4px;
  }

  /* faded labels for non-focused items when an item is focused/hovered */
  .menu-label.faded {
    opacity: 0.35;
    color: var(--color-muted);
  }

  /* focused label gets emphasis */
  .menu-label.focused {
    opacity: 1;
    color: var(--color-primary);
    font-weight: 600;
  }

  /* ensure nav can shrink inside flex containers when necessary */
  .left-menu nav {
    min-width: 0;
  }
  /* remove visible border on the separator above the theme toggle */
  .left-menu .p-3 {
    border-top: 0 none transparent;
  }

  /* Icon theming: many icons are monochrome SVGs. Use `filter` and `opacity`
     to adapt them for light/dark themes instead of relying on `color` which
     does not apply to <img> raster/SVG elements. */
  .menu-icon {
    /* ensure the icon takes the current foreground sizing */
    display: inline-block;
    width: 1.5rem; /* tailwind w-6 */
    height: 1.5rem; /* tailwind h-6 */
    object-fit: contain;
    /* default (light): slightly muted */
    opacity: 0.95;
    filter: none;
    transition: filter 200ms ease, opacity 200ms ease, transform 200ms ease;
  }

  /* active/selected icon color */
  .menu-icon.active {
    /* use a subtle transform for emphasis and higher opacity */
    transform: translateY(-1px);
    opacity: 1;
    /* tint using a CSS filter that approximates the --color-primary */
    /* This keeps icons visible when they are bitmap/svg images. */
    filter: drop-shadow(0 0 0 var(--color-primary)) saturate(1.25) brightness(1);
  }

  /* Theme-specific adjustments: in dark mode icons should be lighter */
  :global(.dark) .menu-icon {
    /* lighten icons for dark background */
    opacity: 0.95;
    /* for monochrome SVGs that are black, invert to make them light */
    filter: invert(1) grayscale(1) contrast(90%);
  }

  /* but keep the active tint in dark mode using primary color overlay */
  :global(.dark) .menu-icon.active {
    filter: invert(1) grayscale(1) contrast(90%) drop-shadow(0 0 0 var(--color-primary));
  }

  /* smaller icons inside the theme toggle knob */
  .toggle-icon {
    width: 1rem;
    height: 1rem;
    object-fit: contain;
    filter: none;
  }
</style>
