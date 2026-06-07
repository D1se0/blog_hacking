/* =============================================================================
   reflections.js
   Lógica de la sección de Reflexiones (Reflections).

   Todo el módulo está encapsulado en una IIFE para evitar contaminar
   el scope global con las variables de estado.

   Contiene:
     · loadHeader()           → Carga el header y marca el enlace activo
     · initReflections()      → Punto de entrada: carga datos y configura la vista
     · createReflectionCard() → Genera el HTML de una tarjeta de reflexión
     · renderTags()           → Renderiza y conecta los botones de filtrado por tag
     · setupSearch()          → Configura el input de búsqueda
     · filterReflections()    → Filtrado combinado (texto + tag)
     · renderReflections()    → Renderiza la página actual de tarjetas
     · renderPagination()     → Genera los controles de paginación
============================================================================= */

(function () {

  /* ===========================================================================
     ESTADO INTERNO DEL MÓDULO
  =========================================================================== */

  let allReflections      = []; // Todas las reflexiones cargadas del JSON
  let filteredReflections = []; // Subconjunto tras aplicar filtros
  let currentPage         = 1;
  let currentTag          = 'All';
  const itemsPerPage      = 6;


  /* ===========================================================================
     HEADER
     Carga header.html, lo inyecta en #header-container y marca el
     enlace de navegación activo según la página actual.
  =========================================================================== */

  async function loadHeader(activePage = '') {
    try {
      const res  = await fetch('header.html');
      if (!res.ok) throw new Error("Failed to load header");

      const html = await res.text();
      document.getElementById('header-container').innerHTML = html;

      const links = document.querySelectorAll('.nav-link');
      links.forEach(link => {
        link.classList.remove('nav-accent');
        link.style.color = 'var(--color-text-muted)';

        const href = link.getAttribute('href').replace(/^\//, '');

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
  }


  /* ===========================================================================
     INICIALIZACIÓN
     Punto de entrada expuesto globalmente. Carga el header, obtiene el
     JSON de reflexiones, extrae los tags disponibles y renderiza la vista.
  =========================================================================== */

  window.initReflections = async function () {
    await loadHeader('reflections.html');

    try {
      const res          = await fetch('reflections.json');
      allReflections     = await res.json();
      filteredReflections = [...allReflections];

      // Construir el conjunto de tags únicos combinando 'tags' y 'category'
      const tagsSet = new Set();
      allReflections.forEach(r => {
        if (r.tags)     r.tags.forEach(t => tagsSet.add(t.toLowerCase()));
        if (r.category) tagsSet.add(r.category.toLowerCase());
      });

      renderTags(Array.from(tagsSet).sort());
      setupSearch();
      renderReflections();

    } catch (e) {
      console.error(e);
    }
  };


  /* ===========================================================================
     TARJETA DE REFLEXIÓN
     Genera el HTML de una tarjeta individual para la grid.
  =========================================================================== */

  function createReflectionCard(r) {
    const dateStr = new Date(r.date).toLocaleDateString("en-US", {
      year:  "numeric",
      month: "long",
      day:   "numeric"
    });

    return `
      <a href="view.html?reflection=${r.id}"
         class="group block rounded-lg overflow-hidden transition-colors"
         style="background-color: var(--color-surface); border: 1px solid var(--color-border);">

        <!-- Imagen de portada de la reflexión -->
        <div class="post-image-container">
          <img src="reflections/${r.id}/images/logo.png" alt="${r.title}">
        </div>

        <div class="p-5">
          <time class="text-xs" style="color: var(--color-text-muted)">
            ${dateStr}
          </time>

          <h3 class="post-title mt-2 mb-2 text-lg font-semibold">
            ${r.title}
          </h3>

          <p class="text-sm" style="color: var(--color-text-muted)">
            ${r.description}
          </p>
        </div>
      </a>
    `;
  }


  /* ===========================================================================
     RENDERIZADO DE TAGS
     Genera los botones de filtrado por tag en #tags-container.
  =========================================================================== */

  function renderTags(tags) {
    const container = document.getElementById('tags-container');

    // Botón "All" activo por defecto
    let html = `
      <button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
        style="background-color: var(--color-accent); color: white">
        All
      </button>
    `;

    tags.forEach(tag => {
      html += `
        <button data-tag="${tag}" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
          style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border);">
          #${tag}
        </button>
      `;
    });

    container.innerHTML = html;

    // Asignar eventos de filtrado
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        currentTag  = e.target.dataset.tag;
        currentPage = 1;

        // Resetear estilos de todos los botones
        document.querySelectorAll('.tag-btn').forEach(b => {
          b.style.backgroundColor = 'var(--color-surface-raised)';
          b.style.color           = 'var(--color-text-muted)';
          b.style.border          = '1px solid var(--color-border)';
        });

        // Activar el botón seleccionado
        e.target.style.backgroundColor = 'var(--color-accent)';
        e.target.style.color           = 'white';
        e.target.style.border          = 'none';

        filterReflections();
      });
    });
  }


  /* ===========================================================================
     BUSCADOR
     Filtra en tiempo real al escribir en #search-input.
  =========================================================================== */

  function setupSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', filterReflections);
  }


  /* ===========================================================================
     FILTRADO COMBINADO
     Aplica simultáneamente filtro de texto (título/descripción) y tag.
  =========================================================================== */

  function filterReflections() {
    const search = document.getElementById('search-input').value.toLowerCase();

    filteredReflections = allReflections.filter(r => {
      // Filtro de texto
      const matchesSearch =
        r.title.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search);

      // Filtro de tag: construir lista plana de todos los tags de la reflexión
      let matchesTag = true;
      if (currentTag !== 'All') {
        const rTags = [];
        if (r.tags)     r.tags.forEach(t => rTags.push(t.toLowerCase()));
        if (r.category) rTags.push(r.category.toLowerCase());
        matchesTag = rTags.includes(currentTag);
      }

      return matchesSearch && matchesTag;
    });

    currentPage = 1;
    renderReflections();
  }


  /* ===========================================================================
     RENDERIZADO DE TARJETAS
     Ordena por fecha, calcula los ítems de la página actual y los
     inyecta en #posts-grid.
  =========================================================================== */

  function renderReflections() {
    const grid = document.getElementById('posts-grid');

    // Ordenar por fecha descendente (más reciente primero)
    const sorted = filteredReflections.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    const start = (currentPage - 1) * itemsPerPage;
    const end   = start + itemsPerPage;
    const items = sorted.slice(start, end);

    if (items.length === 0) {
      grid.innerHTML = `
        <p style="
          color: var(--color-text-muted);
          font-style: italic;
          text-align: center;
          width: 100%;
          display: block;
          margin: 4rem 0;
          font-size: 1.1rem;">
          No hay posts que coincidan con esta búsqueda.
        </p>
      `;
      document.getElementById('pagination-container').innerHTML = '';
      return;
    }

    grid.innerHTML = items.map(createReflectionCard).join('');
    renderPagination();
  }


  /* ===========================================================================
     PAGINACIÓN
  =========================================================================== */

  function renderPagination() {
    const totalPages = Math.ceil(filteredReflections.length / itemsPerPage);
    const container  = document.getElementById('pagination-container');

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
      html += `
        <button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
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
        currentPage = parseInt(e.target.getAttribute('data-page'));
        renderReflections();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

})();
