const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Налаштування парсингу JSON
app.use(bodyParser.json());

// Налаштування з'єднання з базою даних
const db = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database",
});

// Підключення до бази даних
db.connect((err) => {
  if (err) {
    console.error("Помилка підключення до бази даних:", err);
    return;
  }
  console.log("Підключено до бази даних MySQL");
});

// Обробка POST-запиту для збереження події
app.post("/api/events", (req, res) => {
  const {
    title,
    type,
    date,
    time,
    duration,
    description,
    location,
    participants,
    hideContentUntil,
    task,
  } = req.body;

  const eventQuery = `
    INSERT INTO events (title, type, date, time, duration, description, location, participants, hideContentUntil)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    eventQuery,
    [
      title,
      type,
      date,
      time,
      duration,
      description,
      location,
      participants,
      hideContentUntil,
    ],
    (err, result) => {
      if (err) {
        console.error("Помилка при збереженні події:", err);
        res.status(500).json({ error: "Помилка при збереженні події" });
        return;
      }

      const eventId = result.insertId;

      if (task) {
        const taskQuery = `
          INSERT INTO tasks (event_id, title, dueDate, description)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          taskQuery,
          [eventId, task.title, task.dueDate, task.description],
          (err) => {
            if (err) {
              console.error("Помилка при збереженні завдання:", err);
              res
                .status(500)
                .json({ error: "Помилка при збереженні завдання" });
              return;
            }

            res.status(201).json({ id: eventId, message: "Подія та завдання збережені" });
          }
        );
      } else {
        res.status(201).json({ id: eventId, message: "Подія збережена" });
      }
    }
  );
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});
