'use strict';

// Находим нужный элемент страницы.
function getElement(id) {
  return document.getElementById(id);
}

// Ищем рейсы по направлению и дате.
function searchRoutes() {
  const searchText = getElement('routeSearch').value.trim().toLocaleLowerCase('ru');
  const selectedDate = getElement('routeDate').value;
  let shownCount = 0;

  document.querySelectorAll('.route').forEach(function (card) {
    const routeText = card.textContent.toLocaleLowerCase('ru');
    const matchesRoute =
      searchText === '' ||
      card.dataset.route.includes(searchText) ||
      routeText.includes(searchText);

    const matchesDate =
      selectedDate === '' ||
      !card.dataset.date ||
      card.dataset.date === selectedDate;

    const shouldShow = matchesRoute && matchesDate;
    card.classList.toggle('hidden', !shouldShow);

    if (shouldShow) shownCount++;
  });

  // Если подходящих рейсов нет, показываем подсказку.
  let emptyMessage = getElement('routeEmpty');

  if (!emptyMessage) {
    emptyMessage = document.createElement('p');
    emptyMessage.id = 'routeEmpty';
    emptyMessage.className = 'notice';
    getElement('routes').after(emptyMessage);
  }

  emptyMessage.textContent = shownCount
    ? ''
    : 'Подходящие рейсы не найдены. Измените направление или дату.';
}

// Считаем цену поездки: расстояние умножаем на тариф.
function calcFare() {
  const distance = Number(getElement('distance').value);
  const pricePerUnit = Number(getElement('fare').value);
  const result = getElement('fareResult');

  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(pricePerUnit) ||
    distance <= 0 ||
    pricePerUnit < 0
  ) {
    result.textContent =
      'Введите расстояние больше нуля и неотрицательный тариф.';
    return;
  }

  const totalPrice = distance * pricePerUnit;
  result.textContent =
    'Стоимость: ' +
    totalPrice.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) +
    ' ₽';
}

// Демонстрационный таймер обратного отсчёта на 15 минут.
let seconds = 900;

function updateCountdown() {
  const timer = getElement('countdown');
  if (!timer) return;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // padStart добавляет ноль слева, если число состоит из одной цифры.
  timer.textContent = [hours, minutes, remainingSeconds]
    .map(function (value) {
      return String(value).padStart(2, '0');
    })
    .join(':');

  if (seconds > 0) {
    seconds--;
  } else {
    seconds = 900;
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);