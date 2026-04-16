import React, { useState, useRef } from 'react';

function JuegoFonema({ hecho, alEnviarRespuesta }) {
    const [grabando, setGrabando] = useState(false);
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);

    const iniciarGrabacion = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            chunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'audio/wav' });
                alEnviarRespuesta(hecho.id_hecho, blob); // Enviamos el audio al backend
            };

            mediaRecorder.current.start();
            setGrabando(true);
        } catch (err) {
            alert("Error al acceder al micrófono");
        }
    };

    const detenerGrabacion = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setGrabando(false);
        }
    };

    return (
        <div style={estilos.card}>
            <div style={estilos.badge}>PRUEBA DE ARTICULACIÓN</div>
            <h2 style={estilos.titulo}>¿Cómo se llama esto?</h2>
            
            <div style={estilos.contenedorImagen}>
                {/* Imagen dinámica basada en el código del hecho (ej: H001.png) */}
                <img 
                    src={`/assets/estimulos/${hecho.codigo_h}.png`} 
                    alt="Estímulo visual"
                    style={estilos.imagen}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200?text=Imagen+Estímulo'}
                />
            </div>

            <p style={estilos.descripcion}>{hecho.descripcion_hecho}</p>

            <button 
                onMouseDown={iniciarGrabacion} 
                onMouseUp={detenerGrabacion}
                onMouseLeave={grabando ? detenerGrabacion : null}
                style={grabando ? estilos.botonGrabando : estilos.botonMicro}
            >
                {grabando ? '🔴 Escuchando...' : '🎤 Mantén presionado para hablar'}
            </button>
            <p style={estilos.pista}>Suelta el botón al terminar de hablar</p>
        </div>
    );
}

const estilos = {
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
    badge: { display: 'inline-block', padding: '5px 15px', backgroundColor: '#ebf8ff', color: '#3182ce', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' },
    titulo: { color: '#2d3748', marginBottom: '20px' },
    contenedorImagen: { height: '200px', display: 'flex', justifyContent: 'center', marginBottom: '20px' },
    imagen: { maxHeight: '100%', borderRadius: '15px' },
    descripcion: { fontSize: '18px', fontWeight: 'bold', color: '#4a5568', marginBottom: '30px' },
    botonMicro: { padding: '20px 40px', fontSize: '18px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', transition: '0.3s' },
    botonGrabando: { padding: '20px 40px', fontSize: '18px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', transform: 'scale(1.1)' },
    pista: { color: '#a0aec0', fontSize: '12px', marginTop: '15px' }
};

export default JuegoFonema;