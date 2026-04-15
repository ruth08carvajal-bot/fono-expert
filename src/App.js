/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Yhorel <code>src/App.js</code> and save to reload.
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
/*
import { useState } from 'react';
import Login from './components/Login';
import Evaluacion from './components/Evaluacion';

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <div className="App">
      {!usuario ? (
        // Si no hay usuario, mostramos el login
        <Login alLoguear={(datos) => setUsuario(datos)} />
      ) : (
        // Si ya se logueó, mostramos la evaluación y le pasamos su ID
        <div>
          <header style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
            <span>Bienvenido: <b>{usuario.message.split(' ')[1]}</b></span>
            <button onClick={() => setUsuario(null)}>Cerrar Sesión</button>
          </header>
          <Evaluacion idUsuario={usuario.user_id} idNino={usuario.id_nino} />
        </div>
      )}
    </div>
  );
}

export default App;
*/
import { useState } from 'react';
import Login from './components/Login';
import Evaluacion from './components/Evaluacion';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Estilo básico para evitar que las cosas se encimen
  const contenedorEstilo = {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white', // Forzamos fondo blanco para que no sea opaco
    color: 'black',
    position: 'relative'
  };

  return (
    <div style={contenedorEstilo}>
      {!usuario ? (
        <Login alLoguear={(datos) => setUsuario(datos)} />
      ) : (
        <div style={{ padding: '20px' }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', marginBottom: '20px', padding: '10px' }}>
            <span>Padre: <b>{usuario.message}</b></span>
            <button onClick={() => setUsuario(null)} style={{ cursor: 'pointer' }}>Salir</button>
          </nav>
          
          {/* Aquí va tu sistema experto */}
          <Evaluacion idNino={usuario.id_nino} />
        </div>
      )}
    </div>
  );
}

export default App;