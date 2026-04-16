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
import Registro from './components/Registro'; // Asegúrate de haber creado este archivo
import Evaluacion from './components/Evaluacion';

function App() {
  const [usuario, setUsuario] = useState(null);
  // Nuevo estado para controlar qué formulario mostrar cuando no hay sesión
  const [vistaActual, setVistaActual] = useState('login'); 

  const contenedorEstilo = {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white',
    color: 'black',
    position: 'relative'
  };

  // Si ya hay un usuario logueado, mostramos la Evaluación
  if (usuario) {
    return (
      <div style={contenedorEstilo}>
        <div style={{ padding: '20px' }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', marginBottom: '20px', padding: '10px' }}>
            <span>Padre: <b>{usuario.message}</b></span>
            <button onClick={() => setUsuario(null)} style={{ cursor: 'pointer' }}>Salir</button>
          </nav>
          
          <Evaluacion idNino={usuario.id_nino} />
        </div>
      </div>
    );
  }

  // Si no hay usuario, alternamos entre Login y Registro
  return (
    <div style={contenedorEstilo}>
      {vistaActual === 'login' ? (
        <Login 
          alLoguear={(datos) => setUsuario(datos)} 
          irARegistro={() => setVistaActual('registro')} // Pasamos la función para cambiar de vista
        />
      ) : (
        <Registro 
          alRegistrar={(datos) => setUsuario(datos)} 
          volverAlLogin={() => setVistaActual('login')} // Función para regresar
        />
      )}
    </div>
  );
}

export default App;