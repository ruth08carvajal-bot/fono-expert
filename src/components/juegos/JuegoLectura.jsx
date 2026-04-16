import React from 'react';

function JuegoLectura({ hecho, alEnviarRespuesta }) {
    return (
        <div style={estilos.card}>
            <div style={estilos.badge}>LECTOESCRITURA</div>
            <h2 style={estilos.titulo}>¡Vamos a leer!</h2>
            
            <div style={estilos.cajaTexto}>
                <p style={estilos.texto}>{hecho.descripcion_hecho}</p>
            </div>

            <div style={estilos.controles}>
                <button 
                    onClick={() => alEnviarRespuesta(hecho.id_hecho, 1.0)} 
                    style={estilos.botonExito}
                >
                    ✅ Leyó correctamente
                </button>
                <button 
                    onClick={() => alEnviarRespuesta(hecho.id_hecho, 0.0)} 
                    style={estilos.botonError}
                >
                    ❌ Tuvo dificultad
                </button>
            </div>
            <p style={estilos.nota}>El padre/evaluador confirma el resultado</p>
        </div>
    );
}

const estilos = {
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center' },
    badge: { display: 'inline-block', padding: '5px 15px', backgroundColor: '#fff5f5', color: '#e53e3e', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' },
    cajaTexto: { backgroundColor: '#f7fafc', padding: '40px', borderRadius: '15px', marginBottom: '30px', border: '2px dashed #cbd5e0' },
    texto: { fontSize: '32px', fontWeight: 'bold', color: '#2d3748', margin: 0 },
    controles: { display: 'flex', gap: '15px', justifyContent: 'center' },
    botonExito: { padding: '15px 25px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
    botonError: { padding: '15px 25px', backgroundColor: '#f56565', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
    nota: { fontSize: '12px', color: '#a0aec0', marginTop: '15px' }
};

export default JuegoLectura;