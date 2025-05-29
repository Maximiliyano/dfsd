package main.java.com.example.demo.models.events;



import main.java.com.example.demo.models.roles.User;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;

abstract class Event {
    private String title;
    private LocalDate start;
    private Period timeOfEvent;
    private String content;
    private String place;
    private ArrayList<User> participants;
    private Task task;
    private int id;

    Event(String title, String content, String place, ArrayList<User> participants,int id, Task task) {
        this.title = title;
        this.content = content;
        this.place = place;
        this.participants = participants;
        this.task = task;
    }
    Event(String title, String content, String place, ArrayList<User> participants,int id) {
        this.title = title;
        this.content = content;
        this.place = place;
        this.participants = participants;
        this.id = id;
    }
}
