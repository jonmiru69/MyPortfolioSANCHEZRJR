/**
 * Résumé / CV Page Renderer
 * Structured curriculum vitae with single-document printable layout.
 */

export function renderResume(container, data) {
  const cv = data?.cv || {};

  const competenciesHtml = (cv.core_competencies || []).map(skill => `
    <span class="chip chip-accent">${skill}</span>
  `).join('');

  const experienceHtml = (cv.experience || []).map(exp => `
    <div style="margin-bottom: 1.5rem; padding-left: 1rem; border-left: 2px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; margin-bottom: 0.25rem;">
        <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary);">${exp.position}</h4>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${exp.period}</span>
      </div>
      <p style="font-size: 0.88rem; color: var(--color-accent); font-weight: 500; margin-bottom: 0.5rem;">${exp.organization}</p>
      <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
        ${(exp.highlights || []).map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const educationHtml = (cv.education || []).map(edu => `
    <div style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
        <h4 style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">${edu.degree}</h4>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${edu.period}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--color-accent); margin-bottom: 0.2rem;">${edu.institution}</p>
      ${edu.honors ? `<p style="font-size: 0.82rem; font-style: italic; color: var(--text-secondary);">${edu.honors}</p>` : ''}
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-view resume-page cv-document">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; margin-bottom: 1.5rem; gap: 1rem;">
        <div>
          <span class="signature-heading">PORTFOLIO FOR CURRICULUM VITAE</span>
          <h2 class="tab-title">${cv.name || 'Ramelito Jr. C. Sanchez, LPT'}</h2>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
            ${cv.contact?.email || ''} · ${cv.contact?.location || ''}
          </p>
        </div>
        <button id="btn-print-cv" class="btn btn-primary btn-sm no-print">
          🖨️ Export CV as PDF / Print
        </button>
      </div>

      <div style="border-top: 2px solid var(--border-color); padding-top: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.5rem;">
          Executive Summary
        </h3>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); max-width: 65ch;">
          ${cv.career_summary || ''}
        </p>
      </div>

      <div style="margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.75rem;">
          Core Competencies &amp; Specializations
        </h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
          ${competenciesHtml}
        </div>
      </div>

      <div style="margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 1rem;">
          Professional Teaching &amp; Research Experience
        </h3>
        ${experienceHtml}
      </div>

      <div style="margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 1rem;">
          Academic Background
        </h3>
        ${educationHtml}
      </div>

      <div>
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.5rem;">
          Professional Credentials
        </h3>
        <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--text-secondary);">
          ${(cv.credentials || []).map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  container.querySelector('#btn-print-cv')?.addEventListener('click', () => {
    window.print();
  });
}
