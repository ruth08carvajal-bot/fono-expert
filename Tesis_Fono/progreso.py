from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime, timedelta
from conexion_db import Database
import os

class GestorProgreso:
    def __init__(self):
        self.db_manager = Database()

    # --- MÓDULO 5: ALGORITMO DE ADAPTACIÓN DINÁMICA ---
    def generar_ruta_personalizada(self, id_nino):
        """
        Calcula la dificultad y actividades basándose en la categoría 
        del diagnóstico y la certeza (Lógica Difusa).
        """
        db = self.db_manager.conectar()
        if not db:
            return {"error": "No hay conexión a BD"}
            
        try:
            cursor = db.cursor(dictionary=True)
            # Consulta alineada a tu script SQL: resultados_reporte y catalogo_diagnosticos
            sql_diag = """
                SELECT e.id_diagnostico_final, r.porcentaje_certeza, d.categoria, d.nombre_diagnostico
                FROM evaluaciones e
                JOIN resultados_reporte r ON e.id_evaluacion = r.id_evaluacion
                JOIN catalogo_diagnosticos d ON e.id_diagnostico_final = d.id_diagnostico
                WHERE e.id_nino = %s
                ORDER BY e.fecha_evaluacion DESC LIMIT 1
            """
            cursor.execute(sql_diag, (id_nino,))
            ultimo = cursor.fetchone()
            
            if not ultimo:
                return {
                    "tipo": "estimulacion_general", 
                    "nivel": 1, 
                    "mensaje": "Completar evaluación inicial para personalizar ruta"
                }

            certeza = float(ultimo['porcentaje_certeza'])
            # Lógica de Adaptación: 3 Niveles basados en Certeza/Severidad
            nivel = 3 if certeza > 70 else (2 if certeza > 40 else 1)

            ruta = {
                "diagnostico_actual": ultimo['nombre_diagnostico'],
                "dificultad_asignada": nivel,
                "categoria_clinica": ultimo['categoria'],
                "actividades": self._seleccionar_actividades(ultimo['categoria'], nivel)
            }
            return ruta
        except Exception as e:
            print(f"Error en Adaptación Dinámica: {e}")
            return {"error": str(e)}
        finally:
            db.close()

    def _seleccionar_actividades(self, categoria, nivel):
        """Sub-función para mapear actividades según categoría clínica"""
        mapa = {
            'Habla': ["Soplo Dinámico", "Gimnasia Lingual", "Repetición Fonémica"],
            'Fluidez': ["Control de Respiración", "Habla Rítmica", "Relajación Muscular"],
            'Lenguaje': ["Asociación Visual", "Construcción de Frases", "Vocabulario"],
            'Lectura': ["Reconocimiento de Grafemas", "Velocidad Lectora"]
        }
        # Retorna la lista según categoría o una genérica si no existe
        return mapa.get(categoria, ["Estimulación General"])

    # --- MÓDULO 7: MONITOREO Y REEVALUACIÓN (Ciclo de 30 días) ---
    def verificar_reevaluacion(self, id_nino):
        """Verifica si han pasado 30 días para activar nueva evaluación."""
        db = self.db_manager.conectar()
        if not db: return False, "Sin conexión"
        
        try:
            cursor = db.cursor(dictionary=True)
            sql = "SELECT fecha_evaluacion FROM evaluaciones WHERE id_nino = %s ORDER BY fecha_evaluacion DESC LIMIT 1"
            cursor.execute(sql, (id_nino,))
            ultima = cursor.fetchone()
            
            if ultima:
                fecha_ultima = ultima['fecha_evaluacion']
                fecha_proxima = fecha_ultima + timedelta(days=30)
                
                if datetime.now() > fecha_proxima:
                    return True, "Ciclo cumplido. Se requiere reevaluación."
                else:
                    dias = (fecha_proxima - datetime.now()).days
                    return False, f"Tratamiento en curso. Reevaluación en {dias} días."
            
            return True, "Se requiere evaluación inicial."
        finally:
            db.close()

    # --- MÓDULO 6: GENERACIÓN DE PDF Y EXPLICACIÓN ---
    def crear_pdf_especialista(self, nombre_nino, diagnostico, certeza, id_evaluacion):
        """Genera informe con el Módulo de Explicación (Hechos detectados)."""
        # Crear carpeta de reportes si no existe
        if not os.path.exists('reportes'):
            os.makedirs('reportes')

        fecha_str = datetime.now().strftime('%Y%m%d_%H%M')
        nombre_archivo = f"reportes/Reporte_{nombre_nino.replace(' ', '_')}_{fecha_str}.pdf"
        
        c = canvas.Canvas(nombre_archivo, pagesize=letter)
        
        # --- Encabezado ---
        c.setFont("Helvetica-Bold", 16)
        c.drawString(100, 750, "INFORME FONOAUDIOLÓGICO - SEFONO")
        c.setFont("Helvetica-Oblique", 9)
        c.drawString(100, 735, "Sistema Experto (Durkin) con Lógica Difusa y Backward Chaining")
        
        # --- Datos del Paciente ---
        c.setFont("Helvetica-Bold", 12)
        c.drawString(100, 700, "DATOS GENERALES")
        c.setFont("Helvetica", 11)
        c.drawString(100, 680, f"Paciente: {nombre_nino}")
        c.drawString(100, 665, f"Fecha de Emisión: {datetime.now().strftime('%d/%m/%Y')}")
        c.drawString(100, 650, f"Diagnóstico Presuntivo: {diagnostico}")
        c.drawString(100, 635, f"Certeza Calculada: {certeza}%")

        c.line(100, 620, 500, 620)

        # --- Módulo de Explicación (Justificación de Hechos) ---
        c.setFont("Helvetica-Bold", 12)
        c.drawString(100, 600, "JUSTIFICACIÓN TÉCNICA (Evidencia Clínica):")
        
        evidencias = self._obtener_evidencia_explicacion(id_evaluacion)
        y_pos = 580
        c.setFont("Helvetica", 10)
        
        if evidencias:
            for ev in evidencias:
                # Mostrar descripción del hecho y su valor fuzzy (porcentaje de presencia)
                texto = f"• {ev['descripcion_hecho']} (Detectado al {int(ev['valor_fuzzy']*100)}%)"
                c.drawString(115, y_pos, texto)
                y_pos -= 15
        else:
            c.drawString(115, y_pos, "No se registró evidencia detallada para esta sesión.")
            y_pos -= 15

        # --- Recomendaciones ---
        c.setFont("Helvetica-Bold", 12)
        c.drawString(100, y_pos - 20, "PLAN DE ACCIÓN SUGERIDO:")
        c.setFont("Helvetica", 10)
        c.drawString(110, y_pos - 40, "1. Realizar las actividades diarias asignadas en la plataforma.")
        c.drawString(110, y_pos - 55, "2. El reporte debe ser validado por un fonoaudiólogo colegiado.")
        c.drawString(110, y_pos - 70, "3. Próxima reevaluación automática en 30 días.")

        c.save()
        return nombre_archivo

    def _obtener_evidencia_explicacion(self, id_evaluacion):
        """Consulta los hechos que el motor usó para llegar al diagnóstico."""
        db = self.db_manager.conectar()
        if not db: return []
        
        try:
            cursor = db.cursor(dictionary=True)
            sql = """
                SELECT h.descripcion_hecho, e.valor_fuzzy 
                FROM evidencia_sesion e
                JOIN catalogo_hechos h ON e.id_hecho = h.id_hecho
                WHERE e.id_evaluacion = %s AND e.valor_fuzzy > 0.4
            """
            cursor.execute(sql, (id_evaluacion,))
            return cursor.fetchall()
        finally:
            db.close()