import numpy as np
import skfuzzy as fuzz
from datetime import datetime
from conexion_db import Database

class MotorInferencia:
    def __init__(self):
        self.db_manager = Database()
        self.memoria_trabajo = {}  # {id_hecho: valor_fuzzy}
        
        # LÓGICA DIFUSA (Parámetros para la precisión del audio en tu tesis)
        self.x_precision = np.arange(0, 1.1, 0.1)
        self.f_baja = fuzz.trapmf(self.x_precision, [0, 0, 0.2, 0.4])
        self.f_media = fuzz.trimf(self.x_precision, [0.3, 0.5, 0.7])
        self.f_alta = fuzz.trapmf(self.x_precision, [0.6, 0.8, 1, 1])

    def agregar_hecho(self, id_hecho, valor):
        """Carga evidencia en la memoria volátil del motor"""
        try:
            self.memoria_trabajo[int(id_hecho)] = float(valor)
        except (ValueError, TypeError):
            self.memoria_trabajo[id_hecho] = float(valor)

    # --- HITOS DE DESARROLLO Y EDAD ---
    def obtener_edad_meses(self, id_nino):
        db = self.db_manager.conectar()
        cursor = db.cursor()
        try:
            cursor.execute("SELECT fecha_nacimiento FROM perfiles_ninos WHERE id_nino = %s", (id_nino,))
            fila = cursor.fetchone()
            if not fila: return 0
            fecha_nac = fila[0]
            hoy = datetime.now().date()
            meses = (hoy.year - fecha_nac.year) * 12 + (hoy.month - fecha_nac.month)
            if hoy.day < fecha_nac.day: meses -= 1
            return meses
        finally:
            cursor.close()
            db.close()

    def validar_sospecha_por_edad(self, id_nino, id_diagnostico_sospecha):
        """Valida restricciones biológicas según la edad del niño"""
        edad = self.obtener_edad_meses(id_nino)
        # Regla: Fonema /r/ (ID 5) requiere 60 meses
        if id_diagnostico_sospecha == 5 and edad < 60:
            return False, f"Edad insuficiente ({edad} meses) para evaluar fonema /r/."
        # Regla: Fonema /s/ (ID 6) requiere 36 meses
        if id_diagnostico_sospecha == 6 and edad < 36:
            return False, f"Edad insuficiente ({edad} meses) para evaluar fonema /s/."
        return True, "Edad adecuada para evaluación."

    # --- CARGA DE CONTEXTO (ANAMNESIS) ---
    #def cargar_datos_anamnesis(self, id_nino):
     #   """Extrae antecedentes de la tabla anamnesis y los vuelve hechos"""
      #  db = self.db_manager.conectar()
       # cursor = db.cursor(dictionary=True)
        #try:
         #   cursor.execute("SELECT * FROM anamnesis WHERE id_nino = %s", (id_nino,))
          #  res = cursor.fetchone()
           # if res:
                # Mapeo de columnas a IDs de hechos (Ajustar IDs según tu catálogo)
            #    if res['respira_boca']: self.agregar_hecho(27, 1.0) # Ejemplo ID 27: Alteración estructural
             #   if res['uso_chupon_biberon']: self.agregar_hecho(26, 0.8) # Ejemplo ID 26: Praxias
        #finally:
         #   cursor.close()
          #  db.close()
    def cargar_datos_anamnesis(self, id_evaluacion):
        """Carga en la memoria de trabajo todos los hechos de la sesión actual"""
        db = self.db_manager.conectar()
        cursor = db.cursor(dictionary=True)
        try:
            # Traemos todo lo que se haya registrado (Anamnesis + Juegos)
            cursor.execute("SELECT id_hecho, valor_fuzzy FROM evidencia_sesion WHERE id_evaluacion = %s", (id_evaluacion,))
            evidencias = cursor.fetchall()
            for ev in evidencias:
                self.agregar_hecho(ev['id_hecho'], ev['valor_fuzzy'])
        finally:
            cursor.close()
            db.close()

    def priorizar_metas_por_anamnesis(self):
        """
        Analiza la memoria de trabajo (hechos de anamnesis y sospechas) 
        y devuelve una lista de diagnósticos ordenados por relevancia.
        """
        if not self.memoria_trabajo:
            return []

        db = self.db_manager.conectar()
        if not db:
            return []

        cursor = db.cursor(dictionary=True)
        try:
            ids_hechos = list(self.memoria_trabajo.keys())
            if not ids_hechos:
                return []

            format_strings = ','.join(['%s'] * len(ids_hechos))
            sql = f"""
                SELECT id_diagnostico, id_hecho, peso_certeza
                FROM reglas_diagnostico
                WHERE id_hecho IN ({format_strings})
            """
            cursor.execute(sql, tuple(ids_hechos))
            reglas = cursor.fetchall()

            puntuaciones = {}
            for regla in reglas:
                valor = float(self.memoria_trabajo.get(regla['id_hecho'], 0.0))
                score = valor * float(regla['peso_certeza'])
                if regla['id_diagnostico'] not in puntuaciones:
                    puntuaciones[regla['id_diagnostico']] = score
                else:
                    puntuaciones[regla['id_diagnostico']] += score

            diagnósticos_ordenados = sorted(
                puntuaciones.items(),
                key=lambda item: item[1],
                reverse=True
            )
            return [diag[0] for diag in diagnósticos_ordenados]
        finally:
            db.close()

    # --- ESTRATEGIA DE CONTROL: BACKWARD CHAINING ---
    def buscar_siguiente_pregunta(self, id_diagnostico, id_evaluacion):
        """Busca el siguiente hecho faltante para validar una meta (diagnóstico)"""
        db = self.db_manager.conectar()
        cursor = db.cursor(dictionary=True)
        sql = """
            SELECT r.id_hecho, h.descripcion_hecho, h.codigo_h, h.instrumento_origen
            FROM reglas_diagnostico r
            JOIN catalogo_hechos h ON r.id_hecho = h.id_hecho
            WHERE r.id_diagnostico = %s 
            AND r.id_hecho NOT IN (
                SELECT id_hecho FROM evidencia_sesion WHERE id_evaluacion = %s
            )
            ORDER BY r.peso_certeza DESC LIMIT 1
        """
        try:
            cursor.execute(sql, (id_diagnostico, id_evaluacion))
            siguiente = cursor.fetchone()
            if siguiente:
                return {
                    "status": "pregunta_pendiente",
                    "id_hecho": siguiente['id_hecho'],
                    "codigo": siguiente['codigo_h'],
                    "pregunta": siguiente['descripcion_hecho'],
                    "instrumento": siguiente['instrumento_origen']
                }
            return {"status": "fin_evaluacion", "mensaje": "No hay más hechos pendientes para este diagnóstico."}
        finally:
            cursor.close()
            db.close()

    # --- RAZONAMIENTO Y COMBINACIÓN (MYCIN) ---
    def calcular_diagnostico_final(self, id_evaluacion):
        """Cruza evidencia real con reglas y aplica la fórmula de combinación de MYCIN"""
        db = self.db_manager.conectar()
        cursor = db.cursor(dictionary=True)
        sql = """
            SELECT r.id_diagnostico, d.nombre_diagnostico, e.valor_fuzzy, r.peso_certeza
            FROM evidencia_sesion e
            JOIN reglas_diagnostico r ON e.id_hecho = r.id_hecho
            JOIN catalogo_diagnosticos d ON r.id_diagnostico = d.id_diagnostico
            WHERE e.id_evaluacion = %s
        """
        try:
            cursor.execute(sql, (id_evaluacion,))
            filas = cursor.fetchall()
            if not filas: return None

            puntuaciones = {} 
            for f in filas:
                id_d = f['id_diagnostico']
                # Factor de Certeza Local (Efecto del síntoma en el diagnóstico)
                certeza_actual = float(f['valor_fuzzy']) * float(f['peso_certeza'])
                
                if id_d not in puntuaciones:
                    puntuaciones[id_d] = {"nombre": f['nombre_diagnostico'], "certeza": certeza_actual}
                else:
                    # Algoritmo de combinación: CF_comb = CF1 + CF2 * (1 - CF1)
                    c1 = puntuaciones[id_d]['certeza']
                    puntuaciones[id_d]['certeza'] = c1 + certeza_actual * (1 - c1)

            # Seleccionamos el diagnóstico con mayor Factor de Certeza
            id_ganador = max(puntuaciones, key=lambda k: puntuaciones[k]['certeza'])
            res = puntuaciones[id_ganador]
            return {
                "id_diagnostico": id_ganador,
                "diagnostico": res['nombre'],
                "certeza": round(res['certeza'] * 100, 2)
            }
        finally:
            cursor.close()
            db.close()

    # --- SALIDA Y PERSISTENCIA ---
    def guardar_reporte_final(self, id_evaluacion, resultado):
        """Guarda el resultado calculado en MariaDB para el reporte final"""
        if not resultado: return False
        db = self.db_manager.conectar()
        cursor = db.cursor()
        try:
            # 1. Actualizar diagnóstico en tabla evaluaciones
            cursor.execute("UPDATE evaluaciones SET id_diagnostico_final = %s WHERE id_evaluacion = %s", 
                           (resultado['id_diagnostico'], id_evaluacion))
            
            # 2. Insertar en tabla resultados_reporte
            recomendacion = f"Se sugiere intervención fonoaudiológica para {resultado['diagnostico']}."
            sql_reporte = """
                INSERT INTO resultados_reporte (id_evaluacion, porcentaje_certeza, recomendacion_especifica)
                VALUES (%s, %s, %s)
            """
            cursor.execute(sql_reporte, (id_evaluacion, resultado['certeza'], recomendacion))
            db.commit()
            return True
        except Exception as e:
            print(f"Error al persistir reporte: {e}")
            db.rollback()
            return False
        finally:
            cursor.close()
            db.close()

    def agregar_hecho_a_bd(self, id_evaluacion, id_hecho, valor_fuzzy):
        """Guarda la evidencia recolectada de un juego en la base de datos."""
        db = self.db_manager.conectar()
        cursor = db.cursor()
        try:
            sql = "INSERT INTO evidencia_sesion (id_evaluacion, id_hecho, valor_fuzzy) VALUES (%s, %s, %s)"
            cursor.execute(sql, (id_evaluacion, id_hecho, valor_fuzzy))
            db.commit()
            # Actualizamos la memoria de trabajo actual
            self.agregar_hecho(id_hecho, valor_fuzzy)
        finally:
            if db: db.close()