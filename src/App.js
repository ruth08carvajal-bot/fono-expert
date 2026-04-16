import { useState, useEffect } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import RegistroNino from './components/RegistroNino';
import Evaluacion from './components/Evaluacion';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('login');
  const [ninoSeleccionado, setNinoSeleccionado] = useState(null);

  // 🔥 OBTENER NIÑOS DEL BACKEND
  const obtenerNinos = async (idUsuario) => {
    try {
      const response = await fetch(`http://localhost:5000/obtener_ninos_padre/${idUsuario}`);
      const data = await response.json();

      setUsuario((prev) => ({
        ...prev,
        hijos: data
      }));

    } catch (error) {
      console.error("Error al obtener niños:", error);
    }
  };

  // 🔥 RECARGA AUTOMÁTICA AL ENTRAR AL DASHBOARD
  useEffect(() => {
    if (vista === 'dashboard' && usuario?.id_usuario) {
      obtenerNinos(usuario.id_usuario);
    }
  }, [vista]);

  // 🔒 CERRAR SESIÓN
  const manejarCerrarSesion = () => {
    setUsuario(null);
    setNinoSeleccionado(null);
    setVista('login');
  };

  return (
    <div style={estilos.appContainer}>
      
      {/* LOGIN */}
      {vista === 'login' && (
        <Login 
          alLoguear={(datos) => { 
            setUsuario(datos);
            obtenerNinos(datos.id_usuario);
            setVista('dashboard'); 
          }} 
          irARegistro={() => setVista('registro')} 
        />
      )}

      {/* REGISTRO */}
      {vista === 'registro' && (
        <Registro 
          alRegistrar={(datos) => { 
            setUsuario(datos);
            obtenerNinos(datos.id_usuario);
            setVista('dashboard'); 
          }} 
          volverAlLogin={() => setVista('login')} 
        />
      )}

      {/* DASHBOARD */}
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

      {/* REGISTRO NUEVO NIÑO */}
      {vista === 'nuevo_nino' && usuario && (
        <RegistroNino 
          idPadre={usuario.id_usuario} // 🔥 IMPORTANTE
          alFinalizar={() => {
            obtenerNinos(usuario.id_usuario);
            setVista('dashboard');
          }}
          volver={() => setVista('dashboard')}
        />
      )}

      {/* EVALUACIÓN */}
      {vista === 'evaluacion' && ninoSeleccionado && (
        <div style={estilos.evaluacionWrapper}>
          <div style={estilos.barraSuperior}>
            <button 
              onClick={() => setVista('dashboard')} 
              style={estilos.botonVolver}
            >
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

// 🎨 ESTILOS
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