// ============================================
// МОДУЛЬ НАСТРОЕК
// ============================================

window.setLanguage = function(lang) {
  localStorage.setItem('language', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  const translations = {
    ru: { nav_home: 'Главная', nav_profile: 'Профиль', login: 'Войти', logout: 'Выйти' },
    en: { nav_home: 'Home', nav_profile: 'Profile', login: 'Login', logout: 'Logout' }
  };
  
  const t = translations[lang];
  if (t) {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.dataset.translate;
      if (t[key]) el.textContent = t[key];
    });
  }
};

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

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'ru';
  setLanguage(savedLang);
});

console.log('⚙️ settings.js загружен');
