document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const loginButton = document.querySelector(".login-button");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    errorMessage.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    loginButton.classList.remove("shake");

    let isValid = true;

    if (!email) {
        emailError.textContent = "Будь ласка, введіть email.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent = "Невірний формат email.";
        isValid = false;
    }

    if (!password) {
        passwordError.textContent = "Будь ласка, введіть пароль.";
        isValid = false;
    }

    if (!isValid) {
        loginButton.classList.add("shake");
        return;
    }

    loginButton.textContent = "⏳ Вхід...";
    loginButton.disabled = true;

    fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => {
            if (!response.ok) throw new Error("Невірний email або пароль");
            return response.json();
        })
        .then(data => {
            alert(`✅ Вхід успішний! Ваша роль: ${data.role}`);
            localStorage.setItem("name", data.name);
            console.log("Відповідь від сервера:", data);
            if (data.role == "students"){
                window.location.href = "dashboard.html";
            }
            else {
                if (data.role == "parents") {
                    window.location.href = "parents/parents_dashboard.html";
                } else {
                    if (data.role == "teachers") {
                        window.location.href = "teacher/teacher_dashboard.html";
                    }
                }
            }
            localStorage.setItem("role", data.role);
            localStorage.setItem("login", data.login)
            localStorage.setItem("id", data.id)
        })
        .catch(error => {
            errorMessage.textContent = "❌ " + error.message;
            loginButton.classList.add("shake");
        })
        .finally(() => {
            loginButton.textContent = "Увійти";
            loginButton.disabled = false;
        });
});
