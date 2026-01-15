"use client"

import { useEffect, useState, useCallback } from "react"
import Editor from "@monaco-editor/react"
import { FileTree } from "@/components/editor/view/FileTree"
import { IconCode, IconPlayerPlay, IconExternalLink, IconRefresh, IconFile } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// Sample project files for react-basics
const defaultReactBasicsFiles: Record<string, string> = {
  "/package.json": `{
  "name": "react-basics",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}`,
    "/vite.config.js": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true }
})`,
    "/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    "/src/main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
    "/src/App.tsx": `import { useState } from 'react'

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
      <h1 style={styles.title}>📝 Todo List</h1>
      <div style={styles.stats}>{tasks.length} tasks · {completedCount} done</div>

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
              ✕
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
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(180deg, #f0f4ff 0%, #fff 100%)',
    fontFamily: 'system-ui, sans-serif',
  },
  title: { fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  stats: { color: '#64748b', marginBottom: '24px' },
  inputRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
  input: { padding: '12px 16px', fontSize: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', width: '280px', outline: 'none' },
  addButton: { padding: '12px 24px', fontSize: '1rem', fontWeight: '600', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, width: '100%', maxWidth: '400px' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', borderRadius: '8px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  label: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
  deleteButton: { padding: '6px 12px', fontSize: '0.875rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  empty: { color: '#94a3b8', marginTop: '32px' },
}`,
  "/src/index.css": `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: system-ui, sans-serif;
}`,
}

// Generate preview HTML
function generatePreviewHtml(files: Record<string, string>) {
  const appTsx = files["/src/App.tsx"]
  if (!appTsx) return '<html><body>Loading...</body></html>'
  
  const appCode = appTsx
    .replace(/export default /g, '')
    .replace(/import React.*?\n/g, '')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
</head>
<body>
  <div id="root"></div>
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
      }
    }
  </script>
  <script type="module">
    import React, { useState } from 'react'
    import { createRoot } from 'react-dom/client'

    ${appCode}

    const root = createRoot(document.getElementById('root'))
    root.render(React.createElement(App))
  </script>
</body>
</html>`
}

function getFileIconClass(filename: string): string {
  if (filename.endsWith('.json')) return 'devicon-vscode-plain'
  if (filename.endsWith('.html')) return 'devicon-html5-plain'
  if (filename.endsWith('.css')) return 'devicon-css3-plain'
  if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) return 'devicon-react-original'
  if (filename.endsWith('.ts')) return 'devicon-typescript-plain'
  if (filename.endsWith('.js')) return 'devicon-javascript-plain'
  return 'devicon-vscode-plain'
}

function getLanguage(filename: string): string {
  if (filename.endsWith('.json')) return 'json'
  if (filename.endsWith('.html')) return 'html'
  if (filename.endsWith('.css')) return 'css'
  if (filename.endsWith('.tsx')) return 'typescript'
  if (filename.endsWith('.ts')) return 'typescript'
  if (filename.endsWith('.jsx')) return 'javascript'
  if (filename.endsWith('.js')) return 'javascript'
  return 'plaintext'
}

interface CodeEditorProps {
  projectId: string
  className?: string
}

export function CodeEditor({ projectId, className }: CodeEditorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<string>("/src/App.tsx")

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      if (projectId === "react-basics") {
        setProjectFiles(defaultReactBasicsFiles)
      }
      setIsLoading(false)
    }
    load()
  }, [projectId])

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    const html = generatePreviewHtml(projectFiles)
    const blob = new Blob([html], { type: "text/html" })
    setPreviewUrl(URL.createObjectURL(blob))
    setActiveTab("preview")
    setIsRunning(false)
  }, [projectFiles])

  const fileList = Object.keys(projectFiles).sort()
  const selected = selectedFile || "/src/App.tsx"

  if (isLoading) {
    return (
      <div className={cn("h-[500px] flex items-center justify-center bg-muted/30 rounded-lg border", className)}>
        <div className="flex flex-col items-center gap-2">
          <IconCode className="w-8 h-8 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-[600px] bg-background border rounded-lg overflow-hidden font-sans", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors",
              activeTab === "code" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <IconCode className="w-4 h-4" />
            Code
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors",
              activeTab === "preview" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <IconExternalLink className="w-4 h-4" />
            Preview
          </button>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isRunning ? <IconRefresh className="w-4 h-4 animate-spin" /> : <IconPlayerPlay className="w-4 h-4" />}
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>

      {/* Main content */}
      {activeTab === "code" ? (
        <div className="flex-1 flex overflow-hidden">
          {/* File tree */}
          <div className="w-48 border-r bg-muted/10 overflow-auto">
            <div className="px-3 py-2 border-b text-xs font-medium text-muted-foreground">
              Files
            </div>
            <div className="p-1">
              {fileList.map((path) => (
                <button
                  key={path}
                  onClick={() => setSelectedFile(path)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left",
                    selectedFile === path ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  <span className="text-muted-foreground text-xs">{path.split('.').pop()?.toUpperCase()}</span>
                  <span className="truncate">{path.split('/').pop()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/10">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{selectedFile.split('.').pop()?.toUpperCase()}</span>
                <span className="text-sm">{selectedFile.split('/').pop()}</span>
              </div>
              <span className="text-xs text-muted-foreground">{getLanguage(selectedFile)}</span>
            </div>
            <Editor
              height="100%"
              language={getLanguage(selectedFile)}
              value={projectFiles[selectedFile] || ""}
              onChange={(value) => setProjectFiles(prev => ({ ...prev, [selectedFile]: value || "" }))}
              theme="vs-dark"
              options={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                quickSuggestions: true,
                padding: { top: 16 },
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="flex-1 w-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Preview"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/30">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <IconPlayerPlay className="w-4 h-4" />
                {isRunning ? "Running..." : "Run App"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CodeEditor
