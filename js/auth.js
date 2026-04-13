// ============================================
// МОДУЛЬ АВТОРИЗАЦИИ
// ============================================

let currentUser = null;
let selectedAvatar = '🐱';

// Список эмодзи животных (40 штук)
const ANIMAL_EMOJIS = [
  '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐴', '🦄',
  '🐝', '🐛', '🦋', '🐌', '🐞', '🐟', '🐠', '🐡', '🐙', '🦑',
  '🐬', '🐳', '🐋', '🦈', '🦭', '🐊', '🐉', '🦕', '🦖', '🐲'
];

// Рендер сетки аватаров
function renderAvatarGrid() {
  const grid = document.getElementById('avatar-emoji-grid');
  if (!grid) return;
  
  grid.innerHTML = ANIMAL_EMOJIS.map(emoji => `
    <div class="avatar-emoji ${selectedAvatar === emoji ? 'selected' : ''}" 
         data-emoji="${emoji}" 
         onclick="selectAvatar('${emoji}')"
         title="${getAnimalName(emoji)}">
      ${emoji}
    </div>
  `).join('');
}

// Получить название животного по эмодзи
function getAnimalName(emoji) {
  const names = {
    '🐱': 'Кот', '🐶': 'Собака', '🐭': 'Мышь', '🐹': 'Хомяк', '🐰': 'Кролик',
    '🦊': 'Лиса', '🐻': 'Медведь', '🐼': 'Панда', '🐨': 'Коала', '🐯': 'Тигр',
    '🦁': 'Лев', '🐮': 'Корова', '🐷': 'Свинья', '🐸': 'Лягушка', '🐵': 'Обезьяна'
  };
  return names[emoji] || 'Животное';
}

// Выбор аватара
window.selectAvatar = function(emoji) {
  selectedAvatar = emoji;
  document.querySelectorAll('.avatar-emoji').forEach(el => {
    el.classList.toggle('selected', el.dataset.emoji === emoji);
  });
  console.log('🦊 Выбран аватар:', emoji);
};

// Показать ошибку
function showAuthError(message) {
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

// Показать форму входа
window.showLoginForm = function() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'block';
  if (registerForm) registerForm.style.display = 'none';
  
  // Очищаем ошибки
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
  
  // Очищаем ошибки
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) errorDiv.style.display = 'none';
};

// Открыть модальное окно авторизации
window.openAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    showLoginForm();
    console.log('🔓 Модальное окно авторизации открыто');
  }
};

// Закрыть модальное окно авторизации
window.closeAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
    
    // Очищаем все поля
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    
    const errorDiv = document.getElementById('auth-error');
    if (errorDiv) errorDiv.style.display = 'none';
    
    console.log('🔒 Модальное окно авторизации закрыто');
  }
};

// Вход в систему
async function login() {
  const loginInput = document.getElementById('login-username')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  
  if (!loginInput || !password) {
    showAuthError('Заполните все поля');
    return;
  }
  
  // Определяем, email это или username
  let email = loginInput;
  if (!loginInput.includes('@')) {
    try {
      const usersSnapshot = await db.collection('users')
        .where('username', '==', loginInput.toLowerCase())
        .get();
      
      if (usersSnapshot.empty) {
        showAuthError('Пользователь не найден');
        return;
      }
      email = usersSnapshot.docs[0].data().email;
    } catch (error) {
      console.error('Ошибка поиска пользователя:', error);
      showAuthError('Ошибка поиска пользователя');
      return;
    }
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    await loadUserData(currentUser.uid);
    updateUIForLoggedInUser();
    closeAuthModal();
    showNotification(`Добро пожаловать, ${window.userData?.name || currentUser.email}!`, 'success');
    console.log('✅ Успешный вход:', currentUser.email);
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    switch (error.code) {
      case 'auth/user-not-found':
        showAuthError('Пользователь не найден');
        break;
      case 'auth/wrong-password':
        showAuthError('Неверный пароль');
        break;
      case 'auth/invalid-email':
        showAuthError('Неверный формат email');
        break;
      case 'auth/too-many-requests':
        showAuthError('Слишком много попыток. Попробуйте позже');
        break;
      default:
        showAuthError('Ошибка: ' + error.message);
    }
  }
}

// Регистрация
async function register() {
  const username = document.getElementById('register-username')?.value.trim();
  const name = document.getElementById('register-name')?.value.trim();
  const email = document.getElementById('register-email')?.value.trim();
  const password = document.getElementById('register-password')?.value;
  
  // Валидация
  if (!username || !name || !email || !password) {
    showAuthError('Заполните все поля');
    return;
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    showAuthError('Username должен содержать 3-20 символов (буквы, цифры, _)');
    return;
  }
  
  if (password.length < 6) {
    showAuthError('Пароль должен быть не менее 6 символов');
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    showAuthError('Введите корректный email');
    return;
  }
  
  // Проверяем уникальность username
  try {
    const existingUser = await db.collection('users')
      .where('username', '==', username.toLowerCase())
      .get();
    
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
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      completedLessons: [],
      courseProgress: {},
      totalHours: 0,
      xp: 0,
      level: 1
    };
    
    await db.collection('users').doc(userCredential.user.uid).set(userData);
    
    currentUser = userCredential.user;
    window.userData = userData;
    window.userProgress = {
      completedLessons: [],
      courseProgress: {}
    };
    
    updateUIForLoggedInUser();
    closeAuthModal();
    showNotification('Регистрация успешна! Добро пожаловать!', 'success');
    console.log('✅ Успешная регистрация:', username);
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    switch (error.code) {
      case 'auth/email-already-in-use':
        showAuthError('Email уже используется');
        break;
      case 'auth/weak-password':
        showAuthError('Слишком слабый пароль');
        break;
      case 'auth/invalid-email':
        showAuthError('Неверный формат email');
        break;
      default:
        showAuthError('Ошибка: ' + error.message);
    }
  }
}

// Загрузка данных пользователя
async function loadUserData(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      window.userData = userDoc.data();
      window.userProgress = {
        completedLessons: window.userData.completedLessons || [],
        courseProgress: window.userData.courseProgress || {}
      };
      console.log('📁 Данные пользователя загружены:', window.userData.username);
      return true;
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки данных:', error);
  }
  return false;
}

// Выход из системы
window.logout = async function() {
  try {
    await auth.signOut();
    currentUser = null;
    window.userData = null;
    window.userProgress = null;
    updateUIForLoggedOutUser();
    showPage('landing');
    showNotification('Вы вышли из аккаунта', 'info');
    console.log('👋 Выход из аккаунта');
  } catch (error) {
    console.error('❌ Ошибка выхода:', error);
    showNotification('Ошибка при выходе', 'error');
  }
};

// Обновление UI для залогиненного пользователя
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
    
    // Обновляем страницу профиля если она открыта
    if (typeof renderProfilePage === 'function') {
      renderProfilePage();
    }
  }
}

// Обновление UI для разлогиненного пользователя
function updateUIForLoggedOutUser() {
  const authContainer = document.getElementById('auth-container');
  const userMenu = document.getElementById('user-menu');
  if (authContainer) authContainer.style.display = 'flex';
  if (userMenu) userMenu.style.display = 'none';
}

// Сохранение прогресса
window.saveProgress = async function(courseId, lessonId) {
  if (!currentUser) {
    console.warn('Пользователь не авторизован, прогресс не сохранен');
    return false;
  }
  
  try {
    const userRef = db.collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();
    const completedLessons = userDoc.data()?.completedLessons || [];
    
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      const totalHours = Math.floor(completedLessons.length * 2); // 2 часа за урок
      
      await userRef.update({
        completedLessons: completedLessons,
        [`courseProgress.${courseId}`]: completedLessons.length,
        totalHours: totalHours,
        xp: completedLessons.length * 100
      });
      
      if (window.userProgress) {
        window.userProgress.completedLessons = completedLessons;
      }
      
      console.log(`💾 Прогресс сохранен: урок ${lessonId} пройден`);
      return true;
    }
  } catch (error) {
    console.error('❌ Ошибка сохранения прогресса:', error);
  }
  return false;
};

// Слушатель авторизации
auth.onAuthStateChanged(async (user) => {
  console.log('🔐 Auth state changed:', user ? `Пользователь ${user.email}` : 'Нет пользователя');
  currentUser = user;
  
  if (user) {
    const loaded = await loadUserData(user.uid);
    if (loaded) {
      updateUIForLoggedInUser();
    }
  } else {
    updateUIForLoggedOutUser();
  }
});

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔐 Инициализация модуля авторизации');
  
  const authTriggerBtn = document.getElementById('auth-trigger-btn');
  if (authTriggerBtn) {
    authTriggerBtn.addEventListener('click', openAuthModal);
  }
  
  const loginSubmit = document.getElementById('login-submit');
  if (loginSubmit) {
    loginSubmit.addEventListener('click', login);
  }
  
  const registerSubmit = document.getElementById('register-submit');
  if (registerSubmit) {
    registerSubmit.addEventListener('click', register);
  }
  
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAuthModal();
    });
  }
  
  // Вход по Enter
  const passwordInputs = document.querySelectorAll('#login-password, #register-password');
  passwordInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        if (input.id === 'login-password') {
          login();
        } else if (input.id === 'register-password') {
          register();
        }
      }
    });
  });
  
  // Клик по аватару для перехода в профиль
  const userAvatar = document.getElementById('user-avatar');
  if (userAvatar) {
    userAvatar.addEventListener('click', () => {
      if (currentUser) {
        showPage('profile');
      }
    });
  }
  
  renderAvatarGrid();
});

console.log('🔐 Модуль авторизации загружен');
