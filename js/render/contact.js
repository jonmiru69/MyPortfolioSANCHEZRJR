const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderContact(container, data, siteData) {
  const email = siteData?.contact?.mailto_address || siteData?.identity?.email || '';
  const institution = siteData?.identity?.institution || data?.office_location || '';
  const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
  container.innerHTML = `<div class="page-view contact-page">
    <h2 class="tab-title">Contact</h2>
    <p class="tab-summary">${escape(data?.summary || 'Get in touch for professional inquiries.')}</p>
    <div class="contact-details">
      ${institution ? `<div><h3>Institution</h3><p>${escape(institution)}</p></div>` : ''}
      ${safeEmail ? `<div><h3>Email</h3><p><a href="mailto:${escape(safeEmail)}">${escape(safeEmail)}</a></p><p>Opens your email application.</p></div>` : ''}
      ${(data?.social_links || []).filter(x => /^https?:\/\//i.test(x.url || '')).map(x => `<div><a href="${escape(x.url)}" target="_blank" rel="noopener noreferrer">${escape(x.platform)} ↗</a></div>`).join('')}
    </div></div>`;
}
