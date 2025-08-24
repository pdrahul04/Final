import React from 'react';

function App() {
  return (
    <div className="container">
      <div className="card">
        <h1>🚀 Jira Clone - Learning Project</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px', color: '#666' }}>
          Welcome to your step-by-step journey learning React + TypeScript + Redux + DnD Kit!
        </p>
        
        <div className="card" style={{ backgroundColor: '#f8f9ff', border: '2px solid #3498db' }}>
          <h2>📋 Step 1: Project Setup Complete!</h2>
          <p><strong>What we've accomplished:</strong></p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>✅ Removed Tailwind CSS and set up clean CSS styling</li>
            <li>✅ Created TypeScript interfaces for all our data models</li>
            <li>✅ Set up localStorage utility functions</li>
            <li>✅ Established project folder structure</li>
          </ul>
          
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '6px' }}>
            <h3>🎯 Ready for Step 2: Redux Toolkit Setup</h3>
            <p>Next, we'll install Redux Toolkit and create our state management system with slices for projects, tasks, and sprints.</p>
          </div>
        </div>

        <div className="mt-20">
          <h3>📁 Current Project Structure:</h3>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '6px', fontSize: '14px' }}>
{`src/
├── types/
│   └── index.ts          # TypeScript interfaces & enums
├── utils/
│   └── localStorage.ts   # Local storage utilities
├── App.tsx               # Main app component
├── index.css             # Global styles
└── main.tsx              # App entry point`}
          </pre>
        </div>

        <div className="flex gap-20 mt-20">
          <button className="btn btn-primary">
            Ready for Step 2! 🚀
          </button>
          <button className="btn btn-secondary">
            Let me review this step first 📖
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;