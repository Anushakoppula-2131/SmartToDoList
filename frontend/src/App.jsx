"use client"

import { useState } from "react"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"
import PriorityAIModal from "./components/PriorityAIModal"
import "./styles.css"
import todoImage from "./assets/image.png";

export default function App() {
  const [tasks, setTasks] = useState([])
  const [showAIModal, setShowAIModal] = useState(false)
  

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), subtasks: [] }])
  }

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const suggestPriorities = () => {
    setShowAIModal(true)
  }

  
  return (
    <div className="main_container">
      <div className="container">
        <h1>Smart To-Do List</h1>
        <div className="content-wrapper"
          // style={{
          //   display: "flex",
          //   alignItems: "center",
          //   justifyContent: "space-between",
          //   gap: "250px",
          //   flexWrap: "wrap",
          //   padding:0px

          // }}
        >
          {/* Left Side: Image
          <div className="image-container"
          // style={{ flex: "1", minWidth: "250px", textAlign: "center" }}
          >
          <img
            src={todoImage}
            alt="To-Do Illustration"
            className="todo-image "
            // style={{ width: "100%", height:"453px" ,paddingRight:130}}
          />
        </div> */}
  
          {/* Right Side: To-Do Form */}
          <div className="form-container"
          //style={{ flex: "1", minWidth: "250px"}}
          >
            <TaskForm addTask={addTask} />
          
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <button
                onClick={suggestPriorities}
                className="btn btn-primary"
              >
                Suggest Priorities (AI)
              </button>
            </div>
          </div>
        </div>
  
        {/* Tasks List Below */}
        <div style={{ marginTop: "20px", width: "100%" }}>
          <TaskList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />
        </div>
  
        {showAIModal && (
          <PriorityAIModal
            tasks={tasks}
            updateTask={updateTask}
            closeModal={() => setShowAIModal(false)}
          />
        )}
      </div>
    </div>
  );
  
  

}

