import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import animacionRobot from '../assets/robot.json';

function Registro({ alRegistrar, volverAlLogin }) {
  const [datos, setDatos] = useState({
    nombre_padre: '',
    email: '',
    password: '',
    nombre_nino: '',
    edad_nino: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const playerRef = useRef(null);

  // Mantenemos tus frames que ya funcionan
  const estados = {
    idle: [0, 250],
    focusUser: [250, 320],
    focusPassword: [320, 420],
    processing: [420, 560],
    success: [560, 680],
    error: [680, 780]
  };

  const playState = (state, loop = false) => {
    if (!playerRef.current) return;
    const segmento = estados[state];
    playerRef.current.stop();
    playerRef.current.playSegments(segmento, true);
    // Ajuste manual de loop según tu versión de lottie-react
    if (playerRef.current.animationItem) {
        playerRef.current.animationItem.loop = loop;
    }
  };

  useEffect(() => {
    playState('idle', true);
  }, []);

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    playState('processing', true);

    try {
      // URL de tu servidor Flask
      const response = await axios.post('http://127.0.0.1:5000/evaluar', {
        ...datos,
        tipo: 'registro' 
      });

      if (response.data.status === "success") {
        playState('success');
        setTimeout(() => {
          alRegistrar(response.data);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la cuenta");
      playState('error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.capaFondoRobot}>
        <Lottie
          lottieRef={playerRef}
          animationData={animacionRobot}
          style={estilos.robotFondo}
          loop={true}
        />
      </div>

      <div style={estilos.tarjeta}>
        <h2 style={estilos.titulo}>Nuevo Perfil</h2>
        <p style={estilos.subtitulo}>Registro para Fonoaudiología Infantil</p>

        <form onSubmit={manejarEnvio} style={estilos.formulario}>
          <div style={estilos.fila}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Nombre del Tutor</label>
              <input
                name="nombre_padre"
                type="text"
                onChange={manejarCambio}
                onFocus={() => playState('focusUser', true)}
                style={estilos.input}
                required
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Correo electrónico</label>
            <input
              name="email"
              type="email"
              onChange={manejarCambio}
              onFocus={() => playState('focusUser', true)}
              style={estilos.input}
              required
            />
          </div>

          <div style={estilos.filaDoble}>
            <div style={estilos.campo}>
              <label style={estilos.label}>Nombre del Niño(a)</label>
              <input
                name="nombre_nino"
                type="text"
                onChange={manejarCambio}
                onFocus={() => playState('focusUser', true)}
                style={estilos.input}
                required
              />
            </div>
            <div style={estilos.campo}>
              <label style={estilos.label}>Edad</label>
              <input
                name="edad_nino"
                type="number"
                min="3"
                max="10"
                onChange={manejarCambio}
                onFocus={() => playState('focusUser', true)}
                style={estilos.input}
                required
              />
            </div>
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Contraseña</label>
            <input
              name="password"
              type="password"
              onChange={manejarCambio}
              onFocus={() => playState('focusPassword', false)}
              style={estilos.input}
              required
            />
          </div>

          {error && <div style={estilos.error}>{error}</div>}

          <button type="submit" disabled={cargando} style={estilos.boton}>
            {cargando ? 'Creando Perfil...' : 'Comenzar Registro'}
          </button>
        </form>

        <button onClick={volverAlLogin} style={estilos.botonLink}>
          ¿Ya tienes cuenta? Inicia Sesión
        </button>
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f0f4f8',
    position: 'relative',
    overflow: 'hidden'
  },
  capaFondoRobot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none'
  },
  robotFondo: {
    width: '850px',
    height: '650px',
    transform: 'translateY(-100px) scale(1.3)',
    opacity: 0.8
  },
  tarjeta: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '450px',
    zIndex: 10,
    backdropFilter: 'blur(8px)'
  },
  titulo: { color: '#2d3748', textAlign: 'center', marginBottom: '5px' },
  subtitulo: { color: '#718096', textAlign: 'center', marginBottom: '20px', fontSize: '14px' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '12px' },
  filaDoble: { display: 'flex', gap: '10px' },
  campo: { flex: 1, textAlign: 'left' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px' },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box'
  },
  boton: {
    backgroundColor: '#3182ce',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  botonLink: {
    background: 'none',
    border: 'none',
    color: '#3182ce',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: '15px',
    width: '100%'
  },
  error: { color: '#e53e3e', fontSize: '12px', textAlign: 'center' }
};

export default Registro;