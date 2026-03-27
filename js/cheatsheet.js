let allSheets = [];
let filteredSheets = [];
let currentTag = 'All';
let currentOS = 'All';
let currentPage = 1;
const itemsPerPage = 6;

// ==================== HEADER ====================
window.loadHeader = async function(activePage = '') {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error("Failed to load header");
    const html = await res.text();
    const container = document.getElementById('header-container');
    if(container) container.innerHTML = html;

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.classList.remove('nav-accent');
      link.style.color = 'var(--color-text-muted)';
      const href = link.getAttribute('href')?.replace(/^\//,'') || '';
      if(activePage.includes(href) && href !== '') {
        link.classList.add('nav-accent');
        link.style.color = 'var(--color-accent-light)';
      } else if(activePage === 'index.html' && href === '') {
        link.classList.add('nav-accent');
        link.style.color = 'var(--color-accent-light)';
      }
    });
  } catch(e) {
    console.error(e);
  }
};

// ==================== INIT ====================
window.initCheatSheet = async function () {
  await loadHeader('cheatsheet.html');

  try {
    const res = await fetch('cheatsheet.json');
    allSheets = await res.json();
    allSheets.sort((a,b)=> new Date(b.date)-new Date(a.date));
    filteredSheets = [...allSheets];

    setupOSFilters();
    setupFilters();
    setupSearch();
    renderSheets();
    renderPagination();

  } catch(err){
    const grid = document.getElementById('cheatsheet-grid');
    if(grid) grid.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
};

// ==================== TARJETA ====================
function createSheetCard(sheet){
  return `
    <a href="view.html?cheatsheet=${sheet.id}" class="cs-card">
        <div class="img-container">
            <img src="cheatsheet/${sheet.id}/images/logo.png" alt="${sheet.title} logo">
            <div class="img-overlay"></div>
        </div>
        <div class="cs-content">
            <div class="cs-title">${sheet.title}</div>
            <div class="cs-category">${sheet.category} | ${sheet.os}</div>
            <div class="cs-tags">${sheet.tags.map(t=>`<span>${t}</span>`).join('')}</div>
            <div class="cs-desc">${sheet.description}</div>
        </div>
    </a>
  `;
}

// ==================== RENDER ====================
function renderSheets(){
  const grid = document.getElementById('cheatsheet-grid');
  if(!grid) return;

  // Filtrado combinado
  const start = (currentPage-1)*itemsPerPage;
  const end = start+itemsPerPage;
  const items = filteredSheets.slice(start,end);

  if(!items.length){
    grid.innerHTML = `<p style="color: var(--color-text-muted); text-align:center; margin: 4rem 0;">No CheatSheets found.</p>`;
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }

  grid.innerHTML = items.map(createSheetCard).join('');
  renderPagination();
}

// ==================== FILTROS OS ====================
function setupOSFilters() {
  const osContainer = document.getElementById('filter-container');
  if (!osContainer) return;

  const buttons = osContainer.querySelectorAll('.cs-filter-btn');

  // Establecer All como activo al cargar
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.id === 'filter-all') {
      btn.classList.add('active');
    }
  });

  // Click en los botones
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentOS = btn.id.replace('filter-', '');
      currentPage = 1;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterSheets();
    });
  });

  // Aplicar filtro inicial al cargar
  currentOS = 'all';
  filterSheets();
}

// ==================== FILTROS TAGS ====================
function setupFilters(){
  const tagsContainer = document.getElementById('tags-container');
  if(!tagsContainer) return;

  const uniqueTags = [...new Set(allSheets.flatMap(s=>s.tags.map(t=>t.toLowerCase())))];

  let html = `<button class="tag-btn active" data-tag="All">All</button>`;
  uniqueTags.forEach(t=>{
    html += `<button class="tag-btn" data-tag="${t}">${t}</button>`;
  });
  tagsContainer.innerHTML = html;

  tagsContainer.querySelectorAll('.tag-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      currentTag = btn.dataset.tag;
      currentPage = 1;

      // marcar activo
      tagsContainer.querySelectorAll('.tag-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      filterSheets();
    });
  });
}

// ==================== BUSCADOR ====================
function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', () => {
    currentPage = 1;
    filterSheets();
  });
}

// ==================== FILTRADO GLOBAL ====================
function filterSheets() {
  const search = document.getElementById('search-input')?.value.toLowerCase().trim() || '';

  filteredSheets = allSheets.filter(sheet => {
    const matchesOS = currentOS === 'all' || sheet.os.toLowerCase() === currentOS.toLowerCase();
    const matchesTag = currentTag === 'All' || sheet.tags.some(t => t.toLowerCase() === currentTag.toLowerCase());
    const matchesSearch = sheet.title.toLowerCase().includes(search) || sheet.description.toLowerCase().includes(search);

    return matchesOS && matchesTag && matchesSearch;
  });

  currentPage = 1;
  renderSheets();
}

// ==================== PAGINACION ====================
function renderPagination(){
  const totalPages = Math.ceil(filteredSheets.length/itemsPerPage);
  const container = document.getElementById('pagination-container');
  if(!container) return;

  if(totalPages<=1){
    container.innerHTML='';
    return;
  }

  let html='';
  for(let i=1;i<=totalPages;i++){
    const active = i===currentPage;
    html+=`<button class="page-btn" data-page="${i}" 
      style="
        background-color: ${active?'var(--color-accent)':'var(--color-surface)'};
        color: ${active?'white':'var(--color-text-muted)'};
        border: 1px solid ${active?'var(--color-accent)':'var(--color-border)'};
        padding:0.4rem 0.8rem;
        border-radius:6px;
        margin:0 2px;
        cursor:pointer;
      ">${i}</button>`;
  }
  container.innerHTML=html;

  container.querySelectorAll('.page-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      currentPage=parseInt(btn.dataset.page);
      renderSheets();
      window.scrollTo({top:0, behavior:'smooth'});
    });
  });
}