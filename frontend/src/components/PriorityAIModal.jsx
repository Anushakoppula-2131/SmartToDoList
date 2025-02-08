export default function PriorityAIModal({ tasks, updateTask, closeModal }) {
  const suggestPriority = (task) => {
    const deadline = new Date(task.deadline)
    const now = new Date()
    const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60)
    if (hoursUntilDeadline <= 24) return "high"
    if (hoursUntilDeadline <= 72) return "medium"
    return "low"
  }

  const applyAISuggestions = () => {
    tasks.forEach((task) => {
      const suggestedPriority = suggestPriority(task)
      if (suggestedPriority !== task.importance) {
        updateTask({ ...task, importance: suggestedPriority })
      }
    })
    closeModal()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">AI Priority Suggestions</h3>
          <button onClick={closeModal} className="modal-close">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <ul>
            {tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: "10px" }}>
                <span>{task.title}: </span>
                <strong
                  style={{
                    color:
                      suggestPriority(task) === "high"
                        ? "var(--danger-color)"
                        : suggestPriority(task) === "medium"
                          ? "var(--primary-color)"
                          : "var(--secondary-color)",
                  }}
                >
                  {suggestPriority(task)}
                </strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <button onClick={applyAISuggestions} className="btn btn-primary">
            Apply Suggestions
          </button>
          <button onClick={closeModal} className="btn btn-danger">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

