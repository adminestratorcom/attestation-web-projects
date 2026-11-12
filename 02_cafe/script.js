'use strict';

// Находим элемент страницы по его ID.
function getElement(id) {
  return document.getElementById(id);
}

// Здесь храним добавленные в корзину блюда.
let foodCart = [];

// Добавляем блюдо в корзину.
function addFood(name, price) {
  foodCart.push({ name: name, price: price });
  renderFoodCart();
}

// Обновляем список блюд, количество и общую стоимость.
function renderFoodCart() {
  getElement('cartCount').textContent = foodCart.length;

  const list = getElement('cartItems');
  list.replaceChildren();

  if (foodCart.length === 0) {
    list.textContent = 'Пока пусто';
  }

  foodCart.forEach(function (item, index) {
    const row = document.createElement('div');
    row.className = 'list-item';

    const name = document.createElement('span');
    name.textContent = item.name;

    const price = document.createElement('b');
    price.textContent = item.price + ' ₽ ';

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'secondary';
    removeButton.textContent = 'Удалить';
    removeButton.setAttribute('aria-label', 'Удалить ' + item.name);

    removeButton.addEventListener('click', function () {
      foodCart.splice(index, 1); // Удаляем одно блюдо по его номеру.
      renderFoodCart();
    });

    price.append(removeButton);
    row.append(name, price);
    list.append(row);
  });

  // reduce складывает цены всех блюд.
  const total = foodCart.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  getElement('cartTotal').textContent =
    'Итого: ' + total.toLocaleString('ru-RU') + ' ₽';
}

// Удаляем блюдо по номеру.
function removeFood(index) {
  foodCart.splice(index, 1);
  renderFoodCart();
}

// Полностью очищаем корзину.
function clearCart() {
  foodCart = [];
  renderFoodCart();
}

// Показываем блюда выбранной категории.
function filterFood(tag, button) {
  document.querySelectorAll('.chips button').forEach(function (item) {
    item.classList.remove('active');
  });

  if (button) button.classList.add('active');

  document.querySelectorAll('.food').forEach(function (card) {
    const tags = card.dataset.tags.split(' ');
    const shouldHide = tag !== 'all' && !tags.includes(tag);
    card.classList.toggle('hidden', shouldHide);
  });
}

// Проверяем форму бронирования. Настоящая отправка на сервер не выполняется.
document.querySelectorAll('.validate-form').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const date = form.querySelector('#bookDate')?.value;
    const time = form.querySelector('input[type="time"]')?.value;
    const guests = Number(form.querySelector('input[type="number"]')?.value);

    if (date && date < new Date().toISOString().slice(0, 10)) {
      alert('Нельзя выбрать прошедшую дату.');
      return;
    }

    if (guests < 1 || guests > 12) {
      alert('Количество гостей должно быть от 1 до 12.');
      return;
    }

    alert(
      'Заявка на ' + date + ' в ' + time +
      ', гостей: ' + guests +
      ', проверена. Бронирование демонстрационное.'
    );

    form.reset();
  });
});