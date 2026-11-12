'use strict';

// В учебном примере один временной слот заранее отмечен как занятый.
const bookedServiceSlots = new Set(['2026-12-25|12:00']);

// Рассчитываем примерную стоимость услуги.
function calcService() {
  const basePrice = Number(document.getElementById('priceService')?.value || 0);
  const complexity = Number(document.getElementById('complexity')?.value || 1);
  const urgency = Number(document.getElementById('urgent')?.value || 1);

  const totalPrice = Math.round(basePrice * complexity * urgency);
  const result = document.getElementById('servicePriceResult');

  if (result) {
    result.textContent =
      'Ориентировочная стоимость: ' +
      totalPrice.toLocaleString('ru-RU') + ' ₽';
  }
}

// Ждём, пока HTML-страница полностью загрузится.
document.addEventListener('DOMContentLoaded', function () {
  const bookingForm = document.getElementById('serviceForm');
  const dateInput = document.getElementById('serviceDate');

  // В календаре нельзя выбрать дату раньше сегодняшней.
  if (dateInput) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }

  // Проверяем заявку на услугу.
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const result = document.getElementById('bookingResult');
      if (!bookingForm.reportValidity()) return;

      const date = dateInput?.value || '';
      const time = document.getElementById('serviceTime')?.value || '';
      const today = new Date().toISOString().slice(0, 10);

      if (date && date < today) {
        if (result) {
          result.textContent =
            'Нельзя выбрать прошедшую дату. Выберите сегодняшний или будущий день.';
        }
        return;
      }

      // Не разрешаем выбрать время, которое уже занято в демонстрационных данных.
      if (bookedServiceSlots.has(date + '|' + time)) {
        if (result) {
          result.textContent = 'Это время уже занято. Выберите другой свободный слот.';
        }
        return;
      }

      const service =
        document.getElementById('serviceType')?.value || 'Услуга';

      if (result) {
        result.textContent =
          'Заявка на «' + service + '» на ' + date + ' в ' + time +
          ' подготовлена. Это демонстрационная форма, отправка в организацию не выполняется.';
      }
    });
  }

  // Добавляем отзыв на страницу после проверки формы.
  const reviewForm = document.getElementById('reviewForm');

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!reviewForm.reportValidity()) return;

      const name = document.getElementById('reviewName').value.trim();
      const rating = document.getElementById('reviewRating').value;
      const message = document.getElementById('reviewText').value.trim();

      const row = document.createElement('div');
      row.className = 'list-item';

      const title = document.createElement('strong');
      title.textContent = name + ' · ' + '★'.repeat(Number(rating));

      const paragraph = document.createElement('p');
      paragraph.textContent = message;

      row.append(title, paragraph);
      document.getElementById('reviews').prepend(row);
      reviewForm.reset();
    });
  }

  // Остальные демонстрационные формы только проверяются в браузере.
  document.querySelectorAll('.validate-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const note = document.createElement('p');
      note.className = 'result';
      note.textContent =
        'Спасибо! Форма проверена в демонстрационном режиме; данные никуда не отправляются.';

      form.append(note);
      form.reset();
    });
  });
});