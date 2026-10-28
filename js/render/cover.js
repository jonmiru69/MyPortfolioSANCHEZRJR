import { store } from '../store.js';
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export async function renderCover(container, siteData) {
  const identity = siteData.identity || {};
  const overview = siteData.overview || {};
  const certificates = await store.getTabContent('certificates');
  if (!location.hash.includes('cover') && location.hash !== '' && location.hash !== '#/') return;
  const tabs = store.getVisibleTabs();
  const relevant = tabs.filter(t => !['cover','contents'].includes(t.id));
  const count = (certificates.items || []).filter(item => item.visibility !== 'hidden').length;
  container.innerHTML = `
    <div class="page-view cover-page overview">
      <div class="overview-intro">
        <p class="overview-institution">${escape(identity.institution || '')}</p>
        <h1 class="cover-name">${escape(identity.name || 'Portfolio')}</h1>
        <p class="overview-title">${escape(identity.title)}${identity.credentials ? ` · ${escape(identity.credentials)}` : ''}</p>
        <p class="cover-statement">${escape(identity.positioning_sentence)}</p>
        <a class="btn btn-primary cover-action" href="#/profile">${escape(overview.action_label || 'Read my profile')} <span aria-hidden="true">↗</span></a>
      </div>
      <section class="overview-content">
        <div><h2>${escape(overview.heading || 'Explore the portfolio')}</h2><p>${escape(overview.description || 'Find my background, teaching experience and professional learning in one place.')}</p></div>
        <div class="overview-list">${relevant.map(t => `<a href="#/${escape(t.slug || t.id)}"><span><strong>${escape(t.label)}</strong><small>${escape(t.summary || '')}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>
      </section>
      ${tabs.some(t=>t.id==='certificates') ? `<section class="overview-learning"><h2>${escape(overview.learning_heading || 'Professional learning')}</h2><p>${count} certificate${count===1?'':'s'} available to explore.</p><a href="#/certificates">View certificates ↗</a></section>` : ''}
    </div>`;
}
