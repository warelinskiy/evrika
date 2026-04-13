// ============================================
// МОДУЛЬ ПРОФИЛЯ
// ============================================

window.renderProfilePage = async function() {
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  if (!currentUser) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem;">
        <div style="font-size:4rem;">👤</div>
        <h2>Вы не авторизованы</h2>
        <p style="margin:1rem 0;">Войдите или зарегистрируйтесь</p>
        <button class="btn-primary" onclick="openAuthModal()">Войти</button>
        <button class="btn-secondary" onclick="showRegisterForm()" style="margin-left:1rem;">Регистрация</button>
      </div>
    `;
    return;
  }
  
  if (!window.userData) {
    container.innerHTML = '<div style="text-align:center; padding:2rem;">Загрузка...</div>';
    setTimeout(() => renderProfilePage(), 500);
    return;
  }
  
  const data = window.userData;
  const completed = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completed / totalLessons) * 100);
  const hours = completed * 2;
  
  container.innerHTML = `
    <div class="profile-telegram">
      <div class="profile-avatar-section">
        <div class="profile-avatar-large" onclick="openAvatarSelector()">
          ${data.avatar || '👤'}
          <div class="profile-avatar-edit"><span class="material-symbols-outlined">edit</span></div>
        </div>
      </div>
      
      <div class="profile-info-section">
        <div class="profile-field" onclick="editField('name')">
          <span class="profile-field-label">Имя</span>
          <div class="profile-field-value">
            <span>${escapeHtml(data.name || 'Не указано')}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
        <div class="profile-field" onclick="editField('username')">
          <span class="profile-field-label">Username</span>
          <div class="profile-field-value">
            <span>@${escapeHtml(data.username || '')}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
        <div class="profile-field" onclick="editField('bio')">
          <span class="profile-field-label">О себе</span>
          <div class="profile-field-value">
            <span>${escapeHtml(data.bio || 'Расскажите о себе...')}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
      </div>
      
      <div class="profile-stats-telegram">
        <div class="stat-item"><span class="stat-number">${completed}</span><span class="stat-label">уроков</span></div>
        <div class="stat-item"><span class="stat-number">${percentage}%</span><span class="stat-label">прогресс</span></div>
        <div class="stat-item"><span class="stat-number">${hours}</span><span class="stat-label">часов</span></div>
      </div>
      
      <div class="profile-section-title">Безопасность</div>
      <div class="profile-info-section">
        <div class="profile-field" onclick="editField('email')">
          <span class="profile-field-label">Email</span>
          <div class="profile-field-value">
            <span>${escapeHtml(data.email || '')}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
        <div class="profile-field" onclick="changePassword()">
          <span class="profile-field-label">Пароль</span>
          <div class="profile-field-value">
            <span>••••••••</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
      </div>
      
      <div class="profile-section-title">Информация</div>
      <div class="profile-info-section">
        <div class="profile-field">
          <span class="profile-field-label">ID пользователя</span>
          <div class="profile-field-value">
            <span style="font-size:0.75rem; font-family:monospace;">${data.uid || currentUser.uid}</span>
          </div>
        </div>
        <div class="profile-field">
          <span class="profile-field-label">Дата регистрации</span>
          <div class="profile-field-value">
            <span>${formatDate(data.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div class="profile-actions-telegram">
        <button class="profile-action-btn logout" onclick="logout()">
          <span class="material-symbols-outlined">logout</span> Выйти из аккаунта
        </button>
        <button class="profile-action-btn delete" onclick="deleteAccount()">
          <span class="material-symbols-outlined">delete_forever</span> Удалить аккаунт
        </button>
      </div>
    </div>
  `;
};

window.openAvatarSelector = function() {
  const modal = document.getElementById('avatar-modal');
  if (!modal) return;
  
  const grid = document.getElementById('avatar-selector-grid');
  if (grid) {
    const animalEmojis = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐴', '🦄'];
    grid.innerHTML = animalEmojis.map(emoji => `
      <div class="avatar-emoji ${window.userData?.avatar === emoji ? 'selected' : ''}" onclick="selectAvatarAndSave('${emoji}')">
        ${emoji}
      </div>
    `).join('');
  }
  
  modal.classList.add('active');
};

window.selectAvatarAndSave = async function(emoji) {
  if (!currentUser) return;
  try {
    await db.collection('users').doc(currentUser.uid).update({ avatar: emoji });
    if (window.userData) window.userData.avatar = emoji;
    closeAvatarModal();
    renderProfilePage();
    if (typeof showNotification === 'function') showNotification('Аватар обновлен!', 'success');
  } catch(e) {
    console.error(e);
  }
};

window.closeAvatarModal = function() {
  const modal = document.getElementById('avatar-modal');
  if (modal) modal.classList.remove('active');
};

window.editField = function(field) {
  const modal = document.getElementById('edit-field-modal');
  if (!modal) return;
  
  const data = window.userData;
  let currentValue = '';
  let placeholder = '';
  
  switch(field) {
    case 'name': currentValue = data.name || ''; placeholder = 'Ваше имя'; break;
    case 'username': currentValue = data.username || ''; placeholder = 'username'; break;
    case 'bio': currentValue = data.bio || ''; placeholder = 'Расскажите о себе...'; break;
    case 'email': currentValue = data.email || ''; placeholder = 'Email'; break;
  }
  
  const input = document.getElementById('edit-field-input');
  if (input) {
    input.value = currentValue;
    input.placeholder = placeholder;
  }
  
  const saveBtn = document.getElementById('save-field-btn');
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
  newSaveBtn.onclick = () => saveField(field);
  
  modal.classList.add('active');
};

window.closeEditFieldModal = function() {
  const modal = document.getElementById('edit-field-modal');
  if (modal) modal.classList.remove('active');
};

async function saveField(field) {
  const value = document.getElementById('edit-field-input')?.value.trim();
  if (!value && field !== 'bio') {
    if (typeof showNotification === 'function') showNotification('Поле не может быть пустым', 'error');
    return;
  }
  
  if (field === 'username') {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
      if (typeof showNotification === 'function') showNotification('Username: 3-20 символов (буквы, цифры, _)', 'error');
      return;
    }
    try {
      const existing = await db.collection('users').where('username', '==', value.toLowerCase()).get();
      if (!existing.empty && existing.docs[0].id !== currentUser.uid) {
        if (typeof showNotification === 'function') showNotification('Username уже занят', 'error');
        return;
      }
    } catch(e) {}
  }
  
  if (field === 'email') {
    if (!value.includes('@')) {
      if (typeof showNotification === 'function') showNotification('Введите корректный email', 'error');
      return;
    }
    try {
      await currentUser.updateEmail(value);
    } catch(e) {
      if (typeof showNotification === 'function') showNotification('Ошибка: ' + e.message, 'error');
      return;
    }
  }
  
  try {
    const updates = { [field]: field === 'username' ? value.toLowerCase() : value };
    await db.collection('users').doc(currentUser.uid).update(updates);
    if (window.userData) window.userData[field] = field === 'username' ? value.toLowerCase() : value;
    closeEditFieldModal();
    renderProfilePage();
    if (typeof showNotification === 'function') showNotification('Сохранено!', 'success');
  } catch(e) {
    console.error(e);
    if (typeof showNotification === 'function') showNotification('Ошибка сохранения', 'error');
  }
}

window.changePassword = function() {
  const modal = document.getElementById('password-modal');
  if (!modal) return;
  const inputs = ['password-old', 'password-new', 'password-confirm'];
  inputs.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const errorDiv = document.getElementById('password-error');
  if (errorDiv) errorDiv.style.display = 'none';
  modal.classList.add('active');
};

window.closePasswordModal = function() {
  const modal = document.getElementById('password-modal');
  if (modal) modal.classList.remove('active');
};

async function updatePassword() {
  const oldPass = document.getElementById('password-old')?.value;
  const newPass = document.getElementById('password-new')?.value;
  const confirmPass = document.getElementById('password-confirm')?.value;
  const errorDiv = document.getElementById('password-error');
  
  if (!oldPass || !newPass) {
    if (errorDiv) { errorDiv.textContent = 'Заполните все поля'; errorDiv.style.display = 'block'; }
    return;
  }
  
  if (newPass.length < 6) {
    if (errorDiv) { errorDiv.textContent = 'Новый пароль должен быть не менее 6 символов'; errorDiv.style.display = 'block'; }
    return;
  }
  
  if (newPass !== confirmPass) {
    if (errorDiv) { errorDiv.textContent = 'Пароли не совпадают'; errorDiv.style.display = 'block'; }
    return;
  }
  
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, oldPass);
    await currentUser.reauthenticateWithCredential(credential);
    await currentUser.updatePassword(newPass);
    closePasswordModal();
    if (typeof showNotification === 'function') showNotification('Пароль изменен!', 'success');
  } catch(e) {
    if (errorDiv) {
      errorDiv.textContent = e.code === 'auth/wrong-password' ? 'Неверный старый пароль' : 'Ошибка: ' + e.message;
      errorDiv.style.display = 'block';
    }
  }
}

window.deleteAccount = function() {
  if (confirm('Вы уверены? Это действие необратимо. Все ваши данные будут удалены.')) {
    if (confirm('ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ! Аккаунт будет удален навсегда.')) {
      deleteAccountConfirm();
    }
  }
};

async function deleteAccountConfirm() {
  try {
    await db.collection('users').doc(currentUser.uid).delete();
    await currentUser.delete();
    if (typeof logout === 'function') logout();
    if (typeof showNotification === 'function') showNotification('Аккаунт удален', 'info');
  } catch(e) {
    if (typeof showNotification === 'function') showNotification('Ошибка: ' + e.message, 'error');
  }
}

function formatDate(date) {
  if (!date) return 'Неизвестно';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  const savePassword = document.getElementById('save-password-btn');
  if (savePassword) savePassword.addEventListener('click', updatePassword);
  
  const closePassword = document.getElementById('close-password-modal');
  if (closePassword) closePassword.addEventListener('click', closePasswordModal);
  
  const closeAvatar = document.getElementById('close-avatar-modal');
  if (closeAvatar) closeAvatar.addEventListener('click', closeAvatarModal);
  
  const closeEdit = document.getElementById('close-edit-field-modal');
  if (closeEdit) closeEdit.addEventListener('click', closeEditFieldModal);
});

console.log('👤 profile.js загружен');
