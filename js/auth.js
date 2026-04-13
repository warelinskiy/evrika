// ============================================
// МОДУЛЬ АВТОРИЗАЦИИ
// ============================================

let currentUser = null;
let selectedAvatar = '🐱';

const animalEmojis = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐴', '🦄'];

function renderAvatarGrid() {
  const grid = document.getElementById('avatar-emoji-grid');
  if (!grid) return;
  grid.innerHTML = animalEmojis.map(emoji => `
    <div class="avatar-emoji ${selectedAvatar === emoji ? 'selected' : ''}" data-emoji="${emoji}" onclick="selectAvatar('${emoji}')">
      ${emoji}
    </div>
  `).join('');
}

window.selectAvatar = function(emoji) {
  selectedAvatar = emoji;
  document.querySelectorAll('.avatar-emoji').forEach(el => {
    el.classList.toggle('selected', el.dataset.emoji === emoji);
  });
};

function showError(msg) {
  const errDiv = document.getElementById('auth-error');
  if (errDiv) {
    errDiv.textContent = msg;
    errDiv.style.display = 'block';
    setTimeout(() => {
      if (errDiv) errDiv.style.display = 'none';
    }, 3000);
  } else {
    alert(msg);
  }
}

window.showLoginForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
  const errDiv = document.getElementById('auth-error');
  if (errDiv) errDiv.style.display = 'none';
};

window.showRegisterForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
  renderAvatarGrid();
  const errDiv = document.getElementById('auth-error');
  if (errDiv) errDiv.style.display = 'none';
};

window.openAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    showLoginForm();
  }
};

window.closeAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(i => i.value = '');
  }
};

window.login = async function() {
  const input = document.getElementById('login-username')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  
  if (!input || !password) {
    showError('Заполните все поля');
    return;
  }
  
  let email = input;
  if (!input.includes('@')) {
    try {
      const users = await db.collection('users').where('username', '==', input.toLowerCase()).get();
      if (users.empty) { 
        showError('Пользователь не найден'); 
        return; 
      }
      email = users.docs[0].data().email;
    } catch(e) { 
      showError('Ошибка поиска'); 
      return; 
    }
  }
  
  try {
    const user = await auth.signInWithEmailAndPassword(email, password);
    currentUser = user.user;
    await loadUserData(currentUser.uid);
    updateUI();
    closeAuthModal();
    if (typeof showNotification === 'function') {
      showNotification(`Добро пожаловать!`, 'success');
    }
    console.log('✅ Вход выполнен:', currentUser.email);
  } catch(e) {
    console.error(e);
    if (e.code === 'auth/user-not-found') showError('Пользователь не найден');
    else if (e.code === 'auth/wrong-password') showError('Неверный пароль');
    else if (e.code === 'auth/invalid-email') showError('Неверный email');
    else showError('Ошибка: ' + e.message);
  }
};

window.register = async function() {
  const username = document.getElementById('register-username')?.value.trim();
  const name = document.getElementById('register-name')?.value.trim();
  const email = document.getElementById('register-email')?.value.trim();
  const password = document.getElementById('register-password')?.value;
  
  if (!username || !name || !email || !password) {
    showError('Заполните все поля');
    return;
  }
  
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    showError('Username: 3-20 символов (буквы, цифры, _)');
    return;
  }
  
  if (password.length < 6) {
    showError('Пароль не менее 6 символов');
    return;
  }
  
  try {
    const existing = await db.collection('users').where('username', '==', username.toLowerCase()).get();
    if (!existing.empty) { 
      showError('Username уже занят'); 
      return; 
    }
  } catch(e) {
    console.error(e);
  }
  
  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    await userCred.user.updateProfile({ displayName: name });
    
    await db.collection('users').doc(userCred.user.uid).set({
      uid: userCred.user.uid,
      username: username.toLowerCase(),
      name: name,
      email: email,
      avatar: selectedAvatar,
      bio: '',
      createdAt: new Date(),
      completedLessons: []
    });
    
    currentUser = userCred.user;
    window.userData = { 
      uid: currentUser.uid,
      username: username.toLowerCase(), 
      name: name, 
      email: email, 
      avatar: selectedAvatar, 
      completedLessons: [] 
    };
    updateUI();
    closeAuthModal();
    if (typeof showNotification === 'function') {
      showNotification('Регистрация успешна!', 'success');
    }
    console.log('✅ Регистрация выполнена:', username);
  } catch(e) {
    console.error(e);
    if (e.code === 'auth/email-already-in-use') showError('Email уже используется');
    else if (e.code === 'auth/weak-password') showError('Слишком слабый пароль');
    else showError('Ошибка: ' + e.message);
  }
};

async function loadUserData(uid) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) {
      window.userData = doc.data();
      window.userProgress = { completedLessons: window.userData.completedLessons || [] };
      console.log('✅ Данные пользователя загружены');
      return true;
    }
  } catch(e) { 
    console.error('Ошибка загрузки данных:', e);
  }
  return false;
}

window.logout = async function() {
  try {
    await auth.signOut();
    currentUser = null;
    window.userData = null;
    updateUI();
    if (typeof showPage === 'function') showPage('landing');
    if (typeof showNotification === 'function') showNotification('Вы вышли из аккаунта', 'info');
    console.log('👋 Выход выполнен');
  } catch(e) {
    console.error(e);
  }
};

function updateUI() {
  const authDiv = document.getElementById('auth-container');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  
  if (currentUser && window.userData) {
    if (authDiv) authDiv.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = window.userData.name || currentUser.email.split('@')[0];
    if (userAvatar) userAvatar.textContent = window.userData.avatar || '👤';
    if (typeof renderProfilePage === 'function') renderProfilePage();
  } else {
    if (authDiv) authDiv.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }
}

// Слушатель авторизации
auth.onAuthStateChanged(async (user) => {
  console.log('🔐 Auth state changed:', user ? `Пользователь ${user.email}` : 'Нет пользователя');
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
  console.log('🔐 Инициализация auth.js');
  
  const trigger = document.getElementById('auth-trigger-btn');
  if (trigger) trigger.addEventListener('click', openAuthModal);
  
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

console.log('🔐 auth.js загружен');
