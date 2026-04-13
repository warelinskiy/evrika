// ============================================
// ГЛАВНЫЙ МОДУЛЬ
// ============================================

window.showNotification = function(msg, type = 'info') {
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const div = document.createElement('div');
  div.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    padding: 12px 24px; background: ${colors[type]};
    color: white; border-radius: 12px; z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
};

window.showPage = function(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');
  if (pageId === 'profile' && typeof renderProfilePage === 'function') renderProfilePage();
  window.scrollTo({ top: 0 });
};

// Добавляем анимацию
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Приложение загружено');
  showPage('landing');
});
