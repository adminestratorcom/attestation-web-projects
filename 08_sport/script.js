'use strict';

// Считаем индекс массы тела и показываем учебную оценку калорийности.
function calcBmi() {
  const height = Number(document.getElementById('height').value) / 100;
  const weight = Number(document.getElementById('weight').value);

  // Проверяем, что рост и вес находятся в допустимых пределах.
  if (
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    height < 1 ||
    height > 2.5 ||
    weight < 20 ||
    weight > 350
  ) {
    document.getElementById('bmiResult').textContent =
      'Введите рост от 100 до 250 см и вес от 20 до 350 кг.';
    return;
  }

  // ИМТ = вес в килограммах / рост в метрах в квадрате.
  const bmi = weight / (height * height);

  let category;

  if (bmi < 18.5) {
    category = 'ниже условного диапазона';
  } else if (bmi < 25) {
    category = 'условно нормальный диапазон';
  } else if (bmi < 30) {
    category = 'выше условного диапазона';
  } else {
    category = 'высокий показатель';
  }

  document.getElementById('bmiResult').textContent =
    'ИМТ: ' + bmi.toFixed(1) + ' — ' + category +
    '. ИМТ является ориентиром, а не диагнозом.';

  // Это упрощённая учебная оценка, а не медицинская рекомендация.
  const activityFactor = Number(document.getElementById('activity').value);
  const calories = Math.round(weight * 22 * activityFactor);

  document.getElementById('calorieResult').textContent =
    'Условная оценка суточной калорийности: ' + calories +
    ' ккал. Это упрощённая учебная оценка, не индивидуальная рекомендация.';
}

// Таймер тренировки начинается с одной минуты.
let timerLeft = 60;
let timerId = null;

// Обновляем цифры на экране.
function paintTimer() {
  const minutes = Math.floor(timerLeft / 60);
  const seconds = timerLeft % 60;

  document.getElementById('timer').textContent =
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0');
}

// Запускаем таймер, если он ещё не работает.
function startTimer() {
  if (timerId) return;

  const inputSeconds = Number(document.getElementById('timerInput').value);

  if (timerLeft === 0) {
    timerLeft = Math.max(1, inputSeconds);
  }

  timerId = setInterval(function () {
    timerLeft = Math.max(0, timerLeft - 1);
    paintTimer();

    if (timerLeft === 0) {
      pauseTimer();
    }
  }, 1000);
}

// Останавливаем таймер.
function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
}

// Сбрасываем таймер на значение из поля ввода.
function resetTimer() {
  pauseTimer();
  timerLeft = Math.max(1, Number(document.getElementById('timerInput').value));
  paintTimer();
}

// Показываем тренировки выбранного типа.
function filterTraining(type, button) {
  document.querySelectorAll('.chips button').forEach(function (item) {
    item.classList.remove('active');
  });

  if (button) button.classList.add('active');

  document.querySelectorAll('.training').forEach(function (card) {
    const shouldHide = type !== 'all' && card.dataset.type !== type;
    card.classList.toggle('hidden', shouldHide);
  });
}