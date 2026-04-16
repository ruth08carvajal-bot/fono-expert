import os
import mysql.connector
from mysql.connector import Error

class Database:
    def __init__(self):
        self.host = os.getenv("DB_HOST", "localhost")
        self.user = os.getenv("DB_USER", "root")
        self.password = os.getenv("DB_PASSWORD", "0")
        self.database = os.getenv("DB_NAME", "fono_expert_db")
        self.conexion = None

    def conectar(self):
        if self.conexion and self.conexion.is_connected():
            return self.conexion

        try:
            self.conexion = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                charset="utf8mb4",
                use_unicode=True
            )
            if self.conexion.is_connected():
                return self.conexion
        except Error as e:
            print(f"Error al conectar a MariaDB: {e}")
            self.conexion = None
        return None

    def cerrar(self):
        if self.conexion and self.conexion.is_connected():
            self.conexion.close()
            self.conexion = None

    def __enter__(self):
        return self.conectar()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cerrar()

    # --- NUEVOS MÉTODOS PARA EL SISTEMA EXPERTO ---

    def obtener_reglas_por_diagnostico(self, id_diagnostico):
        """Trae los hechos y pesos necesarios para una meta (Diagnóstico)"""
        db = self.conectar()
        if db:
            cursor = db.cursor(dictionary=True)
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
        if db and lista_ids_hechos:
            try:
                cursor = db.cursor(dictionary=True)
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
                cursor.execute("SELECT id_hecho, id_diagnostico, peso_certeza FROM reglas_diagnostico")
                reglas = cursor.fetchall()
                return reglas
            except Error as e:
                print(f"Error al obtener reglas: {e}")
                return []
            finally:
                self.cerrar()
        return []

    def obtener_nombre_diagnostico(self, id_diagnostico):
        """Busca el nombre legible para el reporte PDF"""
        db = self.conectar()
        if db:
            try:
                cursor = db.cursor(dictionary=True)
                cursor.execute("SELECT nombre_diagnostico FROM catalogo_diagnosticos WHERE id_diagnostico = %s", (id_diagnostico,))
                res = cursor.fetchone()
                return res['nombre_diagnostico'] if res else "Diagnóstico Desconocido"
            except Error as e:
                print(f"Error al obtener nombre: {e}")
                return "Error de Diagnóstico"
            finally:
                self.cerrar()
        return "Sin Conexión"

    def guardar_resultado_final(self, id_evaluacion, certeza, recomendaciones):
        db = self.conectar()
        if db:
            try:
                cursor = db.cursor()
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