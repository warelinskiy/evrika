// ============================================
// МОДУЛЬ АВТОРИЗАЦИИ
// ============================================

let currentUser = null;
let selectedAvatar = '🐱';

// Список эмодзи животных
const animalEmojis = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐟', '🐠', '🐡', '🐙', '🦑', '🐬', '🐳', '🐋', '🦈', '🦭', '🐊', '🐉', '🦕', '🦖'];

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

function showError(message) {
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
  }
}

window.showLoginForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
};

window.showRegisterForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
  renderAvatarGrid();
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
    inputs.forEach(input => input.value = '');
    const errorDiv = document.getElementById('auth-error');
    if (errorDiv) errorDiv.style.display = 'none';
  }
};

async function login() {
  const loginInput = document.getElementById('login-username')?.value;
  const password = document.getElementById('login-password')?.value;
  
  if (!loginInput || !password) {
    showError('Заполните все поля');
    return;
  }
  
  let email = loginInput;
  if (!loginInput.includes('@')) {
    try {
      const usersSnapshot = await db.collection('users').where('username', '==', loginInput.toLowerCase()).get();
      if (usersSnapshot.empty) {
        showError('Пользователь не найден');
        return;
      }
      email = usersSnapshot.docs[0].data().email;
    } catch (error) {
      showError('Ошибка поиска пользователя');
      return;
    }
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    await loadUserData(currentUser.uid);
    updateUIForLoggedInUser();
    closeAuthModal();
    showNotification('Добро пожаловать!', 'success');
  } catch (error) {
    console.error('Ошибка входа:', error);
    if (error.code === 'auth/user-not-found') showError('Пользователь не найден');
    else if (error.code === 'auth/wrong-password') showError('Неверный пароль');
    else if (error.code === 'auth/invalid-email') showError('Неверный email');
    else showError('Ошибка: ' + error.message);
  }
}

async function register() {
  const username = document.getElementById('register-username')?.value;
  const name = document.getElementById('register-name')?.value;
  const email = document.getElementById('register-email')?.value;
  const password = document.getElementById('register-password')?.value;
  
  if (!username || !name || !email || !password) {
    showError('Заполните все поля');
    return;
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    showError('Username должен содержать 3-20 символов (буквы, цифры, _)');
    return;
  }
  
  if (password.length < 6) {
    showError('Пароль должен быть не менее 6 символов');
    return;
  }
  
  try {
    const existingUser = await db.collection('users').where('username', '==', username.toLowerCase()).get();
    if (!existingUser.empty) {
      showError('Этот username уже занят');
      return;
    }
  } catch (error) {
    console.error('Ошибка проверки username:', error);
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    
    await db.collection('users').doc(userCredential.user.uid).set({
      uid: userCredential.user.uid,
      username: username.toLowerCase(),
      name: name,
      email: email,
      avatar: selectedAvatar,
      bio: '',
      location: '',
      website: '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      completedLessons: [],
      courseProgress: {}
    });
    
    currentUser = userCredential.user;
    await loadUserData(currentUser.uid);
    updateUIForLoggedInUser();
    closeAuthModal();
    showNotification('Регистрация успешна!', 'success');
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    if (error.code === 'auth/email-already-in-use') showError('Email уже используется');
    else if (error.code === 'auth/weak-password') showError('Слишком слабый пароль');
    else showError('Ошибка: ' + error.message);
  }
}

async function loadUserData(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      window.userData = userDoc.data();
      window.userProgress = {
        completedLessons: window.userData.completedLessons || [],
        courseProgress: window.userData.courseProgress || {}
      };
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

window.logout = async function() {
  try {
    await auth.signOut();
    currentUser = null;
    window.userData = null;
    window.userProgress = null;
    updateUIForLoggedOutUser();
    showPage('landing');
    showNotification('Вы вышли из аккаунта', 'info');
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
};

function updateUIForLoggedInUser() {
  const authContainer = document.getElementById('auth-container');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  
  if (currentUser && window.userData) {
    const displayName = window.userData.name || currentUser.displayName || currentUser.email.split('@')[0];
    if (userName) userName.textContent = displayName;
    if (userAvatar) userAvatar.textContent = window.userData.avatar || '👤';
    if (authContainer) authContainer.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    updateProgressDisplay();
    if (typeof renderProfile === 'function') renderProfile();
  }
}

function updateUIForLoggedOutUser() {
  const authContainer = document.getElementById('auth-container');
  const userMenu = document.getElementById('user-menu');
  if (authContainer) authContainer.style.display = 'flex';
  if (userMenu) userMenu.style.display = 'none';
}

async function saveProgress(courseId, lessonId) {
  if (!currentUser) return;
  try {
    const userRef = db.collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();
    const completedLessons = userDoc.data()?.completedLessons || [];
    
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      await userRef.update({
        completedLessons: completedLessons,
        [`courseProgress.${courseId}`]: completedLessons.filter(l => l.startsWith(courseId)).length
      });
      if (window.userProgress) window.userProgress.completedLessons = completedLessons;
      updateProgressDisplay();
    }
  } catch (error) {
    console.error('Ошибка сохранения прогресса:', error);
  }
}

function updateProgressDisplay() {
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  const progressFill = document.querySelector('.progress-bar-fill');
  const progressPct = document.querySelector('.sidebar-progress-pct');
  
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressPct) progressPct.textContent = `${percentage}%`;
}

// Слушатель авторизации
auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  if (user) {
    await loadUserData(user.uid);
    updateUIForLoggedInUser();
  } else {
    updateUIForLoggedOutUser();
  }
});

// Обработчики событий
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
  
  renderAvatarGrid();
});
