<script>
  import { services as servicesList } from '../lib/services.js';
  import { peekPush } from '../stores/ui.js';

  // compact: renders a compact stacked list suitable for side panels
  // when false renders the larger grid layout used on the main page
  export let compact = false;

  function handleOpen(s) {
    if (!s) return;
    peekPush({ type: 'service', props: { service: s } });
  }
</script>

<section class="py-16 bg-gray-50" id="services">
  <div class="max-w-4xl mx-auto text-center px-4">
    <h2 class="text-2xl font-semibold text-primary mb-8">What We Do</h2>

    {#if compact}
      <div class="space-y-3 text-left">
        {#each servicesList as s}
          <button
            class="w-full text-left p-3 rounded-lg shadow-sm hover:shadow-md transition break-words flex flex-col items-start"
            style="background-color:var(--color-surface); color:var(--color-text); border-color:var(--color-border)"
            on:click={() => handleOpen(s)}
          >
            <h3 class="font-semibold two-line leading-tight mb-1">{s.title}</h3>
            <p class="text-sm text-gray-600 mt-0">{s.body}</p>
          </button>
        {/each}
      </div>
    {:else}
      <div class="grid md:grid-cols-2 gap-8 text-left">
        {#each servicesList as s}
          <button
            class="p-6 rounded-xl shadow-sm text-left flex flex-col items-start"
            style="background-color:var(--color-surface); color:var(--color-text); border-color:var(--color-border)"
            on:click={() => handleOpen(s)}
          >
            <h3 class="font-semibold text-lg mb-2 two-line leading-tight">{s.title}</h3>
            <p class="text-gray-600">{s.body}</p>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</section>

  
