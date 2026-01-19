import { useState } from 'react'

export default function App() {
  // TODO: Replace this with useState
  const count = 0

  // TODO: Implement increment
  function increment() {
    // Your code here
  }

  // TODO: Implement decrement
  function decrement() {
    // Your code here
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Counter</h1>
      <div style={styles.counter}>{count}</div>
      <div style={styles.buttons}>
        <button onClick={decrement} style={styles.button}>-</button>
        <button onClick={increment} style={styles.button}>+</button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    background: 'linear-gradient(180deg, #f0f4ff 0%, #fff 100%)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '1rem',
  },
  counter: {
    fontSize: '4rem',
    fontWeight: 700,
    color: '#3b82f6',
    marginBottom: '1rem',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    width: '60px',
    height: '60px',
    fontSize: '2rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '12px',
    background: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
  },
}
