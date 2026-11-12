'use strict';

// Короткая функция для поиска элемента по его ID.
function byId(id) {
  return document.getElementById(id);
}

// Проверяем учебные формы. Данные никуда не отправляются.
document.querySelectorAll('.validate-form').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Не перезагружаем страницу.

    if (!form.reportValidity()) return;

    const message = document.createElement('p');
    message.className = 'result';
    message.setAttribute('role', 'status');
    message.textContent =
      'Заявка проверена. Это учебная демонстрация: данные не отправлялись на сервер.';

    form.append(message);
    form.reset();
  });
});

// Показываем информацию о выбранном тарифе.
function showPlan(name, description) {
  const planBox = byId('planInfo');
  if (!planBox) return;

  planBox.textContent = name + ': ' + description;
  planBox.classList.remove('hidden');
}

// Считаем вклад с ежемесячным начислением процентов.
function calcDeposit() {
  const amount = Number(byId('amount')?.value);
  const months = Number(byId('months')?.value);
  const yearlyRate = Number(byId('rate')?.value);

  const result = byId('calcResult');
  const paymentTable = byId('paymentTable');

  // Проверяем, что все числа введены правильно и находятся в допустимых пределах.
  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(months) ||
    !Number.isFinite(yearlyRate) ||
    amount < 1000 ||
    months < 1 ||
    months > 60 ||
    yearlyRate < 0 ||
    yearlyRate > 40
  ) {
    result.textContent =
      'Проверьте сумму (от 1 000 ₽), срок (1–60 месяцев) и ставку (0–40%).';
    paymentTable.replaceChildren();
    return;
  }

  // Переводим годовую ставку в месячную: проценты делим на 100 и на 12.
  const monthlyRate = yearlyRate / 1200;

  // Формула сложных процентов: проценты каждый месяц прибавляются к вкладу.
  const total = amount * Math.pow(1 + monthlyRate, months);

  result.textContent =
    'Итоговая сумма: ' +
    total.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) +
    ' ₽';

  // Показываем начисления за первые шесть месяцев (или меньше, если срок короче).
  const heading = document.createElement('p');
  heading.className = 'muted';
  heading.textContent =
    'Пример начислений по месяцам (ежемесячная капитализация, без пополнений и снятий):';

  const list = document.createElement('div');
  list.className = 'list';

  for (let month = 1; month <= Math.min(months, 6); month++) {
    const row = document.createElement('div');
    row.className = 'list-item';

    const monthTotal = amount * Math.pow(1 + monthlyRate, month);
    row.textContent =
      'Месяц ' + month + ': ' +
      monthTotal.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) +
      ' ₽';

    list.append(row);
  }

  paymentTable.replaceChildren(heading, list);
}