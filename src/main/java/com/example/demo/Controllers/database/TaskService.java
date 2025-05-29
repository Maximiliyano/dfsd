package main.java.com.example.demo.Controllers.database;

import com.google.gson.Gson;
import main.java.com.example.demo.Database;
import main.java.com.example.demo.models.events.Task;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TaskService {
    public static int createTask(Task t) {
        int generatedId = -1;
        try (Connection conn = Database.connect()) {
            String sql = "INSERT INTO tasks (teacher_id, title, description, due_date, students_id) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setInt(1, t.getTeacherId());
                stmt.setString(2, t.getTitle());
                stmt.setString(3, t.getContent());
                stmt.setDate(4, t.getEndDate());
                String json = new Gson().toJson(t.getStudentIds());
                stmt.setString(5, json);
                stmt.executeUpdate();

                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        generatedId = rs.getInt(1); // Повертає перший (і єдиний) ключ
                    }
                }

            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return generatedId;
    }

    public static  void deleteTaskById(int taskId) {
        String sql = "DELETE FROM tasks WHERE id = ?";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, taskId); // підставляємо ID
            stmt.executeUpdate();   // виконуємо запит

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static List<Task> getTasks(String login, String role) throws SQLException {
        int userId = UserChecker.getUserIdByLoginAndRole(login, role);

        String sql = "SELECT * FROM tasks WHERE JSON_CONTAINS(participants, JSON_ARRAY(?))";

        List<Task> tasks = new ArrayList<>();

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Task task = new Task();
                    task.setId(rs.getInt("id"));
                    task.setTitle(rs.getString("title"));
                    task.setContent(rs.getString("description"));
                    //task.setStudents_id(rs.getString("participants"));
                    tasks.add(task);
                }
            }
        }

        return tasks;
    }

}