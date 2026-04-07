// Interactive JavaScript functionality for navigation, forms, and page interactions for evrika educational platform

// Navigation functionality
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // Smooth scrolling to section
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Form functionality
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate form submission
        alert('Form submitted successfully!');
        form.reset(); // Reset the form
    });
});

// Page interactions functionality
const buttons = document.querySelectorAll('.interactive-button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Button clicked!');
    });
});