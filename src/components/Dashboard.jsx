import React from 'react';

function Dashboard({ datosPadre, alIrARegistroNino, alSeleccionarNino, cerrarSesion }) {
  // Asumiendo que tu backend devuelve una lista de hijos en el objeto usuario
  const hijos = datosPadre.hijos || [];

  return (
    <div style={estilos.contenedor}>
      {/* Barra de Navegación Superior */}
      <nav style={estilos.navbar}>
        <div style={estilos.logoSeccion}>
          <h2 style={estilos.logoText}>FonoExpert</h2>
          <span style={estilos.tagline}>Panel de Control</span>
        </div>
        <div style={estilos.usuarioSeccion}>
          <span style={estilos.userName}>Padre: <b>{datosPadre.nombre_padre || "Usuario"}</b></span>
          <button onClick={cerrarSesion} style={estilos.botonSalir}>Cerrar Sesión</button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main style={estilos.main}>
        <div style={estilos.bienvenidaCard}>
          <h1 style={estilos.tituloBienvenida}>¡Hola de nuevo!</h1>
          <p style={estilos.p}>Gestiona las evaluaciones de tus niños y revisa sus progresos desde aquí.</p>
        </div>

        <div style={estilos.seccionHijos}>
          <div style={estilos.headerLista}>
            <h3 style={estilos.subtitulo}>Tus Niños Registrados</h3>
            <button onClick={alIrARegistroNino} style={estilos.botonAnadir}>
              + Registrar otro niño
            </button>
          </div>

          <div style={estilos.gridHijos}>
            {hijos.length > 0 ? (
              hijos.map((nino) => (
                <div key={nino.id_nino} style={estilos.cardNino}>
                  <div style={estilos.avatar}>
                    {nino.nombre_nino.charAt(0).toUpperCase()}
                  </div>
                  <div style={estilos.info}>
                    <h4 style={estilos.nombreNino}>{nino.nombre_nino}</h4>
                    <p style={estilos.datosNino}>{nino.edad} años • {nino.genero}</p>
                  </div>
                  <button 
                    onClick={() => alSeleccionarNino(nino)} 
                    style={estilos.botonEvaluar}
                  >
                    {nino.accion_boton || 'Evaluar'}
                  </button>
                </div>
              ))
            ) : (
              <div style={estilos.vacio}>
                <p>No hay niños vinculados a esta cuenta.</p>
                <button onClick={alIrARegistroNino} style={estilos.botonLinkVacio}>Haz clic aquí para registrar al primero</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const estilos = {
  contenedor: { minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
  navbar: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '0 40px', height: '70px', backgroundColor: '#fff', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 
  },
  logoSeccion: { display: 'flex', flexDirection: 'column' },
  logoText: { margin: 0, color: '#2b6cb0', fontSize: '22px' },
  tagline: { fontSize: '11px', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' },
  usuarioSeccion: { display: 'flex', alignItems: 'center', gap: '20px' },
  userName: { color: '#4a5568', fontSize: '14px' },
  botonSalir: { padding: '8px 15px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#e53e3e', fontWeight: 'bold' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' },
  bienvenidaCard: { backgroundColor: '#3182ce', padding: '30px', borderRadius: '20px', color: 'white', marginBottom: '40px', boxShadow: '0 10px 15px -3px rgba(49, 130, 206, 0.3)' },
  tituloBienvenida: { margin: '0 0 10px 0', fontSize: '28px' },
  p: { margin: 0, opacity: 0.9 },
  seccionHijos: { display: 'flex', flexDirection: 'column', gap: '20px' },
  headerLista: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  subtitulo: { fontSize: '20px', color: '#2d3748', margin: 0 },
  botonAnadir: { backgroundColor: '#38a169', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
  gridHijos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  cardNino: { backgroundColor: 'white', padding: '20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' },
  avatar: { width: '50px', height: '50px', backgroundColor: '#ebf8ff', color: '#3182ce', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold' },
  info: { flex: 1 },
  nombreNino: { margin: 0, color: '#2d3748', fontSize: '17px' },
  datosNino: { margin: '2px 0 0 0', color: '#718096', fontSize: '13px' },
  botonEvaluar: { padding: '10px 18px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  vacio: { textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '20px', gridColumn: '1/-1', border: '2px dashed #cbd5e0' },
  botonLinkVacio: { background: 'none', border: 'none', color: '#3182ce', textDecoration: 'underline', cursor: 'pointer', fontSize: '16px' }
};

export default Dashboard;