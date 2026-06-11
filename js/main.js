/* =============================================================================
   main.js
   Lógica principal del blog de hacking.
   
   Contiene:
     · loadHeader()        → Carga el header compartido e indica la página activa
     · createMachineCard() → Genera el HTML de una tarjeta de máquina
     · loadLatestPosts()   → Muestra las 3 últimas máquinas en index.html
     · initBlog()          → Inicializa la vista de blog (filtros, búsqueda, paginación)
     · initTools()         → Inicializa la vista de herramientas
     · loadStats()         → Carga y dibuja el gráfico de estadísticas (donut chart)
============================================================================= */


/* =============================================================================
   CONSTANTES GLOBALES
============================================================================= */

// URL base del servidor VPS donde están alojadas las imágenes de las máquinas
const REMOTE_MACHINES = "https://51.170.40.86/machines";

// Paleta de colores por nivel de dificultad (fondo, texto, borde)
const DIFFICULTY_COLORS = {
  Easy: {
    bg:     "rgba(40,167,69,0.15)",
    text:   "#28A745",
    border: "rgba(40,167,69,0.4)"
  },
  Intermediate: {
    bg:     "rgba(255,140,0,0.15)",
    text:   "#FF8C00",
    border: "rgba(255,140,0,0.4)"
  },
  Hard: {
    bg:     "rgba(220,20,60,0.15)",
    text:   "#DC143C",
    border: "rgba(220,20,60,0.4)"
  },
  Insane: {
    bg:     "rgba(138,43,226,0.15)",
    text:   "#8A2BE2",
    border: "rgba(138,43,226,0.4)"
  }
};

// Color de fallback para dificultades no reconocidas
const DIFFICULTY_COLOR_DEFAULT = {
  bg:     "var(--color-surface-raised)",
  text:   "var(--color-text-muted)",
  border: "var(--color-border)"
};


/* =============================================================================
   HEADER
   Carga el header.html en el contenedor #header-container y marca
   como activo el enlace de navegación correspondiente a la página actual.
============================================================================= */

async function loadHeader(activePage = '') {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error("Failed to load header");

    const html = await res.text();
    document.getElementById('header-container').innerHTML = html;

    // Recorrer todos los enlaces de navegación y marcar el activo
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.classList.remove('nav-accent');
      link.style.color = 'var(--color-text-muted)';

      const href = link.getAttribute('href').replace(/^\//, '');

      const isCurrentPage   = activePage.includes(href) && href !== '';
      const isHomePage      = activePage === 'index.html' && href === '';

      if (isCurrentPage || isHomePage) {
        link.classList.add('nav-accent');
        link.style.color = 'var(--color-accent-light)';
      }
    });

  } catch (e) {
    console.error(e);
  }
}


/* =============================================================================
   TARJETA DE MÁQUINA
   Genera el HTML completo de una tarjeta para una máquina CTF.
   Incluye: imagen, fecha, título, descripción, tags y badge de estado.
============================================================================= */

function createMachineCard(m) {
  // Formatear la fecha en formato legible (ej: "January 5, 2025")
  const dateStr = new Date(m.date).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric"
  });

  // ── Badge de dificultad ──────────────────────────────────────────────────
  const diff = DIFFICULTY_COLORS[m.difficulty] || DIFFICULTY_COLOR_DEFAULT;
  let tagsHtml = '';

  if (m.difficulty) {
    tagsHtml += `
      <span class="rounded-full font-medium px-2 py-0.5 text-xs"
        style="
          background-color: ${diff.bg};
          color: ${diff.text};
          border: 1px solid ${diff.border};
        ">
        ${m.difficulty.toLowerCase()}
      </span>
    `;
  }

  // ── Badge de sistema operativo ───────────────────────────────────────────
  if (m.os) {
    tagsHtml += `
      <span class="rounded-full font-medium px-2 py-0.5 text-xs"
        style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border)">
        #${m.os.toLowerCase()}
      </span>
    `;
  }

  // ── Badges de skills (habilidades requeridas) ────────────────────────────
  // Máximo de tags visibles antes del botón "Ver más"
  const MAX_VISIBLE_TAGS = 3;

  if (m.skills) {
    m.skills.forEach((s, idx) => {
      const hidden = idx >= MAX_VISIBLE_TAGS ? ' data-extra-tag="true" style="display:none; background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border)"' : ' style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border)"';
      tagsHtml += `<span class="rounded-full font-medium px-2 py-0.5 text-xs"${hidden}>#${s.toLowerCase()}</span>`;
    });

    // Botón "Ver más" solo si hay tags ocultos
    if (m.skills.length > MAX_VISIBLE_TAGS) {
      const extra = m.skills.length - MAX_VISIBLE_TAGS;
      tagsHtml += `
        <button class="tag-toggle-btn rounded-full px-2 py-0.5 text-xs font-medium"
          style="background-color: var(--color-surface-raised); color: var(--color-accent-light); border: 1px solid var(--color-accent-light); cursor:pointer;"
          data-expanded="false">
          +${extra} más
        </button>
      `;
    }
  }

  // ── Badge de estado (Activa / Retirada) ──────────────────────────────────
  const statusTag = m.active
    ? `<span class="rounded-full font-bold px-2 py-0.5 text-xs"
          style="color: #28A745; background: rgba(145,152,161,0.2); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);">
          Activa
       </span>`
    : `<span class="rounded-full font-bold px-2 py-0.5 text-xs"
          style="color: #DC143C; background: rgba(145,152,161,0.2); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);">
          Retirada
       </span>`;

  // El badge de estado va primero antes que los demás tags
  tagsHtml = statusTag + ' ' + tagsHtml;

  // ── Icono de candado (solo si la máquina está activa en HTB) ────────────
  const lockSvg = m.active ? `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clip-rule="evenodd">
      </path>
    </svg>
  ` : '';

  // ── HTML completo de la tarjeta ──────────────────────────────────────────
  return `
    <a href="view.html?machine=${m.id.toLowerCase()}"
       class="group block rounded-lg overflow-hidden transition-colors"
       style="background-color: var(--color-surface); border: 1px solid var(--color-border); position: relative;">

      <!-- Banner "Nos deja pronto" si la máquina está próxima a retirarse -->
      ${m.active_to_retire ? `
        <div style="
          position: absolute; top: 12px; right: 12px;
          padding: 4px 10px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.5px; border-radius: 999px;
          color: #ffb3b3; background: rgba(220,20,60,0.12);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(220,20,60,0.25); z-index: 10;">
          Nos deja pronto…
        </div>
      ` : ''}

      <!-- Imagen de portada de la máquina -->
      <div class="post-image-container">
        <img src="${REMOTE_MACHINES}/${m.id.toLowerCase()}/images/logo.png" alt="${m.title}">
      </div>

      <!-- Contenido textual -->
      <div class="p-5">

        <!-- Fecha y candado (si activa) -->
        <div class="mb-2 flex items-center gap-2">
          <time datetime="${m.date}" class="text-xs" style="color: var(--color-text-muted)">
            ${dateStr}
          </time>
          ${lockSvg ? `
            <span class="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs"
              style="background-color: var(--color-surface-raised); color: var(--color-accent-light)">
              ${lockSvg}
            </span>
          ` : ''}
        </div>

        <h3 class="post-title mb-2 text-lg font-semibold transition-colors">
          ${m.title}
        </h3>

        <p class="post-description mb-3 text-sm leading-relaxed" style="color: var(--color-text-muted)">
          ${m.description}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          ${tagsHtml}
        </div>

      </div>
    </a>
  `;
}


/* =============================================================================
   INDEX — ÚLTIMAS MÁQUINAS
   Carga las 3 máquinas más recientes y las renderiza en #latest-posts-grid.
   Se usa únicamente en index.html.
============================================================================= */

async function loadLatestPosts() {
  try {
    const res      = await fetch('machines.json');
    const machines = await res.json();
    const grid     = document.getElementById('latest-posts-grid');

    // Ordenar por fecha descendente y tomar las 3 más recientes
    machines.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = machines.slice(0, 3);

    grid.innerHTML = latest.map(createMachineCard).join('');

  } catch (e) {
    console.error(e);
    document.getElementById('latest-posts-grid').innerHTML =
      '<p style="color:red">Failed to load posts</p>';
  }
}


/* =============================================================================
   BLOG — ESTADO GLOBAL
   Variables que controlan el estado de filtros, búsqueda y paginación
   de la vista principal de máquinas (blog / CTF).
============================================================================= */

let allMachines      = [];  // Todas las máquinas cargadas del JSON
let filteredMachines = [];  // Subconjunto tras aplicar filtros activos
let currentPage      = 1;   // Página actual de la paginación
let currentTag       = 'All'; // Tag de filtrado activo ('All' = sin filtro)
let currentType      = 'All'; // Tipo de CTF activo ('All' = sin filtro)

const itemsPerPage = 6; // Número de tarjetas por página


/* =============================================================================
   BLOG — INICIALIZACIÓN
   Carga el JSON, extrae los tags disponibles, configura los filtros y
   renderiza la primera página.
============================================================================= */

async function initBlog() {
  try {
    const res    = await fetch('machines.json');
    allMachines  = await res.json();
    filteredMachines = [...allMachines];

    // Construir el conjunto de tags únicos a partir de os, difficulty, skills y estado
    const tagsSet = new Set();
    allMachines.forEach(m => {
      if (m.os)         tagsSet.add(m.os.toLowerCase());
      if (m.difficulty) tagsSet.add(m.difficulty.toLowerCase());
      if (m.skills)     m.skills.forEach(s => tagsSet.add(s.toLowerCase()));

      tagsSet.add(m.active ? 'activa' : 'retirada');

      if (m.active_to_retire) tagsSet.add('active_to_retire');
    });

    renderTags(Array.from(tagsSet));
    renderTypeFilters();
    setupSearch();
    renderBlog();

  } catch (e) {
    console.error(e);
    document.getElementById('posts-grid').innerHTML =
      '<p style="color:red">Failed to load posts</p>';
  }
}


/* =============================================================================
   BLOG — RENDERIZADO DE TAGS
   Genera los botones de tag en #tags-container y les asigna el evento
   de filtrado al hacer clic.
============================================================================= */

function renderTags(tags) {
  const container  = document.getElementById('tags-container');
  const MAX_TAGS   = 12; // tags visibles antes de "Ver más"
  const extraCount = tags.length - MAX_TAGS;

  // ── Botón "All" activo por defecto ───────────────────────────────────────
  let html = `
    <button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium transition-colors"
      style="background-color: var(--color-accent); color: white">
      All
    </button>
  `;

  // ── Botones de tags: primeros MAX_TAGS visibles, el resto ocultos ─────────
  tags.forEach((tag, idx) => {
    const label   = tag === 'active_to_retire' ? '#nos_deja_pronto' : `#${tag}`;
    const hidden  = idx >= MAX_TAGS;
    html += `
      <button data-tag="${tag}"
        class="tag-btn rounded-full px-3 py-1 text-xs font-medium transition-colors${hidden ? ' tags-extra-btn' : ''}"
        style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border);${hidden ? ' display:none;' : ''}">
        ${label}
      </button>
    `;
  });

  // ── Botón "Ver más" si hay tags ocultos ───────────────────────────────────
  if (extraCount > 0) {
    html += `
      <button id="tags-show-more"
        class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
        data-expanded="false"
        style="background-color: var(--color-surface-raised); color: var(--color-accent-light); border: 1px solid var(--color-accent-light); cursor: pointer;">
        +${extraCount} más
      </button>
    `;
  }

  container.innerHTML = html;

  // ── Evento "Ver más / Ver menos" ─────────────────────────────────────────
  const showMoreBtn = document.getElementById('tags-show-more');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const expanded  = showMoreBtn.dataset.expanded === 'true';
      const extras    = container.querySelectorAll('.tags-extra-btn');

      if (expanded) {
        extras.forEach(b => b.style.display = 'none');
        showMoreBtn.textContent      = `+${extraCount} más`;
        showMoreBtn.dataset.expanded = 'false';
      } else {
        extras.forEach(b => b.style.display = '');
        showMoreBtn.textContent      = 'Ver menos';
        showMoreBtn.dataset.expanded = 'true';
      }
    });
  }

  // ── Eventos de filtrado por tag ───────────────────────────────────────────
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      currentTag = e.target.getAttribute('data-tag');

      // Resetear todos los botones al estilo inactivo
      document.querySelectorAll('.tag-btn').forEach(b => {
        b.style.backgroundColor = 'var(--color-surface-raised)';
        b.style.color           = 'var(--color-text-muted)';
        b.style.border          = '1px solid var(--color-border)';
      });

      // Marcar el botón clicado como activo
      e.target.style.backgroundColor = 'var(--color-accent)';
      e.target.style.color           = 'white';
      e.target.style.border          = 'none';

      filterBlog();
    });
  });
}


/* =============================================================================
   BLOG — FILTROS POR TIPO DE CTF
   Genera los botones de tipo (HackTheBox, TryHackMe, etc.) en #ctf-type-filter.
============================================================================= */

function renderTypeFilters() {
  const container = document.getElementById('ctf-type-filter');

  // Extraer los tipos únicos de todas las máquinas
  const types = [...new Set(allMachines.map(m => m.type))];

  let html = `
    <button data-type="All" class="type-btn rounded-lg px-4 py-2 text-sm font-medium"
      style="background-color: var(--color-accent); color: white;">
      All CTFs
    </button>
  `;

  types.forEach(type => {
    html += `
      <button data-type="${type}" class="type-btn rounded-lg px-4 py-2 text-sm font-medium"
        style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border);">
        ${type}
      </button>
    `;
  });

  container.innerHTML = html;

  // Asignar eventos de filtrado por tipo
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      currentType = e.target.dataset.type;

      // Resetear estilos de todos los botones de tipo
      document.querySelectorAll('.type-btn').forEach(b => {
        b.style.backgroundColor = 'var(--color-surface-raised)';
        b.style.color           = 'var(--color-text-muted)';
        b.style.border          = '1px solid var(--color-border)';
      });

      // Activar el botón seleccionado
      e.target.style.backgroundColor = 'var(--color-accent)';
      e.target.style.color           = 'white';
      e.target.style.border          = 'none';

      filterBlog();
    });
  });
}


/* =============================================================================
   BLOG — BUSCADOR
   Escucha el input de búsqueda y lanza filterBlog() en cada pulsación.
============================================================================= */

function setupSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => filterBlog());
}


/* =============================================================================
   BLOG — FILTRADO COMBINADO
   Aplica los tres filtros simultáneamente: texto, tag y tipo de CTF.
   El resultado se guarda en filteredMachines y se re-renderiza la vista.
============================================================================= */

function filterBlog() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();

  filteredMachines = allMachines.filter(m => {

    // ── Filtro de texto: título o descripción contienen el término ───────
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery) ||
      m.description.toLowerCase().includes(searchQuery);

    // ── Filtro de tag ────────────────────────────────────────────────────
    let matchesTag = true;
    if (currentTag !== 'All') {
      // Construir lista plana de todos los tags de esta máquina
      const mTags = [];
      if (m.os)         mTags.push(m.os.toLowerCase());
      if (m.difficulty) mTags.push(m.difficulty.toLowerCase());
      if (m.skills)     m.skills.forEach(s => mTags.push(s.toLowerCase()));
      mTags.push(m.active ? 'activa' : 'retirada');
      if (m.active_to_retire) mTags.push('active_to_retire');

      matchesTag = mTags.includes(currentTag);
    }

    // ── Filtro de tipo de CTF ────────────────────────────────────────────
    const matchesType = currentType === 'All' || m.type === currentType;

    return matchesSearch && matchesTag && matchesType;
  });

  // Resetear a la primera página al cambiar filtros
  currentPage = 1;
  renderBlog();
}


/* =============================================================================
   BLOG — RENDERIZADO DE TARJETAS
   Ordena las máquinas filtradas por fecha, aplica la paginación y
   renderiza las tarjetas de la página actual en #posts-grid.
============================================================================= */

function renderBlog() {
  const grid = document.getElementById('posts-grid');

  if (filteredMachines.length === 0) {
    grid.innerHTML = '<p style="color: var(--color-text-muted)">No writeups found.</p>';
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }

  // Ordenar por fecha descendente (más reciente primero)
  const sorted = filteredMachines.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calcular los índices de la página actual
  const start        = (currentPage - 1) * itemsPerPage;
  const end          = start + itemsPerPage;
  const currentItems = sorted.slice(start, end);

  grid.innerHTML = currentItems.map(createMachineCard).join('');
  renderPagination();

  // ── Delegar eventos para botones "Ver más" de tags ───────────────────────
  grid.querySelectorAll('.tag-toggle-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const card    = btn.closest('.flex.flex-wrap');
      const extras  = card.querySelectorAll('[data-extra-tag="true"]');
      const expanded = btn.dataset.expanded === 'true';

      if (expanded) {
        extras.forEach(t => t.style.display = 'none');
        const count = extras.length;
        btn.textContent    = `+${count} más`;
        btn.dataset.expanded = 'false';
      } else {
        extras.forEach(t => { t.style.display = ''; t.removeAttribute('style'); t.style.backgroundColor = 'var(--color-surface-raised)'; t.style.color = 'var(--color-text-muted)'; t.style.border = '1px solid var(--color-border)'; });
        btn.textContent    = 'Ver menos';
        btn.dataset.expanded = 'true';
      }
    });
  });
}


/* =============================================================================
   BLOG — PAGINACIÓN
   Genera los controles de paginación (flechas + números) y les asigna
   los eventos para cambiar de página.
============================================================================= */

function renderPagination() {
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage);
  const container  = document.getElementById('pagination-container');

  // No mostrar paginación si cabe todo en una sola página
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  // ── Flecha anterior ──────────────────────────────────────────────────────
  const prevArrow = `
    <button class="page-arrow rounded-md px-3 py-1 transition-colors"
      ${prevDisabled ? 'disabled' : ''}
      style="
        background-color: var(--color-surface);
        color: ${prevDisabled ? 'var(--color-text-muted)' : 'var(--color-text)'};
        border: 1px solid var(--color-border);
        cursor: ${prevDisabled ? 'not-allowed' : 'pointer'};
        transition: background-color 0.2s;">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  `;

  // ── Flecha siguiente ─────────────────────────────────────────────────────
  const nextArrow = `
    <button class="page-arrow rounded-md px-3 py-1 transition-colors"
      ${nextDisabled ? 'disabled' : ''}
      style="
        background-color: var(--color-surface);
        color: ${nextDisabled ? 'var(--color-text-muted)' : 'var(--color-text)'};
        border: 1px solid var(--color-border);
        cursor: ${nextDisabled ? 'not-allowed' : 'pointer'};
        transition: background-color 0.2s;">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  `;

  // ── Números de página con ellipsis ─────────────────────────────────────
  // Genera la lista de páginas a mostrar con "..." cuando hay muchas
  function getPageNumbers(current, total) {
    // Siempre mostramos: primera, última, actual y 1 a cada lado
    const delta = 1; // páginas a cada lado de la actual
    const range = [];
    const rangeWithDots = [];

    const left  = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    for (let i = left; i <= right; i++) range.push(i);
    range.push(total);

    // Deduplicar y ordenar
    const uniq = [...new Set(range)].sort((a, b) => a - b);

    let prev = null;
    for (const p of uniq) {
      if (prev !== null && p - prev > 1) rangeWithDots.push('...');
      rangeWithDots.push(p);
      prev = p;
    }
    return rangeWithDots;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  let html = prevArrow;

  pageNumbers.forEach(p => {
    if (p === '...') {
      html += `
        <span class="rounded-md px-3 py-1 text-sm"
          style="color: var(--color-text-muted); user-select:none;">
          …
        </span>
      `;
    } else {
      const isActive = p === currentPage;
      html += `
        <button class="page-btn rounded-md px-3 py-1 text-sm font-medium transition-colors"
          style="
            background-color: ${isActive ? 'var(--color-accent)' : 'var(--color-surface)'};
            color: ${isActive ? 'white' : 'var(--color-text-muted)'};
            border: 1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}"
          data-page="${p}">
          ${p}
        </button>
      `;
    }
  });

  html += nextArrow;
  container.innerHTML = html;

  // ── Eventos en los números de página ─────────────────────────────────────
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      currentPage = parseInt(e.target.getAttribute('data-page'));
      renderBlog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── Eventos en las flechas (con hover) ───────────────────────────────────
  document.querySelectorAll('.page-arrow').forEach((btn, idx) => {
    // Efecto hover solo si el botón no está deshabilitado
    btn.addEventListener('mouseenter', () => {
      if (!btn.disabled) btn.style.backgroundColor = 'rgba(119,125,134,0.1)';
    });
    btn.addEventListener('mouseleave', () => {
      if (!btn.disabled) btn.style.backgroundColor = 'var(--color-surface)';
    });

    btn.addEventListener('click', () => {
      if (idx === 0 && !prevDisabled) currentPage--;  // Flecha izquierda → página anterior
      if (idx === 1 && !nextDisabled) currentPage++;  // Flecha derecha  → página siguiente
      renderBlog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}


/* =============================================================================
   STATS — GRÁFICO DONUT MEJORADO
   Panel de estadísticas con:
     · Donut canvas con gap entre segmentos y glow suave
     · Texto central animado (total de máquinas)
     · Leyenda de barras de progreso horizontal debajo del donut
     · Contadores de OS (Linux / Windows) por dificultad
============================================================================= */

async function loadStats() {
  const res      = await fetch('machines.json');
  const machines = await res.json();

  const difficulties = {
    Easy:         { total: 0, Windows: 0, Linux: 0, color: "#28a745", solid: "rgba(40,167,69,0.85)"    },
    Intermediate: { total: 0, Windows: 0, Linux: 0, color: "#ff8c00", solid: "rgba(255,140,0,0.85)"   },
    Hard:         { total: 0, Windows: 0, Linux: 0, color: "#dc143c", solid: "rgba(220,20,60,0.85)"   },
    Insane:       { total: 0, Windows: 0, Linux: 0, color: "#8a2be2", solid: "rgba(138,43,226,0.85)"  }
  };

  machines.forEach(m => {
    if (difficulties[m.difficulty]) {
      difficulties[m.difficulty].total++;
      if (m.os) difficulties[m.difficulty][m.os] = (difficulties[m.difficulty][m.os] || 0) + 1;
    }
  });

  const totalMachines = Object.values(difficulties).reduce((s, d) => s + d.total, 0);
  drawChart(difficulties, totalMachines);
}

/**
 * Renderiza el panel completo de stats:
 * canvas donut + texto central + leyenda con barras.
 */
function drawChart(data, totalMachines) {
  const canvas          = document.getElementById("statsCanvas");
  const ctx             = canvas.getContext("2d");
  const labelsContainer = document.getElementById("difficultyLabels");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  labelsContainer.innerHTML = "";

  // ── Geometría ────────────────────────────────────────────────────────────
  const cx          = canvas.width  / 2;
  const cy          = canvas.height / 2;
  const outerR      = 108;
  const innerR      = 68;
  const gap         = 0.03; // radianes de espacio entre segmentos
  let   startAngle  = -Math.PI / 2;

  // ── Dibujar segmentos ────────────────────────────────────────────────────
  Object.entries(data).forEach(([key, value]) => {
    if (value.total === 0) return;

    const sliceAngle = (value.total / totalMachines) * Math.PI * 2;
    const endAngle   = startAngle + sliceAngle - gap;
    const midAngle   = startAngle + sliceAngle / 2;

    // Segmento con gap
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle + gap / 2, endAngle);
    ctx.arc(cx, cy, innerR, endAngle, startAngle + gap / 2, true);
    ctx.closePath();

    ctx.fillStyle   = value.solid;
    ctx.shadowBlur  = 14;
    ctx.shadowColor = value.color;
    ctx.fill();
    ctx.shadowBlur  = 0;

    // Etiqueta radial — usamos HTML overlay
    const label       = document.createElement("div");
    label.className   = "difficulty-label";
    label.dataset.key = key;

    const dist = 148;
    label.style.left      = cx + Math.cos(midAngle) * dist + "px";
    label.style.top       = cy + Math.sin(midAngle) * dist + "px";
    label.style.transform = "translate(-50%, -50%)";
    label.style.color     = value.color;
    label.innerHTML       = `<span class="dl-count">${value.total}</span><span class="dl-name">${key}</span>`;

    labelsContainer.appendChild(label);
    startAngle += sliceAngle;
  });

  // ── Texto central: total ─────────────────────────────────────────────────
  ctx.save();
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle    = "#e6edf3";
  ctx.font         = `bold 28px 'Fira Mono', monospace`;
  ctx.fillText(totalMachines, cx, cy - 10);
  ctx.fillStyle = "#8b949e";
  ctx.font      = `11px 'Fira Mono', monospace`;
  ctx.fillText("machines", cx, cy + 12);
  ctx.restore();

  // ── Leyenda debajo: barras de progreso ───────────────────────────────────
  renderStatsLegend(data, totalMachines);
}

/**
 * Renderiza la leyenda con barra de progreso y contador OS debajo del donut.
 */
function renderStatsLegend(data, totalMachines) {
  // Insertar la leyenda dentro del .stats-panel, al lado del donut
  const statsPanel = document.querySelector(".stats-panel");
  if (!statsPanel) return;

  // Eliminar leyenda previa si existe
  const old = statsPanel.querySelector(".stats-legend");
  if (old) old.remove();

  const legend = document.createElement("div");
  legend.className = "stats-legend";

  Object.entries(data).forEach(([key, value]) => {
    if (value.total === 0) return;

    const pct     = ((value.total / totalMachines) * 100).toFixed(0);
    const winPct  = value.total ? ((value.Windows / value.total) * 100).toFixed(0) : 0;
    const linPct  = value.total ? ((value.Linux   / value.total) * 100).toFixed(0) : 0;

    const row = document.createElement("div");
    row.className = "stats-legend-row";
    row.innerHTML = `
      <div class="sl-header">
        <span class="sl-dot" style="background:${value.color}"></span>
        <span class="sl-name">${key}</span>
        <span class="sl-count">${value.total} <span class="sl-pct">(${pct}%)</span></span>
      </div>
      <div class="sl-bar-track">
        <div class="sl-bar-fill" style="width:${pct}%; background:${value.color};"></div>
      </div>
      <div class="sl-os">
        <span class="sl-os-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
          Win ${winPct}%
        </span>
        <span class="sl-os-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.988 1.175-1.22 2.063-.217.778-.143 1.57.382 2.39.064.11.151.232.277.351.08.086.182.186.329.288a5.607 5.607 0 00.373.24c.369.213.795.417 1.225.574.869.312 1.654.408 1.864.152.197-.243.042-.711-.23-1.148-.14-.226-.297-.434-.437-.59a2.31 2.31 0 01-.128-.158 4.046 4.046 0 01-.139-.22c-.132-.248-.227-.527-.247-.838-.035-.556.165-1.03.402-1.476.17-.32.358-.621.524-.896.094-.157.176-.314.25-.477a3.9 3.9 0 00.274-1.096c.05-.5.022-1.024-.099-1.572-.115-.524-.308-1.077-.558-1.637-.248-.558-.558-1.14-.866-1.74l-.09-.189c-.232-.474-.427-.946-.55-1.437-.12-.489-.165-.98-.077-1.49.207-1.183 1.018-1.72 1.636-2.027a4.3 4.3 0 011.268-.351c.275-.037.543-.03.79.012a4.084 4.084 0 011.93 1.028c.418.395.775.887 1.034 1.478.254.582.4 1.247.4 1.97-.001.726-.146 1.392-.4 1.974-.254.582-.616 1.073-1.034 1.468a4.09 4.09 0 01-1.93 1.028c-.248.043-.515.05-.79.012-.275-.038-.56-.12-.845-.245-.279-.124-.568-.3-.852-.52"/></svg>
          Linux ${linPct}%
        </span>
      </div>
    `;
    legend.appendChild(row);
  });

  // Insertar la leyenda dentro del panel (junto al donut)
  statsPanel.appendChild(legend);
}


/* =============================================================================
   STATS — TOGGLE DEL PANEL
   Abre/cierra el panel de estadísticas al hacer clic en #toggleStats.
   El gráfico solo se carga una vez (lazy loading).
============================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleStats");
  const section   = document.getElementById("statsSection");

  // Solo inicializar si existen ambos elementos (solo en index.html)
  if (!toggleBtn || !section) return;

  let loaded = false;

  toggleBtn.addEventListener("click", async () => {
    section.classList.toggle("active");

    if (section.classList.contains("active") && !loaded) {
      await loadStats();
      loaded = true;
    }
  });
});


/* =============================================================================
   TOOLS — ESTADO GLOBAL
   Variables para el módulo de herramientas (tools.html).
============================================================================= */

let allTools      = []; // Todas las herramientas cargadas del JSON
let filteredTools = []; // Subconjunto tras aplicar filtros
let currentToolPage = 1;
let currentToolTag  = 'All';

const toolsPerPage = 6;


/* =============================================================================
   TOOLS — TARJETA DE HERRAMIENTA
   Genera el HTML de una tarjeta para una herramienta externa.
============================================================================= */

function createToolCard(t) {
  // Construir badges de tags de la herramienta
  let tagsHtml = '';
  if (t.tags) {
    t.tags.forEach(tag => {
      tagsHtml += `
        <span class="rounded-full font-medium px-2 py-0.5 text-xs"
          style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border)">
          #${tag.toLowerCase()}
        </span>
      `;
    });
  }

  return `
    <a href="${t.url}" target="_blank"
       class="group block rounded-lg overflow-hidden transition-colors"
       style="background-color: var(--color-surface); border: 1px solid var(--color-border);">

      <!-- Imagen / logo de la herramienta -->
      <div class="post-image-container p-4 flex justify-center items-center">
        <img src="${t.logo}" alt="${t.title}" class="w-12 h-12 object-contain">
      </div>

      <div class="p-5">
        <h3 class="post-title mb-2 text-lg font-semibold transition-colors">${t.title}</h3>
        <p class="mb-3 text-sm leading-relaxed" style="color: var(--color-text-muted)">${t.description}</p>
        <div class="flex flex-wrap gap-2">${tagsHtml}</div>
      </div>
    </a>
  `;
}


/* =============================================================================
   TOOLS — INICIALIZACIÓN
   Carga el JSON de herramientas, construye los tags disponibles y
   renderiza la vista inicial.
============================================================================= */

async function initTools() {
  try {
    const res   = await fetch('tools.json');
    allTools    = await res.json();
    filteredTools = [...allTools];

    // Extraer todos los tags únicos de las herramientas
    const tagsSet = new Set();
    allTools.forEach(t => {
      if (t.tags) t.tags.forEach(tag => tagsSet.add(tag.toLowerCase()));
    });

    renderToolTags(Array.from(tagsSet));
    renderTools();
    setupToolSearch();

  } catch (e) {
    console.error(e);
    document.getElementById('tools-grid').innerHTML =
      '<p style="color:red">Failed to load tools</p>';
  }
}


/* =============================================================================
   TOOLS — RENDERIZADO DE TAGS
   Igual que renderTags() del blog, pero para la vista de herramientas.
============================================================================= */

function renderToolTags(tags) {
  const container  = document.getElementById('tags-container');
  const MAX_TAGS   = 12;
  const extraCount = tags.length - MAX_TAGS;

  let html = `
    <button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium transition-colors"
      style="background-color: var(--color-accent); color: white">
      All
    </button>
  `;

  tags.forEach((tag, idx) => {
    const hidden = idx >= MAX_TAGS;
    html += `
      <button data-tag="${tag}"
        class="tag-btn rounded-full px-3 py-1 text-xs font-medium transition-colors${hidden ? ' tags-extra-btn' : ''}"
        style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border);${hidden ? ' display:none;' : ''}">
        #${tag}
      </button>
    `;
  });

  if (extraCount > 0) {
    html += `
      <button id="tags-show-more"
        class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
        data-expanded="false"
        style="background-color: var(--color-surface-raised); color: var(--color-accent-light); border: 1px solid var(--color-accent-light); cursor: pointer;">
        +${extraCount} más
      </button>
    `;
  }

  container.innerHTML = html;

  const showMoreBtn = document.getElementById('tags-show-more');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const expanded = showMoreBtn.dataset.expanded === 'true';
      const extras   = container.querySelectorAll('.tags-extra-btn');

      if (expanded) {
        extras.forEach(b => b.style.display = 'none');
        showMoreBtn.textContent      = `+${extraCount} más`;
        showMoreBtn.dataset.expanded = 'false';
      } else {
        extras.forEach(b => b.style.display = '');
        showMoreBtn.textContent      = 'Ver menos';
        showMoreBtn.dataset.expanded = 'true';
      }
    });
  }

  // Asignar eventos de filtrado
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      currentToolTag = e.target.dataset.tag;

      document.querySelectorAll('.tag-btn').forEach(b => {
        b.style.backgroundColor = 'var(--color-surface-raised)';
        b.style.color           = 'var(--color-text-muted)';
        b.style.border          = '1px solid var(--color-border)';
      });

      e.target.style.backgroundColor = 'var(--color-accent)';
      e.target.style.color           = 'white';
      e.target.style.border          = 'none';

      filterTools();
    });
  });
}


/* =============================================================================
   TOOLS — BUSCADOR
============================================================================= */

function setupToolSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => filterTools());
}


/* =============================================================================
   TOOLS — FILTRADO COMBINADO
============================================================================= */

function filterTools() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();

  filteredTools = allTools.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery) ||
      t.description.toLowerCase().includes(searchQuery);

    const matchesTag =
      currentToolTag === 'All' ||
      (t.tags && t.tags.map(tag => tag.toLowerCase()).includes(currentToolTag));

    return matchesSearch && matchesTag;
  });

  currentToolPage = 1;
  renderTools();
}


/* =============================================================================
   TOOLS — RENDERIZADO DE TARJETAS
============================================================================= */

function renderTools() {
  const grid = document.getElementById('tools-grid');

  if (filteredTools.length === 0) {
    grid.innerHTML = '<p style="color: var(--color-text-muted)">No tools found.</p>';
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }

  const start        = (currentToolPage - 1) * toolsPerPage;
  const end          = start + toolsPerPage;
  const currentItems = filteredTools.slice(start, end);

  grid.innerHTML = currentItems.map(createToolCard).join('');
  renderToolPagination();
}


/* =============================================================================
   TOOLS — PAGINACIÓN
============================================================================= */

function renderToolPagination() {
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const container  = document.getElementById('pagination-container');

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentToolPage;
    html += `
      <button class="page-btn rounded-md px-3 py-1 text-sm font-medium transition-colors"
        style="
          background-color: ${isActive ? 'var(--color-accent)' : 'var(--color-surface)'};
          color: ${isActive ? 'white' : 'var(--color-text-muted)'};
          border: 1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}"
        data-page="${i}">
        ${i}
      </button>
    `;
  }

  container.innerHTML = html;

  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      currentToolPage = parseInt(e.target.dataset.page);
      renderTools();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}