/**
 * Memberships & Reading Page Renderer
 * Disciplinary affiliations and pedagogical literature informing science teaching practice.
 */

export function renderReading(container, data) {
  const memberships = data?.memberships || [];
  const readingList = data?.reading_list || [];

  const membershipsHtml = memberships.map(m => `
    <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem; flex-wrap: wrap;">
        <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary);">${m.organization}</h4>
        <span class="chip chip-accent" style="font-size: 0.72rem;">${m.status || 'Active'}</span>
      </div>
      <p style="font-size: 0.88rem; color: var(--color-accent); font-weight: 500; margin-bottom: 0.25rem;">${m.role}</p>
      <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">Affiliated since: ${m.since}</span>
    </div>
  `).join('');

  const readingHtml = readingList.map(book => `
    <div class="evidence-sleeve" style="margin-bottom: 1.25rem;">
      <div class="evidence-header">
        <div>
          <span class="chip chip-accent" style="margin-bottom: 0.25rem;">${book.category}</span>
          <h3 class="evidence-title">📖 ${book.title}</h3>
          <p class="evidence-subtitle">Author: <strong>${book.author}</strong></p>
        </div>
        <span class="chip text-mono" style="font-size: 0.72rem;">${book.status}</span>
      </div>
      <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--color-accent); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-top: 0.5rem;">
        <strong style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--color-accent); display: block; margin-bottom: 0.2rem;">PEDAGOGICAL TAKEAWAY:</strong>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0; font-style: italic;">
          "${book.key_takeaway}"
        </p>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-view reading-page">
      <span class="signature-heading">PORTFOLIO FOR MEMBERSHIPS &amp; READING</span>
      <h2 class="tab-title">Professional Societies &amp; Literature</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div style="margin-bottom: 2.5rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 1rem;">
          Professional Societies &amp; Teacher Organizations
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
          ${membershipsHtml}
        </div>
      </div>

      <div>
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 1rem;">
          Foundational Pedagogy &amp; Current Literature
        </h3>
        <div class="reading-list">
          ${readingHtml}
        </div>
      </div>
    </div>
  `;
}
