// ============================================
// МОДУЛЬ КУРСОВ
// ============================================

let courses = [];
let currentCourse = null;

// Демо-курс
const DEMO_COURSE = {
  id: 'java-basic',
  title: 'Java с нуля до профессионала',
  description: 'Полный курс по Java с нуля до уверенного уровня. 18 уроков, практические задания, 30 тестов. После прохождения курса вы сможете уверенно писать на Java и проходить собеседования.',
  icon: '💻',
  lessonsCount: 18,
  duration: '36 часов',
  level: 'Начинающий',
  author: 'Эврика',
  rating: 4.9,
  studentsCount: 15234,
  tags: ['Java', 'ООП', 'Алгоритмы']
};

// Список уроков
const LESSONS_LIST = [
  { id: 'lesson-1', title: 'Введение в Java', duration: '2 часа', description: 'История Java, установка JDK, первая программа' },
  { id: 'lesson-2', title: 'Переменные и примитивные типы', duration: '2 часа', description: 'Типы данных, объявление переменных, литералы' },
  { id: 'lesson-3', title: 'Операторы в Java', duration: '2 часа', description: 'Арифметические, логические, побитовые операторы' },
  { id: 'lesson-4', title: 'Условные операторы и циклы', duration: '2 часа', description: 'if-else, switch, for, while, do-while' },
  { id: 'lesson-5', title: 'Массивы', duration: '2 часа', description: 'Одномерные и многомерные массивы' },
  { id: 'lesson-6', title: 'Строки (String, StringBuilder)', duration: '2 часа', description: 'Работа со строками, методы String' },
  { id: 'lesson-7', title: 'Методы', duration: '2 часа', description: 'Создание и вызов методов, перегрузка' },
  { id: 'lesson-8', title: 'Классы, объекты и конструкторы', duration: '2 часа', description: 'ООП, создание классов, конструкторы' },
  { id: 'lesson-9', title: 'Наследование и полиморфизм', duration: '2 часа', description: 'extends, super, переопределение методов' },
  { id: 'lesson-10', title: 'Абстрактные классы и интерфейсы', duration: '2 часа', description: 'abstract, interface, implements' },
  { id: 'lesson-11', title: 'Исключения', duration: '2 часа', description: 'try-catch-finally, throw, throws' },
  { id: 'lesson-12', title: 'Generics (Обобщения)', duration: '2 часа', description: 'Обобщенные классы, методы, wildcards' },
  { id: 'lesson-13', title: 'Коллекции', duration: '2 часа', description: 'List, Set, Map, ArrayList, HashMap' },
  { id: 'lesson-14', title: 'Stream API и лямбды', duration: '2 часа', description: 'Функциональное программирование в Java' },
  { id: 'lesson-15', title: 'Многопоточность', duration: '2 часа', description: 'Thread, Runnable, synchronized' },
  { id: 'lesson-16', title: 'Работа с датой и временем', duration: '2 часа', description: 'LocalDate, LocalTime, DateTimeFormatter' },
  { id: 'lesson-17', title: 'Ввод-вывод (I/O и NIO)', duration: '2 часа', description: 'Файлы, потоки, сериализация' },
  { id: 'lesson-18', title: 'Аннотации и рефлексия', duration: '2 часа', description: 'Создание аннотаций, Reflection API' }
];

// Загрузка курсов
window.loadCourses = function() {
  const container = document.getElementById('courses-container');
  if (!container) return;
  
  courses = [DEMO_COURSE];
  
  container.innerHTML = courses.map(course => `
    <div class="course-card" onclick="selectCourse('${course.id}')">
      <div class="course-card-header">
        <div class="course-card-header-icon">${course.icon}</div>
        <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
        <div class="course-card-rating">
          ${renderStars(course.rating)}
          <span class="course-card-students">${course.studentsCount}+ студентов</span>
        </div>
      </div>
      <div class="course-card-body">
        <p class="course-card-description">${escapeHtml(course.description)}</p>
        <div class="course-card-tags">
          ${course.tags.map(tag => `<span class="course-tag">${tag}</span>`).join('')}
        </div>
        <div class="course-card-stats">
          <span>📖 ${course.lessonsCount} уроков</span>
          <span>⏱️ ${course.duration}</span>
          <span>📊 ${course.level}</span>
          <span>👤 ${course.author}</span>
        </div>
      </div>
    </div>
  `).join('');
};

// Рендер звезд рейтинга
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '<span class="star filled">★</span>';
  if (hasHalfStar) stars += '<span class="star half">½</span>';
  while (stars.length / 18 < 5) stars += '<span class="star">☆</span>';
  return `<div class="course-rating">${stars} <span class="rating-value">${rating}</span></div>`;
}

// Выбор курса
window.selectCourse = function(courseId) {
  currentCourse = DEMO_COURSE;
  const container = document.getElementById('course-detail-container');
  if (!container) return;
  
  const completedLessons = window.userProgress?.completedLessons || [];
  const completedCount = completedLessons.length;
  const progressPercentage = Math.round((completedCount / LESSONS_LIST.length) * 100);
  
  container.innerHTML = `
    <div class="course-detail-header">
      <button class="btn-secondary back-btn" onclick="showPage('courses')">
        <span class="material-symbols-outlined">arrow_back</span> Назад к курсам
      </button>
    </div>
    
    <div class="course-detail-content">
      <div class="course-detail-info">
        <div class="course-detail-icon">${currentCourse.icon}</div>
        <h1 class="course-detail-title">${escapeHtml(currentCourse.title)}</h1>
        <p class="course-detail-description">${escapeHtml(currentCourse.description)}</p>
        
        <div class="course-detail-meta">
          <div class="meta-item">
            <span class="material-symbols-outlined">menu_book</span>
            <span>${currentCourse.lessonsCount} уроков</span>
          </div>
          <div class="meta-item">
            <span class="material-symbols-outlined">schedule</span>
            <span>${currentCourse.duration}</span>
          </div>
          <div class="meta-item">
            <span class="material-symbols-outlined">signal_cellular_alt</span>
            <span>${currentCourse.level}</span>
          </div>
          <div class="meta-item">
            <span class="material-symbols-outlined">person</span>
            <span>${currentCourse.author}</span>
          </div>
        </div>
        
        <div class="course-progress">
          <div class="course-progress-header">
            <span>Ваш прогресс</span>
            <span class="course-progress-percent">${progressPercentage}%</span>
          </div>
          <div class="course-progress-bar">
            <div class="course-progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="course-progress-text">Пройдено ${completedCount} из ${LESSONS_LIST.length} уроков</div>
        </div>
      </div>
      
      <div class="course-lessons">
        <h2 class="lessons-title">Содержание курса</h2>
        <div class="lessons-list">
          ${LESSONS_LIST.map((lesson, idx) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = idx > 0 && !completedLessons.includes(LESSONS_LIST[idx - 1]?.id);
            const canAccess = isCompleted || idx === 0 || completedLessons.includes(LESSONS_LIST[idx - 1]?.id);
            
            return `
              <div class="lesson-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}" 
                   onclick="${canAccess ? `startLesson('${lesson.id}')` : ''}">
                <div class="lesson-left">
                  <div class="lesson-number">${idx + 1}</div>
                  <div class="lesson-info">
                    <div class="lesson-title">${escapeHtml(lesson.title)}</div>
                    <div class="lesson-meta">
                      <span class="lesson-duration">⏱️ ${lesson.duration}</span>
                      <span class="lesson-description">${escapeHtml(lesson.description)}</span>
                    </div>
                  </div>
                </div>
                <div class="lesson-right">
                  ${isCompleted ? 
                    '<span class="lesson-status completed">✓ Пройден</span>' : 
                    (isLocked ? 
                      '<span class="lesson-status locked">🔒 Заблокирован</span>' : 
                      '<span class="lesson-status available">▶ Начать</span>'
                    )
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  showPage('course-detail');
};

// Создание курса
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

async function createCourse() {
  if (!currentUser) return;
  
  const courseData = {
    title: document.getElementById('course-title')?.value.trim(),
    description: document.getElementById('course-description')?.value.trim(),
    icon: document.getElementById('course-icon')?.value || '📚',
    level: document.getElementById('course-level')?.value,
    visibility: document.getElementById('course-visibility')?.value,
    authorId: currentUser.uid,
    author: window.userData?.name || currentUser.displayName || currentUser.email,
    lessons: 0,
    createdAt: new Date(),
    rating: 0,
    studentsCount: 0
  };
  
  if (!courseData.title) {
    showNotification('Введите название курса', 'error');
    return;
  }
  
  try {
    const docRef = await db.collection('courses').add(courseData);
    courses.push({ id: docRef.id, ...courseData });
    loadCourses();
    closeCreateCourseModal();
    showNotification('Курс успешно создан!', 'success');
    
    // Очищаем форму
    document.getElementById('course-title').value = '';
    document.getElementById('course-description').value = '';
    document.getElementById('course-icon').value = '';
  } catch (error) {
    console.error('Ошибка создания курса:', error);
    showNotification('Ошибка создания курса', 'error');
  }
}

// Добавляем стили для курсов
const coursesStyles = document.createElement('style');
coursesStyles.textContent = `
  .course-card-rating {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .course-rating {
    display: flex;
    align-items: center;
    gap: 0.125rem;
  }
  .star {
    color: #fbbf24;
    font-size: 0.875rem;
  }
  .star.filled, .star.half {
    color: #f59e0b;
  }
  .rating-value {
    font-size: 0.75rem;
    color: var(--on-surface-variant);
    margin-left: 0.25rem;
  }
  .course-card-students {
    font-size: 0.7rem;
    color: var(--on-surface-variant);
  }
  .course-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  .course-tag {
    font-size: 0.7rem;
    padding: 0.125rem 0.5rem;
    background: var(--surface-high);
    border-radius: 0.5rem;
    color: var(--on-surface-variant);
  }
  .course-detail-header {
    margin-bottom: 2rem;
  }
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .course-detail-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }
  @media (max-width: 968px) {
    .course-detail-content {
      grid-template-columns: 1fr;
    }
  }
  .course-detail-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  .course-detail-title {
    font-family: 'Manrope', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  .course-detail-description {
    color: var(--on-surface-variant);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  .course-detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--on-surface-variant);
  }
  .meta-item .material-symbols-outlined {
    font-size: 1.125rem;
  }
  .course-progress {
    background: var(--surface-low);
    border-radius: 1rem;
    padding: 1rem;
  }
  .course-progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }
  .course-progress-percent {
    color: var(--primary);
  }
  .course-progress-bar {
    height: 8px;
    background: var(--surface-container);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  .course-progress-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  .course-progress-text {
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }
  .lessons-title {
    font-family: 'Manrope', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  .lesson-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .lesson-description {
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }
  .lesson-status.available {
    color: var(--primary);
  }
  .lesson-item.locked {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .lesson-item.locked .lesson-status {
    color: var(--on-surface-variant);
  }
`;
document.head.appendChild(coursesStyles);

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log('📚 Инициализация модуля курсов');
  
  const createCourseBtn = document.getElementById('create-course-btn');
  if (createCourseBtn) {
    createCourseBtn.addEventListener('click', openCreateCourseModal);
  }
  
  const createSubmit = document.getElementById('create-course-submit');
  if (createSubmit) {
    createSubmit.addEventListener('click', createCourse);
  }
  
  loadCourses();
});

console.log('📚 Модуль курсов загружен');
