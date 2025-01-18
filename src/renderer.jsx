import './renderer.css';
const React = require('react');
const LIST_ID = window.electronAPI.getEnv('LIST_ID');
const API_KEY = window.electronAPI.getEnv('API_KEY');
const TOKEN = window.electronAPI.getEnv('TOKEN');

const { createRoot } = require('react-dom/client');

function App() {
  const [task, setTask] = React.useState('');
  const inputRef = React.useRef(null); // Create a ref for the input element

  React.useEffect(() => {
    // Automatically focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Listen for the 'focus-input' event from the main process
    const handleFocusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.electronAPI.on('focus-input', handleFocusInput);

    // Cleanup listener when the component unmounts
    return () => {
      window.electronAPI.removeListener('focus-input', handleFocusInput);
    };
  }, []); // Empty dependency array ensures it runs only once

  const handleSubmit = async () => {
    window.electronAPI.minimizeWindow();
    if (!task.trim()) {
      alert('Task cannot be empty!');
      return;
    }

    const response = await fetch('https://api.trello.com/1/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: task,
        idList: LIST_ID,
        key: API_KEY,
        token: TOKEN,
      }),
    });

    if (response.ok) {
      setTask(''); // Clear the input after submission
    } else {
      alert('Error adding task');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(); // Trigger task creation on Enter key press
    }
  };

  const handleClose = () => {
    window.electronAPI.closeWindow(); // Trigger the close event
  };

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Bullet</h2>
        <button onClick={handleClose} className="close-button"></button>
      </div>

      <input
        type="text"
        ref={inputRef} // Attach the ref to the input element
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown} // Add keydown handler for Enter key
        placeholder="Enter your task"
        className="input"
      />
    </div>
  );
}

// Use createRoot for React 18+
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found!');
}
