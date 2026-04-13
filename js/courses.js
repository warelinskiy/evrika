// ============================================
// МОДУЛЬ УПРАВЛЕНИЯ КУРСАМИ
// ============================================

let courses = [];
let currentCourse = null;
let currentLesson = null;

// Загрузка курсов из Firestore
async function loadCourses() {
  try {
    const snapshot = await db.collection('courses').where('visibility', 'in', ['public', 'link']).get();
    courses = [];
    snapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    renderCourses();
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error);
    // Демо-данные для тестирования
    courses = getDemoCourses();
    renderCourses();
  }
}

// Демо-курсы
function getDemoCourses() {
  return [
    {
      id: 'java-basic',
      title: 'Java с нуля до профессионала',
      description: 'Полный курс по Java с нуля до уверенного уровня. 18 уроков, 30 тестов, практические задания.',
      icon: '💻',
      lessons: 18,
      duration: '36 часов',
      level: 'Начинающий',
      author: 'Эврика',
      visibility: 'public'
    }
  ];
}

// Рендер курсов
function renderCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;
  
  container.innerHTML = courses.map(course => `
    <div class="course-card" onclick="selectCourse('${course.id}')">
      <div class="course-card-header">
        <div class="course-card-header-icon">${course.icon || '📚'}</div>
        <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
        <p class="course-card-meta">${course.level || 'Средний'} • ${course.duration || '36ч'}</p>
      </div>
      <div class="course-card-body">
        <p class="course-card-description">${escapeHtml(course.description || '')}</p>
        <div class="course-card-stats">
          <span>📖 ${course.lessons || 0} уроков</span>
          <span>👤 ${escapeHtml(course.author || 'Эврика')}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Выбор курса
function selectCourse(courseId) {
  currentCourse = courses.find(c => c.id === courseId);
  if (currentCourse) {
    showPage('course-detail');
    renderCourseDetail();
  }
}

// Рендер деталей курса
function renderCourseDetail() {
  if (!currentCourse) return;
  
  const container = document.getElementById('course-detail-container');
  if (!container) return;
  
  const completedLessons = window.userProgress?.completedLessons || [];
  const lessons = getLessonsForCourse(currentCourse.id);
  
  container.innerHTML = `
    <div class="mb-8">
      <button class="btn-secondary" onclick="showPage('courses')">← Назад к курсам</button>
    </div>
    <div class="course-detail-header" style="margin-bottom: 2rem;">
      <div class="course-detail-icon" style="font-size: 4rem;">${currentCourse.icon || '📚'}</div>
      <h1 class="section-title" style="margin-top: 1rem;">${escapeHtml(currentCourse.title)}</h1>
      <p class="section-subtitle">${escapeHtml(currentCourse.description)}</p>
      <div class="course-stats" style="display: flex; gap: 2rem; margin-top: 1rem;">
        <span>📖 ${lessons.length} уроков</span>
        <span>⏱️ ${currentCourse.duration || '36 часов'}</span>
        <span>📊 ${currentCourse.level || 'Начинающий'}</span>
      </div>
    </div>
    
    <h2 class="settings-section-title">Уроки курса</h2>
    <div class="lessons-list">
      ${lessons.map((lesson, index) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isLocked = index > 0 && !completedLessons.includes(lessons[index - 1]?.id);
        const canAccess = isCompleted || index === 0 || completedLessons.includes(lessons[index - 1]?.id);
        
        return `
          <div class="lesson-item ${isCompleted ? 'completed' : ''}" 
               onclick="${canAccess ? `startLesson('${lesson.id}')` : ''}"
               style="${!canAccess ? 'opacity: 0.6; cursor: not-allowed;' : ''}">
            <div class="lesson-info">
              <div class="lesson-number">${index + 1}</div>
              <div>
                <div class="lesson-title">${escapeHtml(lesson.title)}</div>
                <div class="lesson-duration">${lesson.duration || '2 часа'} • ${lesson.hasTest ? '30 тестов' : 'Теория'}</div>
              </div>
            </div>
            <div class="lesson-status ${isCompleted ? 'completed' : (isLocked ? 'locked' : '')}">
              ${isCompleted ? '✓ Пройден' : (isLocked ? '🔒 Заблокирован' : '▶ Начать')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
    
    ${currentCourse.author === 'Эврика' ? '' : `
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--surface-low); border-radius: var(--radius-sm);">
        <h3>О авторе</h3>
        <p>${escapeHtml(currentCourse.author || '')}</p>
      </div>
    `}
  `;
}

// Получение уроков для курса
function getLessonsForCourse(courseId) {
  if (courseId === 'java-basic') {
    return javaLessons;
  }
  return [];
}

// Уроки Java (18 уроков)
const javaLessons = [
  { id: 'java-lesson-1', title: 'Введение в Java', duration: '2 часа', hasTest: true, order: 1 },
  { id: 'java-lesson-2', title: 'Переменные и примитивные типы', duration: '2 часа', hasTest: true, order: 2 },
  { id: 'java-lesson-3', title: 'Операторы в Java', duration: '2 часа', hasTest: true, order: 3 },
  { id: 'java-lesson-4', title: 'Условные операторы и циклы', duration: '2 часа', hasTest: true, order: 4 },
  { id: 'java-lesson-5', title: 'Массивы', duration: '2 часа', hasTest: true, order: 5 },
  { id: 'java-lesson-6', title: 'Строки (String, StringBuilder)', duration: '2 часа', hasTest: true, order: 6 },
  { id: 'java-lesson-7', title: 'Методы', duration: '2 часа', hasTest: true, order: 7 },
  { id: 'java-lesson-8', title: 'Классы, объекты и конструкторы', duration: '2 часа', hasTest: true, order: 8 },
  { id: 'java-lesson-9', title: 'Наследование и полиморфизм', duration: '2 часа', hasTest: true, order: 9 },
  { id: 'java-lesson-10', title: 'Абстрактные классы и интерфейсы', duration: '2 часа', hasTest: true, order: 10 },
  { id: 'java-lesson-11', title: 'Исключения', duration: '2 часа', hasTest: true, order: 11 },
  { id: 'java-lesson-12', title: 'Generics (Обобщения)', duration: '2 часа', hasTest: true, order: 12 },
  { id: 'java-lesson-13', title: 'Коллекции', duration: '2 часа', hasTest: true, order: 13 },
  { id: 'java-lesson-14', title: 'Stream API и лямбды', duration: '2 часа', hasTest: true, order: 14 },
  { id: 'java-lesson-15', title: 'Многопоточность', duration: '2 часа', hasTest: true, order: 15 },
  { id: 'java-lesson-16', title: 'Работа с датой и временем', duration: '2 часа', hasTest: true, order: 16 },
  { id: 'java-lesson-17', title: 'Ввод-вывод (I/O и NIO)', duration: '2 часа', hasTest: true, order: 17 },
  { id: 'java-lesson-18', title: 'Аннотации и рефлексия', duration: '2 часа', hasTest: true, order: 18 }
];

// Открытие модального окна создания курса
function openCreateCourseModal() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  document.getElementById('create-course-modal').classList.add('active');
}

function closeCreateCourseModal() {
  document.getElementById('create-course-modal').classList.remove('active');
}

// Создание курса
async function createCourse(courseData) {
  if (!currentUser) return;
  
  try {
    const newCourse = {
      ...courseData,
      authorId: currentUser.uid,
      author: currentUser.displayName || currentUser.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lessons: 0,
      enrolled: 0
    };
    
    const docRef = await db.collection('courses').add(newCourse);
    courses.push({ id: docRef.id, ...newCourse });
    renderCourses();
    closeCreateCourseModal();
    showNotification('Курс успешно создан!', 'success');
  } catch (error) {
    console.error('Ошибка создания курса:', error);
    showNotification('Ошибка создания курса', 'error');
  }
}

// Настройка видимости курса
function setVisibility(value) {
  document.querySelectorAll('.visibility-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.value === value);
  });
  document.getElementById('course-visibility').value = value;
}

// Показ уведомления
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