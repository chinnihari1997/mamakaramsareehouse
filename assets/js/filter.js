// Loads sarees.json and implements search + filters + rendering with sorting and pagination
let SAREES = [];
let currentList = [];
let currentPage = 1;
const PAGE_SIZE = 10;
document.addEventListener('DOMContentLoaded', async ()=>{
  try{
    const res = await fetch('sarees.json');
    SAREES = await res.json();
  }catch(e){ console.error('Failed to load sarees.json', e); SAREES = []; }

  initFilters();
  applyFilters();
  initPaginationControls();
});

function initFilters(){
  const categories = [...new Set(SAREES.map(s=>s.category))].sort();
  const colors = [...new Set(SAREES.flatMap(s=>s.colors))].sort();

  const catList = document.getElementById('category-list'); if(catList) catList.innerHTML = '';
  categories.forEach(c=>{
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<label><input type="checkbox" value="${c}"> ${c}</label>`;
    catList.appendChild(wrapper);
  });

  const colorList = document.getElementById('color-list'); if(colorList) colorList.innerHTML = '';
  colors.forEach(c=>{
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<label><input type="checkbox" value="${c}"> ${c}</label>`;
    colorList.appendChild(wrapper);
  });

  // price bounds
  const prices = SAREES.map(s=>s.price);
  const min = Math.min(...prices); const max = Math.max(...prices);
  const pmin = document.getElementById('price-min');
  const pmax = document.getElementById('price-max');
  if(pmin) pmin.placeholder = min;
  if(pmax) pmax.placeholder = max;

  const applyBtn = document.getElementById('apply-filters');
  if (applyBtn) applyBtn.addEventListener('click', ()=>{ currentPage = 1; applyFilters(); });
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', ()=>{ currentPage = 1; applyFilters(); });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.addEventListener('change', ()=>{ currentPage = 1; applyFilters(); });
}

function applyFilters(){
  const qEl = document.getElementById('search-input');
  const q = qEl ? qEl.value.trim().toLowerCase() : '';
  const checkedCats = Array.from(document.querySelectorAll('#category-list input:checked')).map(i=>i.value);
  const checkedColors = Array.from(document.querySelectorAll('#color-list input:checked')).map(i=>i.value);
  const minVal = parseFloat(document.getElementById('price-min').value || Number.NEGATIVE_INFINITY);
  const maxVal = parseFloat(document.getElementById('price-max').value || Number.POSITIVE_INFINITY);

  let filtered = SAREES.filter(s => {
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (checkedCats.length && !checkedCats.includes(s.category)) return false;
    if (s.price < minVal || s.price > maxVal) return false;
    if (checkedColors.length && !checkedColors.some(c=>s.colors.includes(c))) return false;
    return true;
  });

  // Sorting
  const sort = document.getElementById('sort-select') ? document.getElementById('sort-select').value : 'default';
  if (sort === 'price-asc') filtered.sort((a,b)=>a.price-b.price);
  else if (sort === 'price-desc') filtered.sort((a,b)=>b.price-a.price);
  else if (sort === 'name-asc') filtered.sort((a,b)=>a.name.localeCompare(b.name));
  else if (sort === 'name-desc') filtered.sort((a,b)=>b.name.localeCompare(a.name));

  currentList = filtered;
  renderPage(currentPage);
}

function resetFilters(){
  const searchInput = document.getElementById('search-input'); if(searchInput) searchInput.value = '';
  document.querySelectorAll('#category-list input:checked').forEach(i=>i.checked=false);
  document.querySelectorAll('#color-list input:checked').forEach(i=>i.checked=false);
  document.getElementById('price-min').value = '';
  document.getElementById('price-max').value = '';
  document.getElementById('sort-select').value = 'default';
  currentPage = 1;
  currentList = SAREES.slice();
  renderPage(currentPage);
}

function renderPage(page){
  const total = currentList.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page < 1) page = 1; if (page > totalPages) page = totalPages;
  currentPage = page;
  const start = (page-1)*PAGE_SIZE; const end = start + PAGE_SIZE;
  const pageItems = currentList.slice(start, end);
  renderCards(pageItems);
  renderPagination(totalPages);
}

function renderCards(list){
  const container = document.getElementById('cards');
  const count = document.getElementById('results-count');
  if (!container) return;
  container.innerHTML = '';
  count.textContent = `${currentList.length} results`;

  list.forEach(s => {
    const card = document.createElement('div'); card.className = 'card';
    const img = document.createElement('img'); img.src = s.image; img.alt = s.name;
    const body = document.createElement('div'); body.className = 'card-body';
    const title = document.createElement('h4'); title.textContent = s.name;
    const price = document.createElement('div'); price.className = 'price'; price.textContent = '₹' + s.price;
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = s.category;
    const colors = document.createElement('div'); colors.className = 'colors';
    colors.innerHTML = s.colors.map(c=>'<span class="color-pill">'+c+'</span>').join(' ');
    body.appendChild(title); body.appendChild(price); body.appendChild(meta); body.appendChild(colors);
    // Order button
    const orderBtn = document.createElement('a');
    orderBtn.className = 'btn order-btn';
    orderBtn.textContent = 'Order';
    const waText = encodeURIComponent(`Hi I want to order this saree:\nName: ${s.name}\nID: ${s.id}\nPrice: ₹${s.price}\nCategory: ${s.category}\nColors: ${s.colors.join(', ')}`);
    orderBtn.href = `https://wa.me/6281720436?text=${waText}`;
    orderBtn.target = '_blank';
    orderBtn.rel = 'noopener';
    // prevent card click from opening modal when ordering
    orderBtn.addEventListener('click', (e)=>{ e.stopPropagation(); });
    body.appendChild(orderBtn);
    card.appendChild(img); card.appendChild(body);
    card.addEventListener('click', ()=>{ window.openSareeModal(s); });
    container.appendChild(card);
  });
}

function initPaginationControls(){
  const pag = document.getElementById('pagination-controls');
  if (!pag) return;
}

function renderPagination(totalPages){
  const container = document.getElementById('pagination-controls');
  if (!container) return;
  container.innerHTML = '';
  const prev = document.createElement('button'); prev.className = 'btn'; prev.textContent = 'Prev'; prev.disabled = currentPage===1;
  prev.addEventListener('click', ()=>{ if(currentPage>1) renderPage(currentPage-1); });
  container.appendChild(prev);

  // page numbers (show up to 7 pages with ellipses)
  const maxButtons = 7; let start = Math.max(1, currentPage - 3); let end = Math.min(totalPages, start + maxButtons -1);
  if (end - start < maxButtons -1) start = Math.max(1, end - maxButtons +1);
  if (start > 1){ addPageButton(container, 1); if (start>2) addEllipsis(container); }
  for(let p=start;p<=end;p++){ addPageButton(container,p); }
  if (end < totalPages){ if (end < totalPages-1) addEllipsis(container); addPageButton(container, totalPages); }

  const next = document.createElement('button'); next.className = 'btn'; next.textContent = 'Next'; next.disabled = currentPage===totalPages;
  next.addEventListener('click', ()=>{ if(currentPage<totalPages) renderPage(currentPage+1); });
  container.appendChild(next);
}

function addPageButton(container, p){
  const btn = document.createElement('button'); btn.className = 'btn page-btn'; btn.textContent = p; if (p===currentPage) btn.classList.add('active');
  btn.addEventListener('click', ()=> renderPage(p));
  container.appendChild(btn);
}

function addEllipsis(container){ const span = document.createElement('span'); span.className='ellipsis'; span.textContent = '...'; container.appendChild(span); }
