/**
 * Testimonials & References Page Renderer
 * Supervisory endorsements, peer testimonials, and privacy-protected opt-in references.
 */

export function renderTestimonials(container, data) {
  const endorsements = data?.endorsements || [];
  const references = data?.references || [];

  const endorsementsHtml = endorsements.map(t => `
    <div class="evidence-sleeve" style="margin-bottom: 1.5rem;">
      <p style="font-size: 1rem; line-height: 1.7; color: var(--text-primary); font-style: italic; margin-bottom: 1rem;">
        "${t.text}"
      </p>
      <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
        <div>
          <strong style="font-size: 0.95rem; color: var(--color-accent);">${t.author}</strong>
          <span style="font-size: 0.85rem; color: var(--text-secondary); display: block;">${t.role} · ${t.organization}</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${t.date}</span>
      </div>
    </div>
  `).join('');

  const referencesHtml = references.map(ref => `
    <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem;">
      <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.2rem;">${ref.name}</h4>
      <p style="font-size: 0.85rem; color: var(--color-accent); margin-bottom: 0.2rem;">${ref.title} · ${ref.institution}</p>
      <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); display: block; margin-bottom: 0.75rem;">Relationship: ${ref.relationship}</span>
      
      <div style="background: var(--bg-surface); border: 1px dashed var(--border-color); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary);">
          Contact: <em>${ref.email_masked || 'Protected / Opt-In Only'}</em>
        </span>
        <button class="btn btn-outline btn-sm btn-request-ref" data-ref-name="${ref.name}">
          Request Details
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-view testimonials-page">
      <span class="signature-heading">PORTFOLIO FOR TESTIMONIALS &amp; REFERENCES</span>
      <h2 class="tab-title">Supervisory Endorsements</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div style="margin-bottom: 2.5rem;">
        ${endorsementsHtml}
      </div>

      <div>
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.5rem;">
          Verified Professional References (Opt-In)
        </h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          ${data?.references_notice || ''}
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          ${referencesHtml}
        </div>
      </div>
    </div>
  `;

  // Request details click handlers
  container.querySelectorAll('.btn-request-ref').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-ref-name');
      alert(`To request verified contact credentials for ${name}, please submit a note via the Contact tab with your institution's verification letter.`);
    });
  });
}
