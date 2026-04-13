// ============================================
// МОДУЛЬ ТЕМ
// ============================================

const themes = ['light', 'dark', 'sunset', 'ocean', 'lavender'];

function setTheme(themeName) {
  if (!themes.includes(themeName)) return;
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('eureka-theme', themeName);
}

function getCurrentTheme() {
  return document.body.getAttribute('data-theme') || 'light';
}

function initTheme() {
  const savedTheme = localStorage.getItem('eureka-theme');
  if (savedTheme && themes.includes(savedTheme)) {
    setTheme(savedTheme);
  } else {
    setTheme('light');
  }
}

// Обработчики для выбора темы
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const theme = option.dataset.theme;
      if (theme) setTheme(theme);
    });
  });
});