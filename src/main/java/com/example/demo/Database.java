package main.java.com.example.demo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database{
    private static final String url = "jdbc:mysql://icopoghru9oezxh8.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/vj405xbpvcud57ju";
    private static final String user = "c650tzngv9hbki1r";
    private static final String password = "a0j7fxgnki38y8b6";
    public static Connection connect() {
        try {
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✅ Подключение успешно");
            return conn;
        }
        catch(SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}