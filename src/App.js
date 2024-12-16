import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const addTodo = () => {
    if (task.trim()) {
      setTodos([...todos, { id: Date.now(), text: task, completed: false }]);
      setTask("");
    }
  };

  const toggleCompletion = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Timer functionality
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    setIsRunning(false);
  };

  const startBreak = () => {
    setIsBreak(true);
    setTimeLeft(5 * 60); // Set to 5 minutes for a short break
    setIsRunning(true);
  };

  const startFocus = () => {
    setIsBreak(false);
    setTimeLeft(25 * 60); // Set to 25 minutes for focus
    setIsRunning(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Todo List with Pomodoro Timer</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={addTodo}>Add Task</button>
        </div>
      </header>
      <main>
        <div className="todo-list">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <span onClick={() => toggleCompletion(todo.id)}>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          ))}
        </div>

        <div className="pomodoro-timer">
          <h2>{isBreak ? "Break Time" : "Focus Time"}</h2>
          <div className="timer-display">{formatTime(timeLeft)}</div>
          <div className="timer-controls">
            <button onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={resetTimer}>Reset</button>
            <button onClick={isBreak ? startFocus : startBreak}>
              {isBreak ? "Start Focus" : "Start Break"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
