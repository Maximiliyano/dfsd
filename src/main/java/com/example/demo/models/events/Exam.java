package main.java.com.example.demo.models.events;



import main.java.com.example.demo.models.roles.User;

import java.util.ArrayList;

public class Exam extends ControllWork {
    Exam(String title, String content, String place, ArrayList<User> participants, int id, Task task) {
        super(title, content, place, participants, id, task);

    }
}