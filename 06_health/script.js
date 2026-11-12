'use strict';

// Находим список отделений и список врачей.
const department = document.getElementById('department');
const doctor = document.getElementById('doctor');

// Для каждого отделения указан список врачей.
const doctorsByDepartment = {
  'Терапия': ['Иванова А. А.', 'Смирнов П. В.'],
  'Кардиология': ['Петров И. С.', 'Орлова Е. Н.'],
  'Педиатрия': ['Кузнецова М. А.', 'Волков Д. С.']
};

// При выборе отделения обновляем список врачей.
if (department) {
  department.addEventListener('change', function () {
    doctor.replaceChildren();

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Выберите врача';
    doctor.append(placeholder);

    const doctors = doctorsByDepartment[department.value] || [];

    doctors.forEach(function (doctorName) {
      const option = document.createElement('option');
      option.textContent = doctorName;
      doctor.append(option);
    });
  });
}

// Проверяем учебную форму записи на приём.
const appointmentForm = document.querySelector('.validate-form');

if (appointmentForm) {
  appointmentForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!appointmentForm.reportValidity()) return;

    const date = document.getElementById('appointmentDate').value;
    const today = new Date().toISOString().slice(0, 10);

    if (date < today) {
      alert('Выберите сегодняшнюю или будущую дату.');
      return;
    }

    const status = document.createElement('p');
    status.className = 'result';
    status.setAttribute('role', 'status');
    status.textContent =
      'Заявка проверена: ' + department.value +
      ', врач ' + doctor.value +
      ', дата ' + date +
      '. Это демонстрация, реальная запись не создана.';

    appointmentForm.append(status);
    appointmentForm.reset();
    doctor.innerHTML = '<option value="">Сначала выберите отделение</option>';
  });
}

// Считаем, сколько пунктов пользователь отметил в списке симптомов.
// Этот блок только демонстрационный и не ставит диагноз.
document.querySelectorAll('#symptoms input').forEach(function (input) {
  input.addEventListener('change', function () {
    const checkedItems = document.querySelectorAll('#symptoms input:checked');
    const count = checkedItems.length;

    document.getElementById('symptomResult').textContent =
      'Отмечено: ' + count +
      (count >= 2
        ? ' — обратитесь к врачу для профессиональной оценки состояния.'
        : '');
  });
});

// В разделе вопросов одновременно открыт только один ответ.
document.querySelectorAll('.faq details').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (!item.open) return;

    document.querySelectorAll('.faq details').forEach(function (otherItem) {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});