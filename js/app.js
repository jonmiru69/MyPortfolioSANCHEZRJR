/**
 * Application Entry Point
 * Orchestrates Store, Router, Binder Metaphor Shell, and Tab View Renderers.
 */

import { store } from './store.js';
import { router } from './router.js';

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
    this.presetSelect = null;
    this.themeToggleBtn = null;
    this.siteTitleEl = null;
  }

  async init() {
    this.pageContainer = document.getElementById('binder-page-content');
    this.tabsContainer = document.getElementById('binder-tabs-nav');
    this.presetSelect = document.getElementById('audience-preset-select');
    this.themeToggleBtn = document.getElementById('btn-toggle-theme');
    this.siteTitleEl = document.getElementById('site-branding-title');

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
    this.renderTabs();
    const menu = document.getElementById('section-menu-toggle');
    if (menu && this.tabsContainer) {
      document.documentElement.classList.add('js-nav');
      menu.addEventListener('click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open));
        this.tabsContainer.classList.toggle('menu-open', open);
      });
      this.tabsContainer.addEventListener('click', event => {
        if (event.target.closest('a')) {
          menu.setAttribute('aria-expanded', 'false');
          this.tabsContainer.classList.remove('menu-open');
        }
      });
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
    // Populate Presets
    if (this.presetSelect && store.site?.presets) {
      this.presetSelect.innerHTML = store.site.presets.map(p => `
        <option value="${p.id}" ${p.id === store.activePreset ? 'selected' : ''}>${p.name}</option>
      `).join('');

      this.presetSelect.addEventListener('change', (e) => {
        store.setPreset(e.target.value);
      });
    }

    // Theme Toggle
    if (this.themeToggleBtn) {
      this.themeToggleBtn.innerHTML = store.themeMode === 'dark' ? 'Light mode' : 'Dark mode';
      this.themeToggleBtn.addEventListener('click', () => store.toggleTheme());
    }

    // Branding Title
    if (this.siteTitleEl && store.site?.identity) {
      this.siteTitleEl.textContent = store.site.identity.name || 'Portfolio Binder';
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
        renderProfile(this.pageContainer, data, store.site);
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
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
