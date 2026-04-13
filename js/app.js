// ============================================
// ГЛАВНЫЙ МОДУЛЬ ПРИЛОЖЕНИЯ
// ============================================

// Уведомления
window.showNotification = function(message, type = 'info') {
  const notification = document.createElement('div');
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 12px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

// Переключение страниц
window.showPage = function(pageId) {
  console.log('Переход на страницу:', pageId);
  
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  if (pageId === 'profile' && typeof renderProfilePage === 'function') {
    renderProfilePage();
  }
  
  window.scrollTo({ top: 0 });
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Приложение загружено');
  
  // Закрытие модалок по клику на фон
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal && typeof closeAuthModal === 'function') {
        closeAuthModal();
      }
    });
  });
  
  // Показываем главную страницу
  showPage('landing');
});

// Добавляем анимацию
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);

console.log('🚀 Модуль app.js загружен');
