'use strict';

// Учебное расписание по дням недели.
const scheduleData = {
  'Понедельник': [
    '09:00 — Математика',
    '11:00 — Английский язык',
    '13:00 — Информатика'
  ],
  'Вторник': [
    '09:00 — История',
    '11:00 — Физика',
    '13:00 — Проектная работа'
  ],
  'Среда': [
    '09:00 — Литература',
    '11:00 — Математика',
    '13:00 — Робототехника'
  ],
  'Четверг': [
    '09:00 — Английский язык',
    '11:00 — Химия',
    '13:00 — Физкультура'
  ],
  'Пятница': [
    '09:00 — Информатика',
    '11:00 — История',
    '13:00 — Клуб проектов'
  ]
};

// Показываем расписание выбранного дня.
function showDay(day, button) {
  document.querySelectorAll('.chips button').forEach(function (item) {
    item.classList.remove('active');
  });

  if (button) button.classList.add('active');

  const schedule = document.getElementById('schedule');
  schedule.replaceChildren();

  const lessons = scheduleData[day] || [];

  lessons.forEach(function (lesson) {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.textContent = lesson;
    schedule.append(row);
  });

  // Запоминаем последний выбранный день в браузере.
  localStorage.setItem('lastStudyDay', day);
}

// Оставляем на странице курсы для выбранного возраста.
function filterCourses() {
  const age = document.getElementById('ageFilter').value;

  document.querySelectorAll('.course').forEach(function (card) {
    const cardAge = card.dataset.age;
    const shouldHide =
      age !== 'all' && cardAge !== 'all' && cardAge !== age;

    card.classList.toggle('hidden', shouldHide);
  });
}

// Проверяем ответы в небольшом тесте.
const quiz = document.getElementById('quiz');

if (quiz) {
  quiz.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!quiz.reportValidity()) return;

    // FormData получает выбранные ответы, reduce складывает баллы.
    const answers = new FormData(quiz);
    let score = 0;

    for (const answer of answers.values()) {
      score += Number(answer);
    }

    const result = document.getElementById('quizResult');
    result.textContent =
      'Ваш результат: ' + score + ' из 3. ' +
      (score >= 2
        ? 'Вам подходит активный формат обучения!'
        : 'Попробуйте разные форматы занятий.');

    result.classList.remove('hidden');
    localStorage.setItem('studyQuizScore', String(score));
  });
}