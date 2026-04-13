// ============================================
// МОДУЛЬ АВТОРИЗАЦИИ
// ============================================

let currentUser = null;

// Элементы
const authModal = document.getElementById('auth-modal');
const authTriggerBtn = document.getElementById('auth-trigger-btn');
const loginBtn = document.getElementById('login-btn');
const userMenu = document.getElementById('user-menu');
const authContainer = document.getElementById('auth-container');

// Функция открытия модального окна авторизации
function openAuthModal() {
  authModal.classList.add('active');
}

function closeAuthModal() {
  authModal.classList.remove('active');
  document.getElementById('auth-error').textContent = '';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('register-name').value = '';
  document.getElementById('register-email').value = '';
  document.getElementById('register-password').value = '';
}

// Переключение табов
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
  
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
}

// Вход в систему
async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    updateUIForLoggedInUser(currentUser);
    closeAuthModal();
    return { success: true };
  } catch (error) {
    let errorMessage = 'Ошибка входа';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Пользователь не найден';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Неверный пароль';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Неверный формат email';
        break;
    }
    document.getElementById('auth-error').textContent = errorMessage;
    return { success: false, error: errorMessage };
  }
}

// Регистрация
async function register(name, email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    // Обновляем профиль с именем
    await userCredential.user.updateProfile({ displayName: name });
    // Сохраняем дополнительную информацию в Firestore
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
    return { success: true };
  } catch (error) {
    let errorMessage = 'Ошибка регистрации';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email уже используется';
        break;
      case 'auth/weak-password':
        errorMessage = 'Пароль слишком слабый (минимум 6 символов)';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Неверный формат email';
        break;
    }
    document.getElementById('auth-error').textContent = errorMessage;
    return { success: false, error: errorMessage };
  }
}

// Выход из системы
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

// Обновление UI для залогиненного пользователя
function updateUIForLoggedInUser(user) {
  const displayName = user.displayName || user.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();
  
  document.getElementById('user-avatar').textContent = initial;
  document.getElementById('user-name').textContent = displayName;
  
  authContainer.style.display = 'none';
  userMenu.style.display = 'flex';
  
  // Загружаем прогресс пользователя
  loadUserProgress();
}

// Обновление UI для разлогиненного пользователя
function updateUIForLoggedOutUser() {
  authContainer.style.display = 'flex';
  userMenu.style.display = 'none';
  
  // Очищаем данные пользователя
  currentUser = null;
}

// Загрузка прогресса пользователя
async function loadUserProgress() {
  if (!currentUser) return;
  
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      window.userProgress = {
        completedLessons: userData.completedLessons || [],
        courseProgress: userData.courseProgress || {}
      };
      // Обновляем отображение прогресса
      updateProgressDisplay();
    }
  } catch (error) {
    console.error('Ошибка загрузки прогресса:', error);
  }
}

// Сохранение прогресса
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
        [`courseProgress.${courseId}`]: {
          completedLessons: completedLessons.filter(l => l.startsWith(courseId)).length
        }
      });
      window.userProgress = { completedLessons, courseProgress: {} };
      updateProgressDisplay();
    }
  } catch (error) {
    console.error('Ошибка сохранения прогресса:', error);
  }
}

// Обновление отображения прогресса
function updateProgressDisplay() {
  if (!window.userProgress) return;
  
  const completedCount = window.userProgress.completedLessons?.length || 0;
  const totalLessons = 18; // Всего уроков в курсе Java
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  const progressFill = document.querySelector('.progress-bar-fill');
  const progressPct = document.querySelector('.sidebar-progress-pct');
  const progressText = document.querySelector('.sidebar-progress-text');
  
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressPct) progressPct.textContent = `${percentage}%`;
  if (progressText) progressText.textContent = `${percentage}% завершено`;
}

// Инициализация слушателя авторизации
function initAuth() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      updateUIForLoggedInUser(user);
    } else {
      currentUser = null;
      updateUIForLoggedOutUser();
    }
  });
  
  // Обработчики событий
  if (authTriggerBtn) {
    authTriggerBtn.addEventListener('click', openAuthModal);
  }
  
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', closeAuthModal);
  });
  
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });
  
  document.getElementById('login-submit')?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await login(email, password);
  });
  
  document.getElementById('register-submit')?.addEventListener('click', async () => {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    await register(name, email, password);
  });
  
  document.getElementById('logout-btn')?.addEventListener('click', logout);
}