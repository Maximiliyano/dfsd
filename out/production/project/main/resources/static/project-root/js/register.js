document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки

    // Отримуємо поля форми
    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    // Отримуємо поля для відображення помилок
    const fullnameError = document.getElementById("fullnameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const errorMessage = document.getElementById("errorMessage");

    // Очищаємо попередні помилки
    fullnameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Перевірка імені
    if (!fullname.value.trim()) {
        fullnameError.textContent = "Введіть ім'я та прізвище";
        isValid = false;
    }

    // Перевірка email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.textContent = "Введіть email";
        isValid = false;
    } else if (!emailPattern.test(email.value)) {
        emailError.textContent = "Невірний формат email";
        isValid = false;
    }

    // Перевірка пароля (мінімум 6 символів)
    if (!password.value.trim()) {
        passwordError.textContent = "Введіть пароль";
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.textContent = "Пароль має містити щонайменше 6 символів";
        isValid = false;
    }

    // Якщо всі перевірки пройдені – перенаправляємо на dashboard.html
    if (isValid) {
        document.getElementById("register")
        let text = document.getElementById("fullname").value.trim();
        if (text) {
            localStorage.setItem("name", text);
            window.location.href = "dashboard.html";
        }
    }
});