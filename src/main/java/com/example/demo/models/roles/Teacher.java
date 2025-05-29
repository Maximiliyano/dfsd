package main.java.com.example.demo.models.roles;

public class Teacher extends User {
    private String course;
    public Teacher(String name, String login, String password,String course) {
        super(name, login, password,"teachers");
        this.course = course;
    }
    public Teacher(String name, String login, String password) {
        super(name, login, password,"teachers");
        this.course = course;
    }
    public Teacher(String login, String password) {
        super(login, password,"teachers");
        this.course = course;
    }
    public String getCourse() {
        return course;
    }
    public void setCourse(String course) {
        this.course = course;
    }
}