// ============================================
// МОДУЛЬ АВТОРИЗАЦИИ
// ============================================

let currentUser = null;
let selectedAvatar = '🐱';

// Список аватаров
const animalEmojis = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

// Рендер сетки аватаров
function renderAvatarGrid() {
  const grid = document.getElementById('avatar-emoji-grid');
  if (!grid) return;
  grid.innerHTML = animalEmojis.map(emoji => `
    <div class="avatar-emoji ${selectedAvatar === emoji ? 'selected' : ''}" data-emoji="${emoji}" onclick="selectAvatar('${emoji}')">
      ${emoji}
    </div>
  `).join('');
}

// Выбор аватара
window.selectAvatar = function(emoji) {
  selectedAvatar = emoji;
  document.querySelectorAll('.avatar-emoji').forEach(el => {
    el.classList.toggle('selected', el.dataset.emoji === emoji);
  });
};

// Показать ошибку
function showAuthError(message) {
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
  }
}

// Показать форму входа
window.showLoginForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) errorDiv.style.display = 'none';
};

// Показать форму регистрации
window.showRegisterForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
  renderAvatarGrid();
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) errorDiv.style.display = 'none';
};

// Открыть модальное окно
window.openAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    showLoginForm();
  }
};

// Закрыть модальное окно
window.closeAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
    document.querySelectorAll('#auth-modal input').forEach(input => input.value = '');
  }
};

// Вход
window.login = async function() {
  const loginInput = document.getElementById('login-username')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  
  if (!loginInput || !password) {
    showAuthError('Заполните все поля');
    return;
  }
  
  let email = loginInput;
  if (!loginInput.includes('@')) {
    try {
      const usersSnapshot = await db.collection('users').where('username', '==', loginInput.toLowerCase()).get();
      if (usersSnapshot.empty) {
        showAuthError('Пользователь не найден');
        return;
      }
      email = usersSnapshot.docs[0].data().email;
    } catch (error) {
      showAuthError('Ошибка поиска');
      return;
    }
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    await loadUserData(currentUser.uid);
    updateUI();
    closeAuthModal();
    if (typeof showNotification === 'function') {
      showNotification(`Добро пожаловать, ${window.userData?.name || currentUser.email}!`, 'success');
    }
    console.log('✅ Вход выполнен:', currentUser.email);
  } catch (error) {
    console.error('Ошибка входа:', error);
    if (error.code === 'auth/user-not-found') showAuthError('Пользователь не найден');
    else if (error.code === 'auth/wrong-password') showAuthError('Неверный пароль');
    else if (error.code === 'auth/invalid-email') showAuthError('Неверный email');
    else showAuthError('Ошибка: ' + error.message);
  }
};

// Регистрация
window.register = async function() {
  const username = document.getElementById('register-username')?.value.trim();
  const name = document.getElementById('register-name')?.value.trim();
  const email = document.getElementById('register-email')?.value.trim();
  const password = document.getElementById('register-password')?.value;
  
  if (!username || !name || !email || !password) {
    showAuthError('Заполните все поля');
    return;
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    showAuthError('Username: 3-20 символов (буквы, цифры, _)');
    return;
  }
  
  if (password.length < 6) {
    showAuthError('Пароль должен быть не менее 6 символов');
    return;
  }
  
  try {
    const existingUser = await db.collection('users').where('username', '==', username.toLowerCase()).get();
    if (!existingUser.empty) {
      showAuthError('Этот username уже занят');
      return;
    }
  } catch (error) {
    console.error('Ошибка проверки username:', error);
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    
    const userData = {
      uid: userCredential.user.uid,
      username: username.toLowerCase(),
      name: name,
      email: email,
      avatar: selectedAvatar,
      bio: '',
      location: '',
      website: '',
      createdAt: new Date(),
      completedLessons: []
    };
    
    await db.collection('users').doc(userCredential.user.uid).set(userData);
    
    currentUser = userCredential.user;
    window.userData = userData;
    updateUI();
    closeAuthModal();
    if (typeof showNotification === 'function') {
      showNotification('Регистрация успешна!', 'success');
    }
    console.log('✅ Регистрация выполнена:', username);
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    if (error.code === 'auth/email-already-in-use') showAuthError('Email уже используется');
    else if (error.code === 'auth/weak-password') showAuthError('Слишком слабый пароль');
    else showAuthError('Ошибка: ' + error.message);
  }
};

// Загрузка данных пользователя
async function loadUserData(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      window.userData = userDoc.data();
      window.userProgress = {
        completedLessons: window.userData.completedLessons || []
      };
      return true;
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
  return false;
}

// Выход
window.logout = async function() {
  try {
    await auth.signOut();
    currentUser = null;
    window.userData = null;
    updateUI();
    if (typeof showPage === 'function') showPage('landing');
    if (typeof showNotification === 'function') showNotification('Вы вышли из аккаунта', 'info');
    console.log('👋 Выход выполнен');
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
};

// Обновление UI
function updateUI() {
  const authContainer = document.getElementById('auth-container');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  
  if (currentUser && window.userData) {
    const displayName = window.userData.name || currentUser.email.split('@')[0];
    if (userName) userName.textContent = displayName;
    if (userAvatar) userAvatar.textContent = window.userData.avatar || '👤';
    if (authContainer) authContainer.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (typeof renderProfilePage === 'function') renderProfilePage();
  } else {
    if (authContainer) authContainer.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }
}

// Слушатель авторизации
auth.onAuthStateChanged(async (user) => {
  console.log('Auth state changed:', user ? `Пользователь ${user.email}` : 'Нет пользователя');
  currentUser = user;
  if (user) {
    await loadUserData(user.uid);
    updateUI();
  } else {
    updateUI();
  }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const authTriggerBtn = document.getElementById('auth-trigger-btn');
  if (authTriggerBtn) authTriggerBtn.addEventListener('click', openAuthModal);
  
  const loginSubmit = document.getElementById('login-submit');
  if (loginSubmit) loginSubmit.addEventListener('click', login);
  
  const registerSubmit = document.getElementById('register-submit');
  if (registerSubmit) registerSubmit.addEventListener('click', register);
  
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAuthModal();
    });
  }
  
  const userAvatar = document.getElementById('user-avatar');
  if (userAvatar) {
    userAvatar.addEventListener('click', () => {
      if (currentUser && typeof showPage === 'function') showPage('profile');
    });
  }
  
  renderAvatarGrid();
});

console.log('🔐 Модуль auth.js загружен');
