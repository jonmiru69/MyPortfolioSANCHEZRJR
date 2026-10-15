/**
 * Hash Router & Keyboard Binder Navigation
 * Handles deep links, arrow keys, Home/End, and tab flipping transitions.
 */

import { store } from './store.js';

class Router {
  constructor() {
    this.currentRoute = '';
    this.routeHandlers = new Map();
    this.isNavigating = false;
  }

  init() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    window.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Initial route handling
    if (!window.location.hash) {
      window.location.hash = '#/cover';
    } else {
      this.handleHashChange();
    }
  }

  register(route, handler) {
    this.routeHandlers.set(route, handler);
  }

  navigate(path) {
    const formatted = path.startsWith('#/') ? path : `#/${path.replace(/^#?\/?/, '')}`;
    if (window.location.hash === formatted) {
      this.handleHashChange();
    } else {
      window.location.hash = formatted;
    }
  }

  handleHashChange() {
    const rawHash = window.location.hash || '#/cover';
    const cleanRoute = rawHash.replace(/^#\/?/, '').split('?')[0] || 'cover';
    this.currentRoute = cleanRoute;

    // Notify listeners
    if (this.routeHandlers.has(cleanRoute)) {
      this.routeHandlers.get(cleanRoute)();
    } else if (this.routeHandlers.has('*')) {
      this.routeHandlers.get('*')(cleanRoute);
    }
    store.emit('route-changed', cleanRoute);
  }

  // Keyboard Navigation: Left/Right arrow, Home/End
  handleKeydown(e) {
    // Ignore keystrokes when user is typing in inputs or textareas
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      return;
    }

    // Modal/Lightbox Escape Key
    if (e.key === 'Escape') {
      const activeLightbox = document.querySelector('.lightbox-backdrop');
      if (activeLightbox) {
        activeLightbox.remove();
        return;
      }
      const activeModal = document.querySelector('.modal-overlay');
      if (activeModal) {
        activeModal.remove();
        return;
      }
    }

    if (this.currentRoute === 'admin') return; // Do not flip tabs in admin panel

    const visibleTabs = store.getVisibleTabs();
    if (!visibleTabs || visibleTabs.length === 0) return;

    const currentIndex = visibleTabs.findIndex(t => t.slug === this.currentRoute || t.id === this.currentRoute);

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % visibleTabs.length;
      this.navigate(visibleTabs[nextIndex].slug || visibleTabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
      this.navigate(visibleTabs[prevIndex].slug || visibleTabs[prevIndex].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.navigate(visibleTabs[0].slug || visibleTabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.navigate(visibleTabs[visibleTabs.length - 1].slug || visibleTabs[visibleTabs.length - 1].id);
    }
  }
}

export const router = new Router();
