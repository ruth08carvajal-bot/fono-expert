import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import animacionRobot from '../assets/robot.json';

function RegistroNino({ idPadre, alFinalizar, volver }) {
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(''); // Estado para la fecha
    const [genero, setGenero] = useState('Masculino');
    const [cargando, setCargando] = useState(false);
    
    const playerRef = useRef();

    const estados = {
        idle: [0, 250],
        processing: [420, 560],
        success: [560, 680],
        error: [680, 780]
    };

    const playState = (state, loop = false) => {
        if (!playerRef.current) return;
        const player = playerRef.current;
        player.stop();
        player.playSegments(estados[state], true);
        if (player.animationItem) player.animationItem.loop = loop;
    };

    useEffect(() => { 
        playState('idle', true); 
    }, []);

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setCargando(true);
        playState('processing', true);

        try {
            const res = await axios.post('http://127.0.0.1:5000/registrar_solo_nino', {
                id_padre: idPadre,
                nombre_nino: nombre,
                fecha_nacimiento: fechaNacimiento, // Enviamos la fecha en lugar de la edad manual
                genero: genero
            });

            if (res.data.status === "success") {
                playState('success');
                setTimeout(() => {
                    alFinalizar(res.data.usuario_actualizado);
                }, 1500);
            }
        } catch (err) {
            playState('error');
            alert("Error al registrar al niño");
            setTimeout(() => playState('idle', true), 1200);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={estilos.contenedor}>
            {/* Robot ajustado para ver solo el torso/cuerpo */}
            <div style={estilos.robotCapa}>
                <Lottie 
                    lottieRef={playerRef} 
                    animationData={animacionRobot} 
                    style={estilos.robot}
                    loop={true}
                />
            </div>

            <div style={estilos.tarjeta}>
                <h2 style={{color: '#2d3748', marginBottom: '5px'}}>Nuevo Registro</h2>
                <p style={{color: '#718096', marginBottom: '15px', fontSize: '14px'}}>
                    Datos del niño para su evaluación
                </p>

                <form onSubmit={manejarEnvio} style={estilos.form}>
                    <div style={estilos.campo}>
                        <label style={estilos.label}>Nombre completo</label>
                        <input 
                            type="text" 
                            placeholder="Nombre del niño" 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={estilos.input} 
                            required 
                        />
                    </div>

                    <div style={estilos.campo}>
                        <label style={estilos.label}>Fecha de Nacimiento</label>
                        <input 
                            type="date" 
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            style={estilos.input} 
                            required 
                        />
                    </div>

                    <div style={estilos.campo}>
                        <label style={estilos.label}>Género</label>
                        <select 
                            value={genero} 
                            onChange={(e) => setGenero(e.target.value)} 
                            style={estilos.input}
                        >
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>

                    <button type="submit" disabled={cargando} style={estilos.boton}>
                        {cargando ? 'Guardando...' : 'Registrar Niño'}
                    </button>
                    <button type="button" onClick={volver} style={estilos.botonVolver}>
                        Volver al panel
                    </button>
                </form>
            </div>
        </div>
    );
}

const estilos = {
    contenedor: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw',
        backgroundColor: '#f4f7f9',
        position: 'relative',
        overflow: 'hidden'
    },
    robotCapa: { 
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        pointerEvents: 'none'
    },
    robot: { 
        width: '500px', 
        height: '500px',
        // Subimos al robot y lo escalamos para que las piernas queden fuera de la vista
        transform: 'translateY(-120px) scale(1.3)', 
        opacity: 0.9
    },
    tarjeta: { 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        padding: '30px', 
        borderRadius: '25px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
        width: '340px', 
        textAlign: 'center',
        zIndex: 10,
        backdropFilter: 'blur(5px)',
        border: '1px solid #fff'
    },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    campo: { textAlign: 'left' },
    label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px' },
    input: { 
        width: '100%',
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid #e2e8f0', 
        fontSize: '15px',
        boxSizing: 'border-box'
    },
    boton: { 
        padding: '14px', 
        backgroundColor: '#38a169', 
        color: 'white', 
        border: 'none', 
        borderRadius: '12px', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        marginTop: '5px',
        fontSize: '16px'
    },
    botonVolver: { 
        background: 'none', 
        border: 'none', 
        color: '#718096', 
        cursor: 'pointer', 
        textDecoration: 'underline', 
        fontSize: '14px',
        marginTop: '5px'
    }
};

export default RegistroNino;