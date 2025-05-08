import logo from './logo.svg';
import './App.css';
import Logo from './components/Logo';
import IntroScreen from './components/IntroScreen';
import QuestionnaireForm from './components/QuestionnaireForm';
import LabsForm from './components/LabsForm';
import ReportCard from './components/ReportCard';
import ReportDocument from './components/ReportDocument';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
