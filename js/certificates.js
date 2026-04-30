(function () {

    async function loadHeader(activePage = '') {
        const res = await fetch('header.html');
        const html = await res.text();
        document.getElementById('header-container').innerHTML = html;

        const links = document.querySelectorAll('.nav-link');

        // normalizamos el nombre actual
        const currentPage = activePage.split('/').pop();

        links.forEach(link => {
            link.classList.remove('nav-accent');

            const href = link.getAttribute('href').split('/').pop();

            if (href === currentPage) {
                link.classList.add('nav-accent');
            }
        });
    }

    let allCertificates = [];
    let filteredCertificates = [];
    let currentPage = 1;
    const itemsPerPage = 6;
    let currentTag = 'All';

    window.initCertificates = async function () {

        await loadHeader('certificates.html');

        const res = await fetch('certificates.json');
        allCertificates = await res.json();
        filteredCertificates = [...allCertificates];

        const tagsSet = new Set();

        allCertificates.forEach(c => {
            if (c.tags) c.tags.forEach(t => tagsSet.add(t.toLowerCase()));
            if (c.category) tagsSet.add(c.category.toLowerCase());
        });

        renderTags(Array.from(tagsSet).sort());
        setupSearch();
        renderCertificates();
    };

    function createCard(c) {

        const statusColor =
            c.status === "completed"
                ? "#22c55e"
                : "#f59e0b";

        return `
    <a href="${c.url}" target="_blank"
       class="group block rounded-lg overflow-hidden transition-colors"
       style="background-color: var(--color-surface);
              border:1px solid var(--color-border);">

        <div class="post-image-container">
            <img src="certificates/${c.id}/images/logo.png" alt="${c.title}">
        </div>

        <div class="p-5">

            <span style="
                display:inline-block;
                margin-bottom:10px;
                padding:4px 10px;
                border-radius:999px;
                font-size:12px;
                background:${statusColor};
                color:white;
            ">
                ${c.status === "completed" ? "Completed" : "In Progress"}
            </span>

            <h3 class="post-title mt-2 mb-2 text-lg font-semibold">
                ${c.title}
            </h3>

            <p class="text-sm" style="color: var(--color-text-muted)">
                ${c.description}
            </p>

        </div>
    </a>
    `;
    }

    function renderTags(tags) {

        const container = document.getElementById('tags-container');

        let html = `
    <button data-tag="All" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
    style="background-color:var(--color-accent); color:white;">
    All
    </button>
    `;

        tags.forEach(tag => {
            html += `
        <button data-tag="${tag}" class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
        style="background-color:var(--color-surface-raised);
        color:var(--color-text-muted);
        border:1px solid var(--color-border);">
        #${tag}
        </button>`;
        });

        container.innerHTML = html;

        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                currentTag = e.target.dataset.tag;
                currentPage = 1;
                filterCertificates();
            });
        });
    }

    function setupSearch() {
        document.getElementById('search-input')
            .addEventListener('input', filterCertificates);
    }

    function filterCertificates() {

        const search = document.getElementById('search-input')
            .value.toLowerCase();

        filteredCertificates = allCertificates.filter(c => {

            const matchesSearch =
                c.title.toLowerCase().includes(search) ||
                c.description.toLowerCase().includes(search);

            let matchesTag = true;

            if (currentTag !== "All") {

                const tags = [];

                if (c.tags) c.tags.forEach(t => tags.push(t.toLowerCase()));
                if (c.category) tags.push(c.category.toLowerCase());

                matchesTag = tags.includes(currentTag);
            }

            return matchesSearch && matchesTag;
        });

        renderCertificates();
    }

    function renderCertificates() {

        const grid = document.getElementById('certificates-grid');

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const items = filteredCertificates.slice(start, end);

        if (!items.length) {
            grid.innerHTML = `
        <p style="color:var(--color-text-muted); text-align:center; width:100%;">
        No certificates found.
        </p>`;
            return;
        }

        grid.innerHTML = items.map(createCard).join('');
        renderPagination();
    }

    function renderPagination() {

        const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
        const container = document.getElementById('pagination-container');

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';

        for (let i = 1; i <= totalPages; i++) {

            html += `
        <button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
        data-page="${i}"
        style="background:${i === currentPage ? 'var(--color-accent)' : 'var(--color-surface)'};
        color:${i === currentPage ? 'white' : 'var(--color-text-muted)'};">
        ${i}
        </button>`;
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