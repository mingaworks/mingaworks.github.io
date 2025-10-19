import { writable } from 'svelte/store';

export const contactOpen = writable(false);

export function openContact() {
  contactOpen.set(true);
}

export function closeContact() {
  contactOpen.set(false);
}
