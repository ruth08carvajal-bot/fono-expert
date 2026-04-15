from conexion_db import Database
from modelos.nino import Nino
from datetime import date

class MotorFonoAudiologia:
    def __init__(self):
        self.db_manager = Database()
        self.conn = self.db_manager.conectar()

    def ejecutar_diagnostico_completo(self, id_nino, lista_evidencia):
        """
        Orquestador principal: Identifica, Registra, Evalúa y Guarda.
        lista_evidencia debe ser: [(id_hecho, valor_fuzzy), ...]
        """
        try:
            # 1. Identificación y Cálculo de Edad
            paciente, edad = self._obtener_perfil(id_nino)
            if not paciente:
                print(f"❌ Error: El niño con ID {id_nino} no existe.")
                return

            # 2. Apertura de Sesión en Evaluaciones
            id_sesion = self._crear_sesion(id_nino, edad)
            if not id_sesion: return

            # 3. Registro de Evidencia (Hechos H)
            self._guardar_evidencia(id_sesion, lista_evidencia)

            # 4. Inferencia (Cruce con Reglas R)
            resultados = self._procesar_inferencia(id_sesion)
            
            # 5. Cierre y Reporte del Ganador
            if resultados:
                ganador = resultados[0]
                self._guardar_reporte_final(id_sesion, ganador)
                print(f"\n✅ PROCESO EXITOSO: {paciente.nombre} finalizó su evaluación.")
            else:
                print("⚠️ No se generó diagnóstico: No hubo coincidencia de reglas.")

        finally:
            self.db_manager.cerrar()

    # --- MÉTODOS PRIVADOS (LA LÓGICA INTERNA) ---

    def _obtener_perfil(self, id_nino):
        cursor = self.conn.cursor(dictionary=True)
        query = "SELECT id_nino, nombre_nino, fecha_nacimiento, genero FROM perfiles_ninos WHERE id_nino = %s"
        cursor.execute(query, (id_nino,))
        row = cursor.fetchone()
        if row:
            n = Nino(row['id_nino'], row['nombre_nino'], row['fecha_nacimiento'], row['genero'])
            return n, n.calcular_edad()
        return None, None

    def _crear_sesion(self, id_nino, edad):
        cursor = self.conn.cursor()
        query = "INSERT INTO evaluaciones (id_nino, edad_al_momento_evaluacion) VALUES (%s, %s)"
        cursor.execute(query, (id_nino, edad))
        self.conn.commit()
        return cursor.lastrowid

    def _guardar_evidencia(self, id_sesion, evidencia):
        cursor = self.conn.cursor()
        query = "INSERT INTO evidencia_sesion (id_evaluacion, id_hecho, valor_fuzzy) VALUES (%s, %s, %s)"
        datos = [(id_sesion, h[0], h[1]) for h in evidencia]
        cursor.executemany(query, datos)
        self.conn.commit()

    def _procesar_inferencia(self, id_sesion):
        cursor = self.conn.cursor(dictionary=True)
        query = """
            SELECT cd.id_diagnostico, cd.nombre_diagnostico, 
                   SUM(ev.valor_fuzzy * rd.peso_certeza) AS puntaje
            FROM evidencia_sesion ev
            JOIN reglas_diagnostico rd ON ev.id_hecho = rd.id_hecho
            JOIN catalogo_diagnosticos cd ON rd.id_diagnostico = cd.id_diagnostico
            WHERE ev.id_evaluacion = %s
            GROUP BY cd.id_diagnostico ORDER BY puntaje DESC
        """
        cursor.execute(query, (id_sesion,))
        return cursor.fetchall()

    def _guardar_reporte_final(self, id_sesion, ganador):
        cursor = self.conn.cursor()
        # Guardar en reporte
        msg = f"Resultado sugerido: {ganador['nombre_diagnostico']}. Requiere validación clínica."
        query_rep = "INSERT INTO resultados_reporte (id_evaluacion, porcentaje_certeza, recomendacion_especifica) VALUES (%s, %s, %s)"
        cursor.execute(query_rep, (id_sesion, ganador['puntaje'], msg))
        # Actualizar evaluación
        query_eval = "UPDATE evaluaciones SET id_diagnostico_final = %s WHERE id_evaluacion = %s"
        cursor.execute(query_eval, (ganador['id_diagnostico'], id_sesion))
        self.conn.commit()

# --- PUNTO DE ENTRADA LIMPIO ---
if __name__ == "__main__":
    app = MotorFonoAudiologia()
    
    # Simulación de datos que vendrían de la App en Kotlin
    ID_NIÑO_APP = 5
    EVIDENCIA_JUEGOS = [(23, 1.0), (25, 0.8), (69, 0.9)]
    
    app.ejecutar_diagnostico_completo(ID_NIÑO_APP, EVIDENCIA_JUEGOS)