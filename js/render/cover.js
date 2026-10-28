import { store } from '../store.js';

const escape = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export async function renderCover(container, siteData) {
  const identity = siteData.identity || {};
  const certificateData = await store.getTabContent('certificates');
  if (!location.hash.includes('cover') && location.hash !== '' && location.hash !== '#/') return;
  const previews = (certificateData.items || []).filter(item => item.visibility !== 'hidden' && item.preview_image).slice(0, 4);
  const tabs = store.getVisibleTabs();
  const featured = tabs.filter(t => !['cover', 'contents'].includes(t.id)).slice(0, 4);
  const destination = tabs.find(t => t.id === 'contents') || featured[0];
  container.innerHTML = `
    <div class="page-view cover-page">
      <h1 class="cover-name">${escape(identity.name || 'Portfolio')}</h1>
      <div class="cover-intro">
        <div class="cover-copy">
          <p class="cover-role">${escape(identity.title)}${identity.credentials ? ` · ${escape(identity.credentials)}` : ''}</p>
          <p class="cover-statement">${escape(identity.positioning_sentence)}</p>
          ${destination ? `<a class="btn btn-primary cover-action" href="#/${escape(destination.slug || destination.id)}">Explore the portfolio <span aria-hidden="true">↗</span></a>` : ''}
        </div>
        ${identity.cover_image ? `<div class="cover-image"><img src="${escape(identity.cover_image)}" alt="${escape(identity.cover_image_alt || 'Portfolio cover illustration')}" /></div>` : ''}
      </div>
      <div class="cover-discover">
        <div><h2>Explore the work</h2><p>Teaching, research and professional practice, collected in one place.</p></div>
        <div class="cover-links">${featured.map(t => `<a href="#/${escape(t.slug || t.id)}"><span>${escape(t.label)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div>
      </div>
      ${previews.length ? `<section class="cover-evidence"><div><h2>Learning in practice</h2><p>Explore a selection of professional learning records.</p><a href="#/certificates">View certificates ↗</a></div><div class="cover-evidence-images">${previews.map(item => `<a href="#/certificates"><img src="${escape(item.preview_image)}" alt="${escape(item.title)} certificate" loading="lazy"></a>`).join('')}</div></section>` : ''}
    </div>`;
}
