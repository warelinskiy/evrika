// ============================================
// МОДУЛЬ НАСТРОЕК ПРИЛОЖЕНИЯ
// ============================================

// Языки
window.setLanguage = function(lang) {
  localStorage.setItem('language', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Переводы
  const translations = {
    ru: {
      nav_home: 'Главная',
      nav_profile: 'Профиль',
      nav_settings: 'Настройки',
      login: 'Войти',
      logout: 'Выйти'
    },
    en: {
      nav_home: 'Home',
      nav_profile: 'Profile',
      nav_settings: 'Settings',
      login: 'Login',
      logout: 'Logout'
    }
  };
  
  const t = translations[lang];
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.dataset.translate;
    if (t[key]) el.textContent = t[key];
  });
};

// Уведомления
let notificationsEnabled = localStorage.getItem('notifications') === 'true';

window.toggleNotifications = function() {
  notificationsEnabled = !notificationsEnabled;
  localStorage.setItem('notifications', notificationsEnabled);
  const btn = document.getElementById('notifications-toggle');
  if (btn) {
    btn.textContent = notificationsEnabled ? 'ON' : 'OFF';
    btn.classList.toggle('active', notificationsEnabled);
  }
  if (typeof showNotification === 'function') {
    showNotification(`Уведомления ${notificationsEnabled ? 'включены' : 'выключены'}`, 'info');
  }
};

// Инициализация настроек
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'ru';
  setLanguage(savedLang);
  
  const notificationsBtn = document.getElementById('notifications-toggle');
  if (notificationsBtn) {
    notificationsEnabled = localStorage.getItem('notifications') === 'true';
    notificationsBtn.textContent = notificationsEnabled ? 'ON' : 'OFF';
    notificationsBtn.classList.toggle('active', notificationsEnabled);
  }
});