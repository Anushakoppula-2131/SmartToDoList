import { useState } from "react";
import { gapi } from "gapi-script";
import { initializeGoogleAuth, addEventToGoogleCalendar, deleteEventFromGoogleCalendar } from "./GoogleCalendar";

export default function TaskItem({ task, updateTask, deleteTask }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const addSubtask = () => {
    if (newSubtask.trim()) {
      updateTask({
        ...task,
        subtasks: [...task.subtasks, { id: Date.now(), title: newSubtask, completed: false }],
      });
      setNewSubtask("");
    }
  };

  const toggleSubtask = (subtaskId) => {
    updateTask({
      ...task,
      subtasks: task.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
    });
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  

  const handleDeleteClick = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
  
    try {
      const response = await fetch(`http://localhost:8080/tasks/${task.id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
      
        console.log("Task deleted from database");
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }

    deleteEventFromGoogleCalendar(task, deleteTask)
  };
  

  const handleSaveClick = async () => {
    try {
      // Delete the existing event from Google Calendar
      if (task.eventId) {
        await deleteEventFromGoogleCalendar(task, deleteTask);
      }
  
    // Save the updated task as a new task
      updateTask(editedTask);
      setIsEditing(false);
  
     // Adding the updated task to Google Calendar
      const formattedStartDateTime = `${editedTask.date} ${editedTask.time}`;
      const formattedEndDateTime = new Date(
        new Date(formattedStartDateTime).getTime() + 60 * 60 * 1000
      ).toISOString();

      

    
        addEventToGoogleCalendar(
          {
            ...editedTask,
            startDateTime: formattedStartDateTime,
            endDateTime: formattedEndDateTime,
          },
          updateTask
        );
      } catch (error) {
        console.error("Error while saving and updating event:", error);
        alert("Failed to update event. Check console for details.");
      }
    };
    

  
  return (
    <div className={`task-item importance-${task.importance}`}>
      <div className="task-header">
        {isEditing ? (
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="form-control"
          />
        ) : (
          <h3 className="task-title">{task.title}</h3>
        )}
        <div className="task-actions">
         
          <button
            onClick={() => {

              // console.log("Task Date:", task.date);
              // console.log("Task Time:", task.time);
              // console.log("Formatted Start DateTime:", `${task.date} ${task.time}`);
              // console.log("Parsed Date Object:", new Date(`${task.date} ${task.time}`));

              if (!task.date || !task.time) {
                alert("Please enter a valid date and time before adding to the calendar.");
                console.error("Invalid task date or time:", task.date, task.time);
                return;
              }

              
              const formattedStartDateTime = new Date(`${task.date}T${task.time}`);

              const startDateObj = new Date(formattedStartDateTime);

              if (isNaN(startDateObj.getTime())) {
                alert("Invalid date format. Please check your date and time.");
                console.error("Invalid date object:", formattedStartDateTime);
                return;
              }

              const formattedEndDateTime = new Date(startDateObj.getTime() + 60 * 60 * 1000).toISOString();

              addEventToGoogleCalendar(
                {
                  ...task,
                  startDateTime: formattedStartDateTime,
                  endDateTime: formattedEndDateTime,
                },
                updateTask
              );
            }}
        >
          Add to Calendar
        </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-primary"
            style={{ backgroundColor: "transparent", color: "#333" }}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={handleDeleteClick}
            className="btn btn-danger"
            style={{ backgroundColor: "transparent", color: "#e74c3c" }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="task-details">
        <p>
          Deadline:{" "}
          {isEditing ? (
            <input
              type="datetime-local"
              value={editedTask.deadline}
              onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
              className="form-control"
            />
          ) : (
            formatDeadline(task.deadline)
          )}
        </p>
        <p>
          Importance:{" "}
          {isEditing ? (
            <select
              value={editedTask.importance}
              onChange={(e) => setEditedTask({ ...editedTask, importance: e.target.value })}
              className="form-control"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          ) : (
            task.importance
          )}
        </p>
      </div>
      {isExpanded && (
        <div className="subtask-list">
          <h4>Subtasks:</h4>
          <ul>
            {task.subtasks.map((subtask) => (
              <li key={subtask.id} className="subtask-item">
                <input type="checkbox" checked={subtask.completed} onChange={() => toggleSubtask(subtask.id)} />
                <span className={subtask.completed ? "subtask-completed" : ""}>{subtask.title}</span>
              </li>
            ))}
          </ul>
          <div className="form-group" style={{ display: "flex", marginTop: "10px" }}>
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="New subtask"
              className="form-control"
              style={{ marginRight: "10px", flexGrow: 1 }}
            />
            <button
              onClick={addSubtask}
              className="btn btn-success"
              style={{ backgroundColor: "transparent", color: "#2ecc71", border: "1px solid #2ecc71" }}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div className="task-actions" style={{ marginTop: "10px" }}>
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="btn btn-success"
            style={{ backgroundColor: "#2ecc71", color: "white" }}
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEditClick}
            className="btn btn-warning"
            style={{ backgroundColor: "#f39c12", color: "white" }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
