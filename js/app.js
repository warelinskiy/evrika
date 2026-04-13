// ============================================
// ОСНОВНОЙ ФАЙЛ ПРИЛОЖЕНИЯ
// ============================================

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ КНОПОК ==========

window.showPage = function(pageId) {
  console.log('showPage вызвана:', pageId);
  
  // Скрываем все страницы
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Показываем нужную страницу
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
    console.log('Страница показана:', pageId);
  } else {
    console.error('Страница не найдена:', pageId);
  }
  
  // Обновляем активные ссылки
  document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(link => {
    link.classList.remove('active');
  });
  
  // Загружаем данные для страницы
  if (pageId === 'courses' && typeof loadCourses === 'function') {
    loadCourses();
  } else if (pageId === 'profile') {
    renderProfilePage();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ========== ПЕРЕВОДЫ ==========
const translations = {
  ru: {
    nav_login: 'Войти',
    welcome: 'Добро пожаловать',
    username_or_email: 'Email или Username',
    password: 'Пароль',
    login_btn: 'Войти',
    no_account: 'Нет аккаунта? Зарегистрироваться',
    username: 'Username',
    name: 'Имя',
    email: 'Email',
    register_btn: 'Зарегистрироваться',
    has_account: 'Уже есть аккаунт? Войти',
    hero_badge: 'Онлайн платформа обучения',
    hero_title: 'Учись Java бесплатно в интерактивной игровой системе',
    hero_subtitle: 'Осваивай программирование, создавай свои тесты и делись знаниями с другими.',
    hero_cta: 'Начать обучение',
    hero_login: 'У меня уже есть аккаунт',
    stat_students: 'Активных студентов',
    stat_success: 'Успешных выпускников',
    stat_support: 'Поддержка',
    stat_1: 'Усвоение материала',
    stat_2: 'Быстрее обучение',
    stat_3: 'Доступность системы',
    create_title: 'Создавай и зарабатывай',
    create_text: 'Наша платформа позволяет не только учиться, но и становиться автором.',
    create_card_title: 'Монетизируйте свои знания',
    create_card_text: 'Зарабатывайте баллы и реальные бонусы за популярные курсы',
    science_title: 'Научный подход к обучению',
    science_text: 'В основе Eureka лежат алгоритмы интервальных повторений и когнитивной психологии.',
    process_title: 'Как проходит обучение',
    step1_title: 'Учись',
    step1_text: 'Короткие и емкие уроки без "воды"',
    step2_title: 'Тестируй',
    step2_text: 'Интерактивные тесты в реальном времени',
    step3_title: 'Практикуй',
    step3_text: 'Решение живых задач по кодингу',
    deep_title: 'Глубокое понимание вместо заучивания',
    deep_text: 'Мы верим, что программирование — это логика, а не синтаксис.',
    deep_cta: 'Начать глубокое погружение',
    flex_title: 'Обучение без давления',
    flex_text: 'Никаких обязательных вебинаров или строгих расписаний.',
    feat_1: 'Свободный график',
    feat_2: 'Любое устройство',
    feat_3: 'Свой темп',
    feat_4: 'Без дедлайнов',
    reviews_title: 'Что говорят наши студенты',
    review_1: 'Лучший курс по Java! За 3 месяца прошел с нуля до Junior разработчика.',
    review_2: 'Удобная платформа, понятные уроки и отличные тесты. Рекомендую!',
    cta_title: 'Готов начать свой путь в IT?',
    cta_text: 'Присоединяйся к тысячам студентов, которые уже учатся на платформе Эврика',
    cta_button: 'Начать бесплатно',
    courses_title: 'Курсы программирования',
    create_course_btn: 'Создать курс',
    create_course: 'Создать курс',
    course_title: 'Название курса',
    course_desc: 'Описание',
    course_icon: 'Иконка (эмодзи)',
    course_level: 'Уровень сложности',
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
    visibility: 'Видимость',
    public_btn: 'Для всех',
    link_btn: 'По ссылке',
    private_btn: 'Только я',
    create_btn: 'Создать курс',
    edit_profile: 'Редактировать профиль',
    bio: 'О себе',
    location: 'Местоположение',
    website: 'Сайт',
    save_changes: 'Сохранить изменения',
    avatar_emoji: 'Выберите аватар (животное)',
    mobile_home: 'Главная',
    mobile_courses: 'Курсы',
    mobile_profile: 'Профиль'
  },
  en: {
    nav_login: 'Login',
    welcome: 'Welcome',
    username_or_email: 'Email or Username',
    password: 'Password',
    login_btn: 'Login',
    no_account: "Don't have an account? Sign up",
    username: 'Username',
    name: 'Name',
    email: 'Email',
    register_btn: 'Sign up',
    has_account: 'Already have an account? Login',
    hero_badge: 'Online Learning Platform',
    hero_title: 'Learn Java for Free in an Interactive Gamified System',
    hero_subtitle: 'Master programming, create your own tests, and share knowledge with others.',
    hero_cta: 'Start Learning',
    hero_login: 'I already have an account',
    stat_students: 'Active Students',
    stat_success: 'Success Rate',
    stat_support: 'Support',
    stat_1: 'Material Retention',
    stat_2: 'Faster Learning',
    stat_3: 'Availability',
    create_title: 'Create & Earn',
    create_text: 'Our platform lets you not just learn, but become an author.',
    create_card_title: 'Monetize Your Knowledge',
    create_card_text: 'Earn points and real bonuses for popular courses',
    science_title: 'Scientific Approach to Learning',
    science_text: 'Eureka is built on spaced repetition algorithms and cognitive psychology.',
    process_title: 'How Learning Works',
    step1_title: 'Learn',
    step1_text: 'Short, dense lessons with no filler',
    step2_title: 'Test',
    step2_text: 'Interactive quizzes test your understanding',
    step3_title: 'Practice',
    step3_text: 'Solve live coding challenges',
    deep_title: 'Deep Understanding Over Memorization',
    deep_text: 'We believe programming is logic, not syntax.',
    deep_cta: 'Start Deep Dive',
    flex_title: 'Learning Without Pressure',
    flex_text: 'No mandatory webinars or rigid schedules.',
    feat_1: 'Flexible Schedule',
    feat_2: 'Any Device',
    feat_3: 'Your Pace',
    feat_4: 'No Deadlines',
    reviews_title: 'What Our Students Say',
    review_1: 'Best Java course! Went from zero to Junior developer in 3 months.',
    review_2: 'Convenient platform, clear lessons and great tests. Highly recommend!',
    cta_title: 'Ready to start your IT journey?',
    cta_text: 'Join thousands of students already learning on the Eureka platform',
    cta_button: 'Start for Free',
    courses_title: 'Programming Courses',
    create_course_btn: 'Create Course',
    create_course: 'Create Course',
    course_title: 'Course Title',
    course_desc: 'Description',
    course_icon: 'Icon (emoji)',
    course_level: 'Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    visibility: 'Visibility',
    public_btn: 'Public',
    link_btn: 'Link',
    private_btn: 'Private',
    create_btn: 'Create Course',
    edit_profile: 'Edit Profile',
    bio: 'Bio',
    location: 'Location',
    website: 'Website',
    save_changes: 'Save Changes',
    avatar_emoji: 'Choose avatar (animal)',
    mobile_home: 'Home',
    mobile_courses: 'Courses',
    mobile_profile: 'Profile'
  }
};

let currentLang = localStorage.getItem('language') || 'ru';

window.setLanguage = function(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
};

window.showNotification = function(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6')};
    color: white;
    border-radius: 8px;
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

window.escapeHtml = function(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// ========== РЕНДЕР ПРОФИЛЯ ==========
window.renderProfilePage = function() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  // Ждем данные пользователя
  if (!window.userData) {
    container.innerHTML = '<div style="text-align: center; padding: 2rem;">Загрузка профиля...</div>';
    setTimeout(renderProfilePage, 500);
    return;
  }
  
  const userData = window.userData;
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-large" onclick="openEditProfileModal()">
        ${userData.avatar || '👤'}
      </div>
      <h1 class="profile-name">${escapeHtml(userData.name || '')}</h1>
      <p class="profile-username">@${escapeHtml(userData.username || '')}</p>
      ${userData.bio ? `<p class="profile-bio">${escapeHtml(userData.bio)}</p>` : ''}
      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.5rem;">
        ${userData.location ? `<span style="font-size: 0.875rem; color: var(--on-surface-variant);">📍 ${escapeHtml(userData.location)}</span>` : ''}
      </div>
      <div style="margin-top: 1rem;">
        <button class="btn-secondary" onclick="openEditProfileModal()" style="padding: 0.5rem 1rem;">
          <span class="material-symbols-outlined" style="font-size: 1rem;">edit</span> Редактировать профиль
        </button>
      </div>
    </div>
    
    <div class="profile-stats">
      <div class="stat-card">
        <div class="stat-value">${completedCount}</div>
        <div class="stat-label">Пройдено уроков</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${percentage}%</div>
        <div class="stat-label">Прогресс</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Math.floor(completedCount * 2)}</div>
        <div class="stat-label">Часов обучения</div>
      </div>
    </div>
    
    <div style="margin-top: 2rem; text-align: center;">
      <button class="btn-primary" onclick="showPage('courses')" style="margin-right: 1rem;">
        <span class="material-symbols-outlined">menu_book</span> Продолжить обучение
      </button>
      <button class="btn-secondary" onclick="logout()">
        <span class="material-symbols-outlined">logout</span> Выйти
      </button>
    </div>
  `;
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM загружен');
  
  // Устанавливаем язык
  setLanguage(currentLang);
  
  // Закрытие модальных окон
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Показываем главную страницу
  showPage('landing');
});
