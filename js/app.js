// ============================================
// ОСНОВНОЙ ФАЙЛ ПРИЛОЖЕНИЯ
// ============================================

// Глобальные функции
window.showPage = function(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Обновляем активные ссылки в навигации
  document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(link => {
    link.classList.remove('active');
    if (link.dataset?.page === pageId || link.getAttribute('onclick')?.includes(pageId)) {
      link.classList.add('active');
    }
  });
  
  // Дополнительная логика
  if (pageId === 'courses') {
    loadCourses();
  } else if (pageId === 'profile') {
    renderProfile();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleDarkMode = function() {
  const currentTheme = getCurrentTheme();
  if (currentTheme === 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
};

// Перевод
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
    if (translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Устанавливаем язык
  setLanguage(currentLang);
  
  // Закрытие модальных окон по клику на оверлей
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
});

// Дополнительные глобальные функции
window.escapeHtml = escapeHtml;
window.showNotification = showNotification;
