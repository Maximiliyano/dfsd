document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const errorMessage = document.getElementById("errorMessage");
    emailError.textContent = "";
    passwordError.textContent = "";
    errorMessage.textContent = "";
    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.textContent = "Введіть email";
        isValid = false;
    } else if (!emailPattern.test(email.value)) {
        emailError.textContent = "Невірний формат email";
        isValid = false;
    }
    if (!password.value.trim()) {
        passwordError.textContent = "Введіть пароль";
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.textContent = "Пароль має містити щонайменше 6 символів";
        isValid = false;
    }
    if (isValid) {
        document.getElementById("register")
        //fetch
        let text = document.getElementById("fullname").value.trim();
        if (text) {
            localStorage.setItem("name", text);
            window.location.href = "dashboard.html";
        }
    }
});