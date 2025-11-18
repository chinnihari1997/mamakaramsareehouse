// Simple modal handler for saree details and order integration
document.addEventListener('DOMContentLoaded', ()=>{
  const modal = document.getElementById('saree-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;

  window.openSareeModal = function(saree){
    modalBody.innerHTML = '';
    const img = document.createElement('img');
    img.src = saree.image;
    img.alt = saree.name;
    img.style.maxWidth = '100%';
    const title = document.createElement('h3'); title.textContent = saree.name;
    const price = document.createElement('div'); price.className = 'price'; price.textContent = '₹' + saree.price;
    const category = document.createElement('div'); category.className = 'meta'; category.textContent = saree.category;
    const colors = document.createElement('div'); colors.className = 'colors';
    colors.innerHTML = saree.colors.map(c=>'<span class="color-pill">'+c+'</span>').join(' ');

    // Order button inside modal
    const orderBtn = document.createElement('a');
    orderBtn.className = 'btn order-btn';
    orderBtn.textContent = 'Order via WhatsApp';
    const waText = encodeURIComponent(`Hi I want to order this saree:\nName: ${saree.name}\nID: ${saree.id}\nPrice: ₹${saree.price}\nCategory: ${saree.category}\nColors: ${saree.colors.join(', ')}`);
    orderBtn.href = `https://wa.me/6281720436?text=${waText}`;
    orderBtn.target = '_blank'; orderBtn.rel = 'noopener';

    modalBody.appendChild(img);
    modalBody.appendChild(title);
    modalBody.appendChild(price);
    modalBody.appendChild(category);
    modalBody.appendChild(colors);
    modalBody.appendChild(orderBtn);
    modal.classList.add('show');
  }

  closeBtn.addEventListener('click', ()=> modal.classList.remove('show'));
  modal.addEventListener('click', (e)=>{ if (e.target === modal) modal.classList.remove('show'); });
});
