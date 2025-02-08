package com.example.taskmanager.service;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;

    public Task addTask(Task task) {
        return repository.save(task);
    }

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    // public void deleteTask(Long id) {
    //     repository.deleteById(id);
    // }
    
    public void deleteTask(Long id) {
      
        if (repository.findById(id).isPresent()) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Task not found with ID: " + id);
        }
    }
}
