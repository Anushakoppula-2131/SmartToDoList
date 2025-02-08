"use client"

import { useState } from "react"

export default function TaskForm({ addTask }) {
  const [task, setTask] = useState({ title: "", date: "", time: "", importance: "medium" })

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   if (task.title.trim() && task.date && task.time) {
  //     addTask({
  //       ...task,
  //       deadline: `${task.date}T${task.time}`,
  //     })
  //     setTask({ title: "", date: "", time: "", importance: "medium" })
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.title.trim() && task.date && task.time) {
      addTask({
        ...task,
        deadline: `${task.date}T${task.time}`,
      })

      // setTask({ title: "", date: "", time: "", importance: "medium" })

      const newTask = {
        title: task.title,
        deadline: `${task.date}T${task.time}`,
        importance: task.importance
      };
  
      try {
        const response = await fetch("http://localhost:8080/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });
  
        if (response.ok) {
          const savedTask = await response.json();
          addTask(savedTask);
        } else {
          console.error("Failed to add task");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      setTask({ title: "", date: "", time: "", importance: "medium" })
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="Enter task title"
          className="form-control"
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={task.date}
            onChange={(e) => setTask({ ...task, date: e.target.value })}
            className="form-control"
            required
          />
        </div>


<div className="form-group">
  <label htmlFor="time">Time</label>
  <input
    id="time"
    type="time"
    value={task.time || ""}
    onChange={(e) => setTask({ ...task, time: e.target.value })}
    className="form-control"
    required
  />
</div>


      </div>
      <div className="form-group">
        <label htmlFor="importance">Importance</label>
        <select
          id="importance"
          value={task.importance}
          onChange={(e) => setTask({ ...task, importance: e.target.value })}
          className="form-control"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Add Task
      </button>
    </form>
  )
}

