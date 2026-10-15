/**
 * Contact Page Renderer
 * Four-field minimal form with seamless inline success state and official institutional channels.
 */

export function renderContact(container, data, siteData) {
  const formCfg = data?.form_settings || {};
  const contactCfg = siteData?.contact || {};
  const successMsg = contactCfg.success_message || formCfg.success_message || "Message received. I will reply shortly.";

  const socialLinksHtml = (data?.social_links || []).map(link => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
      ${link.platform} (${link.handle})
    </a>
  `).join('');

  container.innerHTML = `
    <div class="page-view contact-page">
      <span class="signature-heading">PORTFOLIO FOR CONTACT &amp; INQUIRIES</span>
      <h2 class="tab-title">Direct Professional Communication</h2>
      <p class="tab-summary">${data?.summary || ''}</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; align-items: start;">
        <!-- Form Column -->
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 2rem;">
          <h3 style="font-size: 1.2rem; margin-bottom: 0.35rem; color: var(--text-primary);">${formCfg.title || 'Send an Inquiry'}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
            ${formCfg.subtitle || 'Please provide your details below.'}
          </p>

          <div id="contact-form-container">
            <form id="portfolio-contact-form">
              <div class="form-group">
                <label class="form-label" for="contact-name">Full Name *</label>
                <input type="text" id="contact-name" class="form-input" required placeholder="e.g. Dr. Jane Doe" />
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-email">Email Address *</label>
                <input type="email" id="contact-email" class="form-input" required placeholder="e.g. jdoe@institution.edu" />
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-org">Organization / School / Panel *</label>
                <input type="text" id="contact-org" class="form-input" required placeholder="e.g. University Graduate Committee" />
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-msg">Message / Inquiry *</label>
                <textarea id="contact-msg" class="form-textarea" required placeholder="Write your message here..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">
                ${formCfg.submit_label || 'Transmit Message'}
              </button>
            </form>
          </div>
        </div>

        <!-- Institutional Details Column -->
        <div>
          <div style="margin-bottom: 2rem;">
            <h4 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.5rem;">
              Institutional Mailbox
            </h4>
            <p style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.2rem;">
              <a href="mailto:${data?.official_email || 'sanchez.ramelito@deped.gov.ph'}">${data?.official_email || 'sanchez.ramelito@deped.gov.ph'}</a>
            </p>
            <p style="font-size: 0.82rem; color: var(--text-muted);">
              Official Department of Education email account for official correspondence.
            </p>
          </div>

          <div style="margin-bottom: 2rem;">
            <h4 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.5rem;">
              Department Office &amp; Consultation
            </h4>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.2rem;">
              ${data?.office_location || ''}
            </p>
            <p style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
              ${data?.consultation_hours || ''}
            </p>
          </div>

          <div>
            <h4 style="font-family: var(--font-display); font-size: 0.82rem; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-accent); margin-bottom: 0.75rem;">
              Digital Profiles &amp; Repositories
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${socialLinksHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Handle form submission with inline success state
  const form = container.querySelector('#portfolio-contact-form');
  const formContainer = container.querySelector('#contact-form-container');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = container.querySelector('#contact-name').value;
    const email = container.querySelector('#contact-email').value;
    const org = container.querySelector('#contact-org').value;
    const msg = container.querySelector('#contact-msg').value;

    const endpoint = contactCfg.endpoint_url;
    if (endpoint && endpoint.trim().length > 0) {
      // POST to free endpoint
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, org, message: msg })
      }).catch(err => console.warn('Endpoint transmit error:', err));
    } else {
      // Mailto fallback
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name} (${org})`);
      const body = encodeURIComponent(`Sender: ${name}\nOrganization: ${org}\nEmail: ${email}\n\nMessage:\n${msg}`);
      window.open(`mailto:${contactCfg.mailto_address || 'sanchez.ramelito@deped.gov.ph'}?subject=${subject}&body=${body}`);
    }

    // Inline success state replacement (no page reload)
    formContainer.innerHTML = `
      <div style="padding: 2.5rem 1.5rem; text-align: center; background: rgba(52, 211, 153, 0.08); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: var(--radius-sm); animation: fadeIn 0.3s ease;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">✉️</span>
        <h4 style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">
          Inquiry Transmitted
        </h4>
        <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 40ch; margin: 0 auto 1.5rem;">
          ${successMsg}
        </p>
        <button id="btn-reset-form" class="btn btn-outline btn-sm">
          Send Another Message
        </button>
      </div>
    `;

    formContainer.querySelector('#btn-reset-form')?.addEventListener('click', () => {
      renderContact(container, data, siteData);
    });
  });
}
