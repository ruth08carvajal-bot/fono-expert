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
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import RegistroNino from './components/RegistroNino';
import Evaluacion from './components/Evaluacion';

function App() {
  // ESTADOS PRINCIPALES
  const [usuario, setUsuario] = useState(null); // Guarda los datos del padre y sus hijos
  const [vista, setVista] = useState('login'); // Controla: login, registro, dashboard, nuevo_nino, evaluacion
  const [ninoSeleccionado, setNinoSeleccionado] = useState(null); // Para saber a quién evaluar

  // FUNCIÓN PARA CERRAR SESIÓN
  const manejarCerrarSesion = () => {
    setUsuario(null);
    setNinoSeleccionado(null);
    setVista('login');
  };

  // RENDERIZADO CONDICIONAL DE VISTAS
  return (
    <div style={estilos.appContainer}>
      
      {/* 1. PANTALLA DE LOGIN */}
      {vista === 'login' && (
        <Login 
          alLoguear={(datos) => { 
            setUsuario(datos); 
            setVista('dashboard'); 
          }} 
          irARegistro={() => setVista('registro')} 
        />
      )}

      {/* 2. PANTALLA DE REGISTRO INICIAL (PADRE + 1er HIJO) */}
      {vista === 'registro' && (
        <Registro 
          alRegistrar={(datos) => { 
            setUsuario(datos); 
            setVista('dashboard'); 
          }} 
          volverAlLogin={() => setVista('login')} 
        />
      )}

      {/* 3. PANTALLA PRINCIPAL / DASHBOARD (SIN ROBOT) */}
      {vista === 'dashboard' && usuario && (
        <Dashboard 
          datosPadre={usuario}
          alIrARegistroNino={() => setVista('nuevo_nino')}
          alSeleccionarNino={(nino) => {
            setNinoSeleccionado(nino);
            setVista('evaluacion');
          }}
          cerrarSesion={manejarCerrarSesion}
        />
      )}

      {/* 4. REGISTRO DE NUEVO NIÑO (SOLO DATOS NIÑO + ROBOT) */}
      {vista === 'nuevo_nino' && usuario && (
        <RegistroNino 
          idPadre={usuario.id_padre}
          alFinalizar={(datosActualizados) => {
            // Actualizamos el estado global con la nueva lista de hijos que devuelva el server
            setUsuario(datosActualizados);
            setVista('dashboard');
          }}
          volver={() => setVista('dashboard')}
        />
      )}

      {/* 5. PANTALLA DE EVALUACIÓN (SISTEMA EXPERTO) */}
      {vista === 'evaluacion' && ninoSeleccionado && (
        <div style={estilos.evaluacionWrapper}>
          <div style={estilos.barraSuperior}>
            <button onClick={() => setVista('dashboard')} style={estilos.botonVolver}>
              ← Volver al Panel
            </button>
            <span style={estilos.textoEval}>
              Evaluando a: <b>{ninoSeleccionado.nombre_nino}</b>
            </span>
          </div>
          <Evaluacion idNino={ninoSeleccionado.id_nino} />
        </div>
      )}

    </div>
  );
}

// ESTILOS BÁSICOS PARA LA ESTRUCTURA
const estilos = {
  appContainer: {
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: '#f4f7f9',
    margin: 0,
    padding: 0,
    overflowX: 'hidden'
  },
  evaluacionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  barraSuperior: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    gap: '20px'
  },
  botonVolver: {
    padding: '8px 15px',
    backgroundColor: '#edf2f7',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#4a5568',
    fontWeight: '600'
  },
  textoEval: {
    color: '#2d3748',
    fontSize: '16px'
  }
};

export default App;