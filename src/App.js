/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Yharel <code>src/App.js</code> and save to reload.
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
*/
import Evaluacion from './components/Evaluacion';

function App() {
  return (
    <div className="App">
      {/* Aquí estamos llamando a tu lógica del sistema experto */}
      <Evaluacion />
    </div>
  );
}

export default App;