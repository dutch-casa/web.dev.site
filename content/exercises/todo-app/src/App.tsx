import { useState } from 'react'

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build a project', completed: false },
  ])

  const [inputValue, setInputValue] = useState('')

  function addTask() {
    if (!inputValue.trim()) return

    setTasks([...tasks, {
      id: Date.now(),
      text: inputValue,
      completed: false,
    }])
    setInputValue('')
  }

  function toggleTask(id: number) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  function deleteTask(id: number) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>
      <div style={styles.stats}>{tasks.length} tasks - {completedCount} done</div>

      <div style={styles.inputRow}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a task..."
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addButton}>Add</button>
      </div>

      <ul style={styles.list}>
        {tasks.map(task => (
          <li key={task.id} style={styles.listItem}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
              }}>{task.text}</span>
            </label>
            <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
              x
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && <p style={styles.empty}>No tasks yet</p>}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(180deg, #f0f4ff 0%, #fff 100%)',
    fontFamily: 'system-ui, sans-serif',
  },
  title: { fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' },
  stats: { color: '#64748b', marginBottom: '24px' },
  inputRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
  input: { padding: '12px 16px', fontSize: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', width: '280px', outline: 'none' },
  addButton: { padding: '12px 24px', fontSize: '1rem', fontWeight: 600, background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, width: '100%', maxWidth: '400px' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', borderRadius: '8px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  label: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
  deleteButton: { padding: '6px 12px', fontSize: '0.875rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  empty: { color: '#94a3b8', marginTop: '32px' },
}
