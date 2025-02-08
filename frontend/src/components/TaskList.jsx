import TaskItem from "./TaskItem"

export default function TaskList({ tasks, updateTask, deleteTask }) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.deadline !== b.deadline) {
      return new Date(a.deadline) - new Date(b.deadline)
    }
    const importanceOrder = { high: 3, medium: 2, low: 1 }
    return importanceOrder[b.importance] - importanceOrder[a.importance]
  })

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={{
          ...task,
          startDateTime: task.startDateTime || new Date().toISOString(), // Making sure startDateTime exists
          endDateTime:
            task.endDateTime ||
            new Date(new Date().getTime() + 3600000).toISOString(), // Making sure endDateTime exists (1 hour later)
        }} 
        updateTask={updateTask} 
        deleteTask={deleteTask} />
      ))}
    </div>
  )
}

