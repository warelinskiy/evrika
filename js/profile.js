// ============================================
// МОДУЛЬ ПРОФИЛЯ - РЕДАКТИРОВАНИЕ
// ============================================

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

window.closeEditProfileModal = function() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.classList.remove('active');
};

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
