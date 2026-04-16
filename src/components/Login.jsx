import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import animacionRobot from '../assets/robot.json';

function Login({ alLoguear, irARegistro }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const playerRef = useRef();

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
    const player = playerRef.current;
    player.stop();
    setTimeout(() => {
      player.setDirection(1);
      player.playSegments(estados[state], true);
      // Ajuste de loop seguro
      if (player.animationItem) {
        player.animationItem.loop = loop;
      }
    }, 50);
  };

  const volverIdle = () => setTimeout(() => playState('idle', true), 800);

  useEffect(() => { 
    playState('idle', true); 
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    playState('processing', true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email: email,
        password: password
      });

      if (response.data.status === "success") {
        playState('success');
        setTimeout(() => alLoguear(response.data), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error de acceso");
      playState('error');
      setTimeout(() => playState('idle', true), 1200);
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
        <h2 style={estilos.titulo}>¡Bienvenido!</h2>
        <p style={estilos.subtitulo}>Sistema Experto Fonoaudiológico</p>

        <form onSubmit={manejarEnvio} style={estilos.formulario}>
          <div style={estilos.campo}>
            <label style={estilos.label}>Correo</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onFocus={() => { playState('focusUser'); volverIdle(); }}
              style={estilos.input} required 
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onFocus={() => playState('focusPassword')}
              onBlur={volverIdle}
              style={estilos.input} required 
            />
          </div>

          {error && <div style={estilos.error}>{error}</div>}

          <button type="submit" disabled={cargando} style={estilos.boton}>
            {cargando ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        <div style={estilos.footer}>
          <button onClick={irARegistro} style={estilos.botonLink}>
            ¿No tienes cuenta? Crea una aquí
          </button>
        </div>
      </div>
    </div>
  );
}

// DEFINICIÓN DE ESTILOS (Asegúrate de que esto esté después de la función)
const estilos = {
  contenedor: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f4f7f9',
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
    width: '700px',
    height: '500px',
    transform: 'translateY(-120px) scale(1.2)',
    opacity: 0.9
  },
  tarjeta: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '40px',
    borderRadius: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '380px',
    textAlign: 'center',
    zIndex: 10,
    backdropFilter: 'blur(5px)',
    border: '1px solid #fff'
  },
  titulo: { color: '#2d3748', marginBottom: '8px' },
  subtitulo: { color: '#718096', marginBottom: '24px', fontSize: '14px' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '15px' },
  campo: { textAlign: 'left' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  boton: {
    backgroundColor: '#3182ce',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
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
    fontSize: '14px'
  },
  footer: { marginTop: '20px' },
  error: {
    color: '#e53e3e',
    fontSize: '12px',
    padding: '10px',
    backgroundColor: '#fff5f5',
    borderRadius: '8px'
  }
};

export default Login;