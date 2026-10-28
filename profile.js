/**
 * Profile Page Renderer
 * Personal statement, short bio, key facts table, and educator portrait.
 */

export function renderProfile(container, data, siteData) {
  const profile = data || {};
  const identity = siteData?.identity || {};

  const keyFactsHtml = (profile.key_facts || []).map(fact => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 0.65rem 0.85rem; font-family: var(--font-display); font-size: 0.8rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--text-muted); width: 35%; font-weight: 600;">
        ${fact.label}
      </td>
      <td style="padding: 0.65rem 0.85rem; font-size: 0.92rem; color: var(--text-primary); font-weight: 500;">
        ${fact.value}
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="page-view profile-page">
      <span class="signature-heading">PORTFOLIO FOR PROFILE</span>
      <h2 class="tab-title">Educator Profile &amp; Statement</h2>
      <p class="tab-summary">${profile.summary || ''}</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem; margin-bottom: 2.5rem; align-items: start;">
        <div>
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem; color: var(--color-accent); font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase;">
              Teaching Ethos &amp; Mission
            </h3>
            <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-primary); font-style: italic;">
              "${profile.statement || ''}"
            </p>
          </div>

          <div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem; color: var(--color-accent); font-family: var(--font-display); letter-spacing: var(--tracking-wide); text-transform: uppercase;">
              Biographical Background
            </h3>
            <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary);">
              ${profile.bio || ''}
            </p>
          </div>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.5rem; text-align: center;">
          <img 
            src="${identity.avatar || 'assets/images/profile-portrait.svg'}" 
            alt="Portrait of ${identity.name || 'Educator'}" 
            style="width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 1.25rem; display: block; border: 2px solid var(--color-accent);"
          />
          <h4 style="font-size: 1.2rem; margin-bottom: 0.2rem;">${identity.name || 'Portfolio owner'}</h4>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-accent);">${identity.credentials || ''} · ${identity.preferred_name ? `("${identity.preferred_name}")` : ''}</span>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 1.5rem; text-align: left;">
            <tbody>
              ${keyFactsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
