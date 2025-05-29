package main.java.com.example.demo.models.events;


import main.java.com.example.demo.models.roles.User;

import java.util.ArrayList;

public class ParentsMeeting extends Event {
    ParentsMeeting(String title, String content, String place, ArrayList<User> participants, int id) {
        super(title, content, place, participants, id);
    }
}