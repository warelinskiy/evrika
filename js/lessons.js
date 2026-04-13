// ============================================
// МОДУЛЬ УРОКОВ
// ============================================

let currentLesson = null;

function getLessonContent(lessonId) {
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
        <li>Безопасность и многопоточность</li>
      </ul>
      <h2>Пример первой программы:</h2>
      <pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>
      <p>Java используется для разработки веб-приложений, мобильных приложений (Android), корпоративного ПО, игр и многого другого.</p>
    `,
    'lesson-2': `
      <h1>Переменные и примитивные типы данных</h1>
      <p>В Java существует 8 примитивных типов данных: byte, short, int, long, float, double, char, boolean.</p>
      <h2>Целочисленные типы:</h2>
      <ul>
        <li>byte (8 бит): от -128 до 127</li>
        <li>short (16 бит): от -32,768 до 32,767</li>
        <li>int (32 бит): от -2³¹ до 2³¹-1</li>
        <li>long (64 бит): от -2⁶³ до 2⁶³-1</li>
      </ul>
      <h2>Примеры объявления переменных:</h2>
      <pre><code>int age = 25;
double price = 19.99;
char grade = 'A';
boolean isActive = true;
String name = "Java";</code></pre>
    `
  };
  
  // Заполняем остальные уроки
  for (let i = 3; i <= 18; i++) {
    if (!lessonsContent[`lesson-${i}`]) {
      lessonsContent[`lesson-${i}`] = `
        <h1>Урок ${i}: Продвинутые темы Java</h1>
        <p>Этот урок покрывает важные концепции Java программирования.</p>
        <h2>Ключевые темы урока:</h2>
        <ul>
          <li>Теоретические основы</li>
          <li>Практические примеры кода</li>
          <li>Типичные ошибки и их решение</li>
          <li>Лучшие практики</li>
        </ul>
        <p>После завершения урока вы сможете применять полученные знания на практике.</p>
        <h2>Пример кода:</h2>
        <pre><code>public class Example {
    public static void main(String[] args) {
        System.out.println("Урок ${i} пройден!");
    }
}</code></pre>
      `;
    }
  }
  
  return lessonsContent[lessonId] || `<h1>Урок</h1><p>Содержание урока загружается...</p>`;
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
      <div style="margin-top: 2rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-sm); text-align: center;">
        ✓ Урок пройден!
      </div>
    `}
  `;
  showPage('lesson-detail');
};

window.completeLesson = async function(lessonId) {
  await saveProgress('java-basic', lessonId);
  showNotification('Урок пройден! Отличная работа!', 'success');
  
  // Находим следующий урок
  const lessonsList = getLessonsList();
  const currentIndex = lessonsList.findIndex(l => l.id === lessonId);
  const nextLesson = lessonsList[currentIndex + 1];
  
  if (nextLesson) {
    startLesson(nextLesson.id);
  } else {
    showPage('course-detail');
  }
};
