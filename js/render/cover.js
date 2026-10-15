/**
 * Cover Page Renderer
 * Mission-first hero, wide letter-spacing display, positioning sentence, and 'Open portfolio' button.
 */

import { router } from '../router.js';

export function renderCover(container, siteData) {
  const identity = siteData.identity || {};

  container.innerHTML = `
    <div class="page-view cover-page" style="display: flex; flex-direction: column; justify-content: center; min-height: 650px;">
      <span class="signature-heading">PROFESSIONAL TEACHING BINDER</span>
      
      <h1 style="font-size: clamp(2.2rem, 5vw, 3.5rem); line-height: 1.1; margin-bottom: 0.5rem; letter-spacing: var(--tracking-tight);">
        ${identity.name || 'Ramelito Jr. C. Sanchez'} <span style="font-size: 0.55em; color: var(--color-accent); font-weight: 500;">${identity.credentials || 'LPT'}</span>
      </h1>
      
      <p style="font-family: var(--font-mono); font-size: 1rem; color: var(--text-secondary); margin-bottom: 2rem;">
        ${identity.title || 'Science Educator & STE Program Faculty'} · ${identity.date_range || '2019 – Present'}
      </p>

      <div style="margin-bottom: 2.5rem; padding-left: 1.5rem; border-left: 3px solid var(--color-accent);">
        <p style="font-size: 1.25rem; line-height: 1.6; color: var(--text-primary); font-weight: 400; max-width: 60ch;">
          "${identity.positioning_sentence || 'Advancing secondary science education and scientific inquiry through evidence-based pedagogy, curriculum alignment, and technology integration.'}"
        </p>
      </div>

      <div style="margin-bottom: 3rem; max-width: 720px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-color);">
        <img 
          src="${identity.cover_image || 'assets/images/cover-hero.svg'}" 
          alt="Portfolio cover visual representing scientific inquiry and pedagogy" 
          style="width: 100%; height: auto; display: block;"
        />
      </div>

      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <button id="btn-open-portfolio" class="btn btn-primary" style="padding: 0.85rem 1.85rem; font-size: 1rem; letter-spacing: var(--tracking-wide); text-transform: uppercase;">
          Open Portfolio Binder →
        </button>
        <button id="btn-quick-cv" class="btn btn-secondary" style="padding: 0.85rem 1.5rem;">
          View Résumé / CV
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btn-open-portfolio')?.addEventListener('click', () => {
    router.navigate('contents');
  });

  container.querySelector('#btn-quick-cv')?.addEventListener('click', () => {
    router.navigate('resume');
  });
}
