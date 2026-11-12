'use strict';

// В блоке вопросов и ответов одновременно раскрываем только один ответ.
document.querySelectorAll('.faq details').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (!item.open) return;

    document.querySelectorAll('.faq details').forEach(function (otherItem) {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});

// Проверяем введённые данные в формах.
document.querySelectorAll('.validate-form').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Отменяем обычную отправку формы.

    if (!form.reportValidity()) return;

    const phone = form.querySelector('input[pattern]');
    const message = form.querySelector('textarea');

    // Проверяем длину и допустимые символы номера телефона.
    if (
      phone &&
      !/^[+0-9()\-\s]{10,18}$/.test(phone.value.trim())
    ) {
      phone.setCustomValidity('Укажите телефон длиной 10–18 символов.');
      phone.reportValidity();
      phone.setCustomValidity('');
      return;
    }

    // Проверяем, что сообщение не слишком короткое и не слишком длинное.
    if (
      message &&
      (message.value.trim().length < 10 || message.value.trim().length > 500)
    ) {
      message.setCustomValidity('Сообщение должно содержать от 10 до 500 символов.');
      message.reportValidity();
      message.setCustomValidity('');
      return;
    }

    const status = document.createElement('p');
    status.className = 'result';
    status.setAttribute('role', 'status');
    status.textContent =
      'Форма заполнена корректно. В учебной версии сообщение не отправляется на сервер.';

    form.append(status);
    form.reset();
  });
});