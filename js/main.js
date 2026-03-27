async function loadHeader(activePage = '') {
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error("Failed to load header");
    const html = await res.text();
    document.getElementById('header-container').innerHTML = html;

    // Set active link based on page
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
  } catch (e) {
    console.error(e);
  }
}

const REMOTE_MACHINES = "https://greene-alot-gig-everything.trycloudflare.com/machines";

// Generate HTML for a machine card
function createMachineCard(m) {
  const dateStr = new Date(m.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // Tags: difficulty, os, skills
  let tagsHtml = '';
  if (m.difficulty) tagsHtml += `<span class="rounded-full font-medium px-2 py-0.5 text-xs" style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border)">#${m.difficulty.toLowerCase()}</span>`;
  if (m.os) tagsHtml += `<span class="rounded-full font-medium px-2 py-0.5 text-xs" style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border)">#${m.os.toLowerCase()}</span>`;
  if (m.skills) {
    m.skills.forEach(s => {
      tagsHtml += `<span class="rounded-full font-medium px-2 py-0.5 text-xs" 
      style="background-color: var(--color-surface-raised); 
             color: var(--color-text-muted); 
             border: 1px solid var(--color-border)">
      #${s.toLowerCase()}
    </span>`;
    });
  }

  // Minimalist status tag con blur y colores dados
  const statusTag = m.active
    ? `<span class="rounded-full font-bold px-2 py-0.5 text-xs" 
        style="color: #28A745; 
               background: rgba(145, 152, 161, 0.2); 
               backdrop-filter: blur(5px);
               -webkit-backdrop-filter: blur(5px);">
        Activa
      </span>`
    : `<span class="rounded-full font-bold px-2 py-0.5 text-xs" 
        style="color: #DC143C; 
               background: rgba(145, 152, 161, 0.2); 
               backdrop-filter: blur(5px);
               -webkit-backdrop-filter: blur(5px);">
        Retirada
      </span>`;

  tagsHtml = statusTag + ' ' + tagsHtml;

  // Candado solo si active
  const lockSvg = m.active ? `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
    </svg>
  ` : '';

  return `
  <a href="view.html?machine=${m.id.toLowerCase()}" 
   class="group block rounded-lg overflow-hidden transition-colors"
   style="background-color: var(--color-surface); border: 1px solid var(--color-border); position: relative;">

    ${m.active_to_retire ? `
      <div style="
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        border-radius: 999px;
        color: #ffb3b3;
        background: rgba(220, 20, 60, 0.12);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border: 1px solid rgba(220,20,60,0.25);
        z-index: 10;
      ">
        Nos deja pronto…
      </div>
    ` : ''}

    <!-- Imagen superior -->
    <div class="post-image-container">
      <img src="${REMOTE_MACHINES}/${m.id.toLowerCase()}/images/logo.png" alt="${m.title}">
    </div>

    <!-- Contenido -->
    <div class="p-5">

      <div class="mb-2 flex items-center gap-2"> 
        <time datetime="${m.date}" class="text-xs" style="color: var(--color-text-muted)">
          ${dateStr}
        </time> 
        ${lockSvg ? `<span class="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs" style="background-color: var(--color-surface-raised); color: var(--color-accent-light)"> ${lockSvg} </span>` : ''}
      </div>

      <h3 class="post-title mb-2 text-lg font-semibold transition-colors">
        ${m.title}
      </h3>

      <p class="mb-3 text-sm leading-relaxed" style="color: var(--color-text-muted)">
        ${m.description}
      </p>

      <div class="flex flex-wrap gap-2">
        ${tagsHtml}
      </div>

    </div>
  </a>
`;
}

// Load latest posts on index.html
async function loadLatestPosts() {
  try {
    const res = await fetch('machines.json');
    const machines = await res.json();
    const grid = document.getElementById('latest-posts-grid');

    // Ordenar por fecha descendente
    machines.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Tomar las 3 más recientes
    const latest = machines.slice(0, 3);

    grid.innerHTML = latest.map(createMachineCard).join('');
  } catch (e) {
    console.error(e);
    document.getElementById('latest-posts-grid').innerHTML = '<p style="color:red">Failed to load posts</p>';
  }
}

// Blog variables
let allMachines = [];
let filteredMachines = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentTag = 'All';
let currentType = 'All';

// Blog Initialization
async function initBlog() {
  try {
    const res = await fetch('machines.json');
    allMachines = await res.json();
    filteredMachines = [...allMachines];

    // Extract unique tags (os, difficulty, skills)
    const tagsSet = new Set();
    allMachines.forEach(m => {
      if (m.os) tagsSet.add(m.os.toLowerCase());
      if (m.difficulty) tagsSet.add(m.difficulty.toLowerCase());
      if (m.skills) m.skills.forEach(s => tagsSet.add(s.toLowerCase()));

      // Agregar estado como tag
      tagsSet.add(m.active ? 'activa' : 'retirada');

      if (m.active_to_retire) {
        tagsSet.add('active_to_retire');
      }
    });

    renderTags(Array.from(tagsSet));
    renderTypeFilters();
    setupSearch();
    renderBlog();
  } catch (e) {
    console.error(e);
    document.getElementById('posts-grid').innerHTML = '<p style="color:red">Failed to load posts</p>';
  }
}

function renderTags(tags) {
  const container = document.getElementById('tags-container');

  let html = `<button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium transition-colors" style="background-color: var(--color-accent); color: white">All</button>`;

  tags.forEach(tag => {
    html += `<button data-tag="${tag}" class="tag-btn rounded-full px-3 py-1 text-xs font-medium transition-colors" 
    style="background-color: var(--color-surface-raised); color: var(--color-text-muted); border: 1px solid var(--color-border)">${tag === 'active_to_retire' ? '#nos_deja_pronto' : `#${tag}`}</button>`;
  });

  container.innerHTML = html;

  // Attach event listeners
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentTag = e.target.getAttribute('data-tag');

      // Update styling
      document.querySelectorAll('.tag-btn').forEach(b => {
        b.style.backgroundColor = 'var(--color-surface-raised)';
        b.style.color = 'var(--color-text-muted)';
        b.style.border = '1px solid var(--color-border)';
      });
      e.target.style.backgroundColor = 'var(--color-accent)';
      e.target.style.color = 'white';
      e.target.style.border = 'none';

      filterBlog();
    });
  });
}

function renderTypeFilters() {
  const container = document.getElementById('ctf-type-filter');

  // Extraer tipos únicos
  const types = [...new Set(allMachines.map(m => m.type))];

  let html = `
    <button data-type="All"
      class="type-btn rounded-lg px-4 py-2 text-sm font-medium"
      style="background-color: var(--color-accent); color: white;">
      All CTFs
    </button>
  `;

  types.forEach(type => {
    html += `
      <button data-type="${type}"
        class="type-btn rounded-lg px-4 py-2 text-sm font-medium"
        style="background-color: var(--color-surface-raised);
               color: var(--color-text-muted);
               border: 1px solid var(--color-border);">
        ${type}
      </button>
    `;
  });

  container.innerHTML = html;

  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentType = e.target.dataset.type;

      // Reset estilos
      document.querySelectorAll('.type-btn').forEach(b => {
        b.style.backgroundColor = 'var(--color-surface-raised)';
        b.style.color = 'var(--color-text-muted)';
        b.style.border = '1px solid var(--color-border)';
      });

      // Activar seleccionado
      e.target.style.backgroundColor = 'var(--color-accent)';
      e.target.style.color = 'white';
      e.target.style.border = 'none';

      filterBlog();
    });
  });
}

function setupSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', (e) => {
    filterBlog(e.target.value.toLowerCase());
  });
}

function filterBlog(searchQuery = '') {
  searchQuery = document.getElementById('search-input').value.toLowerCase();

  filteredMachines = allMachines.filter(m => {

    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery) ||
      m.description.toLowerCase().includes(searchQuery);

    let matchesTag = true;
    if (currentTag !== 'All') {
      const mTags = [];
      if (m.os) mTags.push(m.os.toLowerCase());
      if (m.difficulty) mTags.push(m.difficulty.toLowerCase());
      if (m.skills) m.skills.forEach(s => mTags.push(s.toLowerCase()));
      mTags.push(m.active ? 'activa' : 'retirada');
      if (m.active_to_retire) {
        mTags.push('active_to_retire');
      }

      matchesTag = mTags.includes(currentTag);
    }

    let matchesType = true;
    if (currentType !== 'All') {
      matchesType = m.type === currentType;
    }

    return matchesSearch && matchesTag && matchesType;
  });

  currentPage = 1;
  renderBlog();
}

function renderBlog() {
  const grid = document.getElementById('posts-grid');

  if (filteredMachines.length === 0) {
    grid.innerHTML = '<p style="color: var(--color-text-muted)">No writeups found.</p>';
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }

  // Ordenar por fecha descendente antes de paginar
  const sortedMachines = filteredMachines.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = sortedMachines.slice(start, end);

  grid.innerHTML = currentItems.map(createMachineCard).join('');
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage);
  const container = document.getElementById('pagination-container');

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  const prevArrow = `
    <button class="page-arrow rounded-md px-3 py-1 transition-colors" ${prevDisabled ? 'disabled' : ''} style="
      background-color: var(--color-surface);
      color: ${prevDisabled ? 'var(--color-text-muted)' : 'var(--color-text)'}; 
      border: 1px solid ${prevDisabled ? 'var(--color-border)' : 'var(--color-border)'};
      cursor: ${prevDisabled ? 'not-allowed' : 'pointer'};
      transition: background-color 0.2s;">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  `;

  const nextArrow = `
    <button class="page-arrow rounded-md px-3 py-1 transition-colors" ${nextDisabled ? 'disabled' : ''} style="
      background-color: var(--color-surface);
      color: ${nextDisabled ? 'var(--color-text-muted)' : 'var(--color-text)'}; 
      border: 1px solid ${nextDisabled ? 'var(--color-border)' : 'var(--color-border)'};
      cursor: ${nextDisabled ? 'not-allowed' : 'pointer'};
      transition: background-color 0.2s;">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  `;

  let html = prevArrow;

  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    html += `<button class="page-btn rounded-md px-3 py-1 text-sm font-medium transition-colors" 
      style="background-color: ${isActive ? 'var(--color-accent)' : 'var(--color-surface)'}; 
             color: ${isActive ? 'white' : 'var(--color-text-muted)'};
             border: 1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}" 
      data-page="${i}">${i}</button>`;
  }

  html += nextArrow;
  container.innerHTML = html;

  // Event listeners para los números
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.getAttribute('data-page'));
      renderBlog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Event listeners para las flechas
  document.querySelectorAll('.page-arrow').forEach((btn, idx) => {
    // Hover solo si no está deshabilitado
    btn.addEventListener('mouseenter', () => {
      if (!btn.disabled) btn.style.backgroundColor = 'rgba(119, 125, 134, 0.1)'; // gris suave
    });
    btn.addEventListener('mouseleave', () => {
      if (!btn.disabled) btn.style.backgroundColor = 'var(--color-surface)';
    });

    btn.addEventListener('click', () => {
      if (idx === 0 && !prevDisabled) { // previous
        currentPage--;
      } else if (idx === 1 && !nextDisabled) { // next
        currentPage++;
      }
      renderBlog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* LOGICA DE BOTON STAT */

async function loadStats() {
  const res = await fetch('machines.json');
  const machines = await res.json();

  const difficulties = {
    Easy: { total: 0, Windows: 0, Linux: 0, color: "rgba(40,167,69,0.8)" },
    Intermediate: { total: 0, Windows: 0, Linux: 0, color: "rgba(255,140,0,0.8)" },
    Hard: { total: 0, Windows: 0, Linux: 0, color: "rgba(220,20,60,0.8)" },
    Insane: { total: 0, Windows: 0, Linux: 0, color: "rgba(110,0,0,0.85)" }
  };

  machines.forEach(m => {
    if (difficulties[m.difficulty]) {
      difficulties[m.difficulty].total++;
      difficulties[m.difficulty][m.os]++;
    }
  });

  drawChart(difficulties);
}

function drawChart(data) {
  const canvas = document.getElementById("statsCanvas");
  const ctx = canvas.getContext("2d");
  const tooltip = document.getElementById("statsTooltip");
  const labelsContainer = document.getElementById("difficultyLabels");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  labelsContainer.innerHTML = "";

  const totalMachines = Object.values(data)
    .reduce((acc, d) => acc + d.total, 0);

  let startAngle = -Math.PI / 2;
  const outerRadius = 110;
  const innerRadius = 65;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  Object.entries(data).forEach(([key, value]) => {
    if (value.total === 0) return;

    const sliceAngle = (value.total / totalMachines) * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;

    // Dibujar segmento DONUT real
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    ctx.fillStyle = value.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = value.color;
    ctx.fill();

    // Crear etiqueta alineada PERFECTAMENTE
    const label = document.createElement("div");
    label.className = "difficulty-label";
    label.textContent = key;
    label.style.color = value.color;

    const labelDistance = 150;
    const x = centerX + Math.cos(midAngle) * labelDistance;
    const y = centerY + Math.sin(midAngle) * labelDistance;

    label.style.left = x + "px";
    label.style.top = y + "px";
    label.style.transform = "translate(-50%, -50%)";

    // Hover porcentaje
    label.addEventListener("mouseenter", () => {

      const winPercent = value.total
        ? ((value.Windows / value.total) * 100).toFixed(1)
        : 0;

      const linuxPercent = value.total
        ? ((value.Linux / value.total) * 100).toFixed(1)
        : 0;

      tooltip.innerHTML = `
    <strong>${key}</strong><br>
    Total: ${value.total}<br>
    Windows: ${winPercent}%<br>
    Linux: ${linuxPercent}%
  `;

      tooltip.style.left = label.style.left;
      tooltip.style.top = label.style.top;
      tooltip.style.opacity = 1;
    });

    label.addEventListener("mouseleave", () => {
      tooltip.style.opacity = 0;
    });

    labelsContainer.appendChild(label);

    startAngle = endAngle;
  });
}

/* Toggle */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleStats");
  const section = document.getElementById("statsSection");

  let loaded = false;

  toggleBtn.addEventListener("click", async () => {
    section.classList.toggle("active");

    if (section.classList.contains("active") && !loaded) {
      await loadStats();
      loaded = true;
    }
  });
});
