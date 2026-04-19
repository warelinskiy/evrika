// ============================================
// АДМИН-ПАНЕЛЬ ЭВРИКА
// ============================================

// Конфигурация админов (UID пользователей, которые имеют доступ)
// Добавьте сюда UID пользователей, которые должны быть админами
const ADMIN_UIDs = [
    'KS7Weht01od4kA9tTQpo7jykysh2'
    // 'UID_ПОЛЬЗОВАТЕЛЯ_2',  // Добавьте сюда UID второго админа
];

// Функция проверки, является ли пользователь админом
window.isAdmin = function(user) {
    if (!user) return false;
    return ADMIN_UIDs.includes(user.uid);
};

// Функция добавления нового админа (только для существующих админов)
window.addAdmin = async function(newAdminUid) {
    if (!currentUser || !isAdmin(currentUser)) {
        showNotification('Доступ запрещен', 'error');
        return false;
    }
    
    if (!ADMIN_UIDs.includes(newAdminUid)) {
        ADMIN_UIDs.push(newAdminUid);
        // Сохраняем в localStorage для persistence
        localStorage.setItem('eureka_admins', JSON.stringify(ADMIN_UIDs));
        showNotification('Админ добавлен', 'success');
        return true;
    }
    return false;
};

// Функция удаления админа
window.removeAdmin = async function(adminUid) {
    if (!currentUser || !isAdmin(currentUser)) {
        showNotification('Доступ запрещен', 'error');
        return false;
    }
    
    const index = ADMIN_UIDs.indexOf(adminUid);
    if (index > -1 && ADMIN_UIDs.length > 1) {
        ADMIN_UIDs.splice(index, 1);
        localStorage.setItem('eureka_admins', JSON.stringify(ADMIN_UIDs));
        showNotification('Админ удален', 'success');
        return true;
    }
    return false;
};

// Загрузка сохраненных админов из localStorage
function loadSavedAdmins() {
    const saved = localStorage.getItem('eureka_admins');
    if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach(uid => {
            if (!ADMIN_UIDs.includes(uid)) {
                ADMIN_UIDs.push(uid);
            }
        });
    }
}
loadSavedAdmins();

// Рендер админ-панели
window.renderAdminPanel = async function() {
    const container = document.getElementById('admin-container');
    if (!container) return;
    
    if (!currentUser) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem;">
                <div style="font-size:4rem;">🔒</div>
                <h2>Доступ запрещен</h2>
                <p>Пожалуйста, войдите в аккаунт</p>
                <button class="btn-primary" onclick="openAuthModal()">Войти</button>
            </div>
        `;
        return;
    }
    
    if (!isAdmin(currentUser)) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem;">
                <div style="font-size:4rem;">🚫</div>
                <h2>Нет доступа</h2>
                <p>У вас нет прав администратора</p>
            </div>
        `;
        return;
    }
    
    // Показываем загрузку
    container.innerHTML = '<div style="text-align:center; padding:2rem;">Загрузка статистики...</div>';
    
    // Собираем статистику
    const stats = await collectStatistics();
    
    container.innerHTML = `
        <div class="admin-panel">
            <div class="admin-header">
                <h1 class="admin-title">📊 Админ-панель Эврика</h1>
                <p class="admin-subtitle">Управление платформой и аналитика</p>
            </div>
            
            <!-- Статистика -->
            <div class="stats-grid">
                <div class="stat-card-large">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalUsers}</div>
                        <div class="stat-label">Всего пользователей</div>
                        <div class="stat-change">+${stats.newUsersThisMonth} за месяц</div>
                    </div>
                </div>
                <div class="stat-card-large">
                    <div class="stat-icon">📚</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalCourses}</div>
                        <div class="stat-label">Всего курсов</div>
                        <div class="stat-change">+${stats.newCoursesThisMonth} за месяц</div>
                    </div>
                </div>
                <div class="stat-card-large">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalLessonsCompleted}</div>
                        <div class="stat-label">Пройдено уроков</div>
                        <div class="stat-change">всего на платформе</div>
                    </div>
                </div>
                <div class="stat-card-large">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalHours}</div>
                        <div class="stat-label">Часов обучения</div>
                        <div class="stat-change">всего на платформе</div>
                    </div>
                </div>
            </div>
            
            <!-- Дополнительная статистика -->
            <div class="stats-secondary">
                <div class="stat-card">
                    <div class="stat-icon-small">📈</div>
                    <div class="stat-number-small">${stats.activeUsersThisWeek}</div>
                    <div class="stat-label-small">Активных на этой неделе</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-small">🎓</div>
                    <div class="stat-number-small">${stats.graduates}</div>
                    <div class="stat-label-small">Выпускников курса</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-small">⭐</div>
                    <div class="stat-number-small">${stats.averageProgress}%</div>
                    <div class="stat-label-small">Средний прогресс</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-small">🏆</div>
                    <div class="stat-number-small">${stats.topStudent}</div>
                    <div class="stat-label-small">Лидер по урокам</div>
                </div>
            </div>
            
            <!-- Таблица пользователей -->
            <div class="admin-section">
                <h2 class="section-title">👥 Пользователи платформы</h2>
                <div class="users-table-container">
                    <table class="users-table">
                        <thead>
                            <tr>
                                <th>Аватар</th>
                                <th>Имя</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Уроков</th>
                                <th>Прогресс</th>
                                <th>Дата регистрации</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.users.map(user => `
                                <tr>
                                    <td class="user-avatar-cell">${user.avatar || '👤'}</td>
                                    <td><strong>${escapeHtml(user.name || '-')}</strong></td>
                                    <td>@${escapeHtml(user.username || '-')}</td>
                                    <td>${escapeHtml(user.email || '-')}</td>
                                    <td>${user.completedLessons || 0}</td>
                                    <td>
                                        <div class="progress-bar-small">
                                            <div class="progress-fill-small" style="width: ${Math.round((user.completedLessons || 0) / 18 * 100)}%"></div>
                                        </div>
                                        <span class="progress-text">${Math.round((user.completedLessons || 0) / 18 * 100)}%</span>
                                    </td>
                                    <td>${formatDateShort(user.createdAt)}</td>
                                    <td>
                                        <button class="admin-action-btn ${isAdmin({ uid: user.uid }) ? 'admin-active' : ''}" 
                                                onclick="toggleAdminStatus('${user.uid}', '${user.name || user.email}')">
                                            ${isAdmin({ uid: user.uid }) ? '👑 Убрать админа' : '⭐ Сделать админом'}
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

// Сбор статистики
async function collectStatistics() {
    try {
        // Получаем всех пользователей из Firestore
        const usersSnapshot = await db.collection('users').get();
        const users = [];
        let totalLessons = 0;
        let totalHours = 0;
        let now = new Date();
        let monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        let weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        let newUsersThisMonth = 0;
        let activeUsersThisWeek = 0;
        let graduates = 0;
        let totalProgress = 0;
        let topLessons = 0;
        let topStudent = '-';
        
        usersSnapshot.forEach(doc => {
            const user = doc.data();
            const completed = user.completedLessons?.length || 0;
            const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
            
            users.push({
                uid: doc.id,
                ...user,
                completedLessons: completed
            });
            
            totalLessons += completed;
            totalHours += completed * 2;
            totalProgress += completed;
            
            if (createdAt > monthAgo) newUsersThisMonth++;
            if (createdAt > weekAgo) activeUsersThisWeek++;
            if (completed >= 18) graduates++;
            if (completed > topLessons) {
                topLessons = completed;
                topStudent = user.name || user.username || user.email?.split('@')[0] || '-';
            }
        });
        
        // Получаем курсы
        const coursesSnapshot = await db.collection('courses').get();
        let totalCourses = coursesSnapshot.size;
        let newCoursesThisMonth = 0;
        
        coursesSnapshot.forEach(doc => {
            const course = doc.data();
            const createdAt = course.createdAt?.toDate ? course.createdAt.toDate() : new Date(course.createdAt);
            if (createdAt > monthAgo) newCoursesThisMonth++;
        });
        
        // Сортируем пользователей по дате регистрации
        users.sort((a, b) => {
            let dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            let dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA;
        });
        
        return {
            totalUsers: usersSnapshot.size,
            newUsersThisMonth,
            totalCourses,
            newCoursesThisMonth,
            totalLessonsCompleted: totalLessons,
            totalHours: totalHours,
            activeUsersThisWeek,
            graduates,
            averageProgress: users.length > 0 ? Math.round((totalProgress / (users.length * 18)) * 100) : 0,
            topStudent: topStudent,
            users: users.slice(0, 50) // Показываем последних 50 пользователей
        };
    } catch (error) {
        console.error('Ошибка сбора статистики:', error);
        return {
            totalUsers: 0,
            newUsersThisMonth: 0,
            totalCourses: 0,
            newCoursesThisMonth: 0,
            totalLessonsCompleted: 0,
            totalHours: 0,
            activeUsersThisWeek: 0,
            graduates: 0,
            averageProgress: 0,
            topStudent: '-',
            users: []
        };
    }
}

// Переключение статуса админа
window.toggleAdminStatus = async function(uid, name) {
    if (!currentUser || !isAdmin(currentUser)) {
        showNotification('Доступ запрещен', 'error');
        return;
    }
    
    if (isAdmin({ uid })) {
        if (ADMIN_UIDs.length === 1) {
            showNotification('Нельзя удалить последнего админа', 'error');
            return;
        }
        if (confirm(`Убрать права администратора у ${name}?`)) {
            const index = ADMIN_UIDs.indexOf(uid);
            if (index > -1) {
                ADMIN_UIDs.splice(index, 1);
                localStorage.setItem('eureka_admins', JSON.stringify(ADMIN_UIDs));
                showNotification('Права администратора удалены', 'success');
                renderAdminPanel();
            }
        }
    } else {
        if (confirm(`Дать права администратора ${name}?`)) {
            ADMIN_UIDs.push(uid);
            localStorage.setItem('eureka_admins', JSON.stringify(ADMIN_UIDs));
            showNotification('Права администратора выданы', 'success');
            renderAdminPanel();
        }
    }
};

// Форматирование даты
function formatDateShort(date) {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// Добавляем стили для админ-панели
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .admin-panel {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .admin-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .admin-title {
        font-family: 'Manrope', sans-serif;
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
    }
    
    .admin-subtitle {
        color: var(--on-surface-variant);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .stat-card-large {
        background: var(--surface-lowest);
        border-radius: 1.5rem;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    .stat-icon {
        font-size: 3rem;
    }
    
    .stat-number {
        font-size: 2rem;
        font-weight: 800;
        color: var(--primary);
    }
    
    .stat-label {
        font-size: 0.875rem;
        color: var(--on-surface-variant);
    }
    
    .stat-change {
        font-size: 0.75rem;
        color: #10b981;
        margin-top: 0.25rem;
    }
    
    .stats-secondary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        background: var(--surface-low);
        border-radius: 1rem;
        padding: 1rem;
        text-align: center;
    }
    
    .stat-icon-small {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .stat-number-small {
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .stat-label-small {
        font-size: 0.75rem;
        color: var(--on-surface-variant);
    }
    
    .admin-section {
        background: var(--surface-lowest);
        border-radius: 1.5rem;
        padding: 1.5rem;
        margin-top: 2rem;
    }
    
    .section-title {
        font-family: 'Manrope', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }
    
    .users-table-container {
        overflow-x: auto;
    }
    
    .users-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .users-table th,
    .users-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--surface-container);
    }
    
    .users-table th {
        font-weight: 600;
        color: var(--on-surface-variant);
        font-size: 0.75rem;
        text-transform: uppercase;
    }
    
    .user-avatar-cell {
        font-size: 1.5rem;
    }
    
    .progress-bar-small {
        width: 80px;
        height: 6px;
        background: var(--surface-container);
        border-radius: 3px;
        overflow: hidden;
        display: inline-block;
        margin-right: 0.5rem;
    }
    
    .progress-fill-small {
        height: 100%;
        background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
        border-radius: 3px;
    }
    
    .progress-text {
        font-size: 0.75rem;
    }
    
    .admin-action-btn {
        background: var(--surface-high);
        border: none;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .admin-action-btn:hover {
        transform: scale(1.02);
    }
    
    .admin-action-btn.admin-active {
        background: #fef3c7;
        color: #92400e;
    }
`;

document.head.appendChild(adminStyles);

console.log('👑 Админ-панель загружена');
