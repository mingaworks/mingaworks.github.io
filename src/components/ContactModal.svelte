<script>
  import { onMount } from "svelte";
  import { contactOpen, closeContact } from "../stores/contactModal.js";
  import { fade, scale } from "svelte/transition";

  let open = false;
  const unsubscribe = contactOpen.subscribe((v) => (open = v));

  // form state
  let name = "";
  let email = "";
  let message = "";
  let error = "";
  let sending = false;

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

  async function sendMessage() {
    error = "";
    sending = true;

    // Build a deterministic payload (trim strings and ensure plain object)
    const payload = {
      name: (name || "").trim(),
      email: (email || "").trim(),
      message: (message || "").trim(),
    };

    // Basic client-side validation
    if (!payload.name && !payload.email && !payload.message) {
      error = "Please fill in your name, contact and a short message.";
      sending = false;
      return;
    }

    if (
      Array.isArray(payload) ||
      typeof payload !== "object" ||
      payload === null
    ) {
      error = "Invalid request payload.";
      sending = false;
      return;
    }

    const url = "https://minga-backend-api.onrender.com/contacts";
    const controller = new AbortController();
    const timeoutMs = 15000; // 15s
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Try to parse response as JSON, fallback to text
      let body = null;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        try {
          body = await res.json();
        } catch (e) {
          body = null;
        }
      } else {
        try {
          body = await res.text();
        } catch (e) {
          body = null;
        }
      }

      if (!res.ok) {
        // Prefer server-provided message when available
        const serverMsg = body && (body.message || body.error);
        throw new Error(serverMsg || res.statusText || "Request failed");
      }

      // success: clear and close
      name = "";
      email = "";
      message = "";
      closeContact();
    } catch (err) {
      if (err.name === "AbortError") {
        error = "Request timed out. Please try again.";
      } else {
        error = err.message || String(err);
      }
    } finally {
      sending = false;
    }
  }
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
            class="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transform transition-transform duration-150 ease-out hover:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
            on:submit|preventDefault={sendMessage}
          >
            <h2 class="text-2xl font-semibold text-primary mb-6 text-center">
              Let’s Collaborate
            </h2>
            <input
              type="text"
              placeholder="Your name"
              class="w-full p-3 border rounded mb-4"
              bind:value={name}
              required
            />
            <input
              type="email"
              placeholder="Email or WhatsApp"
              class="w-full p-3 border rounded mb-4"
              bind:value={email}
              required
            />
            <textarea
              placeholder="Tell us about your idea or project"
              class="w-full p-3 border rounded mb-4 h-32"
              bind:value={message}
              required
            ></textarea>

            {#if error}
              <p class="text-sm text-red-600 mb-3">{error}</p>
            {/if}

            <button
              type="submit"
              class="w-full py-3 bg-accent text-white font-medium rounded-xl hover:bg-green-600 transition disabled:opacity-60"
              disabled={sending}
            >
              {#if sending}Sending...{:else}Send Message{/if}
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
