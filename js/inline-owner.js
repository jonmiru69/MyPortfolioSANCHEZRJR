import { github } from './github.js';
import { store } from './store.js';
import { renderSiteEditor } from './admin/site-editor.js';
import { renderContentEditor } from './admin/content-editor.js';
import { renderTabEditor } from './admin/tab-editor.js';
import { renderPublish } from './admin/publish.js';

export function setupInlineOwner(app) {
  let enabled = false;
  const closeMenus = () => document.querySelectorAll('.owner-menu-list:popover-open').forEach(list => list.hidePopover());
  window.addEventListener('resize', closeMenus);
  document.addEventListener('scroll', e => { if (!e.target.closest?.('.owner-menu-list')) closeMenus(); }, true);
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'theme-toggle-btn'; button.textContent = 'Owner mode';
  button.setAttribute('aria-pressed', 'false');
  document.querySelector('.top-bar-controls')?.append(button);

  function openPanel(title, render) {
    const dialog = document.createElement('dialog'); dialog.className = 'owner-dialog';
    const heading = document.createElement('h2'); heading.textContent = title;
    const close = document.createElement('button'); close.type = 'button'; close.className = 'btn btn-secondary'; close.textContent = 'Close editor';
    const body = document.createElement('div'); body.className = 'owner-dialog-body';
    const header = document.createElement('div'); header.className = 'owner-dialog-header'; header.append(heading, close);
    dialog.append(header, body); document.body.append(dialog);
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { dialog.remove(); app.renderTabs(); app.handleRoute(app.currentRoute()); });
    dialog.showModal(); render(body);
  }
  function authenticate() {
    openPanel('Connect owner access', body => {
      body.innerHTML = '<p>Enter the same GitHub personal access token used to publish this portfolio. It stays in this browser session.</p><form><label for="inline-token">GitHub token</label><input id="inline-token" type="password" autocomplete="off" required class="form-input"><button type="submit" class="btn btn-primary">Connect</button><p role="status"></p></form>';
      body.querySelector('form').addEventListener('submit', async e => {
        e.preventDefault(); const form = e.currentTarget; const status = form.querySelector('[role="status"]');
        const token = form.querySelector('input').value; status.textContent = 'Checking access…';
        github.setCredentials(token, github.owner || 'jonmiru69', github.repo || 'MyPortfolioSANCHEZRJR', github.branch || 'main', false);
        const result = await github.testConnection();
        if (!result.ok) { github.disconnect(); status.textContent = result.error || 'Could not verify access.'; return; }
        enabled = true; button.textContent = 'Exit owner mode'; button.setAttribute('aria-pressed','true');
        body.closest('dialog').close();
      });
    });
  }
  button.addEventListener('click', async () => {
    if (enabled) { enabled = false; button.textContent = 'Owner mode'; button.setAttribute('aria-pressed','false'); decorate(); return; }
    if (!github.isAuthenticated()) { authenticate(); return; }
    button.disabled = true;
    const result = await github.testConnection(); button.disabled = false;
    if (!result.ok) { authenticate(); return; }
    enabled = true; button.textContent = 'Exit owner mode'; button.setAttribute('aria-pressed','true'); decorate();
  });
  function menu(label, actions) {
    const details = document.createElement('div'); details.className = 'owner-menu';
    const summary = document.createElement('button'); summary.type='button'; summary.className='owner-menu-trigger'; summary.textContent = '⋮'; summary.setAttribute('aria-label', label); summary.setAttribute('aria-haspopup','menu'); summary.setAttribute('aria-expanded','false'); details.append(summary);
    const list = document.createElement('div'); list.className = 'owner-menu-list'; list.setAttribute('popover','auto'); list.setAttribute('role','menu');
    summary.addEventListener('click', () => {
      if (list.matches(':popover-open')) { list.hidePopover(); return; }
      list.showPopover();
      const rect=summary.getBoundingClientRect(), box=list.getBoundingClientRect(), gap=8;
      list.style.left=Math.max(gap,Math.min(rect.right-box.width,innerWidth-box.width-gap))+'px';
      list.style.top=Math.max(gap,Math.min(rect.bottom+gap,innerHeight-box.height-gap))+'px';
    });
    list.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(list.matches(':popover-open'))));
    list.addEventListener('keydown', e => {
      const buttons=[...list.querySelectorAll('button')], index=buttons.indexOf(document.activeElement);
      if(e.key==='ArrowDown'||e.key==='ArrowUp') { e.preventDefault(); buttons[(index+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus(); }
    });
    for (const [name, handler] of actions) { const b = document.createElement('button'); b.type='button'; b.setAttribute('role','menuitem'); b.textContent=name; b.addEventListener('click', () => { list.hidePopover(); handler(); }); list.append(b); }
    details.append(list); return details;
  }
  function decorate() {
    document.querySelectorAll('.owner-inline-control').forEach(el => el.remove());
    if (!enabled || app.currentRoute() === 'admin') return;
    const route = app.currentRoute(); const page = app.pageContainer.querySelector('.page-view');
    if (!page) return;
    const group = document.createElement('div'); group.className = 'owner-inline-control owner-page-actions';
    group.append(menu('Edit this section', [
      ['Edit page', () => openPanel('Edit page', body => route === 'cover' || route === 'profile' || route === 'contact' ? renderSiteEditor(body) : renderContentEditor(body, route))],
      ...(['profile','contact'].includes(route) ? [['Edit section data', () => openPanel('Edit section data', body => renderContentEditor(body, route))]] : []),
      ['Manage sections', () => openPanel('Manage sections', renderTabEditor)],
      ['Review and publish', () => openPanel('Review and publish', renderPublish)]
    ]));
    page.prepend(group);
    if (['cover','profile','contact'].includes(route)) {
      page.querySelectorAll('.overview-intro > :not(a), .overview-content h2, .overview-content p, .overview-learning h2, .profile-page h3, .profile-page h4, .profile-page p, .contact-details h3, .contact-details p').forEach(target => {
        const wrap = document.createElement('span'); wrap.className='owner-inline-control owner-detail-control';
        wrap.append(menu('Edit this detail', [['Edit details', () => openPanel('Edit details', renderSiteEditor)]]));
        target.after(wrap);
      });
    }
    if (!['cover','contents','profile','contact'].includes(route)) {
      page.querySelectorAll('[data-owner-item]').forEach(card => {
        const id = card.dataset.ownerItem;
        const wrap = document.createElement('div'); wrap.className = 'owner-inline-control';
        wrap.append(menu('Item options', [['Edit, hide or delete', () => openPanel('Edit item', body => renderContentEditor(body, route, id))], ['Add an item', () => openPanel('Add an item', body => renderContentEditor(body, route))]]));
        card.prepend(wrap);
      });
    }
    document.querySelectorAll('.binder-tab').forEach(link => {
      const wrap = document.createElement('span'); wrap.className='owner-inline-control owner-tab-control';
      wrap.append(menu('Section options', [['Manage sections', () => openPanel('Manage sections', renderTabEditor)]]));
      link.after(wrap);
    });
  }
  app.pageContainer.addEventListener('portfolio-list-rendered', () => queueMicrotask(decorate));
  return { decorate };
}
