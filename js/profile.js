// ============================================
// МОДУЛЬ ПРОФИЛЯ
// ============================================

window.renderProfilePage = function() {
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  if (!currentUser) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <div style="font-size: 4rem;">👤</div>
        <h2>Вы не авторизованы</h2>
        <p style="margin: 1rem 0;">Войдите или зарегистрируйтесь</p>
        <button class="btn-primary" onclick="openAuthModal()">Войти</button>
        <button class="btn-secondary" onclick="showRegisterForm()" style="margin-left: 1rem;">Регистрация</button>
      </div>
    `;
    return;
  }
  
  if (!window.userData) {
    container.innerHTML = '<div style="text-align: center; padding: 2rem;">Загрузка...</div>';
    setTimeout(renderProfilePage, 500);
    return;
  }
  
  const userData = window.userData;
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  
  container.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 5rem; margin-bottom: 1rem;">${userData.avatar || '👤'}</div>
      <h1 style="font-family: Manrope; font-size: 2rem;">${escapeHtml(userData.name || '')}</h1>
      <p style="color: var(--on-surface-variant);">@${escapeHtml(userData.username || '')}</p>
      ${userData.bio ? `<p style="margin-top: 1rem; max-width: 400px; margin-left: auto; margin-right: auto;">${escapeHtml(userData.bio)}</p>` : ''}
      <div style="margin-top: 1rem;">
        <button class="btn-primary" onclick="alert('Редактирование скоро')">Редактировать</button>
        <button class="btn-secondary" onclick="logout()" style="margin-left: 1rem;">Выйти</button>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem;">
      <div class="stat-card"><div class="stat-value">${completedCount}</div><div class="stat-label">Уроков</div></div>
      <div class="stat-card"><div class="stat-value">${Math.round(completedCount / 18 * 100)}%</div><div class="stat-label">Прогресс</div></div>
      <div class="stat-card"><div class="stat-value">${completedCount * 2}</div><div class="stat-label">Часов</div></div>
    </div>
  `;
};

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

console.log('👤 Модуль profile.js загружен');
