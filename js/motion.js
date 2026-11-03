/** One reveal controller for route changes, filters and owner edits. */
export function createRevealMotion(root) {
  const selector = [
    '.hero-writing > *', '.portrait-frame', '.hero-name', '.hero-actions',
    '.card-imprint', '.overview-about > *', '.inquiry-feature > *',
    '.learning-heading > *', '.learning-documents article',
    '.overview-index h2', '.overview-index a', '.overview-contact > *',
    '.section-intro > *', '.certificate-art', '.certificate-information dl > div',
    '.certificate-information > .btn', '.portfolio-record > div > *',
    '.profile-layout > img', '.profile-layout > div > *', '.contact-details > *',
    '.inquiry-form > *', '.resume-tools', '.resume-canvas', '.additional-group > *',
  ].join(', ');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return { refresh() {}, destroy() {} };
  let frame = 0;
  let seen = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.06, rootMargin: '0px 0px -16px 0px' });
  const refresh = () => {
    if (preference.matches) return;
    let index = 0;
    for (const el of root.querySelectorAll(selector)) {
      if (seen.has(el) || el.closest('.owner-inline-control')) continue;
      // A parent reveal already carries all of its children together.
      if (el.parentElement.closest('.reveal')) continue;
      seen.add(el);
      el.classList.add('reveal');
      el.style.setProperty('--delay', `${index++ % 4 * 70}ms`);
      observer.observe(el);
    }
  };
  const mutations = new MutationObserver(records => {
    let changed = false;
    for (const record of records) {
      for (const removed of record.removedNodes) {
        if (!(removed instanceof Element)) continue;
        observer.unobserve(removed);
        removed.querySelectorAll('.reveal').forEach(el => observer.unobserve(el));
      }
      if (record.addedNodes.length) changed = true;
    }
    if (changed && !frame) frame = requestAnimationFrame(() => { frame = 0; refresh(); });
  });
  mutations.observe(root, { childList: true, subtree: true });
  const changePreference = () => {
    observer.disconnect();
    root.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal', 'is-visible'));
    seen = new WeakSet();
    refresh();
  };
  preference.addEventListener('change', changePreference);
  refresh();
  return {
    refresh,
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
      preference.removeEventListener('change', changePreference);
    },
  };
}
