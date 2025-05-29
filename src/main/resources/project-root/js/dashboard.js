document.addEventListener("DOMContentLoaded", () => {
  const calendarContainer = document.getElementById("calendar");
  const currentMonthElement = document.getElementById("currentMonth");
  const prevButton = document.getElementById("prevMonth");
  const nextButton = document.getElementById("nextMonth");
  const modeButtons = document.querySelectorAll(".mode-button");
  const sidebar = document.querySelector(".sidebar");
  const navToggle = document.querySelector(".nav-toggle");
  const mainContent = document.querySelector(".main-content");

  let currentDate = new Date(2025, 3); // квітень
  let currentMode = "month";

  const events = {
    "2025-04-20": [{ title: "Контрольна з математики" }],
    "2025-04-22": [{ title: "Домашнє завдання з історії" }],
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function renderCalendar() {
    calendarContainer.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    if (currentMode === "month") {
      const monthName = capitalize(currentDate.toLocaleString("uk-UA", { month: "long" }));
      currentMonthElement.textContent = `${monthName} ${year}`;

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const dayEl = createDay(fullDate, i);
        calendarContainer.appendChild(dayEl);
      }

    } else if (currentMode === "week") {
      currentMonthElement.textContent = `Тиждень ${getWeekNumber(currentDate)} ${year}`;
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dayNum = date.getDate();
        const fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
        const dayEl = createDay(fullDate, `${dayNum}.${date.getMonth() + 1}`);
        calendarContainer.appendChild(dayEl);
      }

    } else if (currentMode === "day") {
      const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      currentMonthElement.textContent = `День ${day} ${capitalize(currentDate.toLocaleString("uk-UA", { month: "long" }))} ${year}`;
      const dayEl = createDay(fullDate, `📅 ${day}`);
      calendarContainer.appendChild(dayEl);

    } else if (currentMode === "year") {
      currentMonthElement.textContent = `Рік ${year}`;
      for (let m = 0; m < 12; m++) {
        const monthDate = new Date(year, m);
        const monthName = capitalize(monthDate.toLocaleString("uk-UA", { month: "long" }));
        const monthEl = document.createElement("div");
        monthEl.className = "calendar-month";
        monthEl.textContent = monthName;
        calendarContainer.appendChild(monthEl);
      }
    }
  }

  function createDay(fullDate, label) {
    const dayEl = document.createElement("div");
    dayEl.className = "calendar-day";
    dayEl.setAttribute("data-date", fullDate);
    dayEl.textContent = label;

    if (events[fullDate]) {
      events[fullDate].forEach(event => {
        const ev = document.createElement("div");
        ev.className = "event";
        ev.textContent = event.title;
        dayEl.appendChild(ev);
      });
    }

    return dayEl;
  }

  function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  }

  prevButton.addEventListener("click", () => {
    if (currentMode === "month") currentDate.setMonth(currentDate.getMonth() - 1);
    else if (currentMode === "week") currentDate.setDate(currentDate.getDate() - 7);
    else if (currentMode === "day") currentDate.setDate(currentDate.getDate() - 1);
    else if (currentMode === "year") currentDate.setFullYear(currentDate.getFullYear() - 1);
    renderCalendar();
  });

  nextButton.addEventListener("click", () => {
    if (currentMode === "month") currentDate.setMonth(currentDate.getMonth() + 1);
    else if (currentMode === "week") currentDate.setDate(currentDate.getDate() + 7);
    else if (currentMode === "day") currentDate.setDate(currentDate.getDate() + 1);
    else if (currentMode === "year") currentDate.setFullYear(currentDate.getFullYear() + 1);
    renderCalendar();
  });

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMode = btn.dataset.mode;
      renderCalendar();
    });
  });

  renderCalendar();

  if (navToggle && sidebar) {
    navToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      if (mainContent) {
        mainContent.classList.toggle("sidebar-collapsed");
      }
    });
  }
});