import ErrorDashboard from './components/ErrorDashboard';
import { ThemeProvider } from './context/ThemeProvider';
import './App.css';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <ErrorDashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
