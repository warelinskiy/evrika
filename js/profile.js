// ============================================
// МОДУЛЬ ПРОФИЛЯ (СТИЛЬ TELEGRAM)
// ============================================

let currentUser = null;
let selectedAvatar = '🐱';

const animalEmojis = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐴', '🦄'];

// Рендер страницы профиля
window.renderProfilePage = async function() {
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  if (!currentUser) {
    container.innerHTML = `
      <div class="profile-not-authorized">
        <div class="profile-not-authorized-icon">👤</div>
        <h2>Вы не авторизованы</h2>
        <p>Войдите или зарегистрируйтесь</p>
        <button class="btn-primary" onclick="openAuthModal()">Войти</button>
        <button class="btn-secondary" onclick="showRegisterForm()" style="margin-left: 1rem;">Регистрация</button>
      </div>
    `;
    return;
  }
  
  if (!window.userData) {
    container.innerHTML = '<div class="profile-loading">Загрузка...</div>';
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
      <!-- Аватар -->
      <div class="profile-avatar-section">
        <div class="profile-avatar-large" onclick="openAvatarSelector()">
          ${data.avatar || '👤'}
          <div class="profile-avatar-edit"><span class="material-symbols-outlined">edit</span></div>
        </div>
      </div>
      
      <!-- Основная информация -->
      <div class="profile-info-section">
        <div class="profile-field">
          <div class="profile-field-label">Имя</div>
          <div class="profile-field-value" onclick="editField('name')">
            <span>${escapeHtml(data.name || 'Не указано')}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
        
        <div class="profile-field">
          <div class="profile-field-label">Username</div>
          <div class="profile-field-value" onclick="editField('username')">
            <span>@${escapeHtml(data.username || '')}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
        
        <div class="profile-field">
          <div class="profile-field-label">О себе</div>
          <div class="profile-field-value" onclick="editField('bio')">
            <span>${escapeHtml(data.bio || 'Расскажите о себе...')}</span>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
      </div>
      
      <!-- Статистика -->
      <div class="profile-stats-telegram">
        <div class="stat-item">
          <span class="stat-number">${completed}</span>
          <span class="stat-label">уроков</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${percentage}%</span>
          <span class="stat-label">прогресс</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${hours}</span>
          <span class="stat-label">часов</span>
        </div>
      </div>
      
      <!-- Безопасность -->
      <div class="profile-section-title">Безопасность</div>
      <div class="profile-field">
        <div class="profile-field-label">Email</div>
        <div class="profile-field-value" onclick="editField('email')">
          <span>${escapeHtml(data.email || '')}</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
      <div class="profile-field">
        <div class="profile-field-label">Пароль</div>
        <div class="profile-field-value" onclick="changePassword()">
          <span>••••••••</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
      
      <!-- Информация об аккаунте -->
      <div class="profile-section-title">Информация</div>
      <div class="profile-field">
        <div class="profile-field-label">ID пользователя</div>
        <div class="profile-field-value">
          <span style="font-size: 0.75rem; font-family: monospace;">${data.uid || currentUser.uid}</span>
        </div>
      </div>
      <div class="profile-field">
        <div class="profile-field-label">Дата регистрации</div>
        <div class="profile-field-value">
          <span>${formatDate(data.createdAt)}</span>
        </div>
      </div>
      
      <!-- Действия -->
      <div class="profile-actions-telegram">
        <button class="profile-action-btn logout" onclick="logout()">
          <span class="material-symbols-outlined">logout</span>
          Выйти из аккаунта
        </button>
        <button class="profile-action-btn delete" onclick="deleteAccount()">
          <span class="material-symbols-outlined">delete_forever</span>
          Удалить аккаунт
        </button>
      </div>
    </div>
  `;
};

// Выбор аватара
window.openAvatarSelector = function() {
  const modal = document.getElementById('avatar-modal');
  if (!modal) return;
  
  const grid = document.getElementById('avatar-selector-grid');
  if (grid) {
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

// Редактирование полей
window.editField = function(field) {
  const modal = document.getElementById('edit-field-modal');
  if (!modal) return;
  
  const data = window.userData;
  let currentValue = '';
  let placeholder = '';
  let inputType = 'text';
  
  switch(field) {
    case 'name':
      currentValue = data.name || '';
      placeholder = 'Ваше имя';
      break;
    case 'username':
      currentValue = data.username || '';
      placeholder = 'username';
      break;
    case 'bio':
      currentValue = data.bio || '';
      placeholder = 'Расскажите о себе...';
      break;
    case 'email':
      currentValue = data.email || '';
      placeholder = 'Email';
      inputType = 'email';
      break;
  }
  
  document.getElementById('edit-field-input').value = currentValue;
  document.getElementById('edit-field-input').placeholder = placeholder;
  document.getElementById('edit-field-input').type = inputType;
  
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
  const value = document.getElementById('edit-field-input').value.trim();
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

// Смена пароля
window.changePassword = function() {
  const modal = document.getElementById('password-modal');
  if (!modal) return;
  document.getElementById('password-old').value = '';
  document.getElementById('password-new').value = '';
  document.getElementById('password-confirm').value = '';
  document.getElementById('password-error').style.display = 'none';
  modal.classList.add('active');
};

window.closePasswordModal = function() {
  const modal = document.getElementById('password-modal');
  if (modal) modal.classList.remove('active');
};

async function updatePassword() {
  const oldPass = document.getElementById('password-old').value;
  const newPass = document.getElementById('password-new').value;
  const confirmPass = document.getElementById('password-confirm').value;
  const errorDiv = document.getElementById('password-error');
  
  if (!oldPass || !newPass) {
    errorDiv.textContent = 'Заполните все поля';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (newPass.length < 6) {
    errorDiv.textContent = 'Новый пароль должен быть не менее 6 символов';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (newPass !== confirmPass) {
    errorDiv.textContent = 'Пароли не совпадают';
    errorDiv.style.display = 'block';
    return;
  }
  
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, oldPass);
    await currentUser.reauthenticateWithCredential(credential);
    await currentUser.updatePassword(newPass);
    closePasswordModal();
    if (typeof showNotification === 'function') showNotification('Пароль изменен!', 'success');
  } catch(e) {
    errorDiv.textContent = e.code === 'auth/wrong-password' ? 'Неверный старый пароль' : 'Ошибка: ' + e.message;
    errorDiv.style.display = 'block';
  }
}

// Удаление аккаунта
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

// Форматирование даты
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

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('save-password-btn')?.addEventListener('click', updatePassword);
  document.getElementById('close-password-modal')?.addEventListener('click', closePasswordModal);
  document.getElementById('close-avatar-modal')?.addEventListener('click', closeAvatarModal);
  document.getElementById('close-edit-field-modal')?.addEventListener('click', closeEditFieldModal);
});
