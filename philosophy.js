/**
 * Philosophy and Goals Page Renderer
 * Teaching philosophy, constructivist 5E pillars, and five-year development goals.
 */

export function renderPhilosophy(container, data) {
  const phil = data?.philosophy || {};
  const goals = data?.goals || {};

  const pillarsHtml = (phil.pillars || []).map(p => `
    <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem;">
      <h4 style="font-size: 1rem; color: var(--color-accent); font-weight: 600; margin-bottom: 0.4rem;">${p.title}</h4>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0;">${p.description}</p>
    </div>
  `).join('');

  const planHtml = (goals.five_year_plan || []).map(step => `
    <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-color);">
      <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--color-accent); min-width: 100px;">
        ${step.year}
      </div>
      <div>
        <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem;">${step.target}</h4>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0;">${step.details}</p>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-view philosophy-page">
      <span class="signature-heading">PORTFOLIO FOR PHILOSOPHY &amp; GOALS</span>
      <h2 class="tab-title">Educational Philosophy &amp; Vision</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div style="margin-bottom: 2.5rem; padding-left: 1.5rem; border-left: 3px solid var(--color-accent);">
        <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-primary);">${phil.title || 'Inquiry as Liberation'}</h3>
        <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); font-style: italic;">
          "${phil.statement || ''}"
        </p>
      </div>

      <div style="margin-bottom: 3rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 1rem;">
          Pillars of Pedagogical Practice
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
          ${pillarsHtml}
        </div>
      </div>

      <div>
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 1.25rem;">
          Five-Year Professional &amp; Academic Trajectory
        </h3>
        <div>
          ${planHtml}
        </div>
      </div>
    </div>
  `;
}
