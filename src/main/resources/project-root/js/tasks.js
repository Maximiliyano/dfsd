// ==== Твій код для керування завданнями ====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
/*const login = localStorage.getItem('login');
const role = localStorage.getItem('role');
fetch("http://localhost:8080/api/render-tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ login, role })
})
    .then(res => res.json())
    .then(tasks => {
      console.log("Отримані задачі:", tasks);
      // tasks — це масив обʼєктів
    })
    .catch(err => {
      console.error("Помилка при отриманні задач:", err);
    });*/
const tasksList = document.getElementById("tasksList");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModal");
const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDueDateInput = document.getElementById("taskDueDate");
const taskContentInput = document.getElementById("taskContent");
const taskAssignmentsInput = document.getElementById("taskAssignments");
const associatedEventSelect = document.getElementById("associatedEvent");
const taskStatusFilter = document.getElementById("taskStatusFilter");
const searchInput = document.getElementById("searchInput");

const navToggle = document.querySelector(".nav-toggle");
const sidebar = document.querySelector(".sidebar");

navToggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

let editingTaskId = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const statusFilter = taskStatusFilter.value;
  const searchQuery = searchInput.value.toLowerCase();

  tasksList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && task.isCompleted) ||
        (statusFilter === "pending" && !task.isCompleted);

    const matchesSearch =
        task.title.toLowerCase().includes(searchQuery) ||
        task.content.toLowerCase().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  if (filteredTasks.length === 0) {
    tasksList.innerHTML = "<p>Завдань не знайдено.</p>";
    return;
  }

  filteredTasks.forEach(task => {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    if (task.isCompleted) taskCard.classList.add("completed");

    taskCard.innerHTML = `
      <h3>${task.title}</h3>
      <p><strong>До:</strong> ${new Date(task.dueDate).toLocaleString()}</p>
      <p>${task.content}</p>
      <p><strong>Учасники:</strong> ${task.participants || "немає"}</p>
      ${
        task.eventId
            ? `<p><em>Пов'язано з подією ID: ${task.eventId}</em></p>`
            : ""
    }
      <div class="task-actions">
        <button class="delete-task-btn" data-id="${task.id}">Видалити</button>
        <button class="toggle-status-btn" data-id="${task.id}">
          ${task.isCompleted ? "Позначити як невиконане" : "Позначити як виконане"}
        </button>
      </div>
    `;

    tasksList.appendChild(taskCard);
  });
}

function openModal() {
  taskModal.style.display = "flex";
}

function closeModal() {
  taskModal.style.display = "none";
  taskForm.reset();
  editingTaskId = null;
}
const title = taskTitleInput.value.trim();
const dueDate = taskDueDateInput.value;
const content = taskContentInput.value.trim();
const teacher_id = localStorage.getItem("id")
function handleAddTask(e) {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const dueDate = taskDueDateInput.value;
  const content = taskContentInput.value.trim();
  const teacher_id = localStorage.getItem("id")

  const participants = taskAssignmentsInput.value.trim().split(',')
      .map(p => parseInt(p.trim())).filter(p => !isNaN(p));

  const data = {
    participants: participants,
    title: title,
    dueDate : dueDate,
    content : content,
    teacher_id : teacher_id
  };

  console.log(data)

  fetch('http://localhost:8080/api/create-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
      .then(response => {
        if (!response.ok) throw new Error("Помилка запиту");
        return response.json();
      })
      .then(result => {
        console.log("Успішно відправлено:", result);
        localStorage.setItem("task_id",result)
        alert(`✅ Завдання створено: ${data}`);
      })
      .catch(error => {
        console.error("Помилка при відправці:", error);
      })


  const eventId = associatedEventSelect.value || null;

  if (!title || !dueDate) return;

  if (editingTaskId !== null) {
    const task = tasks.find(t => t.id === editingTaskId);
    task.title = title;
    task.dueDate = dueDate;
    task.content = content;
    task.participants = participants;
    task.eventId = eventId;
  } else {
    const newTask = {
      id: Date.now(),
      title,
      dueDate,
      content,
      participants,
      isCompleted: false,
      eventId,
    };
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  closeModal();

//запит на бекенд з передачею логін та ролі(вони кешуються їх просто зі складу привезти треба)

  /*fetch("http://localhost:8000/api/render-tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ login, role })
  })
      .then(res => res.json())
      .then(tasks => {
        console.log("Отримані задачі:", tasks);
        // tasks — це масив обʼєктів
      })
      .catch(err => {
        console.error("Помилка при отриманні задач:", err);
      });*/
}

// ==== Код для надсилання користувача на сервер ====
const addUserForm = document.getElementById("addUserForm");

if (addUserForm) {
  addUserForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("addUserRole").value;

    const userData = {
      username,
      email,
      password,
      role
    };

    console.log("Sending user:", userData);

    fetch("/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
          alert("Користувач доданий!");
          addUserForm.reset();
        })
        .catch(error => {
          console.error("Помилка додавання користувача:", error);
        });
  });
}

// ==== Події для завдань ====
tasksList.addEventListener("click", e => {
  const taskId = parseInt(e.target.dataset.id);

  if (e.target.classList.contains("edit-task-btn")) {
    const task = tasks.find(t => t.id === taskId);
    editingTaskId = taskId;
    taskTitleInput.value = task.title;
    taskDueDateInput.value = task.dueDate;
    taskContentInput.value = task.content;
    taskAssignmentsInput.value = task.participants || "";
    associatedEventSelect.value = task.eventId || "";
    openModal();
  }

  if (e.target.classList.contains("delete-task-btn")) {
    const confirmed = confirm("Ви впевнені, що хочете видалити це завдання?");
    if (confirmed) {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks();
      renderTasks();
    }
    /*fetch('http://localhost:8000/api/delete-task', {
      method: 'POST', // або 'DELETE', якщо бекенд це підтримує
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task_id: localStorage.getItem("task_id") // передаємо айді таска
      })
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('Помилка при видаленні таска');
          }
          return response.json();
        })
        .then(data => {
          console.log('Успішно видалено:', data);
        })
        .catch(error => {
          console.error('Сталася помилка:', error);
        });
        for the future because in future we will create this function
     */
  }

  if (e.target.classList.contains("toggle-status-btn")) {
    const task = tasks.find(t => t.id === taskId);
    task.isCompleted = !task.isCompleted;
    saveTasks();
    renderTasks();
  }
});

addTaskBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
taskForm.addEventListener("submit", handleAddTask);
searchInput.addEventListener("input", renderTasks);

renderTasks();