<div class="flex flex-col items-center text-center py-24 px-4 bg-primary text-white">
  <img src="/images/logo.jpeg" alt="Mingaworks" class="w-32 mb-4 rounded-3xl" />
  <h1 class="text-4xl font-bold mb-4">mingaworks</h1>
  <button
    type="button"
    on:click={() => import('../stores/contactModal.js').then(m => m.openContact())}
    class="mt-8 px-6 py-3 text-primary font-medium rounded-xl shadow transition cursor-pointer inline-block"
    style="background-color:var(--color-surface); color:var(--color-text)"
  >
    Contact
  </button>
</div>
