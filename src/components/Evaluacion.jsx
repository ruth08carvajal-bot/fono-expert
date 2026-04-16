import { useState, useEffect } from 'react';
import Anamnesis from './Anamnesis';
import { enviarAFonoaudiologia } from '../services/api';
import axios from 'axios';

// 1. Importamos los componentes de los juegos (Asegúrate de haber creado estos archivos)
import JuegoFonema from './juegos/JuegoFonema';
import JuegoSeleccion from './juegos/JuegoSeleccion';
import JuegoLectura from './juegos/JuegoLectura';

function Evaluacion({ nino, alCompletarAnamnesis }) {
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [anamnesisCompletada, setAnamnesisCompletada] = useState(nino.tiene_anamnesis);
  const [idEvaluacion, setIdEvaluacion] = useState(null);
  
  // Nuevo estado para saber qué hecho (pregunta) toca evaluar
  const [hechoActual, setHechoActual] = useState(null);

  // 2. Efecto para pedir la primera pregunta al motor apenas se complete la anamnesis
  useEffect(() => {
    if (anamnesisCompletada && !hechoActual) {
      obtenerSiguienteHecho();
    }
  }, [anamnesisCompletada]);

  const obtenerSiguienteHecho = async () => {
    setCargando(true);
    try {
      // Llamada al backend para obtener el siguiente hecho según la lógica de encadenamiento hacia atrás
      const res = await axios.get(`http://localhost:5000/siguiente_pregunta/${idEvaluacion || nino.id_nino}`);
      if (res.data.finalizado) {
        setDiagnostico(res.data.diagnostico_final);
      } else {
        setHechoActual(res.data);
      }
    } catch (err) {
      console.error("Error obteniendo meta del SE", err);
    } finally {
      setCargando(false);
    }
  };

  const manejarRespuesta = async (valor) => {
    setCargando(true);
    try {
      // Usamos tu función original enviando los datos del hecho actual
      const data = await enviarAFonoaudiologia({ 
        id_evaluacion: idEvaluacion || nino.id_nino,
        id_hecho: hechoActual?.id_hecho, 
        acierto: valor,
        incertidumbre: 0.2 
      });
      
      // Si el motor devuelve un diagnóstico parcial o final lo guardamos
      if (data.es_final) {
          setDiagnostico(data);
      } else {
          // Si no es el final, pedimos el siguiente hecho
          obtenerSiguienteHecho();
      }
    } catch (err) {
      alert("No se pudo conectar con el servidor de Python");
    } finally {
      setCargando(false);
    }
  };

  // Render de Anamnesis (Tu código original)
  if (!anamnesisCompletada) {
    return (
      <Anamnesis 
        idNino={nino.id_nino} 
        edadNino={nino.edad} 
        alFinalizar={(datos) => {
          alCompletarAnamnesis();
          setAnamnesisCompletada(true);
          setIdEvaluacion(datos.id_evaluacion);
        }} 
      />
    );
  }

  return (
    <div style={estilos.contenedor}>
      <h2 style={estilos.titulo}>Evaluación de Lenguaje</h2>
      
      {cargando && <p>Cargando prueba...</p>}

      {/* 3. Lógica dinámica: Seleccionamos el juego según el ID del hecho */}
      {!diagnostico && hechoActual && (
        <div style={estilos.pantallaJuego}>
            {hechoActual.id_hecho <= 34 && (
                <JuegoFonema hecho={hechoActual} alEnviarRespuesta={manejarRespuesta} />
            )}

            {hechoActual.id_hecho >= 35 && hechoActual.id_hecho <= 68 && (
                <JuegoSeleccion hecho={hechoActual} alEnviarRespuesta={manejarRespuesta} />
            )}

            {hechoActual.id_hecho >= 81 && hechoActual.id_hecho <= 90 && (
                <JuegoLectura hecho={hechoActual} alEnviarRespuesta={manejarRespuesta} />
            )}
        </div>
      )}

      {/* Resultado Final (Tu código original mejorado) */}
      {diagnostico && (
        <div style={estilos.resultado}>
          <h3>Resultado del Sistema Experto:</h3>
          <p><b>Diagnóstico:</b> {diagnostico.resultado}</p>
          <p><b>Nivel de Certeza:</b> {diagnostico.certeza}%</p>
          <button onClick={() => window.location.reload()} style={estilos.boton}>Finalizar</button>
        </div>
      )}
    </div>
  );
}

// 4. Definimos los estilos para que no den error 'no-undef'
const estilos = {
    contenedor: { textAlign: 'center', marginTop: '30px', padding: '20px' },
    titulo: { color: '#2b6cb0', marginBottom: '20px' },
    pantallaJuego: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
    resultado: { marginTop: '30px', padding: '20px', border: '2px solid blue', borderRadius: '15px', backgroundColor: '#ebf8ff' },
    boton: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default Evaluacion;