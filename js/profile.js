// ============================================
// МОДУЛЬ ПРОФИЛЯ
// ============================================

window.renderProfilePage = function() {
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  if (!currentUser) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem;">
        <div style="font-size:4rem;">👤</div>
        <h2>Вы не авторизованы</h2>
        <button class="btn-primary" onclick="openAuthModal()" style="margin-top:1rem;">Войти</button>
      </div>
    `;
    return;
  }
  
  if (!window.userData) {
    container.innerHTML = '<div style="text-align:center; padding:2rem;">Загрузка...</div>';
    setTimeout(renderProfilePage, 500);
    return;
  }
  
  const data = window.userData;
  const completed = window.userProgress?.completedLessons?.length || 0;
  
  container.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:5rem; margin-bottom:1rem;">${data.avatar || '👤'}</div>
      <h1 style="font-family:Manrope; font-size:2rem;">${escapeHtml(data.name || '')}</h1>
      <p style="color:var(--on-surface-variant);">@${escapeHtml(data.username || '')}</p>
      ${data.bio ? `<p style="margin-top:1rem;">${escapeHtml(data.bio)}</p>` : ''}
      <div style="margin-top:1.5rem;">
        <button class="btn-primary" onclick="alert('Редактирование скоро')">Редактировать</button>
        <button class="btn-secondary" onclick="logout()" style="margin-left:1rem;">Выйти</button>
      </div>
    </div>
    <div class="profile-stats">
      <div class="stat-card"><div class="stat-value">${completed}</div><div class="stat-label">Уроков</div></div>
      <div class="stat-card"><div class="stat-value">${Math.round(completed/18*100)}%</div><div class="stat-label">Прогресс</div></div>
      <div class="stat-card"><div class="stat-value">${completed*2}</div><div class="stat-label">Часов</div></div>
    </div>
  `;
};

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
