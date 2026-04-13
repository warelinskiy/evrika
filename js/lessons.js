// ============================================
// МОДУЛЬ УРОКОВ
// ============================================

let currentLesson = null;

function getLessonContent(lessonId) {
  return `
    <h1>Урок по Java</h1>
    <p>Этот урок познакомит вас с основами Java программирования.</p>
    <h2>Ключевые темы:</h2>
    <ul>
      <li>Основные понятия и терминология</li>
      <li>Практические примеры кода</li>
      <li>Типичные ошибки и их решение</li>
    </ul>
    <h2>Пример кода:</h2>
    <pre><code>public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}</code></pre>
    <p>После завершения урока вы сможете применить полученные знания на практике.</p>
  `;
}

window.startLesson = function(lessonId) {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  
  const lessonsList = getLessonsList();
  currentLesson = lessonsList.find(l => l.id === lessonId);
  if (!currentLesson) return;
  
  const content = getLessonContent(lessonId);
  const completedLessons = window.userProgress?.completedLessons || [];
  const isCompleted = completedLessons.includes(lessonId);
  
  const container = document.getElementById('lesson-detail-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="mb-4"><button class="btn-secondary" onclick="selectCourse('java-basic')">← Назад к курсу</button></div>
    <div class="lesson-content">${content}</div>
    ${!isCompleted ? `
      <div style="margin-top: 2rem; text-align: center;">
        <button class="btn-primary" onclick="completeLesson('${lessonId}')">✓ Завершить урок</button>
      </div>
    ` : `
      <div style="margin-top: 2rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 1rem; text-align: center;">
        ✓ Урок пройден!
      </div>
    `}
  `;
  showPage('lesson-detail');
};

window.completeLesson = async function(lessonId) {
  await saveProgress('java-basic', lessonId);
  showNotification('Урок пройден! Отличная работа!', 'success');
  
  const lessonsList = getLessonsList();
  const currentIndex = lessonsList.findIndex(l => l.id === lessonId);
  const nextLesson = lessonsList[currentIndex + 1];
  
  if (nextLesson) {
    startLesson(nextLesson.id);
  } else {
    showPage('course-detail');
  }
};
