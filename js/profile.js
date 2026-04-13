// ============================================
// МОДУЛЬ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
// ============================================

// Рендер страницы профиля
window.renderProfilePage = function() {
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  const currentLang = localStorage.getItem('language') || 'ru';
  const t = (key) => translations[currentLang]?.[key] || key;
  
  // Если пользователь не залогинен
  if (!currentUser) {
    container.innerHTML = `
      <div class="profile-not-authorized">
        <div class="profile-not-authorized-icon">👤</div>
        <h2 class="profile-not-authorized-title">${t('profile_not_authorized')}</h2>
        <p class="profile-not-authorized-text">${t('profile_login_hint')}</p>
        <div class="profile-not-authorized-buttons">
          <button class="btn-primary" onclick="openAuthModal()">${t('nav_login')}</button>
          <button class="btn-secondary" onclick="showRegisterForm()">${t('register_btn')}</button>
        </div>
      </div>
    `;
    return;
  }
  
  // Ждем данные пользователя
  if (!window.userData) {
    container.innerHTML = `<div class="profile-loading">${t('loading_profile')}</div>`;
    setTimeout(renderProfilePage, 500);
    return;
  }
  
  const userData = window.userData;
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  const totalHours = userData.totalHours || Math.floor(completedCount * 2);
  const xp = userData.xp || completedCount * 100;
  const level = userData.level || Math.floor(xp / 500) + 1;
  const nextLevelXp = level * 500;
  const xpProgress = Math.round((xp / nextLevelXp) * 100);
  
  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-large" onclick="openEditProfileModal()">
        ${userData.avatar || '👤'}
        <div class="profile-avatar-edit-overlay">
          <span class="material-symbols-outlined">edit</span>
        </div>
      </div>
      <h1 class="profile-name">${escapeHtml(userData.name || '')}</h1>
      <p class="profile-username">@${escapeHtml(userData.username || '')}</p>
      
      ${userData.bio ? `<p class="profile-bio">${escapeHtml(userData.bio)}</p>` : 
        `<p class="profile-bio profile-bio-empty">${t('write_something_about')}</p>`}
      
      <div class="profile-info-row">
        ${userData.location ? `
          <div class="profile-info-item">
            <span class="material-symbols-outlined">location_on</span>
            <span>${escapeHtml(userData.location)}</span>
          </div>
        ` : ''}
        ${userData.website ? `
          <a href="${escapeHtml(userData.website)}" target="_blank" class="profile-info-item profile-info-link">
            <span class="material-symbols-outlined">link</span>
            <span>Сайт</span>
          </a>
        ` : ''}
        <div class="profile-info-item">
          <span class="material-symbols-outlined">calendar_today</span>
          <span>С нами с ${formatDate(userData.createdAt?.toDate?.() || new Date())}</span>
        </div>
      </div>
      
      <div class="profile-level-card">
        <div class="profile-level-header">
          <div class="profile-level-badge">
            <span class="material-symbols-outlined">stars</span>
            <span>Уровень ${level}</span>
          </div>
          <div class="profile-xp">
            <span>${xp} / ${nextLevelXp} XP</span>
          </div>
        </div>
        <div class="profile-xp-bar">
          <div class="profile-xp-fill" style="width: ${xpProgress}%"></div>
        </div>
      </div>
      
      <div class="profile-actions">
        <button class="btn-primary" onclick="openEditProfileModal()">
          <span class="material-symbols-outlined">edit</span> ${t('edit_profile_btn')}
        </button>
      </div>
    </div>
    
    <div class="profile-stats">
      <div class="stat-card">
        <div class="stat-value">${completedCount}</div>
        <div class="stat-label">${t('lessons_completed')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${percentage}%</div>
        <div class="stat-label">${t('progress')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalHours}</div>
        <div class="stat-label">${t('hours_learned')}</div>
      </div>
    </div>
    
    <div class="profile-footer">
      <button class="btn-secondary" onclick="logout()">
        <span class="material-symbols-outlined">logout</span> ${t('logout')}
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
  console.log('✏️ Модальное окно редактирования профиля открыто');
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
  
  const name = document.getElementById('edit-name')?.value.trim();
  const bio = document.getElementById('edit-bio')?.value.trim();
  const location = document.getElementById('edit-location')?.value.trim();
  const website = document.getElementById('edit-website')?.value.trim();
  
  if (!name) {
    showNotification('Имя не может быть пустым', 'error');
    return;
  }
  
  const updates = { name, bio, location, website };
  
  try {
    await db.collection('users').doc(currentUser.uid).update(updates);
    window.userData = { ...window.userData, ...updates };
    closeEditProfileModal();
    renderProfilePage();
    showNotification('Профиль успешно обновлен!', 'success');
    console.log('✅ Профиль обновлен');
  } catch (error) {
    console.error('❌ Ошибка сохранения профиля:', error);
    showNotification('Ошибка сохранения профиля', 'error');
  }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
  console.log('👤 Инициализация модуля профиля');
  
  const saveBtn = document.getElementById('save-profile-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveProfile);
  }
  
  const modal = document.getElementById('edit-profile-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEditProfileModal();
    });
  }
  
  // Сохранение по Ctrl+Enter в textarea
  const bioTextarea = document.getElementById('edit-bio');
  if (bioTextarea) {
    bioTextarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        saveProfile();
      }
    });
  }
});

// Добавляем стили для профиля
const profileStyles = document.createElement('style');
profileStyles.textContent = `
  .profile-not-authorized {
    text-align: center;
    padding: 3rem;
  }
  .profile-not-authorized-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  .profile-not-authorized-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .profile-not-authorized-text {
    color: var(--on-surface-variant);
    margin-bottom: 1.5rem;
  }
  .profile-not-authorized-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  .profile-loading {
    text-align: center;
    padding: 2rem;
    color: var(--on-surface-variant);
  }
  .profile-avatar-large {
    position: relative;
    cursor: pointer;
  }
  .profile-avatar-edit-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--primary);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .profile-avatar-large:hover .profile-avatar-edit-overlay {
    opacity: 1;
  }
  .profile-avatar-edit-overlay .material-symbols-outlined {
    font-size: 16px;
    color: white;
  }
  .profile-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }
  .profile-info-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: var(--on-surface-variant);
  }
  .profile-info-link {
    text-decoration: none;
    color: var(--primary);
  }
  .profile-info-link:hover {
    text-decoration: underline;
  }
  .profile-level-card {
    background: var(--surface-low);
    border-radius: 1rem;
    padding: 1rem;
    margin-top: 1.5rem;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  .profile-level-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .profile-level-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 600;
    color: var(--primary);
  }
  .profile-xp {
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }
  .profile-xp-bar {
    height: 6px;
    background: var(--surface-container);
    border-radius: 3px;
    overflow: hidden;
  }
  .profile-xp-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  .profile-actions {
    margin-top: 1rem;
  }
  .profile-footer {
    margin-top: 2rem;
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid var(--surface-container);
  }
  .profile-bio-empty {
    opacity: 0.6;
    font-style: italic;
  }
`;
document.head.appendChild(profileStyles);

console.log('👤 Модуль профиля загружен');
