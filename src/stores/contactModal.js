import { writable } from 'svelte/store';

// tracks whether the contact modal is open
export const contactOpen = writable(false);

export function openContact() {
  contactOpen.set(true);
}

export function closeContact() {
  contactOpen.set(false);
}
