package main.java.com.example.demo.models.events;


import main.java.com.example.demo.models.roles.User;

import java.util.ArrayList;

public class ControllWork extends Event {

    ControllWork(String title, String content, String place, ArrayList<User> participants, int id, Task task) {
        super(title, content, place, participants, id,task);
    }
    ControllWork(String title, String content, String place, ArrayList<User> participants, int id) {
        super(title, content, place, participants, id);
    }
}
