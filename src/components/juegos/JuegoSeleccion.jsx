import React from 'react';

function JuegoSeleccion({ hecho, alEnviarRespuesta }) {
    // Ejemplo de opciones (esto debería venir de tu backend junto con el hecho)
    const opciones = hecho.opciones || [
        { id: 1, img: 'opcionA.png', correcta: true },
        { id: 2, img: 'opcionB.png', correcta: false }
    ];

    return (
        <div style={estilos.card}>
            <div style={estilos.badge}>COMPRENSIÓN Y VOCABULARIO</div>
            <h2 style={estilos.titulo}>{hecho.descripcion_hecho}</h2>
            
            <div style={estilos.grid}>
                {opciones.map((opc) => (
                    <div 
                        key={opc.id} 
                        style={estilos.opcion}
                        onClick={() => alEnviarRespuesta(hecho.id_hecho, opc.correcta ? 1.0 : 0.0)}
                    >
                        <img src={`/assets/opciones/${opc.img}`} style={estilos.imgOpcion} alt="opción" />
                    </div>
                ))}
            </div>
            <p style={estilos.instruccion}>Toca el dibujo correcto</p>
        </div>
    );
}

const estilos = {
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center' },
    badge: { display: 'inline-block', padding: '5px 15px', backgroundColor: '#f0fff4', color: '#38a169', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' },
    opcion: { padding: '10px', border: '3px solid #edf2f7', borderRadius: '20px', cursor: 'pointer', transition: '0.2s' },
    imgOpcion: { width: '100%', borderRadius: '15px' },
    instruccion: { marginTop: '20px', color: '#718096', fontWeight: 'bold' }
};

export default JuegoSeleccion;