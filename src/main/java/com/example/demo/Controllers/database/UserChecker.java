package main.java.com.example.demo.Controllers.database;

import main.java.com.example.demo.Database;
import main.java.com.example.demo.models.roles.Parent;
import main.java.com.example.demo.models.roles.Student;
import main.java.com.example.demo.models.roles.Teacher;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserChecker {

    public static String getName(String login, String role) {
        if (!role.equals("students") && !role.equals("parents") && !role.equals("teachers")) {
            return null;
        }

        String sql = "SELECT name FROM " + role + " WHERE login = ? LIMIT 1";

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, login);  // правильний параметр

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("name"); // повертаємо ім’я з колонки name
                } else {
                    return null; // не знайдено
                }
            }
        } catch (SQLException e) {
            System.err.println("Помилка при пошуку ім'я користувача: " + e.getMessage());
            return null;
        }
    }

    // GETTER: getUserIdByLoginAndRole(String login, String role)
    public static Integer getUserIdByLoginAndRole(String login, String role) {
        String sql = "SELECT id FROM "+ role +" WHERE login = ?";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, login);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    public static boolean checkParent(Parent p) {
        return checkUser(Table.PARENTS, p.getLogin(), p.getPassword());
    }

    public static boolean checkStudent(Student s) {
        return checkUser(Table.STUDENTS, s.getLogin(), s.getPassword());
    }

    public static boolean checkTeacher(Teacher t) {
        return checkUser(Table.TEACHERS, t.getLogin(), t.getPassword());
    }

    private static boolean checkUser(Table table, String login, String password) {
        String sql = "SELECT 1 FROM " + table.getTableName() + " WHERE login = ? AND password = ? LIMIT 1";

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, login);
            stmt.setString(2, password);

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }

        } catch (SQLException e) {
            System.err.println("Помилка при перевірці користувача: " + e.getMessage());
            return false;
        }
    }

    public static boolean isLoginAvailable(String login) {
        String sql = "SELECT 1 FROM (SELECT login FROM parents UNION SELECT login FROM students UNION SELECT login FROM teachers) AS all_logins WHERE login = ? LIMIT 1";

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, login);

            try (ResultSet rs = stmt.executeQuery()) {
                return !rs.next();
            }

        } catch (SQLException e) {
            System.err.println("Помилка при перевірці доступності логіна: " + e.getMessage());
            return false;
        }
    }

    private enum Table {
        PARENTS("parents"),
        STUDENTS("students"),
        TEACHERS("teachers");
        private final String tableName;

        Table(String tableName) {
            this.tableName = tableName;
        }

        public String getTableName() {
            return tableName;
        }
    }
}
