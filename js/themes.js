// ============================================
// МОДУЛЬ ТЕМ ОФОРМЛЕНИЯ
// ============================================

// Доступные темы
const THEMES = {
  light: {
    name: 'Светлая',
    nameEn: 'Light',
    icon: 'light_mode',
    colors: {
      surface: '#f6f6fd',
      onSurface: '#2d2f34',
      primary: '#7b5400',
      gradientStart: '#FFD54F',
      gradientEnd: '#FFB300'
    }
  },
  dark: {
    name: 'Тёмная',
    nameEn: 'Dark',
    icon: 'dark_mode',
    colors: {
      surface: '#13141a',
      onSurface: '#e4e5ec',
      primary: '#feb300',
      gradientStart: '#FFD54F',
      gradientEnd: '#FFB300'
    }
  },
  sunset: {
    name: 'Закат',
    nameEn: 'Sunset',
    icon: 'wb_sunny',
    colors: {
      surface: '#fff5f0',
      onSurface: '#4a2a1a',
      primary: '#e86a2a',
      gradientStart: '#FF8A4A',
      gradientEnd: '#FF6A2A'
    }
  },
  ocean: {
    name: 'Океан',
    nameEn: 'Ocean',
    icon: 'waves',
    colors: {
      surface: '#e8f4f8',
      onSurface: '#1a3a4a',
      primary: '#2a7a9a',
      gradientStart: '#4A9ABA',
      gradientEnd: '#2A7A9A'
    }
  },
  lavender: {
    name: 'Лаванда',
    nameEn: 'Lavender',
    icon: 'spa',
    colors: {
      surface: '#f5f0f8',
      onSurface: '#3a2a4a',
      primary: '#7a4a9a',
      gradientStart: '#9A6ABA',
      gradientEnd: '#7A4A9A'
    }
  }
};

let currentTheme = localStorage.getItem('eureka-theme') || 'light';

// Применение темы
function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) return;
  
  // Устанавливаем data-theme атрибут
  document.body.setAttribute('data-theme', themeName);
  
  // Обновляем CSS переменные для динамических элементов
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--theme-${key}`, value);
  }
  
  // Сохраняем в localStorage
  localStorage.setItem('eureka-theme', themeName);
  currentTheme = themeName;
  
  console.log(`🎨 Тема изменена на: ${themeName}`);
}

// Получить текущую тему
function getCurrentTheme() {
  return currentTheme;
}

// Получить список всех тем
function getAllThemes() {
  return Object.keys(THEMES);
}

// Следующая тема (циклический перебор)
function nextTheme() {
  const themes = getAllThemes();
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  applyTheme(themes[nextIndex]);
}

// Рендер выпадающего меню тем
function renderThemeDropdown() {
  const dropdown = document.getElementById('theme-dropdown');
  if (!dropdown) return;
  
  const currentLang = localStorage.getItem('language') || 'ru';
  
  dropdown.innerHTML = Object.entries(THEMES).map(([key, theme]) => `
    <div class="theme-option ${currentTheme === key ? 'active' : ''}" data-theme="${key}" onclick="setTheme('${key}')">
      <span class="material-symbols-outlined">${theme.icon}</span>
      <span>${currentLang === 'ru' ? theme.name : theme.nameEn}</span>
      ${currentTheme === key ? '<span class="theme-check">✓</span>' : ''}
    </div>
  `).join('');
}

// Установить тему (глобальная функция)
window.setTheme = function(themeName) {
  if (!THEMES[themeName]) {
    console.warn(`Тема "${themeName}" не найдена`);
    return;
  }
  applyTheme(themeName);
  renderThemeDropdown();
  
  const message = currentLang === 'ru' 
    ? `Тема изменена на "${THEMES[themeName].name}"` 
    : `Theme changed to "${THEMES[themeName].nameEn}"`;
  showNotification(message, 'success', 1500);
};

// Инициализация темы
function initTheme() {
  const savedTheme = localStorage.getItem('eureka-theme');
  if (savedTheme && THEMES[savedTheme]) {
    applyTheme(savedTheme);
  } else {
    // Проверяем системные настройки
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }
  renderThemeDropdown();
}

// Следим за системными настройками
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Только если пользователь не выбрал тему вручную
  if (!localStorage.getItem('eureka-theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
    renderThemeDropdown();
  }
});

// Экспортируем для глобального доступа
window.themes = {
  getAll: getAllThemes,
  getCurrent: getCurrentTheme,
  set: window.setTheme,
  next: nextTheme
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Обработчик для кнопки смены темы (быстрая смена)
  const themeToggleBtn = document.querySelector('.theme-trigger-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById('theme-dropdown');
      if (dropdown) {
        dropdown.classList.toggle('show');
      }
    });
  }
  
  // Закрытие дропдауна при клике вне
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('theme-dropdown');
    const trigger = document.querySelector('.theme-trigger-btn');
    if (dropdown && trigger) {
      if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    }
  });
});

console.log('🎨 Модуль тем загружен');
