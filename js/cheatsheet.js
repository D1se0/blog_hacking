/* =============================================================================
   cheatsheet.js
   Lógica de la sección de CheatSheets.

   Contiene:
     · loadHeader()       → Carga el header compartido y marca el enlace activo
     · initCheatSheet()   → Punto de entrada: carga datos y configura la vista
     · createSheetCard()  → Genera el HTML de una tarjeta de cheatsheet
     · renderSheets()     → Renderiza la página actual de tarjetas
     · setupOSFilters()   → Configura los botones de filtrado por OS
     · setupFilters()     → Configura los botones de filtrado por tag
     · setupSearch()      → Configura el input de búsqueda por texto
     · filterSheets()     → Aplica los tres filtros combinados
     · renderPagination() → Genera los controles de paginación
============================================================================= */


/* =============================================================================
   ESTADO GLOBAL
============================================================================= */

let allSheets      = []; // Todos los cheatsheets cargados del JSON
let filteredSheets = []; // Subconjunto tras aplicar filtros
let currentTag     = 'All'; // Tag activo ('All' = sin filtro de tag)
let currentOS      = 'All'; // OS activo ('All' = sin filtro de sistema operativo)
let currentPage    = 1;
const itemsPerPage = 6;


/* =============================================================================
   HEADER
   Carga el header compartido desde header.html y marca el enlace de nav
   correspondiente a la página activa.
   Se expone como window.loadHeader para poder ser llamado desde HTML.
============================================================================= */

window.loadHeader = async function (activePage = '') {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error("Failed to load header");

    const html      = await res.text();
    const container = document.getElementById('header-container');
    if (container) container.innerHTML = html;

    // Marcar el enlace de navegación activo
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.classList.remove('nav-accent');
      link.style.color = 'var(--color-text-muted)';

      const href = link.getAttribute('href')?.replace(/^\//, '') || '';

      const isCurrentPage = activePage.includes(href) && href !== '';
      const isHomePage    = activePage === 'index.html' && href === '';

      if (isCurrentPage || isHomePage) {
        link.classList.add('nav-accent');
        link.style.color = 'var(--color-accent-light)';
      }
    });

  } catch (e) {
    console.error(e);
  }
};


/* =============================================================================
   INICIALIZACIÓN
   Carga el header, obtiene el JSON de cheatsheets, configura filtros
   y búsqueda, y renderiza la vista inicial.
   Se expone como window.initCheatSheet para ser llamado desde el HTML.
============================================================================= */

window.initCheatSheet = async function () {
  await loadHeader('cheatsheet.html');

  try {
    const res = await fetch('cheatsheet.json');
    allSheets = await res.json();

    // Ordenar por fecha descendente desde el principio
    allSheets.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredSheets = [...allSheets];

    setupOSFilters();
    setupFilters();
    setupSearch();
    renderSheets();
    renderPagination();

  } catch (err) {
    const grid = document.getElementById('cheatsheet-grid');
    if (grid) grid.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
};


/* =============================================================================
   TARJETA DE CHEATSHEET
   Genera el HTML de una tarjeta individual para la grid.
============================================================================= */

function createSheetCard(sheet) {
  return `
    <a href="view.html?cheatsheet=${sheet.id}" class="cs-card">
      <div class="img-container">
        <img src="cheatsheet/${sheet.id}/images/logo.png" alt="${sheet.title} logo">
        <div class="img-overlay"></div>
      </div>
      <div class="cs-content">
        <div class="cs-title">${sheet.title}</div>
        <div class="cs-category">${sheet.category} | ${sheet.os}</div>
        <div class="cs-tags">
          ${sheet.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
        <div class="cs-desc">${sheet.description}</div>
      </div>
    </a>
  `;
}


/* =============================================================================
   RENDERIZADO DE TARJETAS
   Calcula los ítems de la página actual y los inyecta en #cheatsheet-grid.
============================================================================= */

function renderSheets() {
  const grid = document.getElementById('cheatsheet-grid');
  if (!grid) return;

  const start = (currentPage - 1) * itemsPerPage;
  const end   = start + itemsPerPage;
  const items = filteredSheets.slice(start, end);

  if (!items.length) {
    grid.innerHTML = `
      <p style="color: var(--color-text-muted); text-align:center; margin: 4rem 0;">
        No CheatSheets found.
      </p>
    `;
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }

  grid.innerHTML = items.map(createSheetCard).join('');
  renderPagination();
}


/* =============================================================================
   FILTROS POR OS
   Escucha los botones .cs-filter-btn del contenedor #filter-container
   (ya presentes en el HTML) y filtra al hacer clic.
============================================================================= */

function setupOSFilters() {
  const osContainer = document.getElementById('filter-container');
  if (!osContainer) return;

  const buttons = osContainer.querySelectorAll('.cs-filter-btn');

  // Marcar "All" como activo por defecto
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.id === 'filter-all') btn.classList.add('active');
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Leer el OS del id del botón (ej: "filter-linux" → "linux")
      currentOS   = btn.id.replace('filter-', '');
      currentPage = 1;

      // Actualizar estilos: desactivar todos y activar el clicado
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterSheets();
    });
  });

  // Aplicar el filtro inicial ('all' = sin filtro)
  currentOS = 'all';
  filterSheets();
}


/* =============================================================================
   FILTROS POR TAG
   Construye dinámicamente los botones de tag en #tags-container y
   filtra al hacer clic.
============================================================================= */

function setupFilters() {
  const tagsContainer = document.getElementById('tags-container');
  if (!tagsContainer) return;

  // Obtener tags únicos de todos los cheatsheets (en minúsculas)
  const uniqueTags = [...new Set(allSheets.flatMap(s => s.tags.map(t => t.toLowerCase())))];

  let html = `<button class="tag-btn active" data-tag="All">All</button>`;
  uniqueTags.forEach(t => {
    html += `<button class="tag-btn" data-tag="${t}">${t}</button>`;
  });
  tagsContainer.innerHTML = html;

  tagsContainer.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTag  = btn.dataset.tag;
      currentPage = 1;

      // Marcar como activo solo el botón clicado
      tagsContainer.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterSheets();
    });
  });
}


/* =============================================================================
   BUSCADOR
   Filtra en tiempo real al escribir en #search-input.
============================================================================= */

function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', () => {
    currentPage = 1;
    filterSheets();
  });
}


/* =============================================================================
   FILTRADO COMBINADO
   Aplica los tres filtros simultáneamente: OS, tag y texto de búsqueda.
============================================================================= */

function filterSheets() {
  const search = document.getElementById('search-input')?.value.toLowerCase().trim() || '';

  filteredSheets = allSheets.filter(sheet => {
    // Filtro de sistema operativo
    const matchesOS = currentOS === 'all' || sheet.os.toLowerCase() === currentOS.toLowerCase();

    // Filtro de tag (comparación case-insensitive)
    const matchesTag =
      currentTag === 'All' ||
      sheet.tags.some(t => t.toLowerCase() === currentTag.toLowerCase());

    // Filtro de texto: título o descripción contienen el término
    const matchesSearch =
      sheet.title.toLowerCase().includes(search) ||
      sheet.description.toLowerCase().includes(search);

    return matchesOS && matchesTag && matchesSearch;
  });

  currentPage = 1;
  renderSheets();
}


/* =============================================================================
   PAGINACIÓN
   Genera los botones de página y los eventos para navegar entre ellas.
============================================================================= */

function renderPagination() {
  const totalPages = Math.ceil(filteredSheets.length / itemsPerPage);
  const container  = document.getElementById('pagination-container');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    html += `
      <button class="page-btn" data-page="${i}"
        style="
          background-color: ${isActive ? 'var(--color-accent)' : 'var(--color-surface)'};
          color: ${isActive ? 'white' : 'var(--color-text-muted)'};
          border: 1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'};
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          margin: 0 2px;
          cursor: pointer;">
        ${i}
      </button>
    `;
  }

  container.innerHTML = html;

  container.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderSheets();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}
