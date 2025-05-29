document.addEventListener("DOMContentLoaded", () => {
    const addEventBtn = document.getElementById("addEventBtn");
    const eventModal = document.getElementById("eventModal");
    const closeModal = document.getElementById("closeModal");
    const eventForm = document.getElementById("eventForm");
    const eventsList = document.getElementById("eventsList");
    const includeTask = document.getElementById("includeTask");
    const taskSection = document.getElementById("taskSection");
    const eventTypeFilter = document.getElementById("eventTypeFilter");
    const statusFilter = document.getElementById("statusFilter");
    const searchInput = document.getElementById("searchInput");
  
    const navToggle = document.querySelector(".nav-toggle");
    const sidebar = document.querySelector(".sidebar");

    navToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  
    // Відкриття модального вікна
    addEventBtn.addEventListener("click", () => {
      eventModal.style.display = "block";
    });
  
    // Закриття модального вікна
    closeModal.addEventListener("click", () => {
      eventModal.style.display = "none";
      eventForm.reset();
      taskSection.style.display = "none";
    });
  
    // Показати/сховати секцію для завдання
    includeTask.addEventListener("change", () => {
      taskSection.style.display = includeTask.checked ? "block" : "none";
    });
  
    // Додавання нової події
    eventForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const title = document.getElementById("eventTitle").value;
      const type = document.getElementById("eventType").value;
      const date = document.getElementById("eventDate").value;
      const time = document.getElementById("eventTime").value;
      const description = document.getElementById("eventDescription").value;
  
      // Створення нової події
      const newEvent = document.createElement("div");
      newEvent.className = "event-card";
  
      newEvent.innerHTML = `
        <h3 class="event-title">${title}</h3>
        <div class="event-meta">
          <span class="event-date">${date} ${time}</span>
          <span class="event-type">${type}</span>
        </div>
        <p class="event-description">${description}</p>
        <button class="edit-event-btn">Редагувати</button>
        <div class="attendance-controls">
          <button class="confirm-attendance">Підтвердити участь</button>
          <button class="decline-attendance">Відмовитися</button>
        </div>
        <div class="comments-section">
          <h4>Коментарі</h4>
          <div class="comments-list"></div>
          <textarea class="comment-input" placeholder="Ваш коментар..."></textarea>
          <button class="submit-comment">Додати коментар</button>
        </div>
      `;
  
      // Додавання події у список
      eventsList.appendChild(newEvent);
      eventModal.style.display = "none";
      eventForm.reset();
      taskSection.style.display = "none";
  
      // Збереження події у localStorage
      const events = JSON.parse(localStorage.getItem("events")) || [];
      events.push({
        title,
        type,
        date,
        time,
        description,
      });
      localStorage.setItem("events", JSON.stringify(events));
    });
  
    // Завантаження подій з localStorage
    const loadEvents = () => {
      const events = JSON.parse(localStorage.getItem("events")) || [];
      eventsList.innerHTML = "";
      events.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = "event-card";
  
        eventElement.innerHTML = `
          <h3 class="event-title">${event.title}</h3>
          <div class="event-meta">
            <span class="event-date">${event.date} ${event.time}</span>
            <span class="event-type">${event.type}</span>
          </div>
          <p class="event-description">${event.description}</p>
          <button class="edit-event-btn">Редагувати</button>
          <div class="attendance-controls">
            <button class="confirm-attendance">Підтвердити участь</button>
            <button class="decline-attendance">Відмовитися</button>
          </div>
          <div class="comments-section">
            <h4>Коментарі</h4>
            <div class="comments-list"></div>
            <textarea class="comment-input" placeholder="Ваш коментар..."></textarea>
            <button class="submit-comment">Додати коментар</button>
          </div>
        `;
        eventsList.appendChild(eventElement);
      });
    };
  
    // Фільтрація подій за типом та статусом
    eventTypeFilter.addEventListener("change", filterEvents);
    statusFilter.addEventListener("change", filterEvents);
    searchInput.addEventListener("input", filterEvents);
  
    const filterEvents = () => {
      const type = eventTypeFilter.value;
      const status = statusFilter.value;
      const searchText = searchInput.value.toLowerCase();
  
      const events = JSON.parse(localStorage.getItem("events")) || [];
      const filteredEvents = events.filter(event => {
        const matchesType = type === "all" || event.type === type;
        const matchesStatus = status === "all" || (status === "upcoming" && new Date(`${event.date} ${event.time}`) > new Date()) || (status === "past" && new Date(`${event.date} ${event.time}`) < new Date());
        const matchesSearch = event.title.toLowerCase().includes(searchText) || event.date.includes(searchText);
        return matchesType && matchesStatus && matchesSearch;
      });
  
      eventsList.innerHTML = "";
      filteredEvents.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = "event-card";
  
        eventElement.innerHTML = `
          <h3 class="event-title">${event.title}</h3>
          <div class="event-meta">
            <span class="event-date">${event.date} ${event.time}</span>
            <span class="event-type">${event.type}</span>
          </div>
          <p class="event-description">${event.description}</p>
          <button class="edit-event-btn">Редагувати</button>
          <div class="attendance-controls">
            <button class="confirm-attendance">Підтвердити участь</button>
            <button class="decline-attendance">Відмовитися</button>
          </div>
          <div class="comments-section">
            <h4>Коментарі</h4>
            <div class="comments-list"></div>
            <textarea class="comment-input" placeholder="Ваш коментар..."></textarea>
            <button class="submit-comment">Додати коментар</button>
          </div>
        `;
        eventsList.appendChild(eventElement);
      });
    };
  
    loadEvents();  // Завантажуємо події при завантаженні сторінки
  });
//в майбудньому зробити запит на сервер з передачею даних цією події на сервер який має записати у базу даних 
fetch("http://localhost:8080/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      type,
      date,
      time,
      description
    })
  })
  .then(response => response.json())
  .then(data => console.log("Успіх:", data))
  .catch(error => console.error("Помилка:", error));
  