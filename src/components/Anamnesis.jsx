import { useState, useEffect } from 'react';
import axios from 'axios';

function Anamnesis({ idNino, edadNino, alFinalizar }) {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    
    // Estado para los Checkbox (id_hecho: boolean)
    const [hechosSeleccionados, setHechosSeleccionados] = useState({
        116: false, 117: false, 118: false, 119: false, // Generales
        120: false, 121: false, 122: false,             // 3-5 años
        123: false, 113: false, 124: false,             // 6-8 años
        125: false, 115: false, 126: false,             // 9-10 años
        114: false                                      // Ruido de fondo
    });

    const manejarCambio = (id) => {
        setHechosSeleccionados(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const enviarAnamnesis = async () => {
        setCargando(true);
        setError('');

        // 1. Transformar el objeto en la lista que espera tu app.py
        const hechos = Object.entries(hechosSeleccionados)
            .filter(([_, seleccionado]) => seleccionado)
            .map(([id, _]) => ({
                id_hecho: parseInt(id),
                valor_fuzzy: 1.0 // Peso de certeza para el Sistema Experto
            }));

        const payload = {
            id_nino: idNino,
            hechos: hechos
        };

        console.log('Enviando payload:', payload);

        try {
            // Endpoint que tenías en Kotlin: /guardar_anamnesis o /evaluar
            const res = await axios.post('http://127.0.0.1:5000/guardar_anamnesis', payload);
            console.log('Respuesta del servidor:', res.data);
            if (res.data.status === "success") {
                alFinalizar(res.data); // Pasar todos los datos incluyendo id_evaluacion
            }
        } catch (err) {
            console.error('Error completo:', err);
            console.error('Respuesta de error:', err.response?.data);
            setError("Error al guardar la anamnesis");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={estilos.contenedor}>
            <div style={estilos.tarjeta}>
                <h3>Anamnesis Clínica</h3>
                <p style={estilos.subtitulo}>Perfil para: {edadNino} años</p>

                <div style={estilos.scrollArea}>
                    {/* SECCIÓN GENERAL (Siempre visible) */}
                    <Section title="Antecedentes Generales">
                        <Item label="Antecedentes familiares de habla" id={116} checked={hechosSeleccionados[116]} onChange={manejarCambio} />
                        <Item label="Otitis o infecciones frecuentes" id={117} checked={hechosSeleccionados[117]} onChange={manejarCambio} />
                        <Item label="Complicaciones en el parto" id={118} checked={hechosSeleccionados[118]} onChange={manejarCambio} />
                        <Item label="Entorno bilingüe" id={119} checked={hechosSeleccionados[119]} onChange={manejarCambio} />
                    </Section>

                    {/* LÓGICA DE VISIBILIDAD SEGÚN EDAD (Como en Android) */}
                    {edadNino >= 3 && (
                        <Section title="Desarrollo 3 - 5 años">
                            <Item label="Uso prolongado de chupón/biberón" id={120} checked={hechosSeleccionados[120]} onChange={manejarCambio} />
                            <Item label="Dificultad al masticar" id={121} checked={hechosSeleccionados[121]} onChange={manejarCambio} />
                            <Item label="Respira por la boca" id={122} checked={hechosSeleccionados[122]} onChange={manejarCambio} />
                        </Section>
                    )}

                    {edadNino >= 6 && (
                        <Section title="Desarrollo 6 - 8 años">
                            <Item label="Muda de dientes frontales" id={123} checked={hechosSeleccionados[123]} onChange={manejarCambio} />
                            <Item label="Ausencia de vibración /r/" id={113} checked={hechosSeleccionados[113]} onChange={manejarCambio} />
                            <Item label="Evita contacto social" id={124} checked={hechosSeleccionados[124]} onChange={manejarCambio} />
                        </Section>
                    )}

                    {edadNino >= 9 && (
                        <Section title="Desarrollo 9 - 10 años">
                            <Item label="Errores constantes en escritura" id={125} checked={hechosSeleccionados[125]} onChange={manejarCambio} />
                            <Item label="Errores en lectura fluida" id={115} checked={hechosSeleccionados[115]} onChange={manejarCambio} />
                            <Item label="Tiene conciencia de su error" id={126} checked={hechosSeleccionados[126]} onChange={manejarCambio} />
                        </Section>
                    )}
                    
                    <Section title="Otros">
                        <Item label="Dificultad con ruido de fondo" id={114} checked={hechosSeleccionados[114]} onChange={manejarCambio} />
                    </Section>
                </div>

                {error && <p style={{color: 'red'}}>{error}</p>}
                
                <button 
                    onClick={enviarAnamnesis} 
                    disabled={cargando} 
                    style={estilos.boton}
                >
                    {cargando ? 'Guardando...' : 'Continuar a Evaluación'}
                </button>
            </div>
        </div>
    );
}

// Sub-componentes para limpiar el código
const Section = ({ title, children }) => (
    <div style={estilos.seccion}>
        <h4 style={estilos.tituloSeccion}>{title}</h4>
        {children}
    </div>
);

const Item = ({ label, id, checked, onChange }) => (
    <div style={estilos.item} onClick={() => onChange(id)}>
        <input type="checkbox" checked={checked} readOnly />
        <label>{label}</label>
    </div>
);

const estilos = {
    contenedor: { display: 'flex', justifyContent: 'center', padding: '20px', backgroundColor: '#f0f4f8', minHeight: '100vh' },
    tarjeta: { backgroundColor: 'white', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    scrollArea: { maxHeight: '60vh', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' },
    seccion: { marginBottom: '20px', textAlign: 'left' },
    tituloSeccion: { borderBottom: '2px solid #e2e8f0', paddingBottom: '5px', color: '#4a5568', fontSize: '16px' },
    item: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', cursor: 'pointer' },
    boton: { width: '100%', padding: '12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    subtitulo: { color: '#718096', fontSize: '14px', marginBottom: '15px' }
};

export default Anamnesis;