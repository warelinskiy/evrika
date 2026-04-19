// ============================================
// ГЛАВНЫЙ МОДУЛЬ ПРИЛОЖЕНИЯ
// ============================================

// Уведомления
// Показ админ-панели
window.showAdminPanel = function() {
    if (typeof renderAdminPanel === 'function') {
        renderAdminPanel();
    }
};

// Показывать/скрывать кнопку админ-панели в зависимости от прав
window.updateAdminButton = function() {
    const adminBtn = document.getElementById('admin-nav-btn');
    if (adminBtn) {
        if (currentUser && typeof isAdmin === 'function' && isAdmin(currentUser)) {
            adminBtn.style.display = 'block';
        } else {
            adminBtn.style.display = 'none';
        }
    }
};

// Добавляем в showPage поддержку админ-панели
const originalShowPage = window.showPage;
window.showPage = function(pageId) {
    if (originalShowPage) originalShowPage(pageId);
    if (pageId === 'admin' && typeof renderAdminPanel === 'function') {
        renderAdminPanel();
    }
};

window.showNotification = function(msg, type = 'info') {
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const div = document.createElement('div');
  div.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${colors[type]};
    color: white;
    border-radius: 12px;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    font-size: 0.875rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
};

// Переключение страниц
window.showPage = function(pageId) {
  console.log('📄 Переход на страницу:', pageId);
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');
  
  if (pageId === 'profile' && typeof renderProfilePage === 'function') {
    renderProfilePage();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Добавляем анимацию (только один раз)
if (!document.querySelector('#app-animations')) {
  const animStyle = document.createElement('style');
  animStyle.id = 'app-animations';
  animStyle.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(animStyle);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Приложение загружено');
  
  // Закрытие модальных окон по клику на фон
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal && typeof closeAuthModal === 'function') {
        closeAuthModal();
      }
    });
  });
  
  showPage('landing');
});

console.log('✅ app.js загружен');
