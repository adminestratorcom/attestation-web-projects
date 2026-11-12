'use strict';

// Список товаров, которые пользователь добавил в корзину.
let shopItems = [];

// Добавляем товар и ненадолго показываем уведомление.
function addProduct(name, price) {
  shopItems.push({ name: name, price: price });
  renderShop();

  const toast = document.getElementById('shopToast');
  toast.classList.remove('hidden');

  clearTimeout(window.shopToastTimer);
  window.shopToastTimer = setTimeout(function () {
    toast.classList.add('hidden');
  }, 3000);
}

// Перерисовываем корзину и пересчитываем сумму.
function renderShop() {
  document.getElementById('shopCount').textContent = shopItems.length;

  const cart = document.getElementById('shopCart');
  cart.replaceChildren();

  if (shopItems.length === 0) {
    cart.textContent = 'Корзина пуста';
  }

  shopItems.forEach(function (item, index) {
    const row = document.createElement('div');
    row.className = 'list-item';

    const productText = document.createElement('span');
    productText.textContent = item.name + ' — ' + item.price + ' ₽';

    const removeButton = document.createElement('button');
    removeButton.className = 'secondary';
    removeButton.type = 'button';
    removeButton.textContent = 'Удалить';

    removeButton.addEventListener('click', function () {
      shopItems.splice(index, 1);
      renderShop();
    });

    row.append(productText, removeButton);
    cart.append(row);
  });

  let total = 0;

  shopItems.forEach(function (item) {
    total += item.price;
  });

  document.getElementById('shopTotal').textContent =
    'Итого: ' + total.toLocaleString('ru-RU') + ' ₽';
}

// Фильтруем товары по категории, цене и наличию.
function filterProducts() {
  const category = document.getElementById('productCategory').value;
  const maxPrice = Number(document.getElementById('maxPrice').value);
  const onlyStock = document.getElementById('onlyStock').checked;

  document.getElementById('priceLabel').textContent = maxPrice;

  document.querySelectorAll('.product').forEach(function (card) {
    const wrongCategory =
      category !== 'all' && card.dataset.cat !== category;

    const tooExpensive = Number(card.dataset.price) > maxPrice;
    const notInStock = onlyStock && card.dataset.stock !== 'yes';

    card.classList.toggle(
      'hidden',
      wrongCategory || tooExpensive || notInStock
    );
  });
}