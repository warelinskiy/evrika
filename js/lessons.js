// ============================================
// МОДУЛЬ УРОКОВ
// ============================================

let currentLesson = null;

const lessonsContent = {
  'lesson-1': `
    <h1>Введение в Java</h1>
    <p>Java — это объектно-ориентированный язык программирования, разработанный компанией Sun Microsystems. Он был создан Джеймсом Гослингом и впервые выпущен в 1995 году.</p>
    <h2>Ключевые особенности Java:</h2>
    <ul>
      <li>Платформонезависимость (Write Once, Run Anywhere)</li>
      <li>Объектно-ориентированный подход</li>
      <li>Автоматическое управление памятью (Garbage Collection)</li>
      <li>Богатая стандартная библиотека</li>
    </ul>
    <h2>Пример первой программы:</h2>
    <pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>
  `,
  'lesson-2': `
    <h1>Переменные и примитивные типы данных</h1>
    <p>В Java существует 8 примитивных типов данных: byte, short, int, long, float, double, char, boolean.</p>
    <h2>Примеры:</h2>
    <pre><code>int age = 25;
double price = 19.99;
char grade = 'A';
boolean isActive = true;
String name = "Java";</code></pre>
  `
};

function getLessonContent(lessonId) {
  if (lessonsContent[lessonId]) return lessonsContent[lessonId];
  
  const lessonNum = lessonId.split('-')[1];
  return `
    <h1>Урок ${lessonNum}: Продвинутые темы Java</h1>
    <p>Этот урок покрывает важные концепции Java программирования.</p>
    <h2>Ключевые темы:</h2>
    <ul>
      <li>Теоретические основы</li>
      <li>Практические примеры кода</li>
      <li>Типичные ошибки и их решение</li>
    </ul>
    <h2>Пример кода:</h2>
    <pre><code>public class Example {
    public static void main(String[] args) {
        System.out.println("Урок ${lessonNum} пройден!");
    }
}</code></pre>
  `;
}

window.startLesson = function(lessonId) {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  
  const lesson = lessonsList.find(l => l.id === lessonId);
  if (!lesson) return;
  currentLesson = lesson;
  
  const content = getLessonContent(lessonId);
  const completedLessons = window.userProgress?.completedLessons || [];
  const isCompleted = completedLessons.includes(lessonId);
  
  const container = document.getElementById('lesson-detail-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="mb-4"><button class="btn-secondary" onclick="showPage('course-detail')">← Назад к курсу</button></div>
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
  
  const currentIndex = lessonsList.findIndex(l => l.id === lessonId);
  const nextLesson = lessonsList[currentIndex + 1];
  
  if (nextLesson) {
    startLesson(nextLesson.id);
  } else {
    showNotification('Поздравляем! Вы прошли весь курс!', 'success');
    showPage('course-detail');
  }
};
