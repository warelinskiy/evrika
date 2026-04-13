// ============================================
// ОСНОВНОЙ ФАЙЛ ПРИЛОЖЕНИЯ - ПОЛНАЯ ВЕРСИЯ
// ============================================

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==========

window.showPage = function(pageId) {
  console.log('📄 Переход на страницу:', pageId);
  
  // Скрываем все страницы
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Показываем нужную страницу
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
    console.log('✅ Страница показана:', pageId);
  } else {
    console.error('❌ Страница не найдена:', pageId);
  }
  
  // Обновляем активные ссылки в навигации
  document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick')?.includes(`'${pageId}'`) || 
        link.getAttribute('onclick')?.includes(`"${pageId}"`)) {
      link.classList.add('active');
    }
  });
  
  // Загружаем данные для страницы профиля
  if (pageId === 'profile' && typeof renderProfilePage === 'function') {
    renderProfilePage();
  }
  
  // Плавный скролл наверх
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ========== УВЕДОМЛЕНИЯ ==========

window.showNotification = function(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 14px 24px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 12px;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  // Добавляем иконку
  const icon = document.createElement('span');
  icon.className = 'material-symbols-outlined';
  icon.textContent = type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info');
  icon.style.fontSize = '20px';
  notification.appendChild(icon);
  
  const text = document.createTextNode(message);
  notification.appendChild(text);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, duration);
};

// Добавляем CSS анимации для уведомлений
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notificationStyle);

// ========== ESCAPE HTML ==========

window.escapeHtml = function(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// ========== ПЕРЕВОДЫ (ПОЛНАЯ ВЕРСИЯ) ==========

const translations = {
  ru: {
    // Навигация
    nav_login: 'Войти',
    nav_profile: 'Профиль',
    nav_home: 'Главная',
    
    // Модальное окно авторизации
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
    avatar_emoji: 'Выберите аватар (животное)',
    
    // Hero блок
    hero_badge: 'Онлайн платформа обучения',
    hero_title: 'Учись Java бесплатно в интерактивной игровой системе',
    hero_subtitle: 'Осваивай программирование, создавай свои тесты и делись знаниями с другими.',
    hero_cta: 'Начать обучение',
    hero_login: 'У меня уже есть аккаунт',
    
    // Статистика
    stat_students: 'Активных студентов',
    stat_success: 'Успешных выпускников',
    stat_support: 'Поддержка',
    stat_1: 'Усвоение материала',
    stat_2: 'Быстрее обучение',
    stat_3: 'Доступность системы',
    
    // Блок 2
    create_title: 'Создавай и зарабатывай',
    create_text: 'Наша платформа позволяет не только учиться, но и становиться автором. Публикуйте свои собственные тесты и практические задачи. Превращайте свою экспертизу в ценность для сообщества и получайте вознаграждение за качественный контент.',
    create_card_title: 'Монетизируйте свои знания',
    create_card_text: 'Зарабатывайте баллы и реальные бонусы за популярные курсы',
    
    // Блок 3
    science_title: 'Научный подход к обучению',
    science_text: 'В основе Eureka лежат алгоритмы интервальных повторений и когнитивной психологии. Мы не просто даем теорию — мы встраиваем знания в вашу долгосрочную память через регулярную практику и адаптивные тесты, которые подстраиваются под ваш темп.',
    
    // Блок 4
    process_title: 'Как проходит обучение',
    step1_title: 'Учись',
    step1_text: 'Короткие и емкие уроки без "воды"',
    step2_title: 'Тестируй',
    step2_text: 'Интерактивные тесты в реальном времени',
    step3_title: 'Практикуй',
    step3_text: 'Решение живых задач по кодингу',
    
    // Блок 5
    deep_title: 'Глубокое понимание вместо заучивания',
    deep_text: 'Мы верим, что программирование — это логика, а не синтаксис. Наша методика сфокусирована на фундаментальных принципах Java, позволяя вам писать эффективный код даже в незнакомых ситуациях.',
    deep_cta: 'Начать глубокое погружение',
    
    // Блок 6
    flex_title: 'Обучение без давления',
    flex_text: 'Никаких обязательных вебинаров или строгих расписаний. Вы сами определяете интенсивность обучения. Наша платформа доступна 24/7, позволяя возвращаться к урокам именно тогда, когда у вас есть вдохновение и время.',
    feat_1: 'Свободный график',
    feat_2: 'Любое устройство',
    feat_3: 'Свой темп',
    feat_4: 'Без дедлайнов',
    
    // Блок 7 - Отзывы
    reviews_title: 'Что говорят наши студенты',
    review_1: 'Лучший курс по Java! За 3 месяца прошел с нуля до Junior разработчика.',
    review_2: 'Удобная платформа, понятные уроки и отличные тесты. Рекомендую!',
    
    // Блок 8 - CTA
    cta_title: 'Готов начать свой путь в IT?',
    cta_text: 'Присоединяйся к тысячам студентов, которые уже учатся на платформе Эврика',
    cta_button: 'Начать бесплатно',
    
    // Профиль
    edit_profile: 'Редактировать профиль',
    bio: 'О себе',
    location: 'Местоположение',
    website: 'Сайт',
    save_changes: 'Сохранить изменения',
    profile_not_authorized: 'Вы не авторизованы',
    profile_login_hint: 'Войдите или зарегистрируйтесь, чтобы увидеть свой профиль',
    loading_profile: 'Загрузка профиля...',
    write_something_about: 'Напишите немного о себе...',
    logout: 'Выйти из аккаунта',
    lessons_completed: 'Пройдено уроков',
    progress: 'Прогресс',
    hours_learned: 'Часов обучения',
    edit_profile_btn: 'Редактировать профиль',
    continue_learning: 'Продолжить обучение',
    
    // Мобильная навигация
    mobile_home: 'Главная',
    mobile_profile: 'Профиль',
    
    // Темы
    theme_light: 'Светлая',
    theme_dark: 'Тёмная',
    theme_sunset: 'Закат',
    theme_ocean: 'Океан',
    theme_lavender: 'Лаванда'
  },
  
  en: {
    // Navigation
    nav_login: 'Login',
    nav_profile: 'Profile',
    nav_home: 'Home',
    
    // Auth modal
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
    avatar_emoji: 'Choose avatar (animal)',
    
    // Hero block
    hero_badge: 'Online Learning Platform',
    hero_title: 'Learn Java for Free in an Interactive Gamified System',
    hero_subtitle: 'Master programming, create your own tests, and share knowledge with others.',
    hero_cta: 'Start Learning',
    hero_login: 'I already have an account',
    
    // Statistics
    stat_students: 'Active Students',
    stat_success: 'Success Rate',
    stat_support: 'Support',
    stat_1: 'Material Retention',
    stat_2: 'Faster Learning',
    stat_3: 'Availability',
    
    // Block 2
    create_title: 'Create & Earn',
    create_text: 'Our platform lets you not just learn, but become an author. Publish your own tests and practical challenges. Turn your expertise into value for the community and earn rewards for quality content.',
    create_card_title: 'Monetize Your Knowledge',
    create_card_text: 'Earn points and real bonuses for popular courses',
    
    // Block 3
    science_title: 'Scientific Approach to Learning',
    science_text: 'Eureka is built on spaced repetition algorithms and cognitive psychology. We don\'t just give theory — we embed knowledge into your long-term memory through regular practice and adaptive tests that adjust to your pace.',
    
    // Block 4
    process_title: 'How Learning Works',
    step1_title: 'Learn',
    step1_text: 'Short, dense lessons with no filler',
    step2_title: 'Test',
    step2_text: 'Interactive quizzes test your understanding',
    step3_title: 'Practice',
    step3_text: 'Solve live coding challenges',
    
    // Block 5
    deep_title: 'Deep Understanding Over Memorization',
    deep_text: 'We believe programming is logic, not syntax. Our methodology focuses on fundamental Java principles, enabling you to write efficient code even in unfamiliar situations.',
    deep_cta: 'Start Deep Dive',
    
    // Block 6
    flex_title: 'Learning Without Pressure',
    flex_text: 'No mandatory webinars or rigid schedules. You set the intensity of your learning. Our platform is available 24/7, letting you return to lessons whenever you have inspiration and time.',
    feat_1: 'Flexible Schedule',
    feat_2: 'Any Device',
    feat_3: 'Your Pace',
    feat_4: 'No Deadlines',
    
    // Block 7 - Reviews
    reviews_title: 'What Our Students Say',
    review_1: 'Best Java course! Went from zero to Junior developer in 3 months.',
    review_2: 'Convenient platform, clear lessons and great tests. Highly recommend!',
    
    // Block 8 - CTA
    cta_title: 'Ready to start your IT journey?',
    cta_text: 'Join thousands of students already learning on the Eureka platform',
    cta_button: 'Start for Free',
    
    // Profile
    edit_profile: 'Edit Profile',
    bio: 'Bio',
    location: 'Location',
    website: 'Website',
    save_changes: 'Save Changes',
    profile_not_authorized: 'Not Authorized',
    profile_login_hint: 'Login or sign up to view your profile',
    loading_profile: 'Loading profile...',
    write_something_about: 'Write something about yourself...',
    logout: 'Log out',
    lessons_completed: 'Lessons Completed',
    progress: 'Progress',
    hours_learned: 'Hours Learned',
    edit_profile_btn: 'Edit Profile',
    continue_learning: 'Continue Learning',
    
    // Mobile navigation
    mobile_home: 'Home',
    mobile_profile: 'Profile',
    
    // Themes
    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_sunset: 'Sunset',
    theme_ocean: 'Ocean',
    theme_lavender: 'Lavender'
  }
};

let currentLang = localStorage.getItem('language') || 'ru';

window.setLanguage = function(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // Обновляем активную кнопку языка
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Обновляем все элементы с data-t атрибутом
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
  
  // Обновляем страницу профиля если она открыта
  if (document.getElementById('page-profile')?.classList.contains('active')) {
    renderProfilePage();
  }
  
  showNotification(`Язык изменен на ${lang === 'ru' ? 'Русский' : 'English'}`, 'success', 1500);
};

// ========== ФОРМАТИРОВАНИЕ ДАТЫ ==========

window.formatDate = function(date) {
  if (!date) return '';
  const d = new Date(date);
  const lang = currentLang === 'ru' ? 'ru-RU' : 'en-US';
  return d.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
};

// ========== ЗАГРУЗКА СОСТОЯНИЯ ==========

window.loadAppState = function() {
  // Восстанавливаем тему
  const savedTheme = localStorage.getItem('eureka-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  }
  
  // Восстанавливаем язык
  setLanguage(currentLang);
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Приложение Эврика загружено');
  
  // Загружаем сохраненное состояние
  loadAppState();
  
  // Закрытие модальных окон по клику на оверлей
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });
  
  // Показываем главную страницу
  showPage('landing');
  
  console.log('✅ Инициализация завершена');
});
