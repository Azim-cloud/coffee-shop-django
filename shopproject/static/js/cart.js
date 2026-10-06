let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const bodyEl = document.getElementById('cartBody');
    const totalEl = document.getElementById('cartTotal');

    if (!countEl) return;

    const count = cart.reduce((s, i) => s + i.qty, 0);
    countEl.textContent = count;

    if (!bodyEl || !totalEl) return;

    if (cart.length === 0) {
        bodyEl.innerHTML = '<p class="text-muted text-center">Корзина пуста</p>';
        totalEl.textContent = '0 ₽';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach((item, i) => {
        total += item.price * item.qty;
        html += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                    <strong>${item.name}</strong><br>
                    <small class="text-muted">${item.price} ₽ × ${item.qty}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i}, -1)">−</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${i}, 1)">+</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${i})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>`;
    });
    bodyEl.innerHTML = html;
    totalEl.textContent = total + ' ₽';
}

function addToCart(name, price, btn) {
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, qty: 1 });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast(`${name} добавлен в корзину`);

    if (btn) {
        btn.classList.add('added');
        btn.innerHTML = '<i class="bi bi-check-circle"></i> Добавлено';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="bi bi-plus-circle"></i> В корзину';
        }, 1200);
    }
}

function changeQty(i, delta) {
    cart[i].qty += delta;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function removeItem(i) {
    cart.splice(i, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function openCart() {
    const modalEl = document.getElementById('cartModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
}

function checkout() {
    if (cart.length === 0) {
        showToast('Корзина пуста!');
        return;
    }
    showToast('Заказ оформлен! Спасибо 🎉');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function showToast(text) {
    const t = document.getElementById('toastNotify');
    if (!t) return;
    document.getElementById('toastText').textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', updateCartUI);