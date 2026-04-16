import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import animacionRobot from '../assets/robot.json';

function Registro({ alRegistrar, volverAlLogin }) {

    const [nombrePadre, setNombrePadre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreNino, setNombreNino] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [celular, setCelular] = useState('');
    const [genero, setGenero] = useState('Masculino');

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const playerRef = useRef();

    // 🎯 FRAMES
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
        if (!segmento) return;

        const player = playerRef.current;

        player.stop();

        setTimeout(() => {
            player.setDirection(1);
            player.playSegments(segmento, true);
            player.loop = loop;
        }, 40);
    };

    const volverIdle = () => {
        setTimeout(() => {
            playState('idle', true);
        }, 700);
    };

    useEffect(() => {
        playState('idle', true);
    }, []);

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        playState('processing', true);

        const datos = {
            correo: email,
            password: password,
            nombre_padre: nombrePadre,
            celular: celular,
            ciudad: "La Paz",
            nombre_nino: nombreNino,
            fecha_nacimiento: fechaNacimiento,
            genero: genero
        };

        try {
            const response = await axios.post('http://127.0.0.1:5000/evaluar', datos);

            if (response.data.status === "success") {
                playState('success');

                setTimeout(() => {
                    alRegistrar(response.data);
                }, 1800);
            }

        } catch (err) {
            setError(err.response?.data?.message || "Error de conexión");

            playState('error');

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
            <div style={estilos.robotContainer}>
                <Lottie
                    lottieRef={playerRef}
                    animationData={animacionRobot}
                    loop={false}
                    style={estilos.robot}
                />
            </div>

            {/* 🧾 FORM */}
            <div style={estilos.tarjeta}>
                <h2 style={estilos.titulo}>Registro</h2>

                <form onSubmit={manejarEnvio} style={estilos.formulario}>

                    <input
                        placeholder="Nombre del padre"
                        onFocus={() => { playState('focusUser'); volverIdle(); }}
                        onChange={(e) => setNombrePadre(e.target.value)}
                        style={estilos.input}
                        required
                    />

                    <input
                        placeholder="Correo"
                        type="email"
                        onFocus={() => { playState('focusUser'); volverIdle(); }}
                        onChange={(e) => setEmail(e.target.value)}
                        style={estilos.input}
                        required
                    />

                    <input
                        placeholder="Celular"
                        onFocus={() => { playState('focusUser'); volverIdle(); }}
                        onChange={(e) => setCelular(e.target.value)}
                        style={estilos.input}
                        required
                    />

                    <input
                        placeholder="Nombre del niño"
                        onFocus={() => { playState('focusUser'); volverIdle(); }}
                        onChange={(e) => setNombreNino(e.target.value)}
                        style={estilos.input}
                        required
                    />

                    <input
                        type="date"
                        onFocus={() => { playState('focusUser'); volverIdle(); }}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        style={estilos.input}
                        required
                    />

                    <select
                        value={genero}
                        onFocus={() => { playState('focusUser'); volverIdle(); }}
                        onChange={(e) => setGenero(e.target.value)}
                        style={estilos.input}
                    >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>

                    <input
                        type="password"
                        placeholder="Contraseña"
                        onFocus={() => playState('focusPassword')}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.length > 0) {
                                playState('focusPassword');
                            }
                        }}
                        onBlur={volverIdle}
                        style={estilos.input}
                        required
                    />

                    {error && <div style={estilos.errorTexto}>{error}</div>}

                    <button type="submit" disabled={cargando} style={estilos.boton}>
                        {cargando ? 'Registrando...' : 'Finalizar Registro'}
                    </button>

                </form>

                <button onClick={volverAlLogin} style={estilos.botonLink}>
                    ¿Ya tienes cuenta? Inicia sesión
                </button>
            </div>

        </div>
    );
}

// 🎨 ESTILOS OPTIMIZADOS
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

    robotContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -65%)',
        width: '700px',
        height: '570px',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
    },

    robot: {
        width: '710px',
        transform: 'translateY(-40px)', // 🔥 subido para que se vea mejor
        opacity: 0.9
    },

    tarjeta: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '25px',
        borderRadius: '18px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '340px',
        textAlign: 'center',
        zIndex: 10,
        backdropFilter: 'blur(6px)',
        border: '1px solid #fff',
        position: 'relative',
        top: '50px' // 🔥 baja el formulario
    },

    titulo: {
        color: '#2d3748',
        marginBottom: '10px',
        fontSize: '20px',
        fontWeight: 'bold'
    },

    formulario: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },

    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none'
    },

    boton: {
        backgroundColor: '#3182ce',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '8px'
    },

    botonLink: {
        marginTop: '15px',
        background: 'none',
        border: 'none',
        color: '#3182ce',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '14px'
    },

    errorTexto: {
        color: '#e53e3e',
        fontSize: '13px',
        padding: '8px',
        backgroundColor: '#fff5f5',
        borderRadius: '8px'
    }
};

export default Registro;