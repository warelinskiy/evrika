// ============================================
// МОДУЛЬ АВТОРИЗАЦИИ
// ============================================

let currentUser = null;

function showError(message) {
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
  }
}

function showLoginForm() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
}

function showRegisterForm() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
}

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    showLoginForm();
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
  }
}

async function login() {
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;
  
  if (!email || !password) {
    showError('Заполните все поля');
    return;
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    updateUIForLoggedInUser(currentUser);
    closeAuthModal();
  } catch (error) {
    console.error('Ошибка входа:', error);
    if (error.code === 'auth/user-not-found') showError('Пользователь не найден');
    else if (error.code === 'auth/wrong-password') showError('Неверный пароль');
    else if (error.code === 'auth/invalid-email') showError('Неверный email');
    else showError('Ошибка: ' + error.message);
  }
}

async function register() {
  const name = document.getElementById('register-name')?.value;
  const email = document.getElementById('register-email')?.value;
  const password = document.getElementById('register-password')?.value;
  
  if (!name || !email || !password) {
    showError('Заполните все поля');
    return;
  }
  if (password.length < 6) {
    showError('Пароль должен быть не менее 6 символов');
    return;
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    
    await db.collection('users').doc(userCredential.user.uid).set({
      name: name,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      completedLessons: [],
      courseProgress: {}
    });
    
    currentUser = userCredential.user;
    updateUIForLoggedInUser(currentUser);
    closeAuthModal();
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    if (error.code === 'auth/email-already-in-use') showError('Email уже используется');
    else if (error.code === 'auth/weak-password') showError('Слишком слабый пароль');
    else showError('Ошибка: ' + error.message);
  }
}

async function logout() {
  try {
    await auth.signOut();
    currentUser = null;
    updateUIForLoggedOutUser();
    showPage('landing');
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
}

function updateUIForLoggedInUser(user) {
  const authContainer = document.getElementById('auth-container');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  
  if (user) {
    const displayName = user.displayName || user.email.split('@')[0];
    if (userName) userName.textContent = displayName;
    if (userAvatar) userAvatar.textContent = displayName.charAt(0).toUpperCase();
    if (authContainer) authContainer.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    loadUserProgress();
  }
}

function updateUIForLoggedOutUser() {
  const authContainer = document.getElementById('auth-container');
  const userMenu = document.getElementById('user-menu');
  if (authContainer) authContainer.style.display = 'flex';
  if (userMenu) userMenu.style.display = 'none';
  window.userProgress = null;
}

async function loadUserProgress() {
  if (!currentUser) return;
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      window.userProgress = userDoc.data();
      updateProgressDisplay();
    }
  } catch (error) {
    console.error('Ошибка загрузки прогресса:', error);
  }
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
  const progressText = document.querySelector('.sidebar-progress-text');
  
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressPct) progressPct.textContent = `${percentage}%`;
  if (progressText) progressText.textContent = `${percentage}% завершено`;
}

// Инициализация слушателя авторизации
auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    updateUIForLoggedInUser(user);
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
});
