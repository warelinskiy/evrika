// ============================================
// МОДУЛЬ ПРОФИЛЯ
// ============================================

window.renderProfile = function() {
  if (!currentUser || !window.userData) {
    if (currentUser) {
      setTimeout(renderProfile, 500);
    }
    return;
  }
  
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  const userData = window.userData;
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-large" onclick="openEditProfileModal()">
        ${userData.avatar || '👤'}
      </div>
      <h1 class="profile-name">${escapeHtml(userData.name || '')}</h1>
      <p class="profile-username">@${escapeHtml(userData.username || '')}</p>
      ${userData.bio ? `<p class="profile-bio">${escapeHtml(userData.bio)}</p>` : ''}
      <div style="margin-top: 1rem;">
        <button class="btn-secondary" onclick="openEditProfileModal()" style="padding: 0.5rem 1rem;">
          <span class="material-symbols-outlined" style="font-size: 1rem;">edit</span> Редактировать профиль
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
  `;
};

window.openEditProfileModal = function() {
  if (!window.userData) return;
  
  const modal = document.getElementById('edit-profile-modal');
  if (!modal) return;
  
  document.getElementById('edit-name').value = window.userData.name || '';
  document.getElementById('edit-bio').value = window.userData.bio || '';
  document.getElementById('edit-location').value = window.userData.location || '';
  document.getElementById('edit-website').value = window.userData.website || '';
  
  modal.classList.add('active');
};

window.closeEditProfileModal = function() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.classList.remove('active');
};

async function saveProfile() {
  if (!currentUser) return;
  
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
    renderProfile();
    showNotification('Профиль обновлен!', 'success');
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error);
    showNotification('Ошибка сохранения профиля', 'error');
  }
}

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
