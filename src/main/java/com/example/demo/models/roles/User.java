package main.java.com.example.demo.models.roles;

import java.time.LocalDate;

public abstract class User{

    private final String status;
    private String name;
    private String login;
    private String password;
    private LocalDate registered;

    User(String name, String login, String password,String status) {
        this.name = name;
        this.login = login;
        this.password = password;
        this.status = status;
        this.registered = LocalDate.now();
    }
    User(String login, String password,String status) {
        this.login = login;
        this.password = password;
        this.status = status;
        this.registered = LocalDate.now();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String passcode) {
        this.password = passcode;
    }

    public LocalDate getRegistered() {
        return registered;
    }

    public void setRegistered(LocalDate registered) {
        this.registered = registered;
    }

    public String getStatus() {
        return status;
    }
}