// ============================================
// МОДУЛЬ КУРСОВ
// ============================================

let courses = [];
let currentCourse = null;

const demoCourse = {
  id: 'java-basic',
  title: 'Java с нуля до профессионала',
  description: 'Полный курс по Java с нуля до уверенного уровня. 18 уроков, практические задания.',
  icon: '💻',
  lessons: 18,
  duration: '36 часов',
  level: 'Начинающий',
  author: 'Эврика'
};

async function loadCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;
  
  courses = [demoCourse];
  
  container.innerHTML = courses.map(course => `
    <div class="course-card" onclick="selectCourse('${course.id}')">
      <div class="course-card-header">
        <div class="course-card-header-icon">${course.icon}</div>
        <h3 class="course-card-title">${course.title}</h3>
        <p class="course-card-meta">${course.level} • ${course.duration}</p>
      </div>
      <div class="course-card-body">
        <p class="course-card-description">${course.description}</p>
        <div class="course-card-stats">
          <span>📖 ${course.lessons} уроков</span>
          <span>👤 ${course.author}</span>
        </div>
      </div>
    </div>
  `).join('');
}

window.selectCourse = function(courseId) {
  currentCourse = demoCourse;
  const container = document.getElementById('course-detail-container');
  if (!container) return;
  
  const completedLessons = window.userProgress?.completedLessons || [];
  const lessonsList = getLessonsList();
  
  container.innerHTML = `
    <div class="mb-4"><button class="btn-secondary" onclick="showPage('courses')">← Назад к курсам</button></div>
    <div style="margin-bottom: 2rem;">
      <div style="font-size: 4rem;">${currentCourse.icon}</div>
      <h1 class="section-title">${currentCourse.title}</h1>
      <p style="color: var(--on-surface-variant);">${currentCourse.description}</p>
    </div>
    <div class="lessons-list">
      ${lessonsList.map((lesson, idx) => {
        const isCompleted = completedLessons.includes(lesson.id);
        return `
          <div class="lesson-item" onclick="startLesson('${lesson.id}')">
            <div class="lesson-left">
              <div class="lesson-number">${idx + 1}</div>
              <div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-duration">${lesson.duration}</div>
              </div>
            </div>
            <div class="lesson-status ${isCompleted ? 'completed' : ''}">
              ${isCompleted ? '✓ Пройден' : '▶ Начать'}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  showPage('course-detail');
};

function getLessonsList() {
  return [
    { id: 'lesson-1', title: 'Введение в Java', duration: '2 часа' },
    { id: 'lesson-2', title: 'Переменные и примитивные типы', duration: '2 часа' },
    { id: 'lesson-3', title: 'Операторы в Java', duration: '2 часа' },
    { id: 'lesson-4', title: 'Условные операторы и циклы', duration: '2 часа' },
    { id: 'lesson-5', title: 'Массивы', duration: '2 часа' },
    { id: 'lesson-6', title: 'Строки', duration: '2 часа' },
    { id: 'lesson-7', title: 'Методы', duration: '2 часа' },
    { id: 'lesson-8', title: 'Классы и объекты', duration: '2 часа' },
    { id: 'lesson-9', title: 'Наследование', duration: '2 часа' },
    { id: 'lesson-10', title: 'Абстрактные классы', duration: '2 часа' },
    { id: 'lesson-11', title: 'Исключения', duration: '2 часа' },
    { id: 'lesson-12', title: 'Generics', duration: '2 часа' },
    { id: 'lesson-13', title: 'Коллекции', duration: '2 часа' },
    { id: 'lesson-14', title: 'Stream API', duration: '2 часа' },
    { id: 'lesson-15', title: 'Многопоточность', duration: '2 часа' },
    { id: 'lesson-16', title: 'Дата и время', duration: '2 часа' },
    { id: 'lesson-17', title: 'Ввод-вывод', duration: '2 часа' },
    { id: 'lesson-18', title: 'Аннотации', duration: '2 часа' }
  ];
}

window.openCreateCourseModal = function() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  const modal = document.getElementById('create-course-modal');
  if (modal) modal.classList.add('active');
};

window.closeCreateCourseModal = function() {
  const modal = document.getElementById('create-course-modal');
  if (modal) modal.classList.remove('active');
};

window.setVisibility = function(value) {
  document.querySelectorAll('.visibility-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.value === value);
  });
  const visibilityInput = document.getElementById('course-visibility');
  if (visibilityInput) visibilityInput.value = value;
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const createCourseBtn = document.getElementById('create-course-btn');
  if (createCourseBtn) createCourseBtn.addEventListener('click', openCreateCourseModal);
  loadCourses();
});  const container = document.getElementById('courses-container');
  if (!container) return;
  
  container.innerHTML = courses.map(course => `
    <div class="course-card" onclick="selectCourse('${course.id}')">
      <div class="course-card-header">
        <div class="course-card-header-icon">${course.icon || '📚'}</div>
        <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
        <p class="course-card-meta">${course.level || 'Начинающий'} • ${course.duration || '36ч'}</p>
      </div>
      <div class="course-card-body">
        <p class="course-card-description">${escapeHtml(course.description || '')}</p>
        <div class="course-card-stats">
          <span>📖 ${course.lessons || 18} уроков</span>
          <span>👤 ${escapeHtml(course.author || 'Эврика')}</span>
        </div>
      </div>
    </div>
  `).join('');
}

window.selectCourse = function(courseId) {
  currentCourse = courses.find(c => c.id === courseId) || demoCourse;
  const container = document.getElementById('course-detail-container');
  if (!container) return;
  
  const completedLessons = window.userProgress?.completedLessons || [];
  const lessonsList = getLessonsList();
  
  container.innerHTML = `
    <div class="mb-4"><button class="btn-secondary" onclick="showPage('courses')">← Назад к курсам</button></div>
    <div style="margin-bottom: 2rem;">
      <div style="font-size: 4rem;">${currentCourse.icon || '💻'}</div>
      <h1 class="section-title" style="margin-top: 1rem;">${escapeHtml(currentCourse.title)}</h1>
      <p style="color: var(--on-surface-variant);">${escapeHtml(currentCourse.description)}</p>
      <div style="display: flex; gap: 2rem; margin-top: 1rem; flex-wrap: wrap;">
        <span>📖 ${currentCourse.lessons || 18} уроков</span>
        <span>⏱️ ${currentCourse.duration || '36 часов'}</span>
        <span>📊 ${currentCourse.level || 'Начинающий'}</span>
      </div>
    </div>
    <h2 style="font-family: Manrope; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem;">Уроки курса (18 уроков по 2 часа)</h2>
    <div class="lessons-list">
      ${lessonsList.map((lesson, idx) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isLocked = idx > 0 && !completedLessons.includes(lessonsList[idx - 1]?.id);
        const canAccess = isCompleted || idx === 0 || completedLessons.includes(lessonsList[idx - 1]?.id);
        
        return `
          <div class="lesson-item" onclick="${canAccess ? `startLesson('${lesson.id}')` : ''}" style="${!canAccess ? 'opacity: 0.6; cursor: not-allowed;' : ''}">
            <div class="lesson-left">
              <div class="lesson-number">${idx + 1}</div>
              <div>
                <div class="lesson-title">${escapeHtml(lesson.title)}</div>
                <div class="lesson-duration">${lesson.duration}</div>
              </div>
            </div>
            <div class="lesson-status ${isCompleted ? 'completed' : (isLocked ? 'locked' : '')}">
              ${isCompleted ? '✓ Пройден' : (isLocked ? '🔒 Заблокирован' : '▶ Начать')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  showPage('course-detail');
};

function getLessonsList() {
  return [
    { id: 'lesson-1', title: 'Введение в Java', duration: '2 часа' },
    { id: 'lesson-2', title: 'Переменные и примитивные типы', duration: '2 часа' },
    { id: 'lesson-3', title: 'Операторы в Java', duration: '2 часа' },
    { id: 'lesson-4', title: 'Условные операторы и циклы', duration: '2 часа' },
    { id: 'lesson-5', title: 'Массивы', duration: '2 часа' },
    { id: 'lesson-6', title: 'Строки (String, StringBuilder)', duration: '2 часа' },
    { id: 'lesson-7', title: 'Методы', duration: '2 часа' },
    { id: 'lesson-8', title: 'Классы, объекты и конструкторы', duration: '2 часа' },
    { id: 'lesson-9', title: 'Наследование и полиморфизм', duration: '2 часа' },
    { id: 'lesson-10', title: 'Абстрактные классы и интерфейсы', duration: '2 часа' },
    { id: 'lesson-11', title: 'Исключения', duration: '2 часа' },
    { id: 'lesson-12', title: 'Generics (Обобщения)', duration: '2 часа' },
    { id: 'lesson-13', title: 'Коллекции', duration: '2 часа' },
    { id: 'lesson-14', title: 'Stream API и лямбды', duration: '2 часа' },
    { id: 'lesson-15', title: 'Многопоточность', duration: '2 часа' },
    { id: 'lesson-16', title: 'Работа с датой и временем', duration: '2 часа' },
    { id: 'lesson-17', title: 'Ввод-вывод (I/O и NIO)', duration: '2 часа' },
    { id: 'lesson-18', title: 'Аннотации и рефлексия', duration: '2 часа' }
  ];
}

function openCreateCourseModal() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  const modal = document.getElementById('create-course-modal');
  if (modal) modal.classList.add('active');
}

window.closeCreateCourseModal = function() {
  const modal = document.getElementById('create-course-modal');
  if (modal) modal.classList.remove('active');
};

window.setVisibility = function(value) {
  document.querySelectorAll('.visibility-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.value === value);
  });
  const visibilityInput = document.getElementById('course-visibility');
  if (visibilityInput) visibilityInput.value = value;
};

async function createCourse() {
  if (!currentUser) return;
  
  const courseData = {
    title: document.getElementById('course-title')?.value,
    description: document.getElementById('course-description')?.value,
    icon: document.getElementById('course-icon')?.value || '📚',
    level: document.getElementById('course-level')?.value,
    visibility: document.getElementById('course-visibility')?.value,
    authorId: currentUser.uid,
    author: window.userData?.name || currentUser.displayName || currentUser.email,
    lessons: 0,
    createdAt: new Date()
  };
  
  if (!courseData.title) {
    showNotification('Введите название курса', 'error');
    return;
  }
  
  try {
    const docRef = await db.collection('courses').add(courseData);
    courses.push({ id: docRef.id, ...courseData });
    renderCourses();
    closeCreateCourseModal();
    showNotification('Курс успешно создан!', 'success');
  } catch (error) {
    console.error('Ошибка создания курса:', error);
    showNotification('Ошибка создания курса', 'error');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
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
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const createCourseBtn = document.getElementById('create-course-btn');
  if (createCourseBtn) createCourseBtn.addEventListener('click', openCreateCourseModal);
  
  const createSubmit = document.getElementById('create-course-submit');
  if (createSubmit) createSubmit.addEventListener('click', createCourse);
  
  loadCourses();
});
