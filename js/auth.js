// ============================================
// МОДУЛЬ АВТОРИЗАЦИИ (С ПОДТВЕРЖДЕНИЕМ EMAIL)
// ============================================

let currentUser = null;
let selectedAvatar = '🐱';
let pendingVerificationEmail = null;

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
    }, 5000);
  } else {
    alert(msg);
  }
}

function showSuccess(msg) {
  const errDiv = document.getElementById('auth-error');
  if (errDiv) {
    errDiv.textContent = msg;
    errDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    errDiv.style.color = '#10b981';
    errDiv.style.display = 'block';
    setTimeout(() => {
      if (errDiv) {
        errDiv.style.display = 'none';
        errDiv.style.backgroundColor = '';
        errDiv.style.color = '';
      }
    }, 5000);
  }
}

window.showLoginForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
  const errDiv = document.getElementById('auth-error');
  if (errDiv) {
    errDiv.style.display = 'none';
    errDiv.style.backgroundColor = '';
    errDiv.style.color = '';
  }
};

window.showRegisterForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
  renderAvatarGrid();
  const errDiv = document.getElementById('auth-error');
  if (errDiv) {
    errDiv.style.display = 'none';
    errDiv.style.backgroundColor = '';
    errDiv.style.color = '';
  }
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
    const errDiv = document.getElementById('auth-error');
    if (errDiv) {
      errDiv.style.display = 'none';
      errDiv.style.backgroundColor = '';
      errDiv.style.color = '';
    }
  }
};

// Функция для отправки письма с подтверждением
async function sendVerificationEmail(user) {
  try {
    await user.sendEmailVerification();
    console.log('📧 Письмо с подтверждением отправлено на:', user.email);
    return true;
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    return false;
  }
}

// Проверка подтвержден ли email
function isEmailVerified(user) {
  return user.emailVerified;
}

// Показать уведомление о необходимости подтвердить email
function showVerificationDialog(email) {
  // Создаем модальное окно поверх существующего
  const modal = document.createElement('div');
  modal.className = 'verification-modal';
  modal.innerHTML = `
    <div class="verification-modal-content">
      <div class="verification-icon">📧</div>
      <h3>Подтвердите email</h3>
      <p>Мы отправили письмо с подтверждением на</p>
      <p><strong>${email}</strong></p>
      <p>Пожалуйста, перейдите по ссылке в письме, чтобы подтвердить свой аккаунт.</p>
      <p class="verification-note">После подтверждения вы сможете войти в аккаунт.</p>
      <div class="verification-buttons">
        <button class="btn-primary" onclick="resendVerificationEmail()">Отправить повторно</button>
        <button class="btn-secondary" onclick="closeVerificationDialog()">Закрыть</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);
}

window.resendVerificationEmail = async function() {
  if (pendingVerificationEmail && auth.currentUser) {
    const sent = await sendVerificationEmail(auth.currentUser);
    if (sent) {
      showSuccess('Письмо с подтверждением отправлено повторно! Проверьте почту.');
    } else {
      showError('Не удалось отправить письмо. Попробуйте позже.');
    }
  }
};

window.closeVerificationDialog = function() {
  const modal = document.querySelector('.verification-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
  // Разлогиниваем пользователя, так как email не подтвержден
  if (auth.currentUser) {
    auth.signOut();
  }
  pendingVerificationEmail = null;
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
  
  // Показываем загрузку
  const loginBtn = document.getElementById('login-submit');
  const originalText = loginBtn?.textContent;
  if (loginBtn) {
    loginBtn.textContent = '⏳ Вход...';
    loginBtn.disabled = true;
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Проверяем, подтвержден ли email
    if (!user.emailVerified) {
      showError('Email не подтвержден! Проверьте почту и перейдите по ссылке в письме.');
      await auth.signOut();
      if (loginBtn) {
        loginBtn.textContent = originalText || 'Войти';
        loginBtn.disabled = false;
      }
      return;
    }
    
    currentUser = user;
    
    // Загружаем данные пользователя
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      window.userData = userDoc.data();
      window.userProgress = { completedLessons: window.userData.completedLessons || [] };
    } else {
      window.userData = { uid: currentUser.uid, email: currentUser.email, name: currentUser.displayName || 'Пользователь', completedLessons: [] };
    }
    
    updateUIAfterLogin();
    closeAuthModal();
    
    if (typeof showNotification === 'function') {
      showNotification(`Добро пожаловать, ${window.userData.name || currentUser.email}!`, 'success');
    }
    
    console.log('✅ Вход выполнен:', currentUser.email);
    
  } catch(error) {
    console.error('Ошибка входа:', error);
    if (error.code === 'auth/user-not-found') showError('Пользователь не найден');
    else if (error.code === 'auth/wrong-password') showError('Неверный пароль');
    else if (error.code === 'auth/invalid-email') showError('Неверный email');
    else showError('Ошибка: ' + error.message);
  } finally {
    if (loginBtn) {
      loginBtn.textContent = originalText || 'Войти';
      loginBtn.disabled = false;
    }
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
  
  // Проверяем уникальность username
  try {
    const existing = await db.collection('users').where('username', '==', username.toLowerCase()).get();
    if (!existing.empty) {
      showError('Username уже занят');
      return;
    }
  } catch(e) {
    console.error(e);
  }
  
  // Показываем загрузку
  const registerBtn = document.getElementById('register-submit');
  const originalText = registerBtn?.textContent;
  if (registerBtn) {
    registerBtn.textContent = '⏳ Регистрация...';
    registerBtn.disabled = true;
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Обновляем профиль
    await user.updateProfile({ displayName: name });
    
    // Сохраняем данные в Firestore
    const userData = {
      uid: user.uid,
      username: username.toLowerCase(),
      name: name,
      email: email,
      avatar: selectedAvatar,
      bio: '',
      createdAt: new Date(),
      completedLessons: [],
      emailVerified: false
    };
    
    await db.collection('users').doc(user.uid).set(userData);
    
    // Отправляем письмо с подтверждением
    const emailSent = await sendVerificationEmail(user);
    
    if (emailSent) {
      pendingVerificationEmail = email;
      showVerificationDialog(email);
      showSuccess('Регистрация почти завершена! Проверьте почту.');
    } else {
      showError('Не удалось отправить письмо с подтверждением. Попробуйте позже.');
    }
    
    // Выходим из аккаунта до подтверждения email
    await auth.signOut();
    
    closeAuthModal();
    
    console.log('✅ Регистрация выполнена, письмо отправлено на:', email);
    
  } catch(error) {
    console.error('Ошибка регистрации:', error);
    if (error.code === 'auth/email-already-in-use') showError('Email уже используется');
    else if (error.code === 'auth/weak-password') showError('Слишком слабый пароль');
    else showError('Ошибка: ' + error.message);
  } finally {
    if (registerBtn) {
      registerBtn.textContent = originalText || 'Зарегистрироваться';
      registerBtn.disabled = false;
    }
  }
};

function updateUIAfterLogin() {
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
  }
}

window.logout = async function() {
  try {
    await auth.signOut();
    currentUser = null;
    window.userData = null;
    
    const authContainer = document.getElementById('auth-container');
    const userMenu = document.getElementById('user-menu');
    if (authContainer) authContainer.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    
    if (typeof showPage === 'function') showPage('landing');
    if (typeof showNotification === 'function') showNotification('Вы вышли из аккаунта', 'info');
    
    console.log('👋 Выход выполнен');
  } catch(error) {
    console.error('Ошибка выхода:', error);
  }
};

// Слушатель авторизации
auth.onAuthStateChanged(async (user) => {
  console.log('🔐 Auth state changed:', user ? `Пользователь ${user.email}` : 'Нет пользователя');
  currentUser = user;
  
  if (user) {
    // Проверяем, изменился ли статус верификации email
    if (user.emailVerified) {
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          window.userData = userDoc.data();
          window.userProgress = { completedLessons: window.userData.completedLessons || [] };
          
          // Если email только что подтвержден, обновляем статус в БД
          if (!window.userData.emailVerified) {
            await db.collection('users').doc(user.uid).update({ emailVerified: true });
            window.userData.emailVerified = true;
            if (typeof showNotification === 'function') {
              showNotification('Email подтвержден! Теперь вы можете пользоваться аккаунтом.', 'success');
            }
          }
        } else {
          window.userData = { uid: user.uid, email: user.email, name: user.displayName || 'Пользователь', completedLessons: [], emailVerified: true };
        }
        updateUIAfterLogin();
      } catch(e) {
        console.error('Ошибка загрузки данных:', e);
      }
    } else {
      // Email не подтвержден - не даем войти
      console.log('Email не подтвержден, выход...');
      await auth.signOut();
      currentUser = null;
      window.userData = null;
      
      const authContainer = document.getElementById('auth-container');
      const userMenu = document.getElementById('user-menu');
      if (authContainer) authContainer.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  } else {
    const authContainer = document.getElementById('auth-container');
    const userMenu = document.getElementById('user-menu');
    if (authContainer) authContainer.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    window.userData = null;
  }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔐 Инициализация auth.js с подтверждением email');
  
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

console.log('🔐 auth.js с подтверждением email загружен');
