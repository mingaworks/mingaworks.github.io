import { writable } from 'svelte/store';
import { getServiceById } from '../lib/services.js';

// layout reactive values (written by LayoutSync on the client)
export const peekWidth = writable(0);
export const leftMenuOffset = writable(160);

// Peek panel stack: entries like { type: 'services'|'service'|'page', props }.
export const peekStack = writable([]);

export function peekPush(entry) {
    peekStack.update((s) => [...s, entry]);
}

export function peekPop() {
    let popped = null;
    peekStack.update((s) => {
        if (s.length === 0) return s;
        popped = s[s.length - 1];
        return s.slice(0, s.length - 1);
    });
    return popped;
}

export function peekReplace(entry) {
    peekStack.set([entry]);
}

export function peekClear() {
    peekStack.set([]);
}

// convenience: open a peek with the "services" main page and optional service
export function openPeek(contentType, payload = null) {
    // contentType: 'services' | 'projects' | 'hands' | 'service'
    if (contentType === 'service') {
        const svc = typeof payload === 'string' ? getServiceById(payload) : payload;
        if (!svc) return;
        peekReplace({ type: 'service', props: { service: svc } });
    } else {
        // replace stack with the root page for this content type
        peekReplace({ type: contentType, props: { payload } });
    }
}

export function closePeek() {
    peekClear();
}
