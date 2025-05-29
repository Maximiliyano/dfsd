package main.java.com.example.demo.Controllers.database;

import main.java.com.example.demo.Database;
import main.java.com.example.demo.models.roles.Parent;
import main.java.com.example.demo.models.roles.Student;
import main.java.com.example.demo.models.roles.Teacher;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

public class UserService {
    public static boolean createStudent(Student s) {
        if (UserChecker.isLoginAvailable(s.getLogin())) {
            try (Connection conn = Database.connect()) {
                String sql = "INSERT INTO students (name, login, password) VALUES (?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, s.getName());
                    stmt.setString(2, s.getLogin());
                    stmt.setString(3, s.getPassword());
                    stmt.executeUpdate();
                }
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    public static boolean createParent(Parent p) {
        if (UserChecker.isLoginAvailable(p.getLogin())) {
            try (Connection conn = Database.connect()) {
                String sql = "INSERT INTO parents (name, login, password) VALUES (?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                    stmt.setString(1, p.getName());
                    stmt.setString(2, p.getLogin());
                    stmt.setString(3, p.getPassword());
                    stmt.executeUpdate();
                }
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    public static boolean createTeacher(Teacher t) {
        if (UserChecker.isLoginAvailable(t.getLogin())) {
            try (Connection conn = Database.connect()) {
                String sql = "INSERT INTO teachers (name, login, password) VALUES (?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, t.getName());
                    stmt.setString(2, t.getLogin());
                    stmt.setString(3, t.getPassword());
                    stmt.executeUpdate();
                }
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
    public static void deleteUser(String login, String table) {
        Connection conn = Database.connect();
        String sql = "DELETE FROM " + table + " WHERE login = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, login);
            stmt.executeUpdate();
            System.out.println("User deleted successfully!");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}