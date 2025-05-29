package main.java.com.example.demo.Controllers.web;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import main.java.com.example.demo.Controllers.database.UserChecker;
import main.java.com.example.demo.Controllers.database.UserService;
import main.java.com.example.demo.models.roles.Parent;
import main.java.com.example.demo.models.roles.Student;
import main.java.com.example.demo.models.roles.Teacher;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class WebAuthController {

    // Обробник для реєстрації
    public static class RegistrationHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Дозволити CORS
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            // Обробка preflight-запиту
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, "{\"error\":\"Method Not Allowed\"}", 405);
                return;
            }

            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            System.out.println("Request body: " + body); // Для дебагу

            try {
                JsonObject json = JsonParser.parseString(body).getAsJsonObject();

                String username = json.has("username") && !json.get("username").isJsonNull()
                        ? json.get("username").getAsString() : null;
                String email = json.has("email") && !json.get("email").isJsonNull()
                        ? json.get("email").getAsString() : null;
                String password = json.has("password") && !json.get("password").isJsonNull()
                        ? json.get("password").getAsString() : null;
                String role = json.has("role") && !json.get("role").isJsonNull()
                        ? json.get("role").getAsString() : null;
                System.out.println("Parsed username: " + username);
                System.out.println("Parsed email: " + email);
                System.out.println("Parsed password: " + password);
                System.out.println("Parsed role: " + role);

                if (username == null || username.isEmpty() ||
                        email == null || email.isEmpty() ||
                        password == null || password.isEmpty() ||
                        role == null || role.isEmpty()) {

                    sendResponse(exchange, "{\"error\":\"Missing required fields\"}", 400);
                    return;
                }

                if (!role.equals("students") && !role.equals("teachers") && !role.equals("parents")) {
                    sendResponse(exchange, "{\"error\":\"Invalid role\"}", 400);
                    return;
                }

                // Тут логіка збереження користувача (заміни на свій UserService)
                boolean registered = false;
                if (role.equals("students")) {
                    UserService.createStudent(new Student(username, email, password));
                    registered = true;
                } else if (role.equals("teachers")) {
                    UserService.createTeacher(new Teacher(username, email, password));
                    registered = true;
                } else if (role.equals("parents")) {
                    UserService.createParent(new Parent(username, email, password));
                    registered = true;
                }

                if (registered) {
                    sendResponse(exchange, "{\"message\":\"Registration successful\"}", 200);
                } else {
                    sendResponse(exchange, "{\"error\":\"User already exists or DB error\"}", 500);
                }

            } catch (Exception e) {
                e.printStackTrace();
                sendResponse(exchange, "{\"error\":\"Invalid JSON format or server error\"}", 400);
            }
        }

        private void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
            byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(statusCode, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }


    }

    // Обробник для логіну
    public static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Дозволити CORS
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            // Обробка preflight-запиту
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, "{\"error\":\"Method Not Allowed\"}", 405);
                return;
            }

            // Читаємо тіло запиту
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);

            try {
                JsonObject json = JsonParser.parseString(body).getAsJsonObject();
                String email = json.has("email") ? json.get("email").getAsString() : null;
                String password = json.has("password") ? json.get("password").getAsString() : null;

                if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                    sendResponse(exchange, "{\"error\":\"Missing email or password\"}", 400);
                    return;
                }

                // Твоя логіка перевірки користувача
                Student s = new Student(email, password);
                Parent p = new Parent(email, password);
                Teacher t = new Teacher(email, password);

                boolean loginStudent = UserChecker.checkStudent(s);
                boolean loginParent = UserChecker.checkParent(p);
                boolean loginTeacher = UserChecker.checkTeacher(t);

                String role = loginTeacher ? t.getStatus()
                        : loginStudent ? s.getStatus()
                        : loginParent ? p.getStatus()
                        : null;
                if (role != null) {
                    String name = UserChecker.getName(email, role);
                    int id = UserChecker.getUserIdByLoginAndRole(email,role);
                    JsonObject responseJson = new JsonObject();
                    responseJson.addProperty("role", role);
                    responseJson.addProperty("name", name);
                    responseJson.addProperty("id", id);
                    sendResponse(exchange, responseJson.toString(), 200);
                } else {
                    sendResponse(exchange, "{\"error\":\"Invalid email or password\"}", 401);
                }

            } catch (Exception e) {
                sendResponse(exchange, "{\"error\":\"Invalid JSON format\"}", 400);
            }
        }
    }
    private static void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }


    // Допоміжний метод для розбору параметрів
    private static Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<>();
        if (query == null) return result;
        for (String param : query.split("&")) {
            String[] entry = param.split("=");
            if (entry.length > 1) {
                result.put(URLDecoder.decode(entry[0], StandardCharsets.UTF_8),
                        URLDecoder.decode(entry[1], StandardCharsets.UTF_8));
            } else {
                result.put(URLDecoder.decode(entry[0], StandardCharsets.UTF_8), "");
            }
        }
        return result;
    }
}
