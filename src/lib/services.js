// Static service list and lookup helper
export const services = [
  { id: 'tools', title: 'Digital Tools & Automation', body: 'We build custom tools to automate tasks and improve workflows for small teams.' },
  { id: 'branding', title: 'Branding & Web Presence', body: 'We design clean, identity-driven visuals and websites that tell your story simply.' },
  { id: 'product', title: 'Product Development', body: 'We help turn concepts into functional prototypes and usable digital products.' },
  { id: 'community', title: 'Community Projects', body: 'We collaborate with hostels and eco-initiatives to amplify local impact through tech.' }
];

export function getServiceById(id) {
  return services.find((s) => s.id === id) || null;
}
