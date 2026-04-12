/* =============================================
   ЭВРИКА — APP.JS
   Language, Dark Mode, Navigation, Quiz Logic
   ============================================= */

// ─── TRANSLATIONS ────────────────────────────────────────────────
const T = {
  ru: {
    // Nav
    nav_courses: "Курсы",
    nav_community: "Сообщество",
    nav_pricing: "Цены",
    nav_login: "Войти",
    nav_get_started: "Начать",

    // Hero
    hero_badge: "Онлайн платформа обучения",
    hero_title: "Учись Java бесплатно в интерактивной игровой системе",
    hero_subtitle: "Осваивай программирование, создавай свои тесты и делись знаниями с другими. Платформа, где обучение превращается в развитие и возможности.",
    hero_check_1: "Бесплатный доступ",
    hero_check_2: "Создание тестов",
    hero_check_3: "Монетизация",
    hero_cta: "Начать",
    hero_login_cta: "У меня уже есть аккаунт",

    // Create & Earn
    create_title: "Создавай и зарабатывай",
    create_text: "Нашa платформа позволяет не только учиться, но и становиться автором. Публикуйте свои собственные тесты и практические задачи. Превращайте свою экспертизу в ценность для сообщества и получайте вознаграждение за качественный контент.",
    create_card_title: "Монетизируйте свои знания",
    create_card_text: "Зарабатывайте баллы и реальные бонусы за популярные курсы",

    // Scientific
    science_title: "Научный подход к обучению",
    science_text: "В основе Eureka лежат алгоритмы интервальных повторений и когнитивной психологии. Мы не просто даем теорию — мы встраиваем знания в вашу долгосрочную память через регулярную практику и адаптивные тесты, которые подстраиваются под ваш темп.",
    stat_1_label: "Усвоение материала",
    stat_2_label: "Быстрее обучение",
    stat_3_label: "Доступность системы",

    // Process
    process_title: "Как проходит обучение",
    step1_title: "Учись",
    step1_text: "Короткие и емкие уроки без «воды». Только то, что действительно нужно для работы с Java.",
    step2_title: "Тестируй",
    step2_text: "Интерактивные тесты проверяют ваше понимание концепций в реальном времени.",
    step3_title: "Практикуй",
    step3_text: "Решение живых задач по кодингу. Переносите теорию в чистый и эффективный код.",

    // Deep Dive
    deep_title: "Глубокое понимание вместо заучивания",
    deep_text: "Мы верим, что программирование — это логика, а не синтаксис. Наша методика сфокусирована на фундаментальных принципах Java, позволяя вам писать эффективный код даже в незнакомых ситуациях.",
    deep_cta: "Начать глубокое погружение",

    // Flexibility
    flex_title: "Обучение без давления",
    flex_text: "Никаких обязательных вебинаров или строгих расписаний. Вы сами определяете интенсивность обучения. Наша платформа доступна 24/7, позволяя возвращаться к урокам именно тогда, когда у вас есть вдохновение и время.",
    flex_cta: "Попробовать бесплатно",
    feat_1: "Свободный график",
    feat_2: "Доступ с любого устройства",
    feat_3: "Ваш темп роста",
    feat_4: "Без давления дедлайнов",

    // Courses page
    courses_label_track: "Образовательные треки",
    courses_label_prog: "Программирование",
    courses_hero_title: "Развивай своё будущее с экспертизой",
    courses_hero_subtitle: "Откройте для себя подборку высокоэффективных курсов, которые проведут вас от основ логики к профессиональной разработке.",
    course_popular: "Популярный трек",
    course_java_title: "Java",
    course_java_subtitle: "Базовый курс Java",
    course_java_desc: "Изучи основы программирования: переменные, условия, циклы, функции. Подходит как для новичков, так и для тех, кто хочет систематизировать знания.",
    course_start: "Начать обучение",
    course_python_title: "Python Core",
    course_python_desc: "Освой самый универсальный язык для науки о данных, автоматизации и бэкенд-разработки.",
    course_python_link: "Изучить программу",
    course_db_title: "Базы данных",
    course_db_desc: "Понимание SQL, NoSQL и эффективного моделирования данных для масштабируемых приложений.",
    course_db_link: "Смотреть курс",
    stat_students: "Активных студентов",
    stat_success: "Успешных выпускников",
    stat_support: "Поддержка менторов",

    // Sidebar nav
    nav_intro: "Введение",
    nav_basics: "Основы Java",
    nav_vars: "Переменные",
    nav_loops: "Циклы",
    nav_methods: "Методы",
    nav_support: "Поддержка",
    nav_settings: "Настройки",
    sidebar_progress: "Java Mastery",
    sidebar_continue: "Продолжить обучение",
    sidebar_complete: "завершено",

    // Lesson
    lesson_module: "Структуры данных и логика",
    lesson_module_sub: "Модуль 2: Продвинутые потоки управления и синтаксис Java.",
    lesson_mark_read: "Отметить как прочитанное",
    lesson_article_title: "Понимание ключевого слова `final`",
    lesson_article_p1: "В Java ключевое слово",
    lesson_article_p1b: "является модификатором без доступа для классов, атрибутов и методов, что делает их неизменяемыми (невозможно наследовать или переопределить).",
    lesson_key_chars: "Ключевые характеристики:",
    lesson_check_1: "Переменные: становится константой. Вы не можете переназначить значение.",
    lesson_check_2: "Методы: запрещает переопределение метода в подклассах.",
    lesson_check_3: "Классы: запрещает наследование класса.",
    lesson_img_label: "Редакционный взгляд",
    lesson_img_title: "Иммутабельная архитектура",
    quiz_title: "Быстрый вызов",
    quiz_subtitle: "Ответь на 30 правильных вопросов",
    quiz_level: "Уровень: Средний",
    quiz_question: "Что произойдёт, если попытаться расширить класс, объявленный как",
    quiz_a1: "Код скомпилируется, но выбросит исключение во время выполнения.",
    quiz_a2: "Это приводит к ошибке времени компиляции.",
    quiz_a3: "Ключевое слово final применяется только к переменным, не к классам.",
    quiz_a4: "Это работает нормально, пока методы не объявлены final.",
    quiz_skip: "Пропустить",
    quiz_submit: "Подтвердить ответ",
    quiz_warning: "Внимание: любой неправильный ответ обнулит ваш прогресс «30 вопросов». Будьте внимательны.",
    resources: "Ресурсы",

    // Profile
    profile_badge: "Премиум студент",
    settings_personal: "Личные данные",
    settings_name_label: "Полное имя",
    settings_name_val: "Alex Eureka",
    settings_birthday_label: "Дата рождения",
    settings_birthday_val: "12 Октября 1995",
    settings_privacy: "Приватность",
    settings_privacy_label: "Конфиденциальность",
    settings_security_label: "Безопасность",
    settings_devices_label: "Устройства",
    settings_devices_val: "3 активных",
    settings_appearance: "Внешний вид",
    settings_theme: "Тема оформления",
    theme_light: "Светлая",
    theme_dark: "Тёмная",
    theme_auto: "Авто",
    settings_lang: "Язык приложения",
    settings_lang_val: "Выбрано: Русский",
    settings_fontsize: "Размер шрифта",
    btn_save: "Сохранить изменения",
    btn_logout: "Выйти",

    // Footer
    footer_terms: "Условия",
    footer_privacy: "Политика",
    footer_careers: "Карьера",
    footer_status: "Статус",
    footer_copy: "© 2024 Эврика Обучение",
    status_online: "Система онлайн",

    // Mobile nav
    mobile_learn: "Обучение",
    mobile_practice: "Практика",
    mobile_community: "Сообщество",
    mobile_profile: "Профиль",
  },

  en: {
    nav_courses: "Courses",
    nav_community: "Community",
    nav_pricing: "Pricing",
    nav_login: "Login",
    nav_get_started: "Get Started",

    hero_badge: "Online Learning Platform",
    hero_title: "Learn Java for Free in an Interactive Gamified System",
    hero_subtitle: "Master programming, create your own tests, and share knowledge with others. A platform where learning transforms into growth and opportunity.",
    hero_check_1: "Free Access",
    hero_check_2: "Test Creation",
    hero_check_3: "Monetization",
    hero_cta: "Start",
    hero_login_cta: "I already have an account",

    create_title: "Create & Earn",
    create_text: "Our platform lets you not just learn, but become an author. Publish your own tests and practical challenges. Turn your expertise into value for the community and earn rewards for quality content.",
    create_card_title: "Monetize Your Knowledge",
    create_card_text: "Earn points and real bonuses for popular courses",

    science_title: "Scientific Approach to Learning",
    science_text: "Eureka is built on spaced repetition algorithms and cognitive psychology. We don't just give theory — we embed knowledge into your long-term memory through regular practice and adaptive tests that adjust to your pace.",
    stat_1_label: "Material Retention",
    stat_2_label: "Faster Learning",
    stat_3_label: "System Availability",

    process_title: "How Learning Works",
    step1_title: "Learn",
    step1_text: "Short, dense lessons with no filler. Only what you truly need to work with Java.",
    step2_title: "Test",
    step2_text: "Interactive quizzes test your understanding of concepts in real time.",
    step3_title: "Practice",
    step3_text: "Solve live coding challenges. Transfer theory into clean, efficient code.",

    deep_title: "Deep Understanding Over Memorization",
    deep_text: "We believe programming is logic, not syntax. Our methodology focuses on fundamental Java principles, enabling you to write efficient code even in unfamiliar situations.",
    deep_cta: "Start Deep Dive",

    flex_title: "Learning Without Pressure",
    flex_text: "No mandatory webinars or rigid schedules. You set the intensity of your learning. Our platform is available 24/7, letting you return to lessons whenever you have inspiration and time.",
    flex_cta: "Try for Free",
    feat_1: "Flexible Schedule",
    feat_2: "Access from Any Device",
    feat_3: "Your Growth Pace",
    feat_4: "No Deadline Pressure",

    courses_label_track: "Educational Tracks",
    courses_label_prog: "Programming",
    courses_hero_title: "Develop Your Future with Expertise",
    courses_hero_subtitle: "Dive into our curated selection of high-impact courses designed to take you from foundational logic to production-ready engineering.",
    course_popular: "Popular Track",
    course_java_title: "Java",
    course_java_subtitle: "Java Fundamentals Course",
    course_java_desc: "Learn programming basics: variables, conditions, loops, functions. Perfect for beginners and those who want to systematize their knowledge.",
    course_start: "Start Learning",
    course_python_title: "Python Core",
    course_python_desc: "Master the most versatile language for data science, automation, and backend development.",
    course_python_link: "Explore Syllabus",
    course_db_title: "Database Design",
    course_db_desc: "Understanding SQL, NoSQL, and efficient data modeling for scalable applications.",
    course_db_link: "View Course",
    stat_students: "Active Students",
    stat_success: "Success Rate",
    stat_support: "Mentor Support",

    nav_intro: "Introduction",
    nav_basics: "Java Basics",
    nav_vars: "Variables",
    nav_loops: "Loops",
    nav_methods: "Methods",
    nav_support: "Support",
    nav_settings: "Settings",
    sidebar_progress: "Java Mastery",
    sidebar_continue: "Continue Learning",
    sidebar_complete: "Complete",

    lesson_module: "Data Structures & Logic",
    lesson_module_sub: "Module 2: Advanced Control Flows and Java Syntax.",
    lesson_mark_read: "Mark as Read",
    lesson_article_title: "Understanding the `final` Keyword",
    lesson_article_p1: "In Java, the",
    lesson_article_p1b: "keyword is a non-access modifier used for classes, attributes, and methods, which makes them non-changeable (impossible to inherit or override).",
    lesson_key_chars: "Key Characteristics:",
    lesson_check_1: "Variables: Becomes a constant. You cannot reassign the value.",
    lesson_check_2: "Methods: Prevents the method from being overridden by subclasses.",
    lesson_check_3: "Classes: Prevents the class from being inherited.",
    lesson_img_label: "Editorial Insight",
    lesson_img_title: "The Immutable Architecture",
    quiz_title: "Quick Challenge",
    quiz_subtitle: "Answer 30 correct questions",
    quiz_level: "Level: Intermediate",
    quiz_question: "What happens when you try to extend a class declared as",
    quiz_a1: "The code will compile but throw a runtime exception.",
    quiz_a2: "It results in a compile-time error.",
    quiz_a3: "The final keyword only applies to variables, not classes.",
    quiz_a4: "It works normally as long as the methods are not final.",
    quiz_skip: "Skip",
    quiz_submit: "Submit Answer",
    quiz_warning: "Note: Any incorrect answer will reset your \"Answer 30 Questions\" streak to zero. Be intentional with your choices.",
    resources: "Resources",

    profile_badge: "Premium Student",
    settings_personal: "Personal Info",
    settings_name_label: "Full Name",
    settings_name_val: "Alex Eureka",
    settings_birthday_label: "Date of Birth",
    settings_birthday_val: "October 12, 1995",
    settings_privacy: "Privacy",
    settings_privacy_label: "Privacy",
    settings_security_label: "Security",
    settings_devices_label: "Devices",
    settings_devices_val: "3 active",
    settings_appearance: "Appearance",
    settings_theme: "Theme",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_auto: "Auto",
    settings_lang: "App Language",
    settings_lang_val: "Selected: English",
    settings_fontsize: "Font Size",
    btn_save: "Save Changes",
    btn_logout: "Log Out",

    footer_terms: "Terms",
    footer_privacy: "Privacy",
    footer_careers: "Careers",
    footer_status: "Status",
    footer_copy: "© 2024 Eureka Learning",
    status_online: "System Online",

    mobile_learn: "Learning",
    mobile_practice: "Practice",
    mobile_community: "Community",
    mobile_profile: "Profile",
  }
};

// ─── STATE ───────────────────────────────────────────────────────
const state = {
  lang: localStorage.getItem('eureka-lang') || 'ru',
  dark: localStorage.getItem('eureka-dark') === 'true',
  theme: localStorage.getItem('eureka-theme') || 'light',
  currentPage: 'landing',
  selectedAnswer: null,
  quizSubmitted: false,
};

// ─── HELPERS ────────────────────────────────────────────────────
const t = (key) => T[state.lang][key] || key;

function $(id) { return document.getElementById(id); }
function $$(sel) { return document.querySelectorAll(sel); }

// ─── TRANSLATION APPLY ──────────────────────────────────────────
function applyTranslations() {
  $$('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (el.tagName === 'INPUT' && el.type !== 'range') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  // Update lang buttons
  $$('.lang-btn, .settings-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === state.lang);
  });
  // Update settings lang value
  const langValEl = $('settings-lang-val');
  if (langValEl) langValEl.textContent = state.lang === 'ru' ? 'Выбрано: Русский' : 'Selected: English';
}

// ─── PAGE NAVIGATION ────────────────────────────────────────────
function showPage(pageId) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const page = $(`page-${pageId}`);
  if (page) page.classList.add('active');
  state.currentPage = pageId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Update active nav link
  $$('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });
  $$('.mobile-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
}

// ─── DARK MODE ──────────────────────────────────────────────────
function applyTheme() {
  if (state.theme === 'dark' || (state.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  // Update theme buttons
  $$('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === state.theme);
  });
}

function toggleDarkMode() {
  state.theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('eureka-theme', state.theme);
  applyTheme();
}

// ─── QUIZ LOGIC ─────────────────────────────────────────────────
function selectAnswer(index) {
  if (state.quizSubmitted) return;
  state.selectedAnswer = index;
  $$('.answer-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });
}

function submitQuiz() {
  if (state.selectedAnswer === null || state.quizSubmitted) return;
  state.quizSubmitted = true;
  const correctIndex = 1; // Option B is correct
  $$('.answer-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add('correct');
    else if (i === state.selectedAnswer) btn.classList.add('wrong');
  });
}

function resetQuiz() {
  state.selectedAnswer = null;
  state.quizSubmitted = false;
  $$('.answer-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected', 'correct', 'wrong');
  });
}

// ─── SIDEBAR NAV ITEMS ──────────────────────────────────────────
function setSidebarActive(item) {
  $$('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
  item.classList.add('active');
}

// ─── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyTranslations();
  showPage('landing');

  // Language toggle buttons
  $$('.lang-btn, .settings-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.lang;
      localStorage.setItem('eureka-lang', state.lang);
      applyTranslations();
    });
  });

  // Dark mode toggle
  $$('.dark-mode-btn').forEach(btn => {
    btn.addEventListener('click', toggleDarkMode);
  });

  // Theme buttons (settings page)
  $$('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.theme;
      localStorage.setItem('eureka-theme', state.theme);
      applyTheme();
    });
  });

  // Page nav links (top nav)
  $$('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(el.dataset.page);
    });
  });

  // "Start Learning" / "Начать обучение" → lesson page
  $$('.go-lesson').forEach(btn => {
    btn.addEventListener('click', () => showPage('lesson'));
  });

  // Settings nav items
  $$('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => setSidebarActive(item));
  });

  // Quiz answer buttons
  $$('.answer-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => selectAnswer(i));
  });

  // Quiz submit
  const submitBtn = $('quiz-submit');
  if (submitBtn) submitBtn.addEventListener('click', submitQuiz);

  // Quiz skip
  const skipBtn = $('quiz-skip');
  if (skipBtn) skipBtn.addEventListener('click', resetQuiz);

  // Brand click → landing
  $$('.nav-brand').forEach(b => b.addEventListener('click', () => showPage('landing')));
});
