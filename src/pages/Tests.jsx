// This file contains programming test examples

// Example 1: Factorial Function
const factorial = (n) => {
    if (n < 0) return 'Invalid input';
    if (n === 0) return 1;
    return n * factorial(n - 1);
};

// Example 2: Fibonacci Sequence
const fibonacci = (n) => {
    if (n < 0) return 'Invalid input';
    if (n === 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
};

// Example 3: Palindrome Checker
const isPalindrome = (str) => {
    const cleanedStr = str.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    return cleanedStr === cleanedStr.split('').reverse().join('');
};

export { factorial, fibonacci, isPalindrome };