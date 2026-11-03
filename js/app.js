import { createRevealMotion } from "./motion.js";
import { store } from "./store.js";
import { router } from "./router.js";
import { setupInlineOwner } from "./inline-owner.js";
import { escapeHTML as safe } from "./utils.js";
import { renderCover } from "./render/cover.js";
import { renderCertificates } from "./render/certificates.js";
import { renderResume } from "./render/resume.js";
import { renderProfile } from "./render/profile.js";
import { renderContact } from "./render/contact.js";
import { renderRecords } from "./render/records.js";
import { renderAdmin } from "./admin/admin-app.js";
class App {
  constructor() {
    this.pageContainer = null;
    this.tabsContainer = null;
    this.generation = 0;
  }
  async init() {
    this.pageContainer = document.getElementById("binder-page-content");
    this.tabsContainer = document.getElementById("binder-tabs-nav");
    this.motion = createRevealMotion(this.pageContainer);
    await store.init();
    store.setTheme(
      localStorage.getItem("portfolio-theme") ||
        store.site?.theme?.default_mode ||
        "dark",
    );
    const toggle = document.getElementById("btn-toggle-theme");
    const root = document.documentElement;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let switchingTheme = false;
    toggle.onclick = async () => {
      if (switchingTheme) return;
      if (reducedMotion.matches || typeof toggle.animate !== "function") {
        store.toggleTheme();
        return;
      }

      switchingTheme = true;
      try {
        const rest = getComputedStyle(toggle).transform;
        await toggle.animate([
          { transform: rest, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
          { transform: "translateY(-8px)", offset: 0.38, easing: "ease-in-out" },
          { transform: "translateY(1px) scale(1.03, 0.96)", offset: 0.82 },
          { transform: rest },
        ], { duration: 150 }).finished;

        if (reducedMotion.matches || typeof document.startViewTransition !== "function") {
          store.toggleTheme();
          return;
        }

        const rect = toggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.ceil(Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        ));
        root.style.setProperty("--theme-reveal-origin", `${x}px ${y}px`);
        root.style.setProperty("--theme-reveal-radius", `${radius}px`);
        root.classList.add("is-revealing-theme");
        const transition = document.startViewTransition(() => store.toggleTheme());
        // A skipped transition still runs the theme update.
        transition.ready.catch(() => {});
        await transition.finished;
      } finally {
        root.classList.remove("is-revealing-theme");
        root.style.removeProperty("--theme-reveal-origin");
        root.style.removeProperty("--theme-reveal-radius");
        switchingTheme = false;
      }
    };
    const syncTheme = (mode) => {
      toggle.textContent = mode === "dark" ? "Light mode" : "Dark mode";
      localStorage.setItem("portfolio-theme", mode);
    };
    store.subscribe("theme-changed", syncTheme);
    syncTheme(store.themeMode);
    this.ownerTools = setupInlineOwner(this);
    this.setupFooter();
    store.subscribe("route-changed", (route) => this.handleRoute(route));
    store.subscribe("preset-changed", () => {
      this.renderTabs();
      this.handleRoute(router.currentRoute);
    });
    store.subscribe("published-updated", () => {
      this.setupFooter();
      this.renderTabs();
      this.handleRoute(router.currentRoute);
    });
    router.init();
  }
  setupFooter() {
    document.getElementById("footer-copy-text").textContent =
      store.site?.identity?.footer_text ||
      store.site?.identity?.name ||
      "Portfolio";
  }
  renderTabs() {
    const visible = store.getVisibleTabs();
    const primary = ["cover", "profile", "resume", "certificates", "contact"];
    const active = router.currentRoute;
    const link = (t) =>
      `<a href="#/${safe(t.slug || t.id)}" class="binder-tab ${active === t.id || active === t.slug ? "active" : ""}" ${active === t.id || active === t.slug ? 'aria-current="page"' : ""}>${safe(t.id === "resume" ? "Résumé" : t.label)}</a>`;
    this.tabsContainer.innerHTML = visible
      .filter((t) => primary.includes(t.id))
      .map(link)
      .join("");
    const extra = visible.filter((t) => !primary.includes(t.id));
    if (extra.length) {
      const details = document.createElement("details");
      details.className = "more-sections";
      const summary = document.createElement("summary");
      summary.textContent = "More";
      const panel = document.createElement("div");
      panel.className = "more-sections-panel";
      panel.innerHTML =
        visible
          .filter((t) => ["profile", "contact"].includes(t.id))
          .map((t) => `<div class="mobile-only">${link(t)}</div>`)
          .join("") + extra.map(link).join("");
      details.append(summary, panel);
      this.tabsContainer.append(details);
      details.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          details.open = false;
          summary.focus();
        }
      });
      details.addEventListener("focusout", (e) => {
        if (!details.contains(e.relatedTarget)) details.open = false;
      });
    }
    this.tabsContainer.hidden = active === "admin";
  }
  async handleRoute(route) {
    const accent = store.site?.theme?.color_accent;
    if (/^#[a-f0-9]{6}$/i.test(accent || ""))
      document.documentElement.style.setProperty("--accent", accent);
    const generation = ++this.generation;
    document.body.classList.toggle("is-admin", route === "admin");
    this.renderTabs();
    const section = store.getTabMeta(route)?.id || route;
    const stage = document.createElement("div");
    stage.dataset.route = section;
    try {
      if (route === "admin") {
        this.pageContainer.replaceChildren(stage);
        await renderAdmin(stage);
        this.ownerTools.decorate();
        return;
      }
      const data = await store.getTabContent(section);
      if (generation !== this.generation) return;
      if (section === "cover") await renderCover(stage, store.site);
      else if (section === "profile")
        await renderProfile(stage, data, store.site);
      else if (section === "resume") await renderResume(stage, data);
      else if (section === "certificates") renderCertificates(stage, data);
      else if (section === "contact") renderContact(stage, data, store.site);
      else renderRecords(stage, data, section);
      if (generation !== this.generation) return;
      this.pageContainer.replaceChildren(stage);
      this.pageContainer.dataset.route = route;
      document.title = `${store.getTabMeta(route)?.label || "Portfolio"} · ${store.site.identity.name}`;
      const description = store.site.seo?.site_description;
      if (description)
        document.querySelector('meta[name="description"]').content =
          description;
      for (const [property, value] of Object.entries({
        "og:title": store.site.seo?.site_title,
        "og:description": description,
        "og:image": store.site.seo?.og_image,
      })) {
        const meta = document.querySelector(`meta[property="${property}"]`);
        if (meta && value) meta.content = value;
      }
      this.ownerTools.decorate();
      this.animate();
      if (this.lastRoute !== route) {
        window.scrollTo(0, 0);
        this.lastRoute = route;
      }
    } catch (error) {
      console.error("Could not load portfolio section", error);
      this.pageContainer.innerHTML =
        '<div class="page-view"><h1>Unable to load</h1><p>Please reload the page and try again.</p><a class="btn btn-primary" href="#/cover">Return to overview</a></div>';
    }
  }
  animate() {
    this.motion.refresh();
  }
  currentRoute() {
    return store.getTabMeta(router.currentRoute)?.id || router.currentRoute;
  }
}
document.addEventListener("DOMContentLoaded", () =>
  new App().init().catch((error) => {
    console.error(error);
    document.getElementById("binder-page-content").textContent =
      "The portfolio could not load. Please refresh to try again.";
  }),
);
