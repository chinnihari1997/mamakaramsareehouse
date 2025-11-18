// Main site utilities: cart handling and header cart icon
document.addEventListener('DOMContentLoaded', ()=>{
  renderCartIcon();
});

function getCart(){
  try{ return JSON.parse(localStorage.getItem('msc_cart')||'[]'); }catch(e){ return []; }
}

function saveCart(cart){ localStorage.setItem('msc_cart', JSON.stringify(cart)); renderCartCount(); }

function addToCart(item){
  const cart = getCart();
  const existing = cart.find(c=>c.id===item.id);
  if(existing){ existing.qty = (existing.qty||1)+1; } else { cart.push({ id:item.id, name:item.name, price:item.price, qty:1 }); }
  saveCart(cart);
  // small visual confirmation
  showToast(`${item.name} added to cart`);
}

function renderCartIcon(){
  const header = document.querySelector('.header-inner');
  if(!header) return;
  // avoid duplicate
  if(document.getElementById('cart-container')) return;
  const wrap = document.createElement('div'); wrap.id='cart-container'; wrap.style.display='flex'; wrap.style.alignItems='center';
  const btn = document.createElement('button'); btn.id='cart-btn'; btn.className='cart-btn'; btn.title='View cart';
  btn.innerHTML = `<svg class="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1" fill="#222"/><circle cx="18" cy="20" r="1" fill="#222"/></svg>`;
  const count = document.createElement('span'); count.id='cart-count'; count.className='cart-count'; count.textContent='0';
  btn.appendChild(count);
  btn.addEventListener('click', ()=>{ openCartPreview(); });
  wrap.appendChild(btn);
  header.appendChild(wrap);
  renderCartCount();
}

function renderCartCount(){
  const c = getCart().reduce((s,i)=>s + (i.qty||0),0);
  const el = document.getElementById('cart-count'); if(el) el.textContent = c;
}

function openCartPreview(){
  const cart = getCart();
  if(!cart.length){ alert('Cart is empty'); return; }
  const lines = cart.map(i=>`${i.qty} x ${i.name} — ₹${i.price}`).join('\n');
  alert('Cart items:\n' + lines);
}

function showToast(msg){
  const t = document.createElement('div'); t.textContent = msg; t.style.position='fixed'; t.style.right='18px'; t.style.bottom='86px'; t.style.background='#111'; t.style.color='#fff'; t.style.padding='8px 12px'; t.style.borderRadius='8px'; t.style.zIndex='200'; t.style.opacity='0'; t.style.transition='opacity .2s';
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.style.opacity='1');
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=> t.remove(),300); },1400);
}

// expose to other modules
window.addToCart = addToCart;
