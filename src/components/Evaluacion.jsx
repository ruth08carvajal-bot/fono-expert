import { useState } from 'react';
import { enviarAFonoaudiologia } from '../services/api';

function Evaluacion() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarRespuesta = async (valor) => {
    setCargando(true);
    try {
      // Enviamos el hecho al motor de inferencia en Python
      const data = await enviarAFonoaudiologia({ 
        fonema: 'R', 
        acierto: valor,
        incertidumbre: 0.2 // Ejemplo de tu variable de incertidumbre
      });
      
      setDiagnostico(data);
    } catch (err) {
      alert("No se pudo conectar con el servidor de Python");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Evaluación de Lenguaje</h2>
      <p>¿El niño logró pronunciar el fonema correctamente?</p>
      
      <button onClick={() => manejarRespuesta(true)} disabled={cargando}>
        {cargando ? 'Analizando...' : 'Logrado'}
      </button>
      
      <button onClick={() => manejarRespuesta(false)} disabled={cargando}>
        No logrado
      </button>

      {diagnostico && (
        <div style={{ marginTop: '20px', color: 'blue' }}>
          <h3>Resultado del Sistema Experto:</h3>
          <p>Diagnóstico: {diagnostico.resultado}</p>
          <p>Nivel de Certeza: {diagnostico.certeza}%</p>
        </div>
      )}
    </div>
  );
}

export default Evaluacion;