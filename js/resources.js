/* =============================================================================
   resources.js — Sección de Recursos IA
   Mismo patrón que certificates.js / bugbounty.js
============================================================================= */

(function () {

  let allResources      = [];
  let filteredResources = [];
  let currentPage       = 1;
  let currentTag        = 'All';
  const itemsPerPage    = 9;

  /* Colores por tipo de recurso */
  const TYPE_META = {
    'prompts':  { color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.3)', label: 'Prompts' },
    'opinion':  { color: '#38bdf8', bg: 'rgba(56,189,248,0.10)',  border: 'rgba(56,189,248,0.3)',  label: 'Opinión' },
    'links':    { color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.3)',   label: 'Links'   },
    'workflow': { color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.3)',  label: 'Workflow'},
    'tools':    { color: '#f472b6', bg: 'rgba(244,114,182,0.10)', border: 'rgba(244,114,182,0.3)', label: 'Tools'  },
    'default':  { color: '#8b949e', bg: 'rgba(139,148,158,0.10)', border: 'rgba(139,148,158,0.3)', label: 'Recurso'},
  };

  /* ── Header ─────────────────────────────────────────────────────────────── */
  async function loadHeader() {
    const res  = await fetch('header.html');
    const html = await res.text();
    document.getElementById('header-container').innerHTML = html;
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('nav-accent');
      if (link.getAttribute('href').split('/').pop() === 'resources.html')
        link.classList.add('nav-accent');
    });
  }

  /* ── Init ────────────────────────────────────────────────────────────────── */
  window.initResources = async function () {
    await loadHeader();
    try {
      const res   = await fetch('resources.json');
      allResources = await res.json();
    } catch { allResources = []; }

    filteredResources = [...allResources];

    const tagsSet = new Set();
    allResources.forEach(r => {
      (r.tags || []).forEach(t => tagsSet.add(t.toLowerCase()));
      if (r.type)     tagsSet.add(r.type.toLowerCase());
      if (r.category) tagsSet.add(r.category.toLowerCase());
    });

    renderTags(Array.from(tagsSet).sort());
    setupSearch();
    renderResources();
    updateStats();
  };

  /* ── Stats ───────────────────────────────────────────────────────────────── */
  function updateStats() {
    const el = document.getElementById('res-stats');
    if (!el) return;
    const types = {};
    allResources.forEach(r => {
      const t = r.type || 'default';
      types[t] = (types[t] || 0) + 1;
    });
    el.innerHTML = Object.entries(types).map(([t, n]) => {
      const m = TYPE_META[t] || TYPE_META.default;
      return `<div class="res-stat-chip" style="border-color:${m.border};background:${m.bg};">
        <span class="res-dot" style="background:${m.color};box-shadow:0 0 5px ${m.color}66;"></span>
        <span style="color:${m.color};font-weight:700;">${n}</span>
        <span style="color:var(--color-text-muted);">${m.label}</span>
      </div>`;
    }).join('') + `<div class="res-stat-chip" style="border-color:var(--color-border);">
      <span style="color:var(--color-text);font-weight:700;">${allResources.length}</span>
      <span style="color:var(--color-text-muted);">Total</span>
    </div>`;
  }

  /* ── Tarjeta ─────────────────────────────────────────────────────────────── */
  function createCard(r) {
    const tm = TYPE_META[r.type] || TYPE_META.default;
    const dateStr = r.date
      ? new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '';

    const tagsHtml = (r.tags || []).slice(0, 4)
      .map(t => `<span class="res-card-tag">#${t.toLowerCase()}</span>`)
      .join('');

    const featuredBadge = r.featured
      ? `<span class="res-featured-badge">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Destacado
        </span>`
      : '';

    /* Ícono por tipo */
    const icons = {
      prompts:  `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
      opinion:  `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
      links:    `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
      workflow: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
      tools:    `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
      default:  `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    };
    const iconPath = icons[r.type] || icons.default;

    return `
      <a href="resource.html?id=${r.id}" class="res-card" style="--res-accent:${tm.color};">

        <!-- Cabecera: tipo + featured -->
        <div class="res-card-head">
          <span class="res-type-badge" style="background:${tm.bg};color:${tm.color};border:1px solid ${tm.border};">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
            ${tm.label}
          </span>
          ${featuredBadge}
        </div>

        <!-- Ícono grande central -->
        <div class="res-card-icon" style="background:${tm.bg};border:1px solid ${tm.border};">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${tm.color}"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
        </div>

        <!-- Categoría -->
        <div class="res-card-category" style="color:${tm.color};">${r.category || tm.label}</div>

        <!-- Título -->
        <h3 class="res-card-title">${r.title}</h3>

        <!-- Descripción -->
        <p class="res-card-desc">${r.description}</p>

        <!-- Footer: tags + fecha -->
        <div class="res-card-footer">
          <div class="res-card-tags">${tagsHtml}</div>
          ${dateStr ? `<span class="res-card-date">${dateStr}</span>` : ''}
        </div>

      </a>
    `;
  }

  /* ── Tags ────────────────────────────────────────────────────────────────── */
  function renderTags(tags) {
    const container  = document.getElementById('tags-container');
    const MAX_TAGS   = 12;
    const extraCount = tags.length - MAX_TAGS;

    let html = `<button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
      style="background-color:var(--color-accent);color:white;">All</button>`;

    tags.forEach((tag, idx) => {
      const hidden = idx >= MAX_TAGS;
      html += `<button data-tag="${tag}"
        class="tag-btn rounded-full px-3 py-1 text-xs font-medium${hidden ? ' tags-extra-btn' : ''}"
        style="background-color:var(--color-surface-raised);color:var(--color-text-muted);
               border:1px solid var(--color-border);${hidden ? 'display:none;' : ''}">
        #${tag}</button>`;
    });

    if (extraCount > 0) {
      html += `<button id="tags-show-more" class="rounded-full px-3 py-1 text-xs font-medium"
        data-expanded="false"
        style="background-color:var(--color-surface-raised);color:var(--color-accent-light);
               border:1px solid var(--color-accent-light);cursor:pointer;">
        +${extraCount} más</button>`;
    }

    container.innerHTML = html;

    const showMore = document.getElementById('tags-show-more');
    if (showMore) {
      showMore.addEventListener('click', () => {
        const expanded = showMore.dataset.expanded === 'true';
        container.querySelectorAll('.tags-extra-btn').forEach(b =>
          b.style.display = expanded ? 'none' : '');
        showMore.textContent      = expanded ? `+${extraCount} más` : 'Ver menos';
        showMore.dataset.expanded = String(!expanded);
      });
    }

    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        currentTag  = e.target.dataset.tag;
        currentPage = 1;
        document.querySelectorAll('.tag-btn').forEach(b => {
          b.style.backgroundColor = 'var(--color-surface-raised)';
          b.style.color           = 'var(--color-text-muted)';
          b.style.border          = '1px solid var(--color-border)';
        });
        e.target.style.backgroundColor = 'var(--color-accent)';
        e.target.style.color           = 'white';
        e.target.style.border          = 'none';
        filterResources();
      });
    });
  }

  /* ── Search ──────────────────────────────────────────────────────────────── */
  function setupSearch() {
    document.getElementById('search-input').addEventListener('input', () => {
      currentPage = 1;
      filterResources();
    });
  }

  /* ── Filter ──────────────────────────────────────────────────────────────── */
  function filterResources() {
    const q = document.getElementById('search-input').value.toLowerCase();
    filteredResources = allResources.filter(r => {
      const matchText = !q ||
        r.title.toLowerCase().includes(q)       ||
        r.description.toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q) ||
        (r.type || '').toLowerCase().includes(q);

      let matchTag = true;
      if (currentTag !== 'All') {
        const flat = [];
        (r.tags || []).forEach(t => flat.push(t.toLowerCase()));
        if (r.type)     flat.push(r.type.toLowerCase());
        if (r.category) flat.push(r.category.toLowerCase());
        matchTag = flat.includes(currentTag);
      }
      return matchText && matchTag;
    });
    renderResources();
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */
  function renderResources() {
    const grid  = document.getElementById('resources-grid');
    const start = (currentPage - 1) * itemsPerPage;
    const items = filteredResources.slice(start, start + itemsPerPage);

    if (!items.length) {
      grid.innerHTML = `<p class="res-empty">No se encontraron recursos.</p>`;
      document.getElementById('pagination-container').innerHTML = '';
      return;
    }
    grid.innerHTML = items.map(createCard).join('');
    renderPagination();
  }

  /* ── Pagination ──────────────────────────────────────────────────────────── */
  function renderPagination() {
    const total     = Math.ceil(filteredResources.length / itemsPerPage);
    const container = document.getElementById('pagination-container');
    if (total <= 1) { container.innerHTML = ''; return; }

    function getPages(cur, tot) {
      const s = new Set([1, tot]);
      for (let i = cur - 1; i <= cur + 1; i++) if (i > 0 && i <= tot) s.add(i);
      const sorted = [...s].sort((a,b) => a-b);
      const out = []; let prev = null;
      sorted.forEach(p => { if (prev !== null && p - prev > 1) out.push('...'); out.push(p); prev = p; });
      return out;
    }

    const bs = (active) =>
      `background:${active ? 'var(--color-accent)' : 'var(--color-surface)'};` +
      `color:${active ? 'white' : 'var(--color-text-muted)'};` +
      `border:1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'};`;

    let html = `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
      data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}
      style="${bs(false)}opacity:${currentPage === 1 ? '0.35' : '1'};">‹</button>`;

    getPages(currentPage, total).forEach(p => {
      if (p === '...') {
        html += `<span style="color:var(--color-text-muted);padding:0 2px;align-self:center;">…</span>`;
      } else {
        html += `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
          data-page="${p}" style="${bs(p === currentPage)}">${p}</button>`;
      }
    });

    html += `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
      data-page="${currentPage + 1}" ${currentPage === total ? 'disabled' : ''}
      style="${bs(false)}opacity:${currentPage === total ? '0.35' : '1'};">›</button>`;

    container.innerHTML = html;
    container.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', e => {
        currentPage = parseInt(e.target.dataset.page);
        renderResources();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

})();
