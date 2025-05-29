document.addEventListener("DOMContentLoaded", () => {
  const modeButtons = document.querySelectorAll(".mode-button");
  const calendarView = document.getElementById("calendarView");
  const currentViewLabel = document.getElementById("currentView");
  const weekdayHeader = document.getElementById("weekdayHeader");
  const prevBtn = document.getElementById("prevView");
  const nextBtn = document.getElementById("nextView");
  const navToggle = document.querySelector(".nav-toggle");
  const sidebar = document.querySelector(".sidebar");
  let currentDate = new Date();
  let currentMode = "day";
  const eventTypes = {
    "Екзамен": "#e57373",
    "Контрольна робота": "#f6b633",
    "Шкільні заходи": "#64b5f6",
    "Батьківські збори": "#9575cd",
    "Особисті події": "#81c784"
  };
  const events = [
    {
      title: "Контрольна з історії",
      date: "2025-05-01",
      time: "10:00",
      duration: 60,
      location: "Кабінет 104",
      type: "Контрольна робота",
      content: "Повторити тему ІІ світової.",
      participants: ["Учні 9-А"]
    },
    {
      title: "Домашнє завдання з біології",
      date: "2025-05-01",
      time: "15:00",
      duration: 30,
      location: "Онлайн",
      type: "Особисті події",
      content: "Підготувати презентацію.",
      participants: []
    },
    {
      title: "Екзамен з фізики",
      date: "2025-05-02",
      time: "09:00",
      duration: 90,
      location: "Кабінет 301",
      type: "Екзамен",
      content: "Іспит з механіки.",
      participants: ["Учні 11-Б"]
    },
    {
      title: "Батьківські збори",
      date: "2025-05-03",
      time: "18:00",
      duration: 60,
      location: "Актова зала",
      type: "Батьківські збори",
      content: "Підсумки року.",
      participants: ["Батьки 9-А"]
    },
    {
      title: "Шкільна лінійка",
      date: "2025-05-05",
      time: "08:30",
      duration: 30,
      location: "Двір школи",
      type: "Шкільні заходи",
      content: "Оголошення результатів тижня.",
      participants: ["Всі"]
    },
    {
      title: "Особистий дедлайн",
      date: "2025-05-12",
      time: "21:00",
      duration: 30,
      location: "Онлайн",
      type: "Особисті події",
      content: "Здати проект до вчителя.",
      participants: []
    },
    {
      title: "Класна година",
      date: "2025-05-15",
      time: "12:00",
      duration: 45,
      location: "Кабінет 100",
      type: "Шкільні заходи",
      content: "Обговорення поведінки в класі.",
      participants: ["Класний керівник", "9-А"]
    }
  ];

  const genitiveMonths = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
  ];

  renderCalendar();

  navToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  prevBtn.addEventListener("click", () => {
    navigateDate(-1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    navigateDate(1);
    renderCalendar();
  });

  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".mode-button.active").classList.remove("active");
      btn.classList.add("active");
      currentMode = btn.dataset.mode;
      renderCalendar();
    });
  });

  function renderCalendar() {
    calendarView.innerHTML = "";
    weekdayHeader.classList.toggle("hidden", currentMode === "year" || currentMode === "day");

    switch (currentMode) {
      case "day":
        renderDayView();
        break;
      case "week":
        renderWeekView();
        break;
      case "month":
        renderMonthView();
        break;
      case "year":
        renderYearView();
        break;
    }
    updateHeaderText();
  }

  function updateHeaderText() {
    if (currentMode === "day") {
      const day = currentDate.getDate();
      const month = genitiveMonths[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      currentViewLabel.textContent = `${day} ${month} ${year}`;
    } else if (currentMode === "week") {
      const start = new Date(currentDate);
      const end = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay() + 1);
      end.setDate(start.getDate() + 6);

      const startDay = start.getDate();
      const startMonth = genitiveMonths[start.getMonth()];
      const endDay = end.getDate();
      const endMonth = genitiveMonths[end.getMonth()];
      const endYear = end.getFullYear();

      currentViewLabel.textContent = `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
    } else if (currentMode === "month") {
      const month = genitiveMonths[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      currentViewLabel.textContent = `${month} ${year}`;
    } else if (currentMode === "year") {
      currentViewLabel.textContent = currentDate.getFullYear();
    }
  }

  function renderDayView() {
    calendarView.className = "calendar-day-view";
    calendarView.innerHTML = "";

    for (let h = 7; h <= 16; h++) {
      const hourSlot = document.createElement("div");
      hourSlot.className = "hour-slot";
      hourSlot.textContent = `${h.toString().padStart(2, '0')}:00`;
      calendarView.appendChild(hourSlot);

      const dateStr = currentDate.toISOString().split("T")[0];
      const evts = events.filter(e => e.date === dateStr && parseInt(e.time.split(":")[0]) === h);
      evts.forEach(e => {
        const el = createEventElement(e);
        hourSlot.appendChild(el);
        el.style.position = "absolute";
        el.style.top = "0";
        el.style.height = "auto";
        el.style.width = "calc(100% - 10px)";
        el.style.margin = "5px";
      });
    }
  }

  function createPositionedEvent(event) {
    const el = createEventElement(event);
    const hourStart = parseInt(event.time.split(":")[0]);
    const hourOffset = hourStart - 7;

    el.style.gridRowStart = hourOffset + 1;
    el.style.gridRowEnd = "span 1";

    return el;
  }

  function renderWeekView() {
    calendarView.className = "calendar-week-grid";
    calendarView.innerHTML = `
        <div class="calendar-week-time-column">
          <div class="time-cell">07:00</div>
          <div class="time-cell">08:00</div>
          <div class="time-cell">09:00</div>
          <div class="time-cell">10:00</div>
          <div class="time-cell">11:00</div>
          <div class="time-cell">12:00</div>
          <div class="time-cell">13:00</div>
          <div class="time-cell">14:00</div>
          <div class="time-cell">15:00</div>
          <div class="time-cell">16:00</div>
            <div class="time-cell">17:00</div>
          <div class="time-cell">18:00</div>
        </div>
        <div class="calendar-week-days">
          <div class="day-column">
            <div class="week-date-label"></div>
            <div class="day-hour-grid"></div>
          </div>
          <div class="day-column">
            <div class="week-date-label"></div>
            <div class="day-hour-grid"></div>
          </div>
          <div class="day-column">
            <div class="week-date-label"></div>
            <div class="day-hour-grid"></div>
          </div>
          <div class="day-column">
            <div class="week-date-label"></div>
            <div class="day-hour-grid"></div>
          </div>
          <div class="day-column">
            <div class="week-date-label"></div>
            <div class="day-hour-grid"></div>
          </div>
          <div class="day-column">
            <div class="week-date-label"></div>
            <div class="day-hour-grid"></div>
          </div>
            <div class="day-column">
              <div class="week-date-label"></div>
              <div class="day-hour-grid"></div>
            </div>
        </div>
      `;

    const dayColumns = calendarView.querySelectorAll(".day-column");
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);

    dayColumns.forEach((dayCol, index) => {
      const d = new Date(start);
      d.setDate(start.getDate() + index);
      const iso = d.toISOString().split("T")[0];
      dayCol.querySelector(".week-date-label").textContent = d.getDate();
      const hourGrid = dayCol.querySelector(".day-hour-grid");
      const evts = events.filter(e => e.date === iso && parseInt(e.time.split(":")[0]) >= 7 && parseInt(e.time.split(":")[0]) <= 18);
      evts.forEach(e => {
        const el = createPositionedEvent(e);
        hourGrid.appendChild(el);
      });

      dayCol.addEventListener("click", (event) => {
        if (!event.target.classList.contains("event")) {
          currentDate = d;
          currentMode = "day";
          document.querySelector(".mode-button.active").classList.remove("active");
          document.querySelector('[data-mode="day"]').classList.add("active");
          renderCalendar();
        }
      });
    });
  }

  function renderMonthView() {
    calendarView.className = "calendar-month-view";
    calendarView.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDay; i++) {
      calendarView.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const iso = date.toISOString().split("T")[0];
      const cell = document.createElement("div");
      cell.className = "calendar-day";

      const dayHeader = document.createElement("div");
      dayHeader.className = "day-header";
      const dayNumber = document.createElement("span");
      dayNumber.className = "day-number";
      dayNumber.textContent = d;
      dayHeader.appendChild(dayNumber);

      const evts = events.filter(e => e.date === iso);
      const eventCount = document.createElement("span");
      eventCount.className = "event-count";
      eventCount.textContent = `Події: ${evts.length}`;
      dayHeader.appendChild(eventCount);
      cell.appendChild(dayHeader);

      evts.forEach(e => {
        const el = createEventElement(e, true);
        cell.appendChild(el);
      });

      cell.addEventListener("click", (event) => {
        if (!event.target.classList.contains("event")) {
          currentDate = date;
          currentMode = "day";
          document.querySelector(".mode-button.active").classList.remove("active");
          document.querySelector('[data-mode="day"]').classList.add("active");
          renderCalendar();
        }
      });

      calendarView.appendChild(cell);
    }
  }

  function renderYearView() {
    calendarView.className = "calendar-year-view";
    calendarView.innerHTML = "";

    const year = currentDate.getFullYear();
    for (let month = 0; month < 12; month++) {
      const monthDiv = document.createElement("div");
      monthDiv.className = "year-month";

      const monthLabel = document.createElement("div");
      monthLabel.className = "month-label";
      monthLabel.textContent = genitiveMonths[month].toUpperCase();
      monthDiv.appendChild(monthLabel);

      const daysGrid = document.createElement("div");
      daysGrid.className = "year-days-grid";

      const firstDayOfMonth = new Date(year, month, 1).getDay() || 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 1; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "year-day empty";
        daysGrid.appendChild(emptyDay);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const iso = date.toISOString().split("T")[0];
        const dayDiv = document.createElement("div");
        dayDiv.className = "year-day";
        dayDiv.textContent = day;

        const hasEvent = events.some(e => e.date === iso);
        if (hasEvent) {
          dayDiv.classList.add("has-event");
          dayDiv.addEventListener("click", () => {
            currentDate = date;
            currentMode = "day";
            document.querySelector(".mode-button.active").classList.remove("active");
            document.querySelector('[data-mode="day"]').classList.add("active");
            renderCalendar();
          });
        }

        daysGrid.appendChild(dayDiv);
      }

      monthDiv.appendChild(daysGrid);
      calendarView.appendChild(monthDiv);
    }
  }


  function createEventElement(event, isMonthMode = false) {
    const el = document.createElement("div");
    el.className = "event";
    el.style.borderLeft = `4px solid ${eventTypes[event.type] || "#aaa"}`;
    el.textContent = event.title;
    el.title = event.title;

    if (isMonthMode) {
      el.addEventListener("mouseenter", e => showTooltip(e, event));
      el.addEventListener("mouseleave", hideTooltip);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        showModal(event);
      });
      el.addEventListener("blur", hideTooltip);
    } else {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        showModal(event);
      });
    }
    return el;
  }

  let currentTooltip = null;

  function showTooltip(e, event) {
    hideTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerHTML = `
        <strong>${event.title}</strong><br>
        ${event.time} – ${event.location}
      `;
    document.body.appendChild(tooltip);

    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    tooltip.style.left = `${rect.left + window.scrollX + 5}px`;

    currentTooltip = tooltip;

    const removeTooltip = () => {
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
      }
    };

    document.addEventListener("click", removeTooltip, { once: true });
    document.addEventListener("keydown", removeTooltip, { once: true });
    e.target.addEventListener("mouseleave", hideTooltip, { once: true });
  }

  function hideTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }

  function showModal(event) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-window" style="z-index: 9999;">
          <h2>${event.title}</h2>
          <p><strong>Дата:</strong> ${event.date}</p>
          <p><strong>Час:</strong> ${event.time}</p>
          <p><strong>Тривалість:</strong> ${event.duration} хв</p>
          <p><strong>Місце:</strong> ${event.location}</p>
          <p><strong>Тип:</strong> ${event.type}</p>
          <p><strong>Зміст:</strong> ${event.content}</p>
          <p><strong>Учасники:</strong> ${event.participants?.join(", ") || "—"}</p>
          <button class="close-modal">Закрити</button>
        </div>
      `;
    document.body.appendChild(modal);
    modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());
  }

  function navigateDate(step) {
    if (currentMode === "day") {
      currentDate.setDate(currentDate.getDate() + step);
    } else if (currentMode === "week") {
      currentDate.setDate(currentDate.getDate() + (step * 7));
    } else if (currentMode === "month") {
      currentDate.setMonth(currentDate.getMonth() + step);
    } else if (currentMode === "year") {
      currentDate.setFullYear(currentDate.getFullYear() + step);
    }
  }
});