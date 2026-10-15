/**
 * Development Plan Page Renderer
 * DepEd IPCRF-Development Plan matrix: strengths, development needs, action plan, and reflections.
 */

export function renderDevelopment(container, data) {
  const strengths = data?.strengths || [];
  const growthAreas = data?.growth_areas || [];
  const actionPlan = data?.action_plan || [];

  const strengthsHtml = strengths.map(s => `
    <li style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">${s}</li>
  `).join('');

  const growthHtml = growthAreas.map(g => `
    <li style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">${g}</li>
  `).join('');

  const planRowsHtml = actionPlan.map(plan => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 0.75rem 0.85rem; font-weight: 600; color: var(--color-accent); font-size: 0.85rem;">${plan.priority}</td>
      <td style="padding: 0.75rem 0.85rem; color: var(--text-primary); font-size: 0.85rem;">${plan.objective}</td>
      <td style="padding: 0.75rem 0.85rem; color: var(--text-secondary); font-size: 0.82rem;">${plan.intervention}</td>
      <td style="padding: 0.75rem 0.85rem; font-family: var(--font-mono); color: var(--text-muted); font-size: 0.78rem;">${plan.timeline}</td>
      <td style="padding: 0.75rem 0.85rem; font-size: 0.82rem;"><span class="chip chip-accent">${plan.status}</span></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="page-view development-page">
      <span class="signature-heading">PORTFOLIO FOR DEVELOPMENT PLAN</span>
      <h2 class="tab-title">IPCRF-DP Professional Growth Matrix</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem;">
          <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-success); margin-bottom: 0.75rem;">
            ✓ Core Strengths &amp; Proficiencies
          </h3>
          <ul style="padding-left: 1.25rem; line-height: 1.6;">
            ${strengthsHtml}
          </ul>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem;">
          <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-warning); margin-bottom: 0.75rem;">
            ⚡ Growth Opportunities &amp; Needs
          </h3>
          <ul style="padding-left: 1.25rem; line-height: 1.6;">
            ${growthHtml}
          </ul>
        </div>
      </div>

      <div style="margin-bottom: 2.5rem;">
        <h3 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-display); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.75rem;">
          Targeted Action Interventions &amp; Objectives
        </h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); font-family: var(--font-display); font-size: 0.75rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted);">
                <th style="padding: 0.65rem 0.85rem;">Competency Focus</th>
                <th style="padding: 0.65rem 0.85rem;">Learning Objective</th>
                <th style="padding: 0.65rem 0.85rem;">Planned Intervention</th>
                <th style="padding: 0.65rem 0.85rem;">Timeline</th>
                <th style="padding: 0.65rem 0.85rem;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${planRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--color-accent); padding: 1.25rem; border-radius: var(--radius-sm);">
        <strong style="font-family: var(--font-display); font-size: 0.78rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-accent); display: block; margin-bottom: 0.35rem;">
          PERSONAL REFLECTION ON LIFELONG PRACTICE
        </strong>
        <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); font-style: italic; margin-bottom: 0;">
          "${data?.reflection_notes || ''}"
        </p>
      </div>
    </div>
  `;
}
