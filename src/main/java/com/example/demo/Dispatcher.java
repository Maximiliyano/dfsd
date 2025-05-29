package main.java.com.example.demo;

import com.sun.net.httpserver.HttpServer;
import main.java.com.example.demo.Controllers.database.TaskService;
import main.java.com.example.demo.Controllers.web.WebTaskController;
import main.java.com.example.demo.Controllers.web.WebAuthController;
import main.java.com.example.demo.models.events.Task;

import java.net.InetSocketAddress;
import java.time.LocalDate;
import java.util.Arrays;

public class Dispatcher {
    public static void main(String[] args) {
        try {
            // Підключення до бази даних
            Database.connect();
            System.out.println("База даних підключена успішно.");

            // Створення і запуск HTTP сервера
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
            server.createContext("/api/login", new WebAuthController.LoginHandler());
            //server.createContext("/api/tasks", new TaskHandler());
            server.createContext("/api/register", new WebAuthController.RegistrationHandler());
            server.createContext("/api/create-task", new WebTaskController.CreateTaskHandler());
            server.createContext("/api/render-tasks", new WebTaskController.TaskRenderer());
            System.out.println("Сервер запущено на порту 8080");
            server.setExecutor(null); // Стандартний пул потоків
            server.start();
            System.out.println("Server started at http://localhost:8080");

        } catch (Exception e) {
            System.err.println("Помилка в Dispatcher: " + e.getMessage());
            e.printStackTrace();
        }
    }
}