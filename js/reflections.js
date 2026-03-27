(function () {

/* ===========================
   HEADER
=========================== */

async function loadHeader(activePage = '') {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error("Failed to load header");
    const html = await res.text();
    document.getElementById('header-container').innerHTML = html;

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.classList.remove('nav-accent');
      link.style.color = 'var(--color-text-muted)';
      const href = link.getAttribute('href').replace(/^\//, '');
      if (activePage.includes(href) && href !== '') {
        link.classList.add('nav-accent');
        link.style.color = 'var(--color-accent-light)';
      } else if (activePage === 'index.html' && href === '') {
        link.classList.add('nav-accent');
        link.style.color = 'var(--color-accent-light)';
      }
    });

  } catch(e) {
    console.error(e);
  }
}

/* ===========================
   REFLECTIONS LOGIC
=========================== */

let allReflections = [];
let filteredReflections = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentTag = 'All';

window.initReflections = async function () {
  await loadHeader('reflections.html');

  try {
    const res = await fetch('reflections.json');
    allReflections = await res.json();
    filteredReflections = [...allReflections];

    const tagsSet = new Set();
    allReflections.forEach(r => {
      if (r.tags) r.tags.forEach(t => tagsSet.add(t.toLowerCase()));
      if (r.category) tagsSet.add(r.category.toLowerCase());
    });

    renderTags(Array.from(tagsSet).sort());
    setupSearch();
    renderReflections();

  } catch (e) {
    console.error(e);
  }
};

function createReflectionCard(r) {
  const dateStr = new Date(r.date)
    .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `
    <a href="view.html?reflection=${r.id}" 
       class="group block rounded-lg overflow-hidden transition-colors"
       style="background-color: var(--color-surface); border: 1px solid var(--color-border);">

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

function renderTags(tags) {
  const container = document.getElementById('tags-container');
  let html = `<button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
      style="background-color: var(--color-accent); color: white">All</button>`;

  tags.forEach(tag => {
    html += `<button data-tag="${tag}" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
        style="background-color: var(--color-surface-raised);
               color: var(--color-text-muted);
               border: 1px solid var(--color-border);">#${tag}</button>`;
  });

  container.innerHTML = html;

  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      currentTag = e.target.dataset.tag;
      currentPage = 1;

      // resaltar tag activo
      document.querySelectorAll('.tag-btn').forEach(b => {
        b.style.backgroundColor = 'var(--color-surface-raised)';
        b.style.color = 'var(--color-text-muted)';
        b.style.border = '1px solid var(--color-border)';
      });
      e.target.style.backgroundColor = 'var(--color-accent)';
      e.target.style.color = 'white';
      e.target.style.border = 'none';

      filterReflections();
    });
  });
}

function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', filterReflections);
}

function filterReflections() {
  const search = document.getElementById('search-input').value.toLowerCase();

  filteredReflections = allReflections.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(search) ||
      r.description.toLowerCase().includes(search);

    let matchesTag = true;
    if (currentTag !== 'All') {
      const rTags = [];
      if (r.tags) r.tags.forEach(t => rTags.push(t.toLowerCase()));
      if (r.category) rTags.push(r.category.toLowerCase());
      matchesTag = rTags.includes(currentTag);
    }

    return matchesSearch && matchesTag;
  });

  currentPage = 1;
  renderReflections();
}

function renderReflections() {
  const grid = document.getElementById('posts-grid');

  // Ordenar por fecha descendente (más reciente primero)
  const sortedReflections = filteredReflections.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const items = sortedReflections.slice(start, end);

  if (items.length === 0) {
    // mensaje centrado y en bloque completo
    grid.innerHTML = `<p style="
      color: var(--color-text-muted); 
      font-style: italic; 
      text-align: center; 
      width: 100%; 
      display: block; 
      margin: 4rem 0;
      font-size: 1.1rem;">
      No hay posts que coincidan con esta búsqueda.
    </p>`;
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }

  grid.innerHTML = items.map(createReflectionCard).join('');
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredReflections.length / itemsPerPage);
  const container = document.getElementById('pagination-container');

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    html += `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
      style="background-color: ${isActive ? 'var(--color-accent)' : 'var(--color-surface)'}; 
             color: ${isActive ? 'white' : 'var(--color-text-muted)'};
             border: 1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}" 
      data-page="${i}">${i}</button>`;
  }

  container.innerHTML = html;

  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.getAttribute('data-page'));
      renderReflections();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

})();