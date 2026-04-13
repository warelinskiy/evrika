// ============================================
// МОДУЛЬ УРОКОВ И ТЕСТОВ
// ============================================

let currentLesson = null;
let currentTest = null;
let currentTestIndex = 0;
let testAnswers = [];
let testStarted = false;

// Контент уроков
const LESSONS_CONTENT = {
  'lesson-1': `
    <h1>Введение в Java</h1>
    <p>Java — это объектно-ориентированный язык программирования, разработанный компанией Sun Microsystems (ныне Oracle). Он был создан Джеймсом Гослингом и впервые выпущен в 1995 году.</p>
    
    <h2>История создания</h2>
    <p>Изначально язык назывался Oak (Дуб) и разрабатывался для бытовых электронных устройств. Позже был переименован в Java в честь сорта кофе Java, который пили разработчики.</p>
    
    <h2>Ключевые особенности Java:</h2>
    <ul>
      <li><strong>Платформонезависимость (Write Once, Run Anywhere)</strong> — программа на Java компилируется в байт-код, который выполняется на Java Virtual Machine (JVM)</li>
      <li><strong>Объектно-ориентированный подход</strong> — все является объектами (кроме примитивов)</li>
      <li><strong>Автоматическое управление памятью (Garbage Collection)</strong> — JVM сама удаляет неиспользуемые объекты</li>
      <li><strong>Богатая стандартная библиотека</strong> — огромное количество готовых классов и методов</li>
      <li><strong>Безопасность и многопоточность</strong> — встроенная поддержка многопоточного программирования</li>
    </ul>
    
    <h2>Пример первой программы:</h2>
    <pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>
    
    <div class="lesson-tip">
      <span class="material-symbols-outlined">lightbulb</span>
      <div>
        <strong>Совет:</strong> Имя файла должно совпадать с именем public класса. Для HelloWorld файл должен называться HelloWorld.java
      </div>
    </div>
  `,
  'lesson-2': `
    <h1>Переменные и примитивные типы данных</h1>
    <p>В Java существует 8 примитивных типов данных, которые хранят значения непосредственно в памяти.</p>
    
    <h2>Целочисленные типы:</h2>
    <table class="lesson-table">
      <tr><th>Тип</th><th>Размер</th><th>Диапазон</th></tr>
      <tr><td>byte</td><td>8 бит</td><td>-128 до 127</td></tr>
      <tr><td>short</td><td>16 бит</td><td>-32,768 до 32,767</td></tr>
      <tr><td>int</td><td>32 бит</td><td>-2³¹ до 2³¹-1</td></tr>
      <tr><td>long</td><td>64 бит</td><td>-2⁶³ до 2⁶³-1</td></tr>
    </table>
    
    <h2>Типы с плавающей точкой:</h2>
    <table class="lesson-table">
      <tr><th>Тип</th><th>Размер</th><th>Точность</th></tr>
      <tr><td>float</td><td>32 бит</td><td>~6-7 знаков</td></tr>
      <tr><td>double</td><td>64 бит</td><td>~15 знаков</td></tr>
    </table>
    
    <h2>Примеры объявления переменных:</h2>
    <pre><code>int age = 25;
double price = 19.99;
char grade = 'A';
boolean isActive = true;
String name = "Java";  // String - ссылочный тип</code></pre>
    
    <div class="lesson-warning">
      <span class="material-symbols-outlined">warning</span>
      <div>
        <strong>Важно!</strong> Локальные переменные не имеют значений по умолчанию. Их нужно инициализировать перед использованием!
      </div>
    </div>
  `
};

// Получить контент урока
function getLessonContent(lessonId) {
  if (LESSONS_CONTENT[lessonId]) return LESSONS_CONTENT[lessonId];
  
  const lessonNum = lessonId.split('-')[1];
  return `
    <h1>Урок ${lessonNum}: Продвинутые темы Java</h1>
    <p>Этот урок покрывает важные концепции Java программирования, которые помогут вам стать профессиональным разработчиком.</p>
    
    <h2>Ключевые темы урока:</h2>
    <ul>
      <li>Теоретические основы с примерами</li>
      <li>Практические примеры кода</li>
      <li>Типичные ошибки и их решение</li>
      <li>Лучшие практики программирования</li>
      <li>Задания для самостоятельной работы</li>
    </ul>
    
    <h2>Пример кода:</h2>
    <pre><code>public class Lesson${lessonNum} {
    public static void main(String[] args) {
        System.out.println("Урок ${lessonNum} пройден!");
        
        // Пример работы с данными
        int result = 0;
        for (int i = 0; i < 10; i++) {
            result += i;
        }
        System.out.println("Результат: " + result);
    }
}</code></pre>
    
    <h2>Практическое задание:</h2>
    <p>Напишите программу, которая выводит все числа от 1 до 100, заменяя числа кратные 3 на "Fizz", кратные 5 на "Buzz", а кратные 3 и 5 на "FizzBuzz".</p>
    
    <div class="lesson-tip">
      <span class="material-symbols-outlined">code</span>
      <div>
        <strong>Подсказка:</strong> Используйте оператор % (остаток от деления) для проверки кратности и цикл for для перебора чисел.
      </div>
    </div>
  `;
}

// Начать урок
window.startLesson = function(lessonId) {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  
  const lesson = LESSONS_LIST.find(l => l.id === lessonId);
  if (!lesson) return;
  currentLesson = lesson;
  
  const content = getLessonContent(lessonId);
  const completedLessons = window.userProgress?.completedLessons || [];
  const isCompleted = completedLessons.includes(lessonId);
  
  const container = document.getElementById('lesson-detail-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="lesson-header">
      <button class="btn-secondary back-btn" onclick="showPage('course-detail')">
        <span class="material-symbols-outlined">arrow_back</span> Назад к курсу
      </button>
      <div class="lesson-progress">
        <span class="material-symbols-outlined">schedule</span>
        <span>${lesson.duration}</span>
      </div>
    </div>
    
    <div class="lesson-content-wrapper">
      <div class="lesson-content">${content}</div>
    </div>
    
    ${!isCompleted ? `
      <div class="lesson-actions">
        <button class="btn-primary complete-btn" onclick="completeLesson('${lessonId}')">
          <span class="material-symbols-outlined">check_circle</span> Завершить урок
        </button>
        <button class="btn-secondary" onclick="startTest('${lessonId}')">
          <span class="material-symbols-outlined">quiz</span> Пройти тест
        </button>
      </div>
    ` : `
      <div class="lesson-completed">
        <span class="material-symbols-outlined">verified</span>
        <div>
          <strong>Урок пройден!</strong>
          <p>Отличная работа! Переходите к следующему уроку.</p>
        </div>
      </div>
    `}
  `;
  
  showPage('lesson-detail');
};

// Завершить урок
window.completeLesson = async function(lessonId) {
  const success = await saveProgress('java-basic', lessonId);
  if (success) {
    showNotification('Урок пройден! Отличная работа!', 'success');
    
    const currentIndex = LESSONS_LIST.findIndex(l => l.id === lessonId);
    const nextLesson = LESSONS_LIST[currentIndex + 1];
    
    if (nextLesson) {
      setTimeout(() => startLesson(nextLesson.id), 1500);
    } else {
      showNotification('Поздравляем! Вы прошли весь курс!', 'success');
      setTimeout(() => showPage('course-detail'), 1500);
    }
  }
};

// Банк тестовых вопросов
const TEST_BANK = {
  'lesson-1': [
    {
      question: 'Кто создал язык программирования Java?',
      options: ['Бьерн Страуструп', 'Джеймс Гослинг', 'Деннис Ритчи', 'Гвидо ван Россум'],
      correct: 1
    },
    {
      question: 'Что такое JVM?',
      options: ['Java Virtual Machine', 'Java Variable Manager', 'Java Version Manager', 'Java Visual Machine'],
      correct: 0
    },
    {
      question: 'Какой принцип означает "Write Once, Run Anywhere"?',
      options: ['Кроссплатформенность', 'Объектно-ориентированность', 'Многопоточность', 'Безопасность'],
      correct: 0
    }
  ],
  'lesson-2': [
    {
      question: 'Какой тип данных в Java занимает 32 бита?',
      options: ['byte', 'short', 'int', 'long'],
      correct: 2
    },
    {
      question: 'Какое значение по умолчанию у переменной типа int?',
      options: ['null', '0', 'undefined', 'пустая строка'],
      correct: 1
    },
    {
      question: 'Какой суффикс нужно добавить к числу для типа long?',
      options: ['f', 'd', 'l', 'L'],
      correct: 3
    }
  ]
};

// Начать тест
window.startTest = function(lessonId) {
  const tests = TEST_BANK[lessonId];
  if (!tests || tests.length === 0) {
    showNotification('Тесты для этого урока еще не добавлены', 'info');
    return;
  }
  
  currentTest = tests;
  currentTestIndex = 0;
  testAnswers = [];
  testStarted = true;
  
  renderTestQuestion();
};

// Рендер текущего вопроса теста
function renderTestQuestion() {
  const container = document.getElementById('lesson-detail-container');
  if (!container) return;
  
  const question = currentTest[currentTestIndex];
  const progress = ((currentTestIndex + 1) / currentTest.length) * 100;
  
  container.innerHTML = `
    <div class="test-container">
      <div class="test-header">
        <button class="btn-secondary" onclick="cancelTest()">
          <span class="material-symbols-outlined">close</span> Выйти из теста
        </button>
        <div class="test-progress">
          <div class="test-progress-text">Вопрос ${currentTestIndex + 1} из ${currentTest.length}</div>
          <div class="test-progress-bar">
            <div class="test-progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>
      </div>
      
      <div class="test-question">
        <h3 class="test-question-text">${escapeHtml(question.question)}</h3>
        <div class="test-options">
          ${question.options.map((opt, idx) => `
            <label class="test-option ${testAnswers[currentTestIndex] === idx ? 'selected' : ''}" onclick="selectTestAnswer(${idx})">
              <span class="test-option-marker">${String.fromCharCode(65 + idx)}</span>
              <span class="test-option-text">${escapeHtml(opt)}</span>
              ${testAnswers[currentTestIndex] === idx ? '<span class="test-option-check">✓</span>' : ''}
            </label>
          `).join('')}
        </div>
      </div>
      
      <div class="test-actions">
        ${currentTestIndex > 0 ? `
          <button class="btn-secondary" onclick="previousQuestion()">
            <span class="material-symbols-outlined">arrow_back</span> Назад
          </button>
        ` : '<div></div>'}
        <button class="btn-primary" onclick="nextQuestion()">
          ${currentTestIndex === currentTest.length - 1 ? 'Завершить тест' : 'Далее'}
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

// Выбрать ответ
window.selectTestAnswer = function(index) {
  if (!testStarted) return;
  testAnswers[currentTestIndex] = index;
  renderTestQuestion();
};

// Предыдущий вопрос
window.previousQuestion = function() {
  if (currentTestIndex > 0) {
    currentTestIndex--;
    renderTestQuestion();
  }
};

// Следующий вопрос
window.nextQuestion = function() {
  if (testAnswers[currentTestIndex] === undefined) {
    showNotification('Пожалуйста, выберите ответ', 'warning');
    return;
  }
  
  if (currentTestIndex === currentTest.length - 1) {
    finishTest();
  } else {
    currentTestIndex++;
    renderTestQuestion();
  }
};

// Завершить тест
function finishTest() {
  let correctCount = 0;
  for (let i = 0; i < currentTest.length; i++) {
    if (testAnswers[i] === currentTest[i].correct) {
      correctCount++;
    }
  }
  
  const percentage = (correctCount / currentTest.length) * 100;
  const passed = percentage >= 70;
  
  const container = document.getElementById('lesson-detail-container');
  container.innerHTML = `
    <div class="test-result">
      <div class="test-result-icon">${passed ? '🎉' : '😔'}</div>
      <h2 class="test-result-title">${passed ? 'Поздравляем!' : 'Попробуйте еще раз'}</h2>
      <div class="test-result-score">${correctCount} / ${currentTest.length}</div>
      <div class="test-result-percent">${percentage.toFixed(1)}% правильных ответов</div>
      <p class="test-result-message">
        ${passed ? 'Вы успешно прошли тест! Урок отмечен как пройденный.' : 'Для прохождения теста необходимо набрать 70% правильных ответов.'}
      </p>
      <div class="test-result-actions">
        ${passed ? `
          <button class="btn-primary" onclick="completeLesson('${currentLesson?.id}')">
            Продолжить обучение
          </button>
        ` : `
          <button class="btn-primary" onclick="startTest('${currentLesson?.id}')">
            Попробовать снова
          </button>
          <button class="btn-secondary" onclick="showPage('course-detail')">
            Вернуться к курсу
          </button>
        `}
      </div>
    </div>
  `;
  
  if (passed && currentLesson) {
    saveProgress('java-basic', currentLesson.id);
  }
  
  testStarted = false;
}

// Отменить тест
window.cancelTest = function() {
  testStarted = false;
  if (currentLesson) {
    startLesson(currentLesson.id);
  } else {
    showPage('course-detail');
  }
};

// Добавляем стили для уроков
const lessonsStyles = document.createElement('style');
lessonsStyles.textContent = `
  .lesson-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .lesson-progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface-low);
    border-radius: 2rem;
    font-size: 0.875rem;
  }
  .lesson-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }
  .lesson-completed {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 1rem;
    margin-top: 2rem;
  }
  .lesson-completed .material-symbols-outlined {
    font-size: 2rem;
    color: #10b981;
  }
  .lesson-tip, .lesson-warning {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    margin: 1.5rem 0;
  }
  .lesson-tip {
    background: rgba(59, 130, 246, 0.1);
    border-left: 4px solid #3b82f6;
  }
  .lesson-warning {
    background: rgba(245, 158, 11, 0.1);
    border-left: 4px solid #f59e0b;
  }
  .lesson-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }
  .lesson-table th, .lesson-table td {
    padding: 0.75rem;
    border: 1px solid var(--surface-container);
    text-align: left;
  }
  .lesson-table th {
    background: var(--surface-low);
    font-weight: 600;
  }
  
  /* Test styles */
  .test-container {
    max-width: 800px;
    margin: 0 auto;
  }
  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .test-progress {
    flex: 1;
    max-width: 300px;
  }
  .test-progress-text {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  .test-progress-bar {
    height: 8px;
    background: var(--surface-container);
    border-radius: 4px;
    overflow: hidden;
  }
  .test-progress-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    transition: width 0.3s ease;
  }
  .test-question {
    background: var(--surface-lowest);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  .test-question-text {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .test-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .test-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface-low);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .test-option:hover {
    background: var(--surface-container);
  }
  .test-option.selected {
    background: rgba(123, 84, 0, 0.1);
    border: 1px solid var(--primary);
  }
  .test-option-marker {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-container);
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.875rem;
  }
  .test-option.selected .test-option-marker {
    background: var(--primary);
    color: white;
  }
  .test-option-text {
    flex: 1;
  }
  .test-option-check {
    color: var(--primary);
  }
  .test-actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .test-result {
    text-align: center;
    padding: 2rem;
  }
  .test-result-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  .test-result-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .test-result-score {
    font-size: 3rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  .test-result-percent {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  .test-result-message {
    color: var(--on-surface-variant);
    margin-bottom: 2rem;
  }
  .test-result-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
`;
document.head.appendChild(lessonsStyles);

console.log('📖 Модуль уроков загружен');
