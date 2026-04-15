from conexion_db import Database

def ejecutar_test():
    print("--- Iniciando prueba de conexión a fono_expert_db ---")
    mi_bd = Database()
    
    # Intentamos la conexión
    if mi_bd.probar_conexion():
        print("--- Prueba finalizada con éxito ---")
    else:
        print("--- La prueba falló. Revisa tus credenciales o si MariaDB está activo ---")

if __name__ == "__main__":
    ejecutar_test()