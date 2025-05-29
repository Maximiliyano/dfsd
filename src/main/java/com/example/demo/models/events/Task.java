package main.java.com.example.demo.models.events;
import java.sql.Date;
import java.util.List;
public class Task {

    private String title;
    private String content;
    private Date endDate;
    private List<Integer> students_id;
    private int teacherId;
    private int id;

    public Task(String title, String content, Date endDate, int id) {
        this.title = title;
        this.content = content;
        this.endDate = endDate;
        this.id = id;
    }
    public Task(String title, String content, Date endDate, List<Integer> students_id, int teacherId) {
        this.title = title;
        this.content = content;
        this.endDate = endDate;
        this.students_id = students_id;
        this.teacherId = teacherId;
    }

    public Task() {

    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getEndDate() {
        return this.endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<Integer> getStudentIds() {
        return this.students_id;
    }
    public void setStudents_id(List<Integer> assignments) {
        this.students_id = assignments;
    }
    public int getTeacherId() {
        return this.teacherId;
    }
    public void setTeacherId(int teacherId) {
        this.teacherId = teacherId;
    }
}