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
        <p>Этот урок покрывает важные концеп
