import { writable } from 'svelte/store';
import { peekClear } from './ui.js';


export const contactOpen = writable(false);
export function openContact() {
  // If a peek panel is open, clear it so the contact modal has focus and
  // isn't visually overlapped by the left menu/peek UI.
  try {
    peekClear();
  } catch (e) {
    // ignore in SSR or if ui store isn't available for any reason
  }
  contactOpen.set(true);
}

export function closeContact() {
  contactOpen.set(false);
}
