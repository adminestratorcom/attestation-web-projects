'use strict';

// Ищем проекты по тексту в их карточках.
function searchProjects() {
  const searchText = document
    .getElementById('projectSearch')
    .value
    .trim()
    .toLocaleLowerCase('ru');

  document.querySelectorAll('.project-card').forEach(function (card) {
    const cardText = card.textContent.toLocaleLowerCase('ru');
    const shouldHide = !cardText.includes(searchText);
    card.classList.toggle('hidden', shouldHide);
  });
}

// Меняем цветовую тему сайта.
function applyTheme(theme) {
  document.body.dataset.theme = theme;

  const isDark = theme === 'dark';

  // Меняем CSS-переменные, от которых зависят цвета страницы.
  document.documentElement.style.setProperty(
    '--bg',
    isDark ? '#111820' : '#f5f7f8'
  );
  document.documentElement.style.setProperty(
    '--surface',
    isDark ? '#1c2731' : '#fff'
  );
  document.documentElement.style.setProperty(
    '--text',
    isDark ? '#edf3f6' : '#17212b'
  );
  document.documentElement.style.setProperty(
    '--line',
    isDark ? '#34424d' : '#e2e8eb'
  );

  // Сохраняем выбранную тему в браузере.
  localStorage.setItem('portfolioTheme', theme);
}

// Переключаемся со светлой темы на тёмную и обратно.
function toggleTheme() {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// При открытии страницы восстанавливаем сохранённую тему.
const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
applyTheme(savedTheme);

// Плавно показываем карточки, когда они появляются на экране.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'none';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.project-card').forEach(function (card) {
    card.style.opacity = 0;
    card.style.transform = 'translateY(18px)';
    card.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(card);
  });
}