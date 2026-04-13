// ============================================
// ОСНОВНОЙ ФАЙЛ ПРИЛОЖЕНИЯ ЭВРИКА
// ============================================

// Глобальные функции для вызова из HTML
window.selectCourse = selectCourse;
window.startLesson = startLesson;
window.startTest = startTest;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.cancelTest = cancelTest;
window.completeLessonAndContinue = completeLessonAndContinue;
window.openCreateCourseModal = openCreateCourseModal;
window.closeCreateCourseModal = closeCreateCourseModal;
window.setVisibility = setVisibility;
window.showPage = showPage;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
  // Инициализация Firebase Auth
  initAuth();
  
  // Загрузка курсов
  await loadCourses();
  
  // Настройка модального окна создания курса
  const createCourseBtn = document.getElementById('create-course-btn');
  if (createCourseBtn) {
    createCourseBtn.addEventListener('click', openCreateCourseModal);
  }
  
  const createCourseSubmit = document.getElementById('create-course-submit');
  if (createCourseSubmit) {
    createCourseSubmit.addEventListener('click', async () => {
      const courseData = {
        title: document.getElementById('course-title').value,
        description: document.getElementById('course-description').value,
        icon: document.getElementById('course-icon').value || '📚',
        level: document.getElementById('course-level').value,
        visibility: document.getElementById('course-visibility').value
      };
      
      if (!courseData.title) {
        showNotification('Введите название курса', 'error');
        return;
      }
      
      await createCourse(courseData);
      
      // Очищаем форму
      document.getElementById('course-title').value = '';
      document.getElementById('course-description').value = '';
      document.getElementById('course-icon').value = '';
    });
  }
  
  // Показываем стартовую страницу
  showPage('landing');
});

// Функция показа страниц
function showPage(pageId) {
  // Скрываем все страницы
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Показываем нужную
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Обновляем активные ссылки в навигации
  document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) {
      link.classList.add('active');
    }
  });
  
  // Дополнительная логика при показе страниц
  if (pageId === 'courses') {
    renderCourses();
  } else if (pageId === 'course-detail' && currentCourse) {
    renderCourseDetail();
  } else if (pageId === 'profile') {
    renderProfile();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Рендер профиля
function renderProfile() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  
  const profileContainer = document.getElementById('profile-content');
  if (!profileContainer) return;
  
  const displayName = currentUser.displayName || currentUser.email.split('@')[0];
  const completedCount = window.userProgress?.completedLessons?.length || 0;
  const totalLessons = 18;
  const percentage = Math.round((completedCount / totalLessons) * 100);
  
  profileContainer.innerHTML = `
    <div class="profile-header" style="text-align: center; margin-bottom: 2rem;">
      <div class="profile-avatar" style="width: 100px; height: 100px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
        <span style="font-size: 3rem; color: white;">${displayName.charAt(0).toUpperCase()}</span>
      </div>
      <h1 class="profile-name">${escapeHtml(displayName)}</h1>
      <p class="profile-email">${escapeHtml(currentUser.email)}</p>
    </div>
    
    <div class="profile-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
      <div class="stat-card" style="background: var(--surface-low); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">
        <div class="stat-value" style="font-size: 2rem; font-weight: 800;">${completedCount}</div>
        <div class="stat-label">Пройдено уроков</div>
      </div>
      <div class="stat-card" style="background: var(--surface-low); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">
        <div class="stat-value" style="font-size: 2rem; font-weight: 800;">${percentage}%</div>
        <div class="stat-label">Прогресс</div>
      </div>
      <div class="stat-card" style="background: var(--surface-low); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">
        <div class="stat-value" style="font-size: 2rem; font-weight: 800;">${Math.floor(completedCount * 2)}</div>
        <div class="stat-label">Часов обучения</div>
      </div>
    </div>
    
    <div class="profile-actions" style="display: flex; justify-content: center;">
      <button class="btn-logout" onclick="logout()">
        <span class="material-symbols-outlined">logout</span>
        Выйти из аккаунта
      </button>
    </div>
  `;
}

// Вспомогательная функция для экранирования HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}