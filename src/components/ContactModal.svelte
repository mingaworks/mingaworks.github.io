<script>
  import { onMount } from "svelte";
  import { contactOpen, closeContact } from "../stores/contactModal.js";
  import { fade, scale } from "svelte/transition";

  let open = false;
  const unsubscribe = contactOpen.subscribe((v) => (open = v));

  // Backdrop and Escape handling intentionally simple to avoid
  // coupling with focus-trap libraries; this keeps the modal lightweight.
  function onBackdropClick(e) {
    if (e.target === e.currentTarget) closeContact();
  }

  function onKey(e) {
    if (e.key === "Escape") closeContact();
  }

  onMount(() => {
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unsubscribe();
    };
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    on:click={onBackdropClick}
    on:keydown={(e) => {
      if (e.key === "Escape") closeContact();
    }}
    role="presentation"
    tabindex="-1"
    style="backdrop-filter: blur(4px);"
  >
    <div
      class="absolute inset-0 bg-black bg-opacity-40"
      aria-hidden="true"
      in:fade={{ duration: 160 }}
      out:fade={{ duration: 120 }}
    ></div>

    <div class="relative z-10 w-full max-w-2xl p-6">
      <div
        class="bg-surface rounded-xl shadow-lg relative"
        role="dialog"
        aria-modal="true"
        in:scale={{ start: 0.92, duration: 260 }}
        out:scale={{ start: 0.92, duration: 180 }}
      >
        <div in:fade={{ duration: 200 }}>
          <button
            type="button"
            class="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Close contact form"
            on:click={closeContact}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <form
            id="contact"
            class="max-w-lg mx-auto p-8 rounded-xl shadow-sm"
            style="background-color:var(--color-surface); color:var(--color-text)"
          >
            <h2 class="text-2xl font-semibold text-primary mb-6 text-center">
              Let’s Collaborate
            </h2>
            <input
              type="text"
              placeholder="Your name"
              class="w-full p-3 border rounded mb-4"
            />
            <input
              type="email"
              placeholder="Email or WhatsApp"
              class="w-full p-3 border rounded mb-4"
            />
            <textarea
              placeholder="Tell us about your idea or project"
              class="w-full p-3 border rounded mb-4 h-32"
            ></textarea>
            <button
              type="submit"
              class="w-full py-3 bg-accent text-white font-medium rounded-xl hover:bg-green-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .bg-surface {
    background-color: var(--color-surface);
    color: var(--color-text);
  }
</style>
