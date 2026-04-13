// ============================================
// МОДУЛЬ ПРОФИЛЯ
// ============================================

// Рендер страницы профиля
window.renderProfilePage = function() {
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  // Если пользователь не залогинен
  if (!currentUser) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">👤</div>
        <h2 style="margin-bottom: 1rem;">Вы не авторизованы</h2>
        <p style="margin-bottom: 2rem; color: var(--on-surface-variant);">Войдите или зарегистрируйтесь, чтобы увидеть свой профиль</p>
        <button class="btn-primary" onclick="openAuthModal()">Войти</button>
        <button class="btn-secondary" onclick="showRegisterForm()" style="margin-left: 1rem;">Зарегистрироваться</button>
      </div>
    `;
    return;
  }
  
  // Ждем данные пользователя
  if (!window.userData) {
    container.innerHTML = '<div style="text-align: center; padding: 2rem;">Загрузка профиля...</div>';
    setTimeout(renderProfilePage, 500);
    return;
  }
  
  const userData = window.userData;
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-large" onclick="openEditProfileModal()" style="cursor: pointer;">
        ${userData.avatar || '👤'}
      </div>
      <h1 class="profile-name">${escapeHtml(userData.name || '')}</h1>
      <p class="profile-username">@${escapeHtml(userData.username || '')}</p>
      ${userData.bio ? `<p class="profile-bio">${escapeHtml(userData.bio)}</p>` : '<p class="profile-bio" style="color: var(--on-surface-variant); opacity: 0.6;">Напишите немного о себе...</p>'}
      
      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.5rem; flex-wrap: wrap;">
        ${userData.location ? `<span style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; color: var(--on-surface-variant);"><span class="material-symbols-outlined" style="font-size: 1rem;">location_on</span> ${escapeHtml(userData.location)}</span>` : ''}
        ${userData.website ? `<a href="${escapeHtml(userData.website)}" target="_blank" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; color: var(--primary); text-decoration: none;"><span class="material-symbols-outlined" style="font-size: 1rem;">link</span> Сайт</a>` : ''}
      </div>
      
      <div style="margin-top: 1.5rem;">
        <button class="btn-primary" onclick="openEditProfileModal()" style="padding: 0.75rem 1.5rem;">
          <span class="material-symbols-outlined" style="font-size: 1.125rem;">edit</span> Редактировать профиль
        </button>
      </div>
    </div>
    
    <div class="profile-stats">
      <div class="stat-card">
        <div class="stat-value">${completedCount}</div>
        <div class="stat-label">Пройдено уроков</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${percentage}%</div>
        <div class="stat-label">Прогресс</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Math.floor(completedCount * 2)}</div>
        <div class="stat-label">Часов обучения</div>
      </div>
    </div>
    
    <div style="margin-top: 2rem; text-align: center; padding-top: 2rem; border-top: 1px solid var(--surface-container);">
      <button class="btn-secondary" onclick="logout()" style="padding: 0.75rem 2rem;">
        <span class="material-symbols-outlined">logout</span> Выйти из аккаунта
      </button>
    </div>
  `;
};

// Открыть модальное окно редактирования
window.openEditProfileModal = function() {
  if (!window.userData) {
    showNotification('Сначала войдите в аккаунт', 'error');
    return;
  }
  
  const modal = document.getElementById('edit-profile-modal');
  if (!modal) return;
  
  document.getElementById('edit-name').value = window.userData.name || '';
  document.getElementById('edit-bio').value = window.userData.bio || '';
  document.getElementById('edit-location').value = window.userData.location || '';
  document.getElementById('edit-website').value = window.userData.website || '';
  
  modal.classList.add('active');
};

// Закрыть модальное окно
window.closeEditProfileModal = function() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.classList.remove('active');
};

// Сохранить изменения профиля
async function saveProfile() {
  if (!currentUser) {
    showNotification('Сначала войдите в аккаунт', 'error');
    return;
  }
  
  const updates = {
    name: document.getElementById('edit-name')?.value,
    bio: document.getElementById('edit-bio')?.value,
    location: document.getElementById('edit-location')?.value,
    website: document.getElementById('edit-website')?.value
  };
  
  try {
    await db.collection('users').doc(currentUser.uid).update(updates);
    window.userData = { ...window.userData, ...updates };
    closeEditProfileModal();
    renderProfilePage();
    showNotification('Профиль обновлен!', 'success');
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error);
    showNotification('Ошибка сохранения профиля', 'error');
  }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-profile-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveProfile);
  
  const modal = document.getElementById('edit-profile-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEditProfileModal();
    });
  }
});
