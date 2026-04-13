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
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
};

function renderProfile() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  
  const container = document.getElementById('profile-container');
  if (!container) return;
  
  const displayName = currentUser.displayName || currentUser.email.split('@')[0];
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-large">
        <span style="font-size: 3rem; color: white;">${displayName.charAt(0).toUpperCase()}</span>
      </div>
      <h1 class="profile-name">${escapeHtml(displayName)}</h1>
      <p class="profile-email">${escapeHtml(currentUser.email)}</p>
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
    
    <div style="display: flex; justify-content: center;">
      <button class="btn-logout" onclick="logout()" style="background: var(--surface-high); color: var(--error); border: none; border-radius: var(--radius-full); padding: 0.75rem 2rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <span class="material-symbols-outlined">logout</span>
        Выйти из аккаунта
      </button>
    </div>
  `;
}

// Перевод
const translations = {
  ru: {
    nav_login: 'Войти',
    hero_badge: 'Онлайн платформа обучения',
    hero_title: 'Учись Java бесплатно в интерактивной игровой системе',
    hero_subtitle: 'Осваивай программирование, создавай свои тесты и делись знаниями с другими.',
    hero_cta: 'Начать обучение',
    courses_title: 'Курсы программирования',
    create_course_btn: 'Создать курс',
    community_title: 'Сообщество',
    community_subtitle: 'Общайтесь с другими разработчиками, делитесь опытом и находите единомышленников',
    pricing_title: 'Цены',
    pricing_subtitle: 'Выберите подходящий тариф для обучения',
    free: 'Бесплатный',
    free_desc: 'Доступ ко всем базовым курсам',
    pro: 'Pro',
    pro_desc: 'Все курсы + сертификаты + поддержка',
    upgrade: 'Выбрать',
    current_plan: 'Текущий план',
    mobile_learn: 'Обучение',
    mobile_courses: 'Курсы',
    mobile_community: 'Сообщество',
    mobile_profile: 'Профиль'
  },
  en: {
    nav_login: 'Login',
    hero_badge: 'Online Learning Platform',
    hero_title: 'Learn Java for Free in an Interactive Gamified System',
    hero_subtitle: 'Master programming, create your own tests, and share knowledge with others.',
    hero_cta: 'Start Learning',
    courses_title: 'Programming Courses',
    create_course_btn: 'Create Course',
    community_title: 'Community',
    community_subtitle: 'Connect with other developers, share experiences and find like-minded people',
    pricing_title: 'Pricing',
    pricing_subtitle: 'Choose the right plan for your learning',
    free: 'Free',
    free_desc: 'Access to all basic courses',
    pro: 'Pro',
    pro_desc: 'All courses + certificates + support',
    upgrade: 'Upgrade',
    current_plan: 'Current Plan',
    mobile_learn: 'Learn',
    mobile_courses: 'Courses',
    mobile_community: 'Community',
    mobile_profile: 'Profile'
  }
};

let currentLang = localStorage.getItem('language') || 'ru';

function setLanguage(lang) {
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
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Восстанавливаем темную тему
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.documentElement.classList.add('dark');
  }
  
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
