document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const navToggle = document.querySelector(".nav-toggle");
    const calendar = document.getElementById("calendar");
    const currentMonth = document.getElementById("currentMonth");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");
    const modeButtons = document.querySelectorAll(".mode-button");
    const tasksList = document.getElementById("tasksList");

    let currentDate = new Date();
    let currentMonthIndex = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function displayCalendar(month, year, mode = "month") {
        currentDate.setFullYear(year, month, 1);
        currentMonth.textContent = currentDate.toLocaleString("uk-UA", { month: "long", year: "numeric" });
        calendar.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        if (mode === "month") {
            for (let i = 0; i < firstDay; i++) {
                calendar.innerHTML += "<div class='calendar-day'></div>";
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const day = document.createElement("div");
                day.classList.add("calendar-day");
                day.textContent = i;
                calendar.appendChild(day);
            }
        }
    }

    function displayDetails(event, details) {
        if (!event.querySelector(".details")) {
            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("details");
            detailsDiv.innerHTML = `
                <h3>${details.title}</h3>
                <p>Дата: ${details.date}</p>
                <p>Час: ${details.time || "Немає часу"}</p>
                <p>Тривалість: ${details.duration || "Невідомо"}</p>
                <p>Місце: ${details.location || "Не вказано"}</p>
                <p>Учасники: ${details.participants ? details.participants.join(", ") : "Немає"}</p>
                <p>Тип: ${details.type || "Невідомий"}</p>
                <p>Зміст: ${details.content}</p>
            `;
            event.appendChild(detailsDiv);
        }
    }

    function hideDetails(event) {
        setTimeout(() => {
            const detailsDiv = event.querySelector(".details");
            if (detailsDiv) {
                detailsDiv.remove();
            }
        }, 300);
    }

    prevMonth.addEventListener("click", () => {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
            currentMonthIndex = 11;
            currentYear--;
        }
        displayCalendar(currentMonthIndex, currentYear);
    });

    nextMonth.addEventListener("click", () => {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0;
            currentYear++;
        }
        displayCalendar(currentMonthIndex, currentYear);
    });

    modeButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".mode-button.active").classList.remove("active");
            button.classList.add("active");
            displayCalendar(currentMonthIndex, currentYear, button.dataset.mode);
        });
    });

    tasksList.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("task-item") && !event.target.querySelector(".details")) {
            const details = JSON.parse(event.target.dataset.details);
            displayDetails(event.target, details);
        }
    });

    tasksList.addEventListener("mouseout", (event) => {
        if (event.target.classList.contains("task-item")) {
            hideDetails(event.target);
        }
    });

    calendar.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("event") && !event.target.querySelector(".details")) {
            const details = JSON.parse(event.target.dataset.details);
            displayDetails(event.target, details);
        }
    });

    calendar.addEventListener("mouseout", (event) => {
        if (event.target.classList.contains("event")) {
            hideDetails(event.target);
        }
    });

    displayCalendar(currentMonthIndex, currentYear);

    navToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });

    const fadeInElements = document.querySelectorAll(".fade-in");
    fadeInElements.forEach(element => {
        element.style.animation = "fadeIn 0.5s ease-in-out";
    });

    const slideInLeftElements = document.querySelectorAll(".slide-in-left");
    slideInLeftElements.forEach(element => {
        element.style.animation = "slideInLeft 0.5s ease-in-out";
    });

    const slideInRightElements = document.querySelectorAll(".slide-in-right");
    slideInRightElements.forEach(element => {
        element.style.animation = "slideInRight 0.5s ease-in-out";
    });
});
