import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import animacionRobot from '../assets/robot.json';

function Registro({ alRegistrar, volverAlLogin }) {
  const [nombrePadre, setNombrePadre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreNino, setNombreNino] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(''); // Estado para la fecha
  
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const playerRef = useRef(null);

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
    player.playSegments(estados[state], true);
    if (player.animationItem) {
      player.animationItem.loop = loop;
    }
  };

  useEffect(() => { 
    playState('idle', true); 
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    playState('processing', true);

    try {
      // Enviamos la fecha directamente (el input date ya da el formato AAAA-mm-dd)
      const response = await axios.post('http://127.0.0.1:5000/evaluar', {
        nombre_padre: nombrePadre,
        correo: email,
        password: password,
        nombre_nino: nombreNino,
        fecha_nacimiento: fechaNacimiento, 
        tipo: 'registro'
      });

      if (response.data.status === "success") {
        playState('success');
        setTimeout(() => {
          alRegistrar(response.data); 
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar");
      playState('error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.capaFondoRobot}>
        <Lottie lottieRef={playerRef} animationData={animacionRobot} style={estilos.robotFondo} />
      </div>

      <div style={estilos.tarjeta}>
        <h2 style={estilos.titulo}>Crear Cuenta</h2>
        
        <form onSubmit={manejarEnvio} style={estilos.formulario}>
          <input 
            placeholder="Tu nombre (Padre/Tutor)" 
            onChange={(e) => setNombrePadre(e.target.value)}
            onFocus={() => playState('focusUser', true)}
            style={estilos.input} required 
          />
          
          <input 
            placeholder="Correo electrónico" 
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => playState('focusUser', true)}
            style={estilos.input} required 
          />

          <input 
            placeholder="Nombre del niño" 
            onChange={(e) => setNombreNino(e.target.value)}
            onFocus={() => playState('focusUser', true)}
            style={estilos.input} required 
          />

          <div style={estilos.campoFecha}>
            <label style={estilos.labelFecha}>Fecha de nacimiento del niño:</label>
            <input 
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              onFocus={() => playState('focusUser', true)}
              style={estilos.input} required 
            />
          </div>

          <input 
            placeholder="Contraseña" 
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => playState('focusPassword', false)}
            style={estilos.input} required 
          />

          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

          <button type="submit" disabled={cargando} style={estilos.boton}>
            {cargando ? 'Registrando...' : 'Registrar y Empezar'}
          </button>
        </form>

        <button onClick={volverAlLogin} style={estilos.botonLink}>
          Ya tengo cuenta, iniciar sesión
        </button>
      </div>
    </div>
  );
}

const estilos = {
  contenedor: { height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: '#f0f4f8', overflow: 'hidden' },
  capaFondoRobot: { position: 'absolute', zIndex: 1, pointerEvents: 'none' },
  robotFondo: { width: '800px', transform: 'translateY(-50px)' },
  tarjeta: { zIndex: 10, backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' },
  titulo: { marginBottom: '20px', color: '#2d3748' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  campoFecha: { textAlign: 'left' },
  labelFecha: { fontSize: '12px', color: '#718096', marginBottom: '5px', display: 'block' },
  boton: { padding: '12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  botonLink: { marginTop: '15px', background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', textDecoration: 'underline' }
};

export default Registro;