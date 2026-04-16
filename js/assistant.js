// ============================================
// AI-АССИСТЕНТ ДЛЯ САЙТА (БЕЗ API)
// ============================================

// База знаний о сайте
const SITE_KNOWLEDGE = {
    // Информация о страницах
    pages: {
        landing: {
            name: 'Главная страница',
            description: 'Главная страница с приветствием и описанием платформы',
            url: '/',
            sections: [
                'Приветственный блок с описанием платформы',
                'Блок "Создавай и зарабатывай" - как монетизировать знания',
                'Блок "Научный подход" - об алгоритмах обучения',
                'Блок "Как проходит обучение" - 3 этапа: Учись, Тестируй, Практикуй',
                'Блок "Глубокое понимание" - о логике программирования',
                'Блок "Обучение без давления" - о свободном графике',
                'Блок "Наши советы" - полезные рекомендации',
                'Блок с призывом к действию'
            ]
        },
        profile: {
            name: 'Профиль пользователя',
            description: 'Страница профиля, где можно управлять аккаунтом',
            url: '/profile',
            features: [
                'Смена аватара (животное)',
                'Редактирование имени',
                'Редактирование username',
                'Редактирование описания (bio)',
                'Смена email',
                'Смена пароля',
                'Просмотр статистики (уроки, прогресс, часы)',
                'Выход из аккаунта',
                'Удаление аккаунта'
            ]
        },
        courses: {
            name: 'Курсы',
            description: 'Страница со списком всех доступных курсов',
            url: '/courses',
            features: [
                'Просмотр всех курсов',
                'Выбор курса для обучения',
                'Создание своего курса'
            ]
        },
        courseDetail: {
            name: 'Детали курса',
            description: 'Страница с подробной информацией о курсе и списком уроков',
            features: [
                'Список всех уроков курса',
                'Прогресс прохождения',
                'Навигация по урокам'
            ]
        },
        lessonDetail: {
            name: 'Урок',
            description: 'Страница с теоретическим материалом и тестами',
            features: [
                'Теоретический материал',
                'Практические примеры кода',
                'Тесты для проверки знаний',
                'Завершение урока'
            ]
        }
    },
    
    // Как пользоваться функциями
    features: {
        registration: {
            title: 'Регистрация',
            description: 'Как создать новый аккаунт',
            steps: [
                'Нажмите кнопку "Войти" в правом верхнем углу экрана',
                'В открывшемся окне выберите вкладку "Регистрация"',
                'Введите username (только латиница, цифры и _, 3-20 символов)',
                'Введите ваше имя',
                'Введите действующий email',
                'Придумайте пароль (минимум 6 символов)',
                'Выберите аватар-животное (нельзя будет изменить потом)',
                'Нажмите кнопку "Зарегистрироваться"'
            ],
            tips: ['Username должен быть уникальным', 'Пароль храните в надежном месте']
        },
        login: {
            title: 'Вход в аккаунт',
            description: 'Как войти в существующий аккаунт',
            steps: [
                'Нажмите кнопку "Войти" в правом верхнем углу',
                'Введите ваш email или username',
                'Введите пароль',
                'Нажмите кнопку "Войти"'
            ]
        },
        profileEdit: {
            title: 'Редактирование профиля',
            description: 'Как изменить данные профиля',
            steps: [
                'Перейдите в раздел "Профиль" (кнопка в навигации)',
                'Нажмите на аватар, чтобы изменить его',
                'Нажмите на любое поле (Имя, Username, О себе, Email) для редактирования',
                'Введите новое значение и нажмите "Сохранить"'
            ]
        },
        passwordChange: {
            title: 'Смена пароля',
            description: 'Как изменить пароль',
            steps: [
                'Перейдите в раздел "Профиль"',
                'Нажмите на поле "Пароль"',
                'Введите старый пароль',
                'Введите новый пароль (минимум 6 символов)',
                'Подтвердите новый пароль',
                'Нажмите "Сменить пароль"'
            ]
        },
        themeChange: {
            title: 'Смена темы оформления',
            description: 'Как изменить внешний вид сайта',
            steps: [
                'Нажмите на иконку палитры 🎨 в правом верхнем углу',
                'Выберите понравившуюся тему из списка:',
                '  • Светлая ☀️',
                '  • Тёмная 🌙',
                '  • Закат 🌅',
                '  • Океан 🌊',
                '  • Лаванда 💜'
            ]
        },
        languageChange: {
            title: 'Смена языка',
            description: 'Как переключить язык интерфейса',
            steps: [
                'Нажмите на кнопку "RU" или "EN" в правом верхнем углу',
                'Выберите нужный язык'
            ]
        },
        avatarChange: {
            title: 'Смена аватара',
            description: 'Как изменить аватар профиля',
            steps: [
                'Перейдите в раздел "Профиль"',
                'Нажмите на ваш текущий аватар',
                'Выберите новое животное из списка',
                'Аватар изменится автоматически'
            ],
            note: 'Аватар нельзя будет изменить после выбора при регистрации!'
        },
        learning: {
            title: 'Как проходит обучение',
            description: 'Описание процесса обучения',
            steps: [
                '1️⃣ УЧИСЬ - короткие и емкие уроки без "воды"',
                '2️⃣ ТЕСТИРУЙ - интерактивные тесты проверяют понимание',
                '3️⃣ ПРАКТИКУЙ - решение живых задач по кодингу'
            ],
            details: 'Каждый урок длится 2 часа. После каждого урока нужно пройти тест из 30 вопросов. Для успешной сдачи нужно 70% правильных ответов.'
        }
    },
    
    // Часто задаваемые вопросы
    faq: [
        { keywords: ['регистрация', 'зарегистрироваться', 'создать аккаунт', 'новый аккаунт'], answer: 'Чтобы зарегистрироваться, нажмите кнопку "Войти" в правом верхнем углу, затем выберите вкладку "Регистрация". Заполните все поля (username, имя, email, пароль) и выберите аватар-животное.' },
        { keywords: ['войти', 'вход', 'логин', 'login', 'sign in'], answer: 'Чтобы войти, нажмите кнопку "Войти" в правом верхнем углу, введите ваш email или username и пароль, затем нажмите "Войти".' },
        { keywords: ['пароль', 'сменить пароль', 'изменить пароль', 'новый пароль'], answer: 'Чтобы сменить пароль, перейдите в раздел "Профиль", нажмите на поле "Пароль". Введите старый пароль, новый пароль (минимум 6 символов) и подтверждение. Нажмите "Сменить пароль".' },
        { keywords: ['аватар', 'сменить аватар', 'изменить аватар', 'картинка профиля'], answer: 'Чтобы сменить аватар, перейдите в "Профиль" и нажмите на ваш текущий аватар. Выберите новое животное из списка. Аватар изменится автоматически.' },
        { keywords: ['тема', 'оформление', 'цвет', 'тема оформления', 'сменить тему'], answer: 'Чтобы сменить тему, нажмите на иконку палитры 🎨 в правом верхнем углу. Доступно 5 тем: Светлая, Тёмная, Закат, Океан, Лаванда.' },
        { keywords: ['язык', 'сменить язык', 'english', 'русский', 'переключить язык'], answer: 'Чтобы сменить язык, нажмите на кнопку "RU" или "EN" в правом верхнем углу. Поддерживаются русский и английский языки.' },
        { keywords: ['урок', 'уроки', 'сколько уроков', 'курс', 'обучение'], answer: 'В курсе Java 18 уроков по 2 часа каждый. Всего 36 часов обучения. Уроки построены по принципу: теория → тесты → практика.' },
        { keywords: ['тест', 'тесты', 'проверить знания', 'экзамен'], answer: 'Тесты проходятся после каждого урока. Каждый тест содержит 30 вопросов. Для успешной сдачи нужно набрать 70% правильных ответов. Если не сдали - можно попробовать снова!' },
        { keywords: ['профиль', 'мой профиль', 'личный кабинет', 'настройки'], answer: 'В профиле вы можете: редактировать имя, username, описание, email, менять пароль, выбирать аватар, просматривать статистику обучения. Чтобы перейти в профиль, нажмите на кнопку "Профиль" в навигации.' },
        { keywords: ['статистика', 'прогресс', 'сколько пройдено'], answer: 'Статистика отображается в профиле. Вы можете видеть: количество пройденных уроков, общий прогресс в процентах, количество часов обучения.' },
        { keywords: ['бесплатно', 'цена', 'стоимость', 'платно'], answer: 'Платформа Эврика полностью бесплатна! Все уроки, тесты и материалы доступны без оплаты.' },
        { keywords: ['сертификат', 'документ', 'подтверждение'], answer: 'Да, после успешного прохождения всех 18 уроков и сдачи всех тестов вы получите сертификат о прохождении курса.' },
        { keywords: ['удалить аккаунт', 'удалить профиль', 'уничтожить аккаунт'], answer: 'Чтобы удалить аккаунт, перейдите в "Профиль", прокрутите вниз и нажмите кнопку "Удалить аккаунт". Подтвердите действие. ВНИМАНИЕ: это действие необратимо!' },
        { keywords: ['выйти', 'выход', 'разлогиниться', 'logout'], answer: 'Чтобы выйти из аккаунта, нажмите на кнопку с иконкой выхода 🚪 рядом с вашим аватаром в правом верхнем углу.' },
        { keywords: ['что умеет', 'возможности', 'функции'], answer: 'Эврика умеет: обучать Java с нуля, проверять знания через тесты, отслеживать прогресс, менять тему (5 вариантов), поддерживать 2 языка, редактировать профиль, создавать свои курсы (в разработке).' },
        { keywords: ['навигация', 'где находится', 'как найти'], answer: 'Основные разделы: Главная (логотип слева), Профиль (кнопка в навигации). Все настройки доступны в профиле. Кнопка входа/выхода - справа вверху.' },
        { keywords: ['регистрация', 'зарегистрироваться', 'создать аккаунт'], answer: 'Чтобы зарегистрироваться, нажмите "Войти" → вкладка "Регистрация". Заполните все поля и выберите аватар.' }
    ]
};

// Текущий язык ассистента
let assistantLang = localStorage.getItem('assistant_lang') || 'ru';

// Переводы для ассистента
const assistantTranslations = {
    ru: {
        title: 'Помощник Эврика',
        placeholder: 'Задайте вопрос...',
        send: 'Отправить',
        welcome: 'Привет! 👋 Я AI-помощник Эврика. Задайте мне вопрос о сайте, и я помогу разобраться!',
        thinking: 'Думаю...',
        error: 'Извините, произошла ошибка. Попробуйте позже.',
        quickQuestions: 'Быстрые вопросы',
        close: 'Закрыть'
    },
    en: {
        title: 'Eureka Assistant',
        placeholder: 'Ask a question...',
        send: 'Send',
        welcome: 'Hello! 👋 I\'m Eureka AI assistant. Ask me anything about the site!',
        thinking: 'Thinking...',
        error: 'Sorry, an error occurred. Please try again later.',
        quickQuestions: 'Quick questions',
        close: 'Close'
    }
};

// Быстрые вопросы
const quickQuestions = {
    ru: [
        'Как зарегистрироваться?',
        'Как пройти тест?',
        'Сколько уроков?',
        'Как сменить тему?',
        'Как удалить аккаунт?'
    ],
    en: [
        'How to register?',
        'How to pass the test?',
        'How many lessons?',
        'How to change theme?',
        'How to delete account?'
    ]
};

// Поиск ответа в базе знаний
function findAnswer(question, currentPage) {
    const lowerQuestion = question.toLowerCase();
    
    // Сначала проверяем FAQ
    for (const item of SITE_KNOWLEDGE.faq) {
        for (const keyword of item.keywords) {
            if (lowerQuestion.includes(keyword.toLowerCase())) {
                return item.answer;
            }
        }
    }
    
    // Вопросы о конкретных страницах
    if (lowerQuestion.includes('главная') || lowerQuestion.includes('landing') || lowerQuestion.includes('что на главной')) {
        const page = SITE_KNOWLEDGE.pages.landing;
        return `📄 **${page.name}**\n\n${page.description}\n\nРазделы:\n${page.sections.map(s => `• ${s}`).join('\n')}`;
    }
    
    if (lowerQuestion.includes('профиль') || lowerQuestion.includes('личный кабинет')) {
        const page = SITE_KNOWLEDGE.pages.profile;
        return `📄 **${page.name}**\n\n${page.description}\n\nВозможности:\n${page.features.map(f => `• ${f}`).join('\n')}`;
    }
    
    if (lowerQuestion.includes('курс') || lowerQuestion.includes('обучение')) {
        return SITE_KNOWLEDGE.features.learning.steps.join('\n') + '\n\n' + SITE_KNOWLEDGE.features.learning.details;
    }
    
    // Вопросы о функциях
    for (const [key, feature] of Object.entries(SITE_KNOWLEDGE.features)) {
        if (lowerQuestion.includes(feature.title.toLowerCase())) {
            let response = `**${feature.title}**\n\n${feature.description}\n\n📋 Инструкция:\n`;
            response += feature.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
            if (feature.tips) response += `\n\n💡 Советы:\n${feature.tips.map(t => `• ${t}`).join('\n')}`;
            if (feature.note) response += `\n\n⚠️ Важно: ${feature.note}`;
            return response;
        }
    }
    
    // Вопросы о тестах
    if (lowerQuestion.includes('тест') || lowerQuestion.includes('проверить знания') || lowerQuestion.includes('экзамен')) {
        return `📝 **Как проходят тесты**\n\n• После каждого урока нужно пройти тест из 30 вопросов\n• Для успешной сдачи нужно 70% правильных ответов\n• Если не сдали - можно попробовать снова\n• Тесты помогают закрепить материал\n• Вопросы покрывают всю теорию урока`;
    }
    
    // Вопросы о текущей странице
    if (currentPage && SITE_KNOWLEDGE.pages[currentPage]) {
        const page = SITE_KNOWLEDGE.pages[currentPage];
        return `Вы сейчас на странице **${page.name}**.\n\n${page.description}\n\nЗдесь вы можете:\n${page.features ? page.features.map(f => `• ${f}`).join('\n') : page.sections?.map(s => `• ${s}`).join('\n') || '• Изучать материалы'}`;
    }
    
    // Общий ответ
    return null;
}

// Получение ответа
async function getResponse(question, currentPage) {
    const answer = findAnswer(question, currentPage);
    
    if (answer) {
        return answer;
    }
    
    // Если ничего не нашли
    return `🤔 Я не совсем понял вопрос. Попробуйте спросить по-другому или выберите один из быстрых вопросов ниже.\n\nЧто я могу:\n• Рассказать о регистрации и входе\n• Объяснить как проходят уроки и тесты\n• Помочь с настройкой профиля\n• Подсказать как сменить тему или язык\n• Ответить на вопросы о курсах\n\nЧем могу помочь?`;
}

// Создание виджета ассистента
function createAssistantWidget() {
    if (document.getElementById('assistant-widget')) return;
    
    const t = assistantTranslations[assistantLang];
    const quickList = quickQuestions[assistantLang];
    
    const widgetHTML = `
        <div id="assistant-widget" class="assistant-widget">
            <button id="assistant-toggle" class="assistant-toggle">
                <span class="material-symbols-outlined">smart_toy</span>
            </button>
            <div id="assistant-chat" class="assistant-chat">
                <div class="assistant-header">
                    <div class="assistant-header-info">
                        <span class="material-symbols-outlined">smart_toy</span>
                        <span>${t.title}</span>
                    </div>
                    <button id="assistant-close" class="assistant-close">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div id="assistant-messages" class="assistant-messages">
                    <div class="assistant-message bot">
                        <div class="assistant-message-avatar">🤖</div>
                        <div class="assistant-message-text">${t.welcome}</div>
                    </div>
                </div>
                <div class="assistant-quick" id="assistant-quick">
                    ${quickList.map(q => `<button class="assistant-quick-btn" data-question="${q}">${q}</button>`).join('')}
                </div>
                <div class="assistant-input-area">
                    <input type="text" id="assistant-input" class="assistant-input" placeholder="${t.placeholder}">
                    <button id="assistant-send" class="assistant-send">
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    addAssistantStyles();
    attachEventHandlers();
}

// Навешивание обработчиков
function attachEventHandlers() {
    const toggleBtn = document.getElementById('assistant-toggle');
    const chat = document.getElementById('assistant-chat');
    const closeBtn = document.getElementById('assistant-close');
    const sendBtn = document.getElementById('assistant-send');
    const input = document.getElementById('assistant-input');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chat.classList.toggle('open');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chat.classList.remove('open');
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', () => sendMessage());
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    // Быстрые вопросы
    document.querySelectorAll('.assistant-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            const input = document.getElementById('assistant-input');
            if (input && question) {
                input.value = question;
                sendMessage();
            }
        });
    });
}

// Отправка сообщения
async function sendMessage() {
    const input = document.getElementById('assistant-input');
    const messagesContainer = document.getElementById('assistant-messages');
    const question = input?.value.trim();
    
    if (!question) return;
    
    // Добавляем сообщение пользователя
    addMessage(question, 'user');
    input.value = '';
    
    // Определяем текущую страницу
    let currentPage = null;
    for (const page of ['landing', 'profile', 'courses', 'course-detail', 'lesson-detail']) {
        const el = document.getElementById(`page-${page}`);
        if (el && el.classList.contains('active')) {
            currentPage = page;
            break;
        }
    }
    
    // Показываем индикатор загрузки
    const loadingId = addLoadingMessage();
    
    // Получаем ответ (имитация задержки для естественности)
    setTimeout(async () => {
        const response = await getResponse(question, currentPage);
        removeLoadingMessage(loadingId);
        addMessage(response, 'bot');
        
        // Добавляем кнопки действий если нужно
        addActionButtons(response);
    }, 300);
}

// Добавление сообщения
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('assistant-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `assistant-message ${sender}`;
    messageDiv.innerHTML = `
        <div class="assistant-message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
        <div class="assistant-message-text">${formatMessageText(text)}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Форматирование текста
function formatMessageText(text) {
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '•');
    return formatted;
}

// Индикатор загрузки
function addLoadingMessage() {
    const messagesContainer = document.getElementById('assistant-messages');
    if (!messagesContainer) return null;
    
    const id = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = id;
    loadingDiv.className = 'assistant-message bot';
    loadingDiv.innerHTML = `
        <div class="assistant-message-avatar">🤖</div>
        <div class="assistant-message-text thinking">
            <span class="dot">●</span>
            <span class="dot">●</span>
            <span class="dot">●</span>
        </div>
    `;
    
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
}

function removeLoadingMessage(id) {
    if (!id) return;
    const loadingEl = document.getElementById(id);
    if (loadingEl) loadingEl.remove();
}

// Добавление кнопок действий
function addActionButtons(response) {
    const messagesContainer = document.getElementById('assistant-messages');
    if (!messagesContainer) return;
    
    const buttons = [];
    if (response.includes('профиль') || response.includes('Profile')) {
        buttons.push({ text: '👤 Перейти в профиль', action: () => showPage('profile') });
    }
    if (response.includes('курс') || response.includes('обучение')) {
        buttons.push({ text: '📚 Посмотреть курсы', action: () => showPage('courses') });
    }
    if (response.includes('регистрац') || response.includes('register')) {
        buttons.push({ text: '📝 Зарегистрироваться', action: () => { openAuthModal(); showRegisterForm(); } });
    }
    if (response.includes('войти') || response.includes('login')) {
        buttons.push({ text: '🔑 Войти', action: () => openAuthModal() });
    }
    
    if (buttons.length > 0) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'assistant-action-buttons';
        buttonsDiv.innerHTML = buttons.map(btn => 
            `<button class="assistant-action-btn" onclick="(function(){ ${btn.action.toString()} })()">${btn.text}</button>`
        ).join('');
        
        // Безопасный способ добавления обработчиков
        messagesContainer.appendChild(buttonsDiv);
        const btns = buttonsDiv.querySelectorAll('.assistant-action-btn');
        btns.forEach((btn, idx) => {
            btn.onclick = () => {
                buttons[idx].action();
                const chat = document.getElementById('assistant-chat');
                if (chat) chat.classList.remove('open');
            };
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Стили
function addAssistantStyles() {
    if (document.getElementById('assistant-styles')) return;
    
    const styles = `
        <style id="assistant-styles">
            .assistant-widget {
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 1000;
                font-family: 'Inter', sans-serif;
            }
            
            .assistant-toggle {
                width: 56px;
                height: 56px;
                border-radius: 28px;
                background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: transform 0.2s, box-shadow 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .assistant-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }
            
            .assistant-toggle .material-symbols-outlined {
                font-size: 28px;
                color: var(--on-primary-fixed);
            }
            
            .assistant-chat {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 380px;
                height: 500px;
                background: var(--surface-lowest);
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
                border: 1px solid rgba(172,173,179,0.1);
            }
            
            .assistant-chat.open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .assistant-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
                color: var(--on-primary-fixed);
            }
            
            .assistant-header-info {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
            }
            
            .assistant-close {
                background: none;
                border: none;
                cursor: pointer;
                color: var(--on-primary-fixed);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .assistant-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .assistant-message {
                display: flex;
                gap: 10px;
                max-width: 85%;
            }
            
            .assistant-message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }
            
            .assistant-message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 16px;
                background: var(--surface-high);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .assistant-message.user .assistant-message-avatar {
                background: var(--primary-fixed);
            }
            
            .assistant-message-text {
                background: var(--surface-low);
                padding: 10px 14px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
                color: var(--on-surface);
            }
            
            .assistant-message.user .assistant-message-text {
                background: var(--primary-fixed);
                color: var(--on-primary-fixed);
            }
            
            .thinking .dot {
                display: inline-block;
                animation: dotPulse 1.5s infinite;
                opacity: 0;
                margin: 0 2px;
            }
            
            .thinking .dot:nth-child(2) { animation-delay: 0.5s; }
            .thinking .dot:nth-child(3) { animation-delay: 1s; }
            
            @keyframes dotPulse {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
            
            .assistant-quick {
                padding: 12px 16px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                border-top: 1px solid var(--surface-container);
                background: var(--surface-low);
            }
            
            .assistant-quick-btn {
                background: var(--surface-high);
                border: none;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                color: var(--on-surface);
            }
            
            .assistant-quick-btn:hover {
                background: var(--surface-container);
                transform: scale(1.02);
            }
            
            .assistant-input-area {
                display: flex;
                padding: 12px 16px;
                gap: 8px;
                border-top: 1px solid var(--surface-container);
                background: var(--surface-lowest);
            }
            
            .assistant-input {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid var(--surface-container);
                border-radius: 24px;
                background: var(--surface-low);
                color: var(--on-surface);
                font-family: inherit;
                font-size: 14px;
                outline: none;
            }
            
            .assistant-input:focus {
                border-color: var(--primary);
            }
            
            .assistant-send {
                width: 40px;
                height: 40px;
                border-radius: 20px;
                background: var(--primary-fixed);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }
            
            .assistant-send:hover {
                transform: scale(1.05);
            }
            
            .assistant-send .material-symbols-outlined {
                font-size: 20px;
                color: var(--on-primary-fixed);
            }
            
            .assistant-action-buttons {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 8px;
            }
            
            .assistant-action-btn {
                background: var(--surface-high);
                border: none;
                padding: 8px 16px;
                border-radius: 24px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                color: var(--primary);
                font-weight: 500;
            }
            
            .assistant-action-btn:hover {
                background: var(--surface-container);
                transform: scale(1.02);
            }
            
            @media (max-width: 768px) {
                .assistant-chat {
                    width: calc(100vw - 40px);
                    right: 0;
                    bottom: 70px;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Смена языка ассистента (вызывается из основного переключателя языка)
function setAssistantLanguage(lang) {
    assistantLang = lang;
    localStorage.setItem('assistant_lang', lang);
    
    const t = assistantTranslations[lang];
    const titleEl = document.querySelector('.assistant-header-info span');
    const inputEl = document.getElementById('assistant-input');
    const welcomeMsg = document.querySelector('.assistant-message.bot .assistant-message-text');
    const quickContainer = document.getElementById('assistant-quick');
    
    if (titleEl) titleEl.textContent = t.title;
    if (inputEl) inputEl.placeholder = t.placeholder;
    if (welcomeMsg && welcomeMsg.textContent !== t.welcome) welcomeMsg.textContent = t.welcome;
    
    if (quickContainer) {
        const quickList = quickQuestions[lang];
        quickContainer.innerHTML = quickList.map(q => 
            `<button class="assistant-quick-btn" data-question="${q}">${q}</button>`
        ).join('');
        
        document.querySelectorAll('.assistant-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                const input = document.getElementById('assistant-input');
                if (input && question) {
                    input.value = question;
                    sendMessage();
                }
            });
        });
    }
}

// Инициализация
function initAssistant() {
    createAssistantWidget();
    console.log('🤖 Ассистент инициализирован');
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAssistant);
} else {
    initAssistant();
}