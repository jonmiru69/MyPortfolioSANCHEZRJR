/**
 * Application Entry Point
 * Orchestrates Store, Router, Binder Metaphor Shell, and Tab View Renderers.
 */

import { store } from './store.js';
import { router } from './router.js';
import { setupInlineOwner } from './inline-owner.js';

// Renderers
import { renderCover } from './render/cover.js';
import { renderContents } from './render/contents.js';
import { renderProfile } from './render/profile.js';
import { renderResume } from './render/resume.js';
import { renderPhilosophy } from './render/philosophy.js';
import { renderEducation } from './render/education.js';
import { renderLicenses } from './render/licenses.js';
import { renderCertificates } from './render/certificates.js';
import { renderResearch } from './render/research.js';
import { renderTeaching } from './render/teaching.js';
import { renderMaterials } from './render/materials.js';
import { renderPerformance } from './render/performance.js';
import { renderAwards } from './render/awards.js';
import { renderService } from './render/service.js';
import { renderProjects } from './render/projects.js';
import { renderDevelopment } from './render/development.js';
import { renderReading } from './render/reading.js';
import { renderTestimonials } from './render/testimonials.js';
import { renderGallery } from './render/gallery.js';
import { renderContact } from './render/contact.js';
import { renderCustom } from './render/custom.js';

// Admin Controller
import { renderAdmin } from './admin/admin-app.js';

class App {
  constructor() {
    this.pageContainer = null;
    this.tabsContainer = null;
    this.themeToggleBtn = null;
  }

  async init() {
    this.pageContainer = document.getElementById('binder-page-content');
    this.tabsContainer = document.getElementById('binder-tabs-nav');
    this.themeToggleBtn = document.getElementById('btn-toggle-theme');

    // Initialize Store (load site.json & drafts)
    await store.init();

    // Setup Theme
    const defaultMode = store.site?.theme?.default_mode || 'dark';
    store.setTheme(defaultMode);

    // Apply custom design tokens from site.json
    if (store.site?.theme) {
      if (store.site.theme.color_accent) {
        document.documentElement.style.setProperty('--brand-accent', store.site.theme.color_accent);
      }
      if (store.site.theme.bg_canvas) {
        document.documentElement.style.setProperty('--bg-canvas', store.site.theme.bg_canvas);
      }
      if (store.site.theme.tracking_display) {
        document.documentElement.style.setProperty('--tracking-display', store.site.theme.tracking_display);
      }
      if (store.site.theme.transition_speed) {
        document.documentElement.style.setProperty('--transition-speed', store.site.theme.transition_speed);
      }
    }

    const seo = store.site?.seo || {};
    const setMeta = (selector, value) => { const el = document.querySelector(selector); if (el && value) el.content = value; };
    setMeta('meta[name="description"]', seo.site_description);
    setMeta('meta[name="keywords"]', seo.keywords);
    setMeta('meta[name="author"]', store.site?.identity?.name);
    setMeta('meta[property="og:title"]', seo.site_title);
    setMeta('meta[property="og:description"]', seo.site_description);
    setMeta('meta[property="og:image"]', seo.og_image);
    setMeta('meta[name="twitter:title"]', seo.site_title);
    setMeta('meta[name="twitter:description"]', seo.site_description);
    setMeta('meta[name="twitter:image"]', seo.og_image);
    this.setupHeader();
    this.setupFooter();
    this.navToggle = document.getElementById('section-menu-toggle');
    this.renderTabs();
    this.ownerTools = setupInlineOwner(this);
    const menu = this.navToggle;
    if (menu && this.tabsContainer) {
      document.documentElement.classList.add('js-nav');
      const desktop = () => window.matchMedia('(min-width: 769px)').matches;
      const setOpen = open => {
        menu.setAttribute('aria-expanded', String(open));
        this.tabsContainer.classList.toggle('menu-open', open);
        document.body.classList.toggle('nav-expanded', open);
      };
      menu.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2"/></svg>'; menu.setAttribute('aria-label', 'Expand or retract navigation');
      setOpen(false);
      menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
      this.tabsContainer.addEventListener('pointerenter', e => { if (desktop() && e.pointerType !== 'touch') setOpen(true); });
      this.tabsContainer.addEventListener('pointerleave', () => { if (desktop()) setOpen(false); });
      this.tabsContainer.addEventListener('focusin', e => { if (e.target !== menu) setOpen(true); });
      this.tabsContainer.addEventListener('focusout', e => { if (!this.tabsContainer.contains(e.relatedTarget)) setOpen(false); });
      this.tabsContainer.addEventListener('keydown', e => { if(e.key === 'Escape') { menu.focus(); setOpen(false); } });
      this.tabsContainer.addEventListener('click', event => { if (event.target.closest('a') && !desktop()) setOpen(false); });
      window.matchMedia('(min-width: 769px)').addEventListener('change', () => setOpen(false));
    }

    // Setup Route Listeners
    store.subscribe('route-changed', (route) => this.handleRoute(route));
    store.subscribe('preset-changed', () => {
      this.renderTabs();
      this.handleRoute(router.currentRoute);
    });
    store.subscribe('theme-changed', (mode) => {
      if (this.themeToggleBtn) {
        this.themeToggleBtn.innerHTML = mode === 'dark' ? 'Light mode' : 'Dark mode';
      }
    });

    // Start Router
    router.init();
  }

  setupHeader() {
    // Theme Toggle
    if (this.themeToggleBtn) {
      this.themeToggleBtn.innerHTML = store.themeMode === 'dark' ? 'Light mode' : 'Dark mode';
      this.themeToggleBtn.addEventListener('click', () => store.toggleTheme());
    }

  }

  setupFooter() {
    const footerText = document.getElementById('footer-copy-text');
    if (footerText && store.site?.identity?.footer_text) {
      footerText.textContent = store.site.identity.footer_text;
    }
  }

  renderTabs() {
    if (!this.tabsContainer) return;

    if (router.currentRoute === 'admin') {
      this.tabsContainer.style.display = 'none';
      return;
    } else {
      this.tabsContainer.style.display = 'flex';
    }

    const visibleTabs = store.getVisibleTabs();

    this.tabsContainer.innerHTML = visibleTabs.map((tab, idx) => {

      const isActive = router.currentRoute === tab.slug || router.currentRoute === tab.id;
      return `
        <a
          href="#/${tab.slug || tab.id}"
          class="binder-tab ${isActive ? 'active' : ''}"
          data-tab-slug="${tab.slug || tab.id}"
          ${isActive ? 'aria-current="page"' : ''}
          title="${tab.label}: ${tab.summary || ''}"
        >

          <span class="binder-tab-label">${tab.label}</span>
        </a>
      `;
    }).join('');
    if (this.navToggle) this.tabsContainer.prepend(this.navToggle);
    const navHeading = document.createElement('div'); navHeading.className='nav-heading';
    const name = document.createElement('strong'); name.className='nav-owner-name'; name.textContent=store.site?.identity?.name || 'Portfolio';
    const label = document.createElement('label'); label.textContent='Portfolio view'; label.htmlFor='nav-preset';
    const select = document.createElement('select'); select.id='nav-preset'; select.className='form-select';
    for(const preset of store.site?.presets || []) { const option=document.createElement('option'); option.value=preset.id; option.textContent=preset.name; option.selected=preset.id===store.activePreset; select.append(option); }
    select.addEventListener('change', () => store.setPreset(select.value));
    navHeading.append(name,label,select);
    this.navToggle?.after(navHeading);
  }

  async handleRoute(route) {
    if (!this.pageContainer) return;
    document.body.classList.toggle('is-admin', route === 'admin');

    // Admin view overrides standard binder wrapper
    const binderContainer = document.querySelector('.binder-container');
    const spine = document.querySelector('.binder-spine');

    if (route === 'admin') {
      if (spine) spine.style.display = 'none';
      if (this.tabsContainer) this.tabsContainer.style.display = 'none';
      if (binderContainer) binderContainer.style.maxWidth = '100%';
      renderAdmin(this.pageContainer);
      document.title = `Owner Admin · ${store.site?.identity?.name || 'Portfolio'}`;
      return;
    } else {
      if (spine && window.innerWidth > 1024) spine.style.display = 'flex';
      if (this.tabsContainer) this.tabsContainer.style.display = 'flex';
      if (binderContainer) binderContainer.style.maxWidth = 'var(--binder-max-width)';
    }

    // Update active tab styles
    this.renderTabs();

    // Loading State Placeholder
    this.pageContainer.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 400px; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem;">
        Loading tab [${route}]...
      </div>
    `;

    try {
      const tabMeta = store.getTabMeta(route);
      const tabLabel = tabMeta ? tabMeta.label : route.toUpperCase();
      document.title = `${tabLabel} · ${store.site?.identity?.name || 'Portfolio Binder'}`;

      if (route === 'cover') {
        await renderCover(this.pageContainer, store.site);
      } else if (route === 'contents') {
        renderContents(this.pageContainer);
      } else if (route === 'profile') {
        const data = await store.getTabContent('profile');
        await renderProfile(this.pageContainer, data, store.site);
      } else if (route === 'resume') {
        const data = await store.getTabContent('resume');
        renderResume(this.pageContainer, data);
      } else if (route === 'philosophy') {
        const data = await store.getTabContent('philosophy');
        renderPhilosophy(this.pageContainer, data);
      } else if (route === 'education') {
        const data = await store.getTabContent('education');
        renderEducation(this.pageContainer, data);
      } else if (route === 'licenses') {
        const data = await store.getTabContent('licenses');
        renderLicenses(this.pageContainer, data);
      } else if (route === 'certificates') {
        const data = await store.getTabContent('certificates');
        renderCertificates(this.pageContainer, data);
      } else if (route === 'research') {
        const data = await store.getTabContent('research');
        renderResearch(this.pageContainer, data);
      } else if (route === 'teaching') {
        const data = await store.getTabContent('teaching');
        renderTeaching(this.pageContainer, data);
      } else if (route === 'materials') {
        const data = await store.getTabContent('materials');
        renderMaterials(this.pageContainer, data);
      } else if (route === 'performance') {
        const data = await store.getTabContent('performance');
        renderPerformance(this.pageContainer, data);
      } else if (route === 'awards') {
        const data = await store.getTabContent('awards');
        renderAwards(this.pageContainer, data);
      } else if (route === 'service') {
        const data = await store.getTabContent('service');
        renderService(this.pageContainer, data);
      } else if (route === 'projects') {
        const data = await store.getTabContent('projects');
        renderProjects(this.pageContainer, data);
      } else if (route === 'development') {
        const data = await store.getTabContent('development');
        renderDevelopment(this.pageContainer, data);
      } else if (route === 'reading') {
        const data = await store.getTabContent('reading');
        renderReading(this.pageContainer, data);
      } else if (route === 'testimonials') {
        const data = await store.getTabContent('testimonials');
        renderTestimonials(this.pageContainer, data);
      } else if (route === 'gallery') {
        const data = await store.getTabContent('gallery');
        renderGallery(this.pageContainer, data);
      } else if (route === 'contact') {
        const data = await store.getTabContent('contact');
        renderContact(this.pageContainer, data, store.site);
      } else {
        // Custom or dynamic tab
        const data = await store.getTabContent(route);
        renderCustom(this.pageContainer, tabMeta || { label: route, id: route }, data);
      }
      this.ownerTools?.decorate();
    } catch (err) {
      console.error(`Error loading tab "${route}":`, err);
      this.pageContainer.innerHTML = `
        <div class="page-view" style="text-align: center; padding: 4rem 2rem;">
          <h3 style="color: var(--color-danger); margin-bottom: 0.5rem;">Section Unavailable</h3>
          <p style="color: var(--text-secondary); max-width: 45ch; margin: 0 auto 1.5rem;">
            The requested portfolio section could not be loaded or is being updated.
          </p>
          <a href="#/cover" class="btn btn-secondary btn-sm">Return to Cover</a>
        </div>
      `;
    }
  }
  currentRoute() { return router.currentRoute; }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
