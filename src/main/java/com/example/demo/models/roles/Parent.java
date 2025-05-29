package main.java.com.example.demo.models.roles;


public class Parent extends User {
    public Parent(String name, String login, String password) {
        super(name, login, password,"parents");
    }
    public Parent(String login, String password) {
        super(login, password,"parents");
    }
}