// ============================================
// ГЛАВНЫЙ МОДУЛЬ ПРИЛОЖЕНИЯ
// ============================================

// Глобальная функция показа страниц
window.showPage = function(pageId) {
  console.log('📄 Переход на страницу:', pageId);
  
  // Скрываем все страницы
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Показываем нужную страницу
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
    console.log('✅ Страница показана:', pageId);
  } else {
    console.error('❌ Страница не найдена:', pageId);
    return;
  }
  
  // Загружаем данные для страницы
  switch(pageId) {
    case 'courses':
      if (typeof loadCourses === 'function') loadCourses();
      break;
    case 'profile':
      if (typeof renderProfilePage === 'function') renderProfilePage();
      break;
  }
  
  // Плавный скролл наверх
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Глобальная функция уведомлений
window.showNotification = function(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 14px 24px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 12px;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  const icon = document.createElement('span');
  icon.className = 'material-symbols-outlined';
  icon.textContent = type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info');
  icon.style.fontSize = '20px';
  notification.appendChild(icon);
  
  const text = document.createTextNode(message);
  notification.appendChild(text);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, duration);
};

// Глобальная функция экранирования HTML
window.escapeHtml = function(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Форматирование даты
window.formatDate = function(date) {
  if (!date) return '';
  const d = new Date(date);
  const lang = localStorage.getItem('language') || 'ru';
  return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Добавляем анимации
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .page {
    animation: fadeIn 0.3s ease;
  }
`;
document.head.appendChild(animationStyles);

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Приложение Эврика загружено');
  
  // Закрытие модальных окон по клику на оверлей
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });
  
  // Показываем главную страницу
  showPage('landing');
  
  console.log('✅ Приложение готово к работе');
});

console.log('🚀 Главный модуль приложения загружен');
