import TaskItem from "./TaskItem";

// Renders the list of tasks inside a card. Parent handles empty states.
export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  return (
    <ul className="card divide-y divide-slate-100 overflow-hidden">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
