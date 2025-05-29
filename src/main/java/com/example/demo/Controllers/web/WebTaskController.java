package main.java.com.example.demo.Controllers.web;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import main.java.com.example.demo.Controllers.database.TaskService;
import main.java.com.example.demo.models.events.Task;

import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class WebTaskController {

    private static final Gson gson = new Gson();
    public static class CreateTaskHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            System.out.println("Method: " + exchange.getRequestMethod());

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                Headers headers = exchange.getResponseHeaders();
                headers.add("Access-Control-Allow-Origin", "*");
                headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                headers.add("Access-Control-Allow-Headers", "Content-Type");
                exchange.sendResponseHeaders(204, -1); // Без тіла
                return;
            }

            // Тепер безпечно перевіряти на POST
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");


            // Читаємо тіло запиту
            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
            JsonObject requestJson = gson.fromJson(isr, JsonObject.class);

            // Отримуємо поля з JSON
            String title = requestJson.has("title") ? requestJson.get("title").getAsString() : null;
            LocalDate localDueDate = LocalDate.parse(requestJson.get("dueDate").getAsString());
            java.sql.Date sqlDueDate = java.sql.Date.valueOf(localDueDate);
            String content = requestJson.has("content") ? requestJson.get("content").getAsString() : null;
            int teacherId = requestJson.has("teacher_id") ? requestJson.get("teacher_id").getAsInt() : -1;
            List<Integer> participants = new ArrayList<>();
            if (requestJson.has("participants") && requestJson.get("participants").isJsonArray()) {
                JsonArray participantsArray = requestJson.getAsJsonArray("participants");
                for (JsonElement el : participantsArray) {
                    participants.add(el.getAsInt());
                }
            }

            if (participants == null || participants.size() == 0) {
                sendResponse(exchange, 400, "Participants are required");
                return;
            }

            // Валідація даних (проста)
            if (title == null || sqlDueDate == null || content == null || teacherId == -1) {
                sendResponse(exchange, 400, "Missing required fields");
                return;
            }
            Task task = new Task(title, content, sqlDueDate, participants, teacherId);
            int id = TaskService.createTask(task);
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("task_id", id);
            byte[] responseBytes = gson.toJson(responseJson).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }
    }
    public  static class DeleteTaskHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            System.out.println("Method: " + exchange.getRequestMethod());

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                Headers headers = exchange.getResponseHeaders();
                headers.add("Access-Control-Allow-Origin", "*");
                headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                headers.add("Access-Control-Allow-Headers", "Content-Type");
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
            JsonObject requestJson = gson.fromJson(isr, JsonObject.class);

            int taskId = requestJson.has("task_id") ? requestJson.get("task_id").getAsInt() : -1;

            if (taskId == -1) {
                sendResponse(exchange, 400, "Missing or invalid task_id");
                return;
            }
            TaskService.deleteTaskById(taskId);
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("status", "deleted");
            responseJson.addProperty("task_id", taskId);
            byte[] responseBytes = gson.toJson(responseJson).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }
    }
    public static class TaskRenderer implements HttpHandler{
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                Headers headers = exchange.getResponseHeaders();
                headers.add("Access-Control-Allow-Origin", "*");
                headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                headers.add("Access-Control-Allow-Headers", "Content-Type");
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
                return;
            }

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Content-Type", "application/json");

            // Зчитуємо тіло запиту
            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
            JsonObject requestJson = new Gson().fromJson(isr, JsonObject.class);

            String login = requestJson.get("login").getAsString();
            String role = requestJson.get("role").getAsString();

            // TODO: Отримати список задач з бази даних
            List<Task> tasks = null; // реалізований метод, який ти раніше писав
            try {
                tasks = TaskService.getTasks(login, role);
            } catch (SQLException e) {
                e.printStackTrace();
            }

            // Перетворити список задач на JSON
            Gson gson = new Gson();
            String jsonResponse = gson.toJson(tasks);

            byte[] responseBytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, responseBytes.length);

            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }

    }
    private static void sendResponse(HttpExchange exchange, int statusCode, String message) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        JsonObject json = new JsonObject();
        json.addProperty("error", message);
        byte[] bytes = gson.toJson(json).getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
