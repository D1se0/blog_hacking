(function(){

async function loadHeader(activePage=''){
try{

const res = await fetch('header.html');
const html = await res.text();

document.getElementById('header-container').innerHTML = html;

const links=document.querySelectorAll('.nav-link');

links.forEach(link=>{
link.classList.remove('nav-accent');
link.style.color='var(--color-text-muted)';

const href=link.getAttribute('href').replace(/^\//,'');

if(activePage.includes(href) && href!==''){
link.classList.add('nav-accent');
link.style.color='var(--color-accent-light)';
}

});

}catch(e){console.error(e)}
}

/* ================= */

let allEnviroments=[];
let filteredEnviroments=[];
let currentPage=1;
let currentTag='All';

const itemsPerPage=6;

/* ================= */

window.initEnviroments=async function(){

await loadHeader('enviroments.html');

const res=await fetch('enviroments.json');

allEnviroments=await res.json();

filteredEnviroments=[...allEnviroments];

const tagsSet=new Set();

allEnviroments.forEach(e=>{

if(e.tags) e.tags.forEach(t=>tagsSet.add(t.toLowerCase()));

if(e.category) tagsSet.add(e.category.toLowerCase());

});

renderTags(Array.from(tagsSet).sort());

setupSearch();

renderEnviroments();

};

/* ================= */

function createEnviromentCard(e){

const dateStr=new Date(e.date).toLocaleDateString("en-US",
{year:"numeric",month:"long",day:"numeric"});

return`

<a href="view.html?enviroment=${e.id}"
class="group block rounded-lg overflow-hidden transition-colors"
style="background-color:var(--color-surface);
border:1px solid var(--color-border);">

<div class="post-image-container">

<img src="enviroments/${e.id}/images/logo.png">

</div>

<div class="p-5">

<time class="text-xs"
style="color:var(--color-text-muted)">
${dateStr}
</time>

<h3 class="post-title mt-2 mb-2 text-lg font-semibold">
${e.title}
</h3>

<p class="text-sm"
style="color:var(--color-text-muted)">
${e.description}
</p>

</div>

</a>

`;

}

/* ================= */

function renderTags(tags){

const container=document.getElementById('tags-container');

let html=`<button data-tag="All"
class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
style="background-color:var(--color-accent);color:white">All</button>`;

tags.forEach(tag=>{

html+=`<button data-tag="${tag}"
class="tag-btn rounded-full px-3 py-1 text-xs font-medium"
style="background-color:var(--color-surface-raised);
color:var(--color-text-muted);
border:1px solid var(--color-border);">#${tag}</button>`;

});

container.innerHTML=html;

document.querySelectorAll('.tag-btn').forEach(btn=>{

btn.addEventListener('click',e=>{

currentTag=e.target.dataset.tag;

currentPage=1;

document.querySelectorAll('.tag-btn').forEach(b=>{
b.style.backgroundColor='var(--color-surface-raised)';
b.style.color='var(--color-text-muted)';
b.style.border='1px solid var(--color-border)';
});

e.target.style.backgroundColor='var(--color-accent)';
e.target.style.color='white';
e.target.style.border='none';

filterEnviroments();

});

});

}

/* ================= */

function setupSearch(){

const input=document.getElementById('search-input');

if(!input)return;

input.addEventListener('input',filterEnviroments);

}

/* ================= */

function filterEnviroments(){

const search=document.getElementById('search-input').value.toLowerCase();

filteredEnviroments=allEnviroments.filter(e=>{

const matchesSearch=
e.title.toLowerCase().includes(search)||
e.description.toLowerCase().includes(search);

let matchesTag=true;

if(currentTag!=='All'){

const tags=[];

if(e.tags) e.tags.forEach(t=>tags.push(t.toLowerCase()));

if(e.category) tags.push(e.category.toLowerCase());

matchesTag=tags.includes(currentTag);

}

return matchesSearch && matchesTag;

});

currentPage=1;

renderEnviroments();

}

/* ================= */

function renderEnviroments(){

const grid=document.getElementById('posts-grid');

const sorted=[...filteredEnviroments].sort((a,b)=>{

return new Date(b.date)-new Date(a.date);

});

const start=(currentPage-1)*itemsPerPage;

const end=start+itemsPerPage;

const items=sorted.slice(start,end);

if(items.length===0){

grid.innerHTML=`<p style="color:var(--color-text-muted);
text-align:center;
width:100%;
margin:4rem 0;">No enviroments found.</p>`;

document.getElementById('pagination-container').innerHTML='';

return;

}

grid.innerHTML=items.map(createEnviromentCard).join('');

renderPagination();

}

/* ================= */

function renderPagination(){

const totalPages=Math.ceil(filteredEnviroments.length/itemsPerPage);

const container=document.getElementById('pagination-container');

if(totalPages<=1){

container.innerHTML='';

return;

}

let html='';

for(let i=1;i<=totalPages;i++){

const active=i===currentPage;

html+=`<button class="page-btn rounded-md px-3 py-1 text-sm font-medium"
style="background-color:${active?'var(--color-accent)':'var(--color-surface)'};
color:${active?'white':'var(--color-text-muted)'};
border:1px solid ${active?'var(--color-accent)':'var(--color-border)'}"
data-page="${i}">${i}</button>`;

}

container.innerHTML=html;

document.querySelectorAll('.page-btn').forEach(btn=>{

btn.addEventListener('click',e=>{

currentPage=parseInt(e.target.dataset.page);

renderEnviroments();

window.scrollTo({top:0,behavior:'smooth'});

});

});

}

})();