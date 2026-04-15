import mysql.connector
from mysql.connector import Error

class Database:
    def __init__(self):
        self.host = "localhost"
        self.user = "root"
        self.password = "0"
        self.database = "fono_expert_db"
        self.conexion = None

    def conectar(self):
        try:
            self.conexion = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            if self.conexion.is_connected():
                return self.conexion
        except Error as e:
            print(f"Error al conectar a MariaDB: {e}")
            return None

    def cerrar(self):
        if self.conexion and self.conexion.is_connected():
            self.conexion.close()
    
    # --- NUEVOS MÉTODOS PARA EL SISTEMA EXPERTO ---

    def obtener_reglas_por_diagnostico(self, id_diagnostico):
        """Trae los hechos y pesos necesarios para una meta (Diagnóstico)"""
        db = self.conectar()
        if db:
            cursor = db.cursor(dictionary=True) # dictionary=True facilita el manejo en Python
            query = """
                SELECT id_hecho, peso_certeza 
                FROM reglas_diagnostico 
                WHERE id_diagnostico = %s
            """
            cursor.execute(query, (id_diagnostico,))
            reglas = cursor.fetchall()
            self.cerrar()
            return reglas
        return []

    def obtener_diagnosticos_por_sospecha(self, lista_ids_hechos):
        db = self.conectar()
        if db:
            try:
                cursor = db.cursor(dictionary=True)
                # El format_strings crea los %s necesarios para los IDs
                format_strings = ','.join(['%s'] * len(lista_ids_hechos))
                query = f"SELECT DISTINCT id_diagnostico FROM reglas_diagnostico WHERE id_hecho IN ({format_strings})"
                
                cursor.execute(query, tuple(lista_ids_hechos))
                resultados = cursor.fetchall()
                return [r['id_diagnostico'] for r in resultados]
            except Exception as e:
                print(f"Error SQL: {e}")
                return []
            finally:
                self.cerrar()
        return []

    def probar_conexion(self):
        db = self.conectar()
        if db and db.is_connected():
            cursor = db.cursor()
            cursor.execute("SELECT VERSION();")
            version = cursor.fetchone()
            print("✅ Conexión exitosa!")
            print(f"🖥️ Versión de MariaDB: {version[0]}")
            self.cerrar()
            return True
        else:
            print("❌ Error: No se pudo establecer la conexión.")
            return False
        
    
    def obtener_reglas_motor(self):
        """Trae todas las reglas: Hecho -> Diagnóstico -> Peso"""
        db = self.conectar()
        if db:
            try:
                cursor = db.cursor(dictionary=True)
                # Coincide con tu tabla: reglas_diagnostico
                cursor.execute("SELECT id_hecho, id_diagnostico, peso_certeza FROM reglas_diagnostico")
                reglas = cursor.fetchall()
                return reglas
            except Error as e:
                print(f"Error al obtener reglas: {e}")
                return []
            finally:
                self.cerrar()
        return []
    
    # 1. Función para obtener el nombre real del diagnóstico (para el PDF)
    def obtener_nombre_diagnostico(self, id_diagnostico):
        """Busca el nombre legible para el reporte PDF"""
        db = self.conectar()
        if db:
            try:
                cursor = db.cursor(dictionary=True)
                # Coincide con tu tabla: catalogo_diagnosticos
                cursor.execute("SELECT nombre_diagnostico FROM catalogo_diagnosticos WHERE id_diagnostico = %s", (id_diagnostico,))
                res = cursor.fetchone()
                # Retornamos solo el string para facilitar el flujo en app.py
                return res['nombre_diagnostico'] if res else "Diagnóstico Desconocido"
            except Error as e:
                print(f"Error al obtener nombre: {e}")
                return "Error de Diagnóstico"
            finally:
                self.cerrar()
        return "Sin Conexión"
# 2. Función para guardar el resultado final en la tabla de reportes
    def guardar_resultado_final(self, id_evaluacion, certeza, recomendaciones):
        db = self.conectar()
        if db:
            try:
                cursor = db.cursor()
                # Ajustado a los nombres de tu script SQL: 
                # porcentaje_certeza y recomendacion_especifica
                sql = """
                    INSERT INTO resultados_reporte (id_evaluacion, porcentaje_certeza, recomendacion_especifica) 
                    VALUES (%s, %s, %s)
                """
                cursor.execute(sql, (id_evaluacion, certeza, recomendaciones))
                db.commit()
            except Error as e:
                print(f"Error al guardar reporte: {e}")
                db.rollback()
            finally:
                self.cerrar()

    # 3. Función para guardar evidencia (evidencia_sesion)
    def guardar_evidencia_juego(self, id_evaluacion, id_hecho, valor_fuzzy):
        db = self.conectar()
        if db:
            try:
                cursor = db.cursor()
                sql = "INSERT INTO evidencia_sesion (id_evaluacion, id_hecho, valor_fuzzy) VALUES (%s, %s, %s)"
                cursor.execute(sql, (id_evaluacion, id_hecho, valor_fuzzy))
                db.commit()
            except Error as e:
                print(f"Error al guardar evidencia: {e}")
                db.rollback()
            finally:
                self.cerrar()