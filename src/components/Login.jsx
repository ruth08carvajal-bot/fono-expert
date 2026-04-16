import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import animacionRobot from '../assets/robot.json';

function Login({ alLoguear }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombrePadre, setNombrePadre] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const playerRef = useRef();

  // 🎯 FRAMES AJUSTADOS
  const estados = {
    idle: [0, 250],
    focusUser: [250, 320],
    focusPassword: [320, 420],
    processing: [420, 560],
    success: [560, 680],
    error: [680, 780]
  };

  // 🔥 CONTROL REAL DE ANIMACIÓN
  const playState = (state, loop = false) => {
    if (!playerRef.current) return;

    const segmento = estados[state];
    if (!segmento) return;

    const player = playerRef.current;

    player.stop();

    setTimeout(() => {
      player.setDirection(1);
      player.playSegments(segmento, true);
      player.loop = loop;
    }, 50);
  };

  // 🔁 VOLVER A IDLE
  const volverIdle = () => {
    setTimeout(() => {
      playState('idle', true);
    }, 800);
  };

  // 🎬 INIT
  useEffect(() => {
    playState('idle', true);
  }, []);

  // 🎯 EVENTOS
  const alEnfocarUsuario = () => {
    playState('focusUser');
    volverIdle();
  };

  const alEnfocarPassword = () => {
    playState('focusPassword');
  };

  const alPerderFoco = () => {
    volverIdle();
  };

  // 🚀 SUBMIT
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    playState('processing', true);

    const url = esRegistro
      ? 'http://127.0.0.1:5000/evaluar'
      : 'http://127.0.0.1:5000/login';

    const datos = esRegistro
      ? {
          correo: email,
          password: password,
          nombre_padre: nombrePadre,
          nombre_nino: 'Por asignar'
        }
      : {
          email: email,
          password: password
        };

    try {
      const response = await axios.post(url, datos);

      if (response.data.status === "success") {
        playState('success');

        setTimeout(() => {
          alLoguear(response.data);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error de acceso");

      playState('error');

      // 🔥 vuelve a idle después del error
      setTimeout(() => {
        playState('idle', true);
      }, 1200);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>

      {/* 🤖 ROBOT */}
      <div style={estilos.capaFondoRobot}>
        <Lottie
          lottieRef={playerRef}
          animationData={animacionRobot}
          loop={false}
          style={estilos.robotFondo}
        />
      </div>

      {/* 🧾 FORM */}
      <div style={estilos.tarjeta}>
        <h2 style={estilos.titulo}>
          {esRegistro ? '¡Únete!' : '¡Bienvenido!'}
        </h2>

        <p style={estilos.subtitulo}>
          Sistema Experto Fonoaudiológico
        </p>

        <form onSubmit={manejarEnvio} style={estilos.formulario}>

          {esRegistro && (
            <div style={estilos.campo}>
              <label style={estilos.label}>Nombre</label>
              <input
                type="text"
                value={nombrePadre}
                onChange={(e) => setNombrePadre(e.target.value)}
                onFocus={alEnfocarUsuario}
                onBlur={alPerderFoco}
                style={estilos.input}
                required
              />
            </div>
          )}

          <div style={estilos.campo}>
            <label style={estilos.label}>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={alEnfocarUsuario}
              onBlur={alPerderFoco}
              style={estilos.input}
              required
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (e.target.value.length > 0) {
                  playState('focusPassword');
                } else {
                  playState('idle', true);
                }
              }}
              onFocus={alEnfocarPassword}
              onBlur={alPerderFoco}
              style={estilos.input}
              required
            />
          </div>

          {error && <div style={estilos.error}>{error}</div>}

          <button
            type="submit"
            disabled={cargando}
            style={estilos.boton}
          >
            {cargando
              ? 'Cargando...'
              : (esRegistro ? 'Registrar' : 'Entrar')}
          </button>

        </form>

        <div style={estilos.footer}>
          <button
            onClick={() => setEsRegistro(!esRegistro)}
            style={estilos.botonLink}
          >
            {esRegistro ? 'Ya tengo cuenta' : 'Crear una cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 ESTILOS
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
    textDecoration: 'underline'
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