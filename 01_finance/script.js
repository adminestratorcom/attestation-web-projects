'use strict';
const byId = (id) => document.getElementById(id);
document.querySelectorAll('.validate-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const message = document.createElement('p');
    message.className = 'result';
    message.setAttribute('role', 'status');
    message.textContent = 'Заявка проверена. Это учебная демонстрация: данные не отправлялись на сервер.';
    form.append(message);
    form.reset();
  });
});
function showPlan(name, description) {
  const box = byId('planInfo');
  if (!box) return;
  box.textContent = `${name}: ${description}`;
  box.classList.remove('hidden');
}
function calcDeposit() {
  const amount = Number(byId('amount')?.value);
  const months = Number(byId('months')?.value);
  const rate = Number(byId('rate')?.value);
  const result = byId('calcResult'), table = byId('paymentTable');
  if (!Number.isFinite(amount) || !Number.isFinite(months) || !Number.isFinite(rate) ||
      amount < 1000 || months < 1 || months > 60 || rate < 0 || rate > 40) {
    result.textContent = 'Проверьте сумму (от 1 000 ₽), срок (1–60 месяцев) и ставку (0–40%).';
    table.replaceChildren(); return;
  }
  const monthly = rate / 1200;
  const total = amount * Math.pow(1 + monthly, months);
  result.textContent = `Итоговая сумма: ${total.toLocaleString('ru-RU',{maximumFractionDigits:2})} ₽`;
  const heading = document.createElement('p'); heading.className = 'muted';
  heading.textContent = 'Пример начислений по месяцам (ежемесячная капитализация, без пополнений и снятий):';
  const list = document.createElement('div'); list.className = 'list';
  for (let month=1; month<=Math.min(months,6); month++) {
    const row=document.createElement('div'); row.className='list-item';
    row.textContent=`Месяц ${month}: ${(amount*Math.pow(1+monthly,month)).toLocaleString('ru-RU',{maximumFractionDigits:2})} ₽`;
    list.append(row);
  }
  table.replaceChildren(heading,list);
}
