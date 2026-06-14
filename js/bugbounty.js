/* =============================================================================
   bugbounty.js — Sección Bug Bounty
============================================================================= */

(function () {

  let allBugs      = [];
  let filteredBugs = [];
  let currentPage  = 1;
  let currentTag   = 'All';
  const itemsPerPage = 9;

  const SEVERITY = {
    'Critical':      { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'  },
    'High':          { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)' },
    'Medium':        { color: '#eab308', bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.3)'  },
    'Low':           { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'  },
    'Informational': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)' },
  };

  const STATUS = {
    'resolved':  { label: 'Resolved',  color: '#22c55e' },
    'accepted':  { label: 'Accepted',  color: '#3b82f6' },
    'duplicate': { label: 'Duplicate', color: '#8b5cf6' },
    'triaged':   { label: 'Triaged',   color: '#f59e0b' },
    'pending':   { label: 'Pending',   color: '#6b7280' },
    'n/a':       { label: 'N/A',       color: '#6b7280' },
  };

  /* ── Header ──────────────────────────────────────────────────────────────── */
  async function loadHeader() {
    const res  = await fetch('header.html');
    const html = await res.text();
    document.getElementById('header-container').innerHTML = html;
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('nav-accent');
      if (link.getAttribute('href').split('/').pop() === 'bugbounty.html')
        link.classList.add('nav-accent');
    });
  }

  /* ── Init ────────────────────────────────────────────────────────────────── */
  window.initBugBounty = async function () {
    await loadHeader();

    try {
      const res   = await fetch('bugbounty.json');
      allBugs     = await res.json();
    } catch { allBugs = []; }

    filteredBugs = [...allBugs];

    const tagsSet = new Set();
    allBugs.forEach(b => {
      (b.tags     || []).forEach(t => tagsSet.add(t.toLowerCase()));
      if (b.severity) tagsSet.add(b.severity.toLowerCase());
      if (b.type)     tagsSet.add(b.type.toLowerCase());
    });

    renderTags(Array.from(tagsSet).sort());
    setupSearch();
    renderBugs();
  };

  /* ── Tarjeta ─────────────────────────────────────────────────────────────── */
  function createCard(b) {
    const sev    = SEVERITY[b.severity] || SEVERITY['Informational'];
    const st     = STATUS[(b.status || '').toLowerCase()] || STATUS['pending'];
    const cvss   = b.cvss   ? parseFloat(b.cvss).toFixed(1) : null;
    const bounty = b.bounty && b.bounty !== '' ? b.bounty : null;
    const dateStr = b.date
      ? new Date(b.date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })
      : '';

    const tagsHtml = (b.tags || []).slice(0, 4).map(t =>
      `<span class="bb-card-tag">#${t.toLowerCase()}</span>`
    ).join('');

    return `
      <a href="bugbounty-report.html?id=${b.id}" class="bb-card">

        <div class="bb-card-head">
          <span class="bb-sev-badge"
            style="background:${sev.bg};color:${sev.color};border:1px solid ${sev.border};">
            <span class="bb-dot" style="background:${sev.color};box-shadow:0 0 5px ${sev.color}44;"></span>
            ${b.severity}
          </span>
          <span class="bb-status-badge" style="color:${st.color};">
            <span class="bb-dot" style="background:${st.color};"></span>
            ${st.label}
          </span>
        </div>

        <div class="bb-card-type">${b.type || 'Web'}</div>
        <h3 class="bb-card-title">${b.title}</h3>
        <p class="bb-card-desc">${b.description}</p>

        <div class="bb-card-meta">
          ${b.program ? `<span class="bb-meta-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            ${b.program}
          </span>` : ''}
          ${cvss ? `<span class="bb-meta-item" style="color:${sev.color};font-weight:700;">
            CVSS ${cvss}
          </span>` : ''}
          ${bounty ? `<span class="bb-meta-item bb-bounty">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            ${bounty}
          </span>` : ''}
        </div>

        <div class="bb-card-footer">
          <div class="bb-card-tags">${tagsHtml}</div>
          ${dateStr ? `<span class="bb-card-date">${dateStr}</span>` : ''}
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
        filterBugs();
      });
    });
  }

  /* ── Search ──────────────────────────────────────────────────────────────── */
  function setupSearch() {
    document.getElementById('search-input').addEventListener('input', () => {
      currentPage = 1;
      filterBugs();
    });
  }

  /* ── Filter ──────────────────────────────────────────────────────────────── */
  function filterBugs() {
    const q = document.getElementById('search-input').value.toLowerCase();
    filteredBugs = allBugs.filter(b => {
      const matchText = !q ||
        b.title.toLowerCase().includes(q)       ||
        b.description.toLowerCase().includes(q) ||
        (b.program || '').toLowerCase().includes(q) ||
        (b.type    || '').toLowerCase().includes(q);

      let matchTag = true;
      if (currentTag !== 'All') {
        const flat = [];
        (b.tags || []).forEach(t => flat.push(t.toLowerCase()));
        if (b.severity) flat.push(b.severity.toLowerCase());
        if (b.type)     flat.push(b.type.toLowerCase());
        matchTag = flat.includes(currentTag);
      }
      return matchText && matchTag;
    });
    renderBugs();
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */
  function renderBugs() {
    const grid  = document.getElementById('bugs-grid');
    const start = (currentPage - 1) * itemsPerPage;
    const items = filteredBugs.slice(start, start + itemsPerPage);

    if (!items.length) {
      grid.innerHTML = `<p class="bb-empty">No se encontraron resultados.</p>`;
      document.getElementById('pagination-container').innerHTML = '';
      return;
    }
    grid.innerHTML = items.map(createCard).join('');
    renderPagination();
  }

  /* ── Pagination ──────────────────────────────────────────────────────────── */
  function renderPagination() {
    const total     = Math.ceil(filteredBugs.length / itemsPerPage);
    const container = document.getElementById('pagination-container');
    if (total <= 1) { container.innerHTML = ''; return; }

    function getPages(cur, tot) {
      const s = new Set([1, tot]);
      for (let i = cur - 1; i <= cur + 1; i++) if (i > 0 && i <= tot) s.add(i);
      const sorted = [...s].sort((a,b)=>a-b);
      const out = []; let prev = null;
      sorted.forEach(p => { if (prev !== null && p - prev > 1) out.push('...'); out.push(p); prev = p; });
      return out;
    }

    const btnStyle = (active) =>
      `background:${active?'var(--color-accent)':'var(--color-surface)'};` +
      `color:${active?'white':'var(--color-text-muted)'};` +
      `border:1px solid ${active?'var(--color-accent)':'var(--color-border)'};`;

    let html = `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
      data-page="${currentPage-1}" ${currentPage===1?'disabled':''}
      style="${btnStyle(false)}opacity:${currentPage===1?'0.35':'1'};">‹</button>`;

    getPages(currentPage, total).forEach(p => {
      if (p === '...') {
        html += `<span style="color:var(--color-text-muted);padding:0 2px;align-self:center;">…</span>`;
      } else {
        html += `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
          data-page="${p}" style="${btnStyle(p===currentPage)}">${p}</button>`;
      }
    });

    html += `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
      data-page="${currentPage+1}" ${currentPage===total?'disabled':''}
      style="${btnStyle(false)}opacity:${currentPage===total?'0.35':'1'};">›</button>`;

    container.innerHTML = html;
    container.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', e => {
        currentPage = parseInt(e.target.dataset.page);
        renderBugs();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

})();
