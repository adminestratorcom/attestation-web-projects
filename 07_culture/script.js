'use strict';

// Названия событий, которые по очереди показываются в галерее.
const slides = [
  '🎭 Театральный вечер',
  '🎨 Выставка современного искусства',
  '🎶 Живой концерт'
];

let currentSlide = 0;

// Переключаем галерею вперёд или назад.
function moveGallery(direction) {
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  document.getElementById('gallery').textContent = slides[currentSlide];
}

// Автоматически меняем слайд каждые пять секунд.
setInterval(function () {
  moveGallery(1);
}, 5000);

// Считаем общую стоимость билетов.
function calcTickets() {
  const quantity = Number(document.getElementById('ticketQty').value);
  const ticketPrice = Number(document.getElementById('ticketType').value);
  const result = document.getElementById('ticketResult');

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    result.textContent = 'Количество билетов должно быть от 1 до 20.';
    return;
  }

  const total = quantity * ticketPrice;
  result.textContent = 'Итого: ' + total.toLocaleString('ru-RU') + ' ₽';
}

// Запоминаем выбранный тип мероприятия.
let currentEventType = 'all';

// Фильтруем мероприятия по типу и дате.
function filterEvents(type, button) {
  if (type) currentEventType = type;

  document.querySelectorAll('.chips button').forEach(function (item) {
    item.classList.remove('active');
  });

  if (button) button.classList.add('active');

  const selectedDate = document.getElementById('eventDate')?.value;
  let shownCount = 0;

  document.querySelectorAll('.event').forEach(function (card) {
    const matchesType =
      currentEventType === 'all' || card.dataset.type === currentEventType;

    const matchesDate =
      !selectedDate || card.dataset.date === selectedDate;

    const shouldShow = matchesType && matchesDate;
    card.classList.toggle('hidden', !shouldShow);

    if (shouldShow) shownCount++;
  });

  // Добавляем сообщение, если событий по выбранным условиям нет.
  let emptyMessage = document.getElementById('eventEmpty');

  if (!emptyMessage) {
    emptyMessage = document.createElement('p');
    emptyMessage.id = 'eventEmpty';
    emptyMessage.className = 'notice';
    document.querySelector('.event')?.parentElement?.after(emptyMessage);
  }

  if (emptyMessage) {
    emptyMessage.textContent = shownCount
      ? ''
      : 'На выбранную дату мероприятий нет.';
  }
}