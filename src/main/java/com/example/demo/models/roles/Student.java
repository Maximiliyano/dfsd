package main.java.com.example.demo.models.roles;

public class Student extends User {
    private Parent parent;
    public Student(String name, String login, String password, Parent parent) {
        super(name, login, password,"students");
        this.parent = parent;
    }
    public Student(String login, String password, Parent parent) {
        super(login, password,"students");
        this.parent = parent;
    }
    public Student(String login, String password, String name) {
        super(login, password,"students");
    }
    public Student(String login, String password) {
        super(login, password, "students");
    }
}