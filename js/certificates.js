/* =============================================================================
   certificates.js
   Lógica de la sección de Certificaciones.

   Todo el módulo está encapsulado en una IIFE para evitar contaminar
   el scope global con las variables de estado.

   Contiene:
     · loadHeader()          → Carga el header y marca el enlace activo
     · initCertificates()    → Punto de entrada: carga datos y configura la vista
     · createCard()          → Genera el HTML de una tarjeta de certificado
     · renderTags()          → Renderiza y conecta los botones de filtrado por tag
     · setupSearch()         → Configura el input de búsqueda
     · filterCertificates()  → Filtrado combinado (texto + tag)
     · renderCertificates()  → Renderiza la página actual de tarjetas
     · renderPagination()    → Genera los controles de paginación
============================================================================= */

(function () {

  /* ===========================================================================
     ESTADO INTERNO DEL MÓDULO
  =========================================================================== */

  let allCertificates      = []; // Todos los certificados cargados del JSON
  let filteredCertificates = []; // Subconjunto tras aplicar filtros
  let currentPage          = 1;
  let currentTag           = 'All';
  const itemsPerPage       = 6;


  /* ===========================================================================
     HEADER
     Carga header.html, lo inyecta en #header-container y activa el
     enlace de navegación de la página actual comparando solo el nombre
     de archivo (sin rutas).
  =========================================================================== */

  async function loadHeader(activePage = '') {
    const res  = await fetch('header.html');
    const html = await res.text();
    document.getElementById('header-container').innerHTML = html;

    // Extraer solo el nombre del archivo de la página actual (ej: "certificates.html")
    const currentFile = activePage.split('/').pop();

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.classList.remove('nav-accent');

      // Extraer también solo el nombre del archivo del href del enlace
      const href = link.getAttribute('href').split('/').pop();

      if (href === currentFile) {
        link.classList.add('nav-accent');
      }
    });
  }


  /* ===========================================================================
     INICIALIZACIÓN
     Punto de entrada expuesto globalmente. Carga el header, obtiene el
     JSON de certificados, extrae los tags disponibles y renderiza la vista.
  =========================================================================== */

  window.initCertificates = async function () {
    await loadHeader('certificates.html');

    const res          = await fetch('certificates.json');
    allCertificates    = await res.json();
    filteredCertificates = [...allCertificates];

    // Construir el conjunto de tags únicos combinando 'tags' y 'category'
    const tagsSet = new Set();
    allCertificates.forEach(c => {
      if (c.tags)     c.tags.forEach(t => tagsSet.add(t.toLowerCase()));
      if (c.category) tagsSet.add(c.category.toLowerCase());
    });

    renderTags(Array.from(tagsSet).sort());
    setupSearch();
    renderCertificates();
  };


  /* ===========================================================================
     TARJETA DE CERTIFICADO
     Genera el HTML de una tarjeta individual. Al hacer clic abre la
     página de detalle certificate.html?id=... en lugar de la URL externa.
  =========================================================================== */

  function createCard(c) {
    const isCompleted = c.status === "completed";
    const statusColor = isCompleted ? "#22c55e" : "#f59e0b";
    const statusLabel = isCompleted ? "Completed" : "In Progress";

    return `
      <a href="certificate.html?id=${c.id}"
         class="group block rounded-lg overflow-hidden transition-colors"
         style="background-color: var(--color-surface); border: 1px solid var(--color-border); text-decoration: none;">

        <!-- Imagen de portada del certificado -->
        <div class="post-image-container">
          <img src="certificates/${c.id}/images/logo.png" alt="${c.title}">
        </div>

        <div class="p-5">

          <!-- Badge de estado (Completed / In Progress) -->
          <span style="
            display: inline-flex; align-items: center; gap: 6px;
            margin-bottom: 10px; padding: 4px 10px; border-radius: 999px;
            font-size: 11px; font-weight: 600;
            background: ${statusColor}18; color: ${statusColor};
            border: 1px solid ${statusColor}33;">
            <span style="width:6px;height:6px;border-radius:50%;background:${statusColor};flex-shrink:0;"></span>
            ${statusLabel}
          </span>

          <h3 class="post-title mt-2 mb-2 text-lg font-semibold">
            ${c.title}
          </h3>

          <p class="text-sm" style="color: var(--color-text-muted); display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
            ${c.description}
          </p>

        </div>
      </a>
    `;
  }


  /* ===========================================================================
     RENDERIZADO DE TAGS
     Genera los botones de filtrado por tag en #tags-container y les
     asigna el evento de click para filtrar.
  =========================================================================== */

  function renderTags(tags) {
    const container = document.getElementById('tags-container');

    // Botón "All" activo por defecto
    let html = `
      <button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
        style="background-color: var(--color-accent); color: white;">
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
        filterCertificates();
      });
    });
  }


  /* ===========================================================================
     BUSCADOR
     Filtra en tiempo real al escribir en #search-input.
  =========================================================================== */

  function setupSearch() {
    document.getElementById('search-input')
      .addEventListener('input', filterCertificates);
  }


  /* ===========================================================================
     FILTRADO COMBINADO
     Aplica simultáneamente filtro de texto (título/descripción) y tag.
  =========================================================================== */

  function filterCertificates() {
    const search = document.getElementById('search-input').value.toLowerCase();

    filteredCertificates = allCertificates.filter(c => {
      // Filtro de texto
      const matchesSearch =
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search);

      // Filtro de tag: construir lista plana de todos los tags del certificado
      let matchesTag = true;
      if (currentTag !== "All") {
        const tags = [];
        if (c.tags)     c.tags.forEach(t => tags.push(t.toLowerCase()));
        if (c.category) tags.push(c.category.toLowerCase());
        matchesTag = tags.includes(currentTag);
      }

      return matchesSearch && matchesTag;
    });

    renderCertificates();
  }


  /* ===========================================================================
     RENDERIZADO DE TARJETAS
     Calcula los ítems de la página actual y los inyecta en #certificates-grid.
  =========================================================================== */

  function renderCertificates() {
    const grid = document.getElementById('certificates-grid');

    const start = (currentPage - 1) * itemsPerPage;
    const end   = start + itemsPerPage;
    const items = filteredCertificates.slice(start, end);

    if (!items.length) {
      grid.innerHTML = `
        <p style="color: var(--color-text-muted); text-align: center; width: 100%;">
          No certificates found.
        </p>
      `;
      return;
    }

    grid.innerHTML = items.map(createCard).join('');
    renderPagination();
  }


  /* ===========================================================================
     PAGINACIÓN
  =========================================================================== */

  function renderPagination() {
    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
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
          data-page="${i}"
          style="
            background: ${isActive ? 'var(--color-accent)' : 'var(--color-surface)'};
            color: ${isActive ? 'white' : 'var(--color-text-muted)'};">
          ${i}
        </button>
      `;
    }

    container.innerHTML = html;

    document.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        currentPage = parseInt(e.target.dataset.page);
        renderCertificates();
      });
    });
  }

})();
