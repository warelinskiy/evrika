// ============================================
// МОДУЛЬ УРОКОВ И ТЕСТОВ
// ============================================

let currentTest = null;
let currentTestIndex = 0;
let testAnswers = [];
let testScore = 0;
let testCompleted = false;

// Банк тестов (большой запас)
const testBank = {
  'java-lesson-1': generateTestsForLesson(1, 50),
  'java-lesson-2': generateTestsForLesson(2, 50),
  'java-lesson-3': generateTestsForLesson(3, 50),
  'java-lesson-4': generateTestsForLesson(4, 50),
  'java-lesson-5': generateTestsForLesson(5, 50),
  'java-lesson-6': generateTestsForLesson(6, 50),
  'java-lesson-7': generateTestsForLesson(7, 50),
  'java-lesson-8': generateTestsForLesson(8, 50),
  'java-lesson-9': generateTestsForLesson(9, 50),
  'java-lesson-10': generateTestsForLesson(10, 50),
  'java-lesson-11': generateTestsForLesson(11, 50),
  'java-lesson-12': generateTestsForLesson(12, 50),
  'java-lesson-13': generateTestsForLesson(13, 50),
  'java-lesson-14': generateTestsForLesson(14, 50),
  'java-lesson-15': generateTestsForLesson(15, 50),
  'java-lesson-16': generateTestsForLesson(16, 50),
  'java-lesson-17': generateTestsForLesson(17, 50),
  'java-lesson-18': generateTestsForLesson(18, 50)
};

// Генерация тестов для урока
function generateTestsForLesson(lessonNum, count) {
  const tests = [];
  const topics = {
    1: ['Java', 'JVM', 'JDK', 'IDE', 'Hello World', 'main method', 'System.out.println', 'comments', 'semicolons', 'case sensitivity'],
    2: ['int', 'double', 'boolean', 'char', 'byte', 'short', 'long', 'float', 'variable naming', 'initialization'],
    3: ['+', '-', '*', '/', '%', '++', '--', '==', '!=', '>', '<', '&&', '||', '!', '+=', 'instanceof'],
    4: ['if', 'else', 'switch', 'for', 'while', 'do-while', 'break', 'continue', 'nested loops', 'conditions'],
    5: ['array declaration', 'array initialization', 'index', 'length', 'multidimensional', 'jagged', 'ArrayIndexOutOfBounds', 'for-each', 'Arrays class', 'copy'],
    6: ['String', 'immutable', 'StringBuilder', 'StringBuffer', 'concat', 'substring', 'indexOf', 'equals', 'compareTo', 'split'],
    7: ['method signature', 'parameters', 'return type', 'overloading', 'static', 'void', 'recursion', 'varargs', 'pass by value', 'method chaining'],
    8: ['class', 'object', 'constructor', 'this', 'new', 'fields', 'methods', 'instance', 'default constructor', 'initialization blocks'],
    9: ['extends', 'super', 'overriding', 'polymorphism', 'dynamic binding', 'instanceof', 'casting', 'Object class', 'final methods', 'protected'],
    10: ['abstract', 'interface', 'implements', 'default methods', 'static methods', 'functional interface', 'multiple inheritance', 'marker interface', 'Comparator', 'Runnable'],
    11: ['try', 'catch', 'finally', 'throw', 'throws', 'Exception', 'RuntimeException', 'checked', 'unchecked', 'custom exception'],
    12: ['type parameter', 'diamond operator', 'wildcard', 'bounded type', 'type erasure', 'generic method', 'generic class', 'PECS', 'Collections', 'type safety'],
    13: ['List', 'Set', 'Map', 'ArrayList', 'HashSet', 'HashMap', 'TreeSet', 'TreeMap', 'Iterator', 'Comparable'],
    14: ['lambda', 'stream', 'filter', 'map', 'collect', 'reduce', 'forEach', 'Predicate', 'Function', 'Optional'],
    15: ['Thread', 'Runnable', 'synchronized', 'wait', 'notify', 'volatile', 'AtomicInteger', 'ExecutorService', 'deadlock', 'race condition'],
    16: ['LocalDate', 'LocalTime', 'LocalDateTime', 'ZonedDateTime', 'Instant', 'Period', 'Duration', 'DateTimeFormatter', 'ZoneId', 'temporal adjusters'],
    17: ['InputStream', 'OutputStream', 'Reader', 'Writer', 'File', 'Files', 'Path', 'BufferedReader', 'Serializable', 'NIO'],
    18: ['annotation', 'Retention', 'Target', 'Reflection', 'Class', 'Method', 'Field', '@Override', '@Deprecated', 'getAnnotation']
  };
  
  const lessonTopics = topics[lessonNum] || [`Topic ${lessonNum}`];
  
  for (let i = 0; i < count; i++) {
    const topic = lessonTopics[i % lessonTopics.length];
    const isTrue = Math.random() > 0.5;
    
    tests.push({
      id: `${lessonNum}_${i}`,
      text: `${isTrue ? 'Что из перечисленного' : 'Какое утверждение'} верно для "${topic}" в Java?`,
      options: generateOptions(topic, lessonNum),
      correct: Math.floor(Math.random() * 4)
    });
  }
  
  return tests;
}

function generateOptions(topic, lessonNum) {
  const options = [
    `${topic} используется для управления памятью`,
    `${topic} является ключевым компонентом Java`,
    `${topic} не поддерживается в Java 17`,
    `${topic} требует импорта специального пакета`
  ];
  return options;
}

// Запуск урока
async function startLesson(lessonId) {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  
  const lesson = javaLessons.find(l => l.id === lessonId);
  if (!lesson) return;
  
  currentLesson = lesson;
  
  // Загружаем содержимое урока
  const lessonContent = await loadLessonContent(lessonId);
  
  showPage('lesson-detail');
  renderLesson(lesson, lessonContent);
}

// Загрузка содержимого урока из файлов
async function loadLessonContent(lessonId) {
  // Маппинг ID урока на номер файла
  const lessonMap = {
    'java-lesson-1': 'Джава1Примитивы',
    'java-lesson-2': 'Джава2Операторы',
    'java-lesson-3': 'Джава3',
    'java-lesson-4': 'Джава4',
    'java-lesson-5': 'Джава5',
    'java-lesson-6': 'Джава6',
    'java-lesson-7': 'Джава7',
    'java-lesson-8': 'Джава8',
    'java-lesson-9': 'Джава9',
    'java-lesson-10': 'Джава10',
    'java-lesson-11': 'Джава11',
    'java-lesson-12': 'Джава12',
    'java-lesson-13': 'Джава13',
    'java-lesson-14': 'Джава14',
    'java-lesson-15': 'Джава15',
    'java-lesson-16': 'Джава16',
    'java-lesson-17': 'Джава17',
    'java-lesson-18': 'Джава18'
  };
  
  const fileName = lessonMap[lessonId];
  if (!fileName) return { title: 'Урок', content: '<p>Содержание урока загружается...</p>' };
  
  try {
    // Пытаемся загрузить из файла (в реальном проекте файлы должны быть доступны)
    const response = await fetch(`${fileName}.txt`);
    if (response.ok) {
      const content = await response.text();
      return {
        title: currentLesson.title,
        content: formatLessonContent(content)
      };
    }
  } catch (e) {
    console.log('Используем встроенный контент');
  }
  
  // Fallback контент
  return {
    title: currentLesson.title,
    content: getFallbackContent(currentLesson.title)
  };
}

function formatLessonContent(rawContent) {
  // Преобразуем текст в HTML
  let html = rawContent
    .replace(/={3,}/g, '<hr class="my-4">')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
    .replace(/\n- (.*?)(?=\n|$)/g, '<li>$1</li>')
    .replace(/<li>/g, '<ul><li>')
    .replace(/<\/li>(?=<li>)/g, '</li>')
    .replace(/(<\/li>)(?!.*<li>)/g, '$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('#') && match.length < 100) {
        const level = match.match(/^#+/)[0].length;
        const text = match.replace(/^#+ /, '');
        return `<h${level}>${text}</h${level}>`;
      }
      return match;
    });
  
  return `<div class="lesson-content">${html}</div>`;
}

function getFallbackContent(title) {
  return `
    <div class="lesson-content">
      <h1>${escapeHtml(title)}</h1>
      <p>Этот урок познакомит вас с основами Java программирования.</p>
      <p>В ходе урока вы изучите ключевые концепции и получите практические навыки.</p>
      <h2>Ключевые темы:</h2>
      <ul>
        <li>Основные понятия и терминология</li>
        <li>Практические примеры кода</li>
        <li>Типичные ошибки и их решение</li>
      </ul>
      <p>После завершения урока вам нужно будет пройти тест из 30 вопросов для закрепления материала.</p>
    </div>
  `;
}

// Рендер урока
function renderLesson(lesson, content) {
  const container = document.getElementById('lesson-detail-container');
  if (!container) return;
  
  const completedLessons = window.userProgress?.completedLessons || [];
  const isCompleted = completedLessons.includes(lesson.id);
  
  container.innerHTML = `
    <div class="mb-4">
      <button class="btn-secondary" onclick="showPage('course-detail')">← Назад к курсу</button>
    </div>
    
    <div class="lesson-header">
      <h1 class="lesson-title">${escapeHtml(lesson.title)}</h1>
      <div class="lesson-meta">Длительность: ${lesson.duration} • ${lesson.hasTest ? '30 тестов' : 'Теория'}</div>
    </div>
    
    <div class="lesson-content-wrapper" style="background: var(--surface-lowest); border-radius: var(--radius-sm); padding: 2rem;">
      ${content.content}
    </div>
    
    ${!isCompleted && lesson.hasTest ? `
      <div style="margin-top: 2rem;">
        <button class="btn-primary" onclick="startTest('${lesson.id}')">
          Пройти тест (30 вопросов)
        </button>
      </div>
    ` : isCompleted ? `
      <div style="margin-top: 2rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-sm); text-align: center;">
        ✓ Урок пройден! Вы успешно сдали тест.
      </div>
    ` : ''}
  `;
}

// Запуск теста
function startTest(lessonId) {
  const tests = testBank[lessonId];
  if (!tests || tests.length === 0) {
    showNotification('Тесты не найдены', 'error');
    return;
  }
  
  // Выбираем 30 случайных тестов из банка
  const shuffled = [...tests];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  currentTest = shuffled.slice(0, 30);
  currentTestIndex = 0;
  testAnswers = [];
  testScore = 0;
  testCompleted = false;
  
  showTestInterface();
}

// Показать интерфейс теста
function showTestInterface() {
  const container = document.getElementById('lesson-detail-container');
  if (!container) return;
  
  const currentQuestion = currentTest[currentTestIndex];
  const progress = ((currentTestIndex + 1) / currentTest.length) * 100;
  
  container.innerHTML = `
    <div class="mb-4">
      <button class="btn-secondary" onclick="cancelTest()">← Отменить тест</button>
    </div>
    
    <div class="test-panel">
      <div class="test-header">
        <div>
          <h2>Тестирование: ${escapeHtml(currentLesson.title)}</h2>
          <p>Вопрос ${currentTestIndex + 1} из ${currentTest.length}</p>
        </div>
        <div class="test-progress">
          <div class="test-progress-bar">
            <div class="test-progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>
      </div>
      
      <div class="test-question">
        <p class="test-question-text">${escapeHtml(currentQuestion.text)}</p>
        <div class="test-options" id="test-options">
          ${currentQuestion.options.map((opt, idx) => `
            <label class="test-option">
              <input type="radio" name="question" value="${idx}" ${testAnswers[currentTestIndex] === idx ? 'checked' : ''}>
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
      <div class="test-actions">
        <button class="btn-secondary" onclick="previousQuestion()" ${currentTestIndex === 0 ? 'disabled' : ''}>
          ← Назад
        </button>
        <button class="btn-primary" onclick="nextQuestion()">
          ${currentTestIndex === currentTest.length - 1 ? 'Завершить тест' : 'Далее →'}
        </button>
      </div>
    </div>
  `;
  
  // Добавляем обработчики для radio
  document.querySelectorAll('.test-option input').forEach(radio => {
    radio.addEventListener('change', (e) => {
      testAnswers[currentTestIndex] = parseInt(e.target.value);
    });
  });
}

function previousQuestion() {
  if (currentTestIndex > 0) {
    currentTestIndex--;
    showTestInterface();
  }
}

function nextQuestion() {
  // Сохраняем ответ
  const selected = document.querySelector('input[name="question"]:checked');
  if (selected) {
    testAnswers[currentTestIndex] = parseInt(selected.value);
  }
  
  if (currentTestIndex === currentTest.length - 1) {
    finishTest();
  } else {
    currentTestIndex++;
    showTestInterface();
  }
}

function cancelTest() {
  currentTest = null;
  renderLesson(currentLesson, { content: 'Тест отменен' });
}

function finishTest() {
  // Подсчет правильных ответов
  for (let i = 0; i < currentTest.length; i++) {
    if (testAnswers[i] === currentTest[i].correct) {
      testScore++;
    }
  }
  
  const percentage = (testScore / currentTest.length) * 100;
  const passed = percentage >= 70;
  
  const container = document.getElementById('lesson-detail-container');
  container.innerHTML = `
    <div class="test-result">
      <h3>${passed ? '🎉 Поздравляем!' : '😔 Увы, не получилось'}</h3>
      <div class="score">${testScore} / ${currentTest.length}</div>
      <p>Правильных ответов: ${percentage.toFixed(1)}%</p>
      <p>${passed ? 'Вы успешно прошли тест! Урок отмечен как пройденный.' : 'Для прохождения теста необходимо набрать 70% правильных ответов. Попробуйте еще раз!'}</p>
      <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
        ${passed ? `
          <button class="btn-primary" onclick="completeLessonAndContinue()">Продолжить обучение</button>
        ` : `
          <button class="btn-primary" onclick="startTest('${currentLesson.id}')">Попробовать снова</button>
          <button class="btn-secondary" onclick="showPage('course-detail')">Вернуться к курсу</button>
        `}
      </div>
    </div>
  `;
  
  if (passed && currentLesson) {
    saveProgress(currentCourse?.id || 'java-basic', currentLesson.id);
  }
}

function completeLessonAndContinue() {
  if (currentCourse) {
    // Находим следующий урок
    const lessons = getLessonsForCourse(currentCourse.id);
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = lessons[currentIndex + 1];
    
    if (nextLesson) {
      startLesson(nextLesson.id);
    } else {
      showPage('course-detail');
      showNotification('Курс завершен! Отличная работа!', 'success');
    }
  } else {
    showPage('courses');
  }
}