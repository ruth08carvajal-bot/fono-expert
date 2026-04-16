import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # <--- 1. NUEVO IMPORT
from datetime import datetime
from conexion_db import Database
from motor_inferencia import MotorInferencia
from progreso import GestorProgreso
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from estimulos import obtener_palabras_por_sospechas
from procesador_audio import ProcesadorAudio


app = Flask(__name__)
CORS(app)  # <--- 2. CONFIGURACIÓN BÁSICA (Permite todas las rutas de React)

db_manager = Database()
motor = MotorInferencia()
gestor_p = GestorProgreso()
audio_proc = ProcesadorAudio() # Instanciamos el procesador
# --- MÓDULO DE LOGIN (CORREGIDO PARA TU BASE DE DATOS) ---
@app.route('/login', methods=['POST'])
def login():
    datos = request.get_json()
    email = datos.get('email')
    password = datos.get('password')

    if not email or not password:
        return jsonify({"status": "error", "message": "Faltan datos"}), 400

    db = db_manager.conectar()
    if db:
        try:
            cursor = db.cursor(dictionary=True)
            
            # 1. Buscamos el usuario y sus datos de padre mediante un JOIN
            # Cambiamos u.nombre_usuario por p.nombre_completo de la tabla datos_padres
            sql = """
                SELECT u.id_usuario, u.password_hash, r.nombre_rol, p.nombre_completo 
                FROM usuarios u
                JOIN roles r ON u.id_rol = r.id_rol
                LEFT JOIN datos_padres p ON u.id_usuario = p.id_usuario
                WHERE u.correo = %s
            """
            cursor.execute(sql, (email,))
            usuario = cursor.fetchone()

            # 2. Verificación de la contraseña (hashing)
            if usuario and check_password_hash(usuario['password_hash'], password):
                
                # 3. Buscamos el ID del niño vinculado a este padre
                # Esto es vital para que SeleccionSospechaActivity funcione en Android
                sql_nino = """
                    SELECT id_nino FROM perfiles_ninos 
                    WHERE id_padre = (SELECT id_padre FROM datos_padres WHERE id_usuario = %s)
                    LIMIT 1
                """
                cursor.execute(sql_nino, (usuario['id_usuario'],))
                nino = cursor.fetchone()
                
                # Si no hay niño registrado aún, mandamos 0 o null
                id_nino = nino['id_nino'] if nino else 0

                return jsonify({
                    "status": "success",
                    "message": f"Bienvenido {usuario['nombre_completo'] or 'Usuario'}",
                    "id_usuario": usuario['id_usuario'],  # ✅ CORREGIDO
                    "id_nino": id_nino,
                    "rol": usuario['nombre_rol']
                }), 200
            else:
                return jsonify({"status": "error", "message": "Correo o contraseña incorrectos"}), 401
        
        except Exception as e:
            print(f"ERROR en login: {e}")
            return jsonify({"status": "error", "message": "Error interno del servidor"}), 500
        finally:
           # db_manager.cerrar()
           if db: db.close()
    
    return jsonify({"status": "error", "message": "No se pudo conectar con la base de datos"}), 500
# --- NUEVO: OBTENER LISTA DE NIÑOS PARA EL DASHBOARD DEL PADRE ---
@app.route('/obtener_ninos_padre/<int:id_usuario>', methods=['GET'])
def obtener_ninos_padre(id_usuario):
    """
    Trae todos los niños asociados a un padre y verifica si ya tienen anamnesis.
    """
    db = db_manager.conectar()
    if not db:
        return jsonify({"status": "error", "message": "Error de conexión"}), 500
    
    try:
        cursor = db.cursor(dictionary=True)
        # Calculamos la edad y verificamos si existe registro en la tabla anamnesis
        sql = """
            SELECT n.id_nino, n.nombre_nino, n.genero, 
                   TIMESTAMPDIFF(YEAR, n.fecha_nacimiento, CURDATE()) AS edad,
                   (SELECT COUNT(*) FROM anamnesis a WHERE a.id_nino = n.id_nino) as tiene_anamnesis
            FROM perfiles_ninos n
            JOIN datos_padres p ON n.id_padre = p.id_padre
            WHERE p.id_usuario = %s
        """
        cursor.execute(sql, (id_usuario,))
        ninos = cursor.fetchall()
        
        # Convertimos el contador a Booleano para Android
        for n in ninos:
            n['tiene_anamnesis'] = n['tiene_anamnesis'] > 0
            # Agregamos el texto del botón basado en si tiene anamnesis
            n['accion_boton'] = "EVALUAR" if n['tiene_anamnesis'] else "INICIAR CON EL ANAMNESIS"
            
        return jsonify(ninos), 200
    except Exception as e:
        print(f"Error en obtener_ninos: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        #db_manager.cerrar()
        if db: db.close()

# --- MÓDULO 1: REGISTRO INTEGRAL (Versión Final Blindada) ---
@app.route('/evaluar', methods=['POST'])
def registrar_todo():
    """
    Registra al usuario, los datos del padre, el perfil del niño 
    y crea la evaluación inicial en un solo flujo.
    """
    data = request.json
    correo = data.get('correo')
    
    # 1. Seguridad: Hasheamos la contraseña antes de cualquier operación
    password_plano = data.get('password', '123456')
    password_encriptada = generate_password_hash(password_plano)
    
    nombre_padre = data.get('nombre_padre', 'Padre de Familia')
    celular = data.get('celular', '00000000')
    ciudad = data.get('ciudad', 'La Paz')
    nombre_nino = data.get('nombre_nino')
    fecha_nac_str = data.get('fecha_nacimiento')
    genero = data.get('genero', 'Masculino')

    db = db_manager.conectar()
    if not db:
        return jsonify({"status": "error", "message": "No hay conexión a BD"}), 500

    try:
        cursor = db.cursor(dictionary=True)
        
        # 2. Verificar si el usuario ya existe
        cursor.execute("SELECT id_usuario FROM usuarios WHERE correo = %s", (correo,))
        usuario_existente = cursor.fetchone()

        if usuario_existente:
            id_usuario = usuario_existente['id_usuario']
            cursor.execute("SELECT id_padre FROM datos_padres WHERE id_usuario = %s", (id_usuario,))
            id_padre = cursor.fetchone()['id_padre']
        else:
            # CORRECCIÓN: Solo 3 campos (correo, password_hash, id_rol)
            sql_user = "INSERT INTO usuarios (correo, password_hash, id_rol) VALUES (%s, %s, 2)"
            cursor.execute(sql_user, (correo, password_encriptada))
            id_usuario = cursor.lastrowid
            
            # Los datos personales van AQUÍ
            sql_padre = "INSERT INTO datos_padres (id_usuario, nombre_completo, numero_celular, ciudad) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql_padre, (id_usuario, nombre_padre, celular, ciudad))
            id_padre = cursor.lastrowid

        # 5. Registrar el perfil del niño
        sql_nino = "INSERT INTO perfiles_ninos (id_padre, nombre_nino, fecha_nacimiento, genero) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql_nino, (id_padre, nombre_nino, fecha_nac_str, genero))
        id_nino = cursor.lastrowid

        # 6. Calcular edad para la evaluación
        fecha_nac = datetime.strptime(fecha_nac_str, '%Y-%m-%d')
        hoy = datetime.now()
        edad_anos = hoy.year - fecha_nac.year - ((hoy.month, hoy.day) < (fecha_nac.month, fecha_nac.day))

        # 7. Crear el registro de la evaluación (Módulo de Monitoreo)
        sql_eval = "INSERT INTO evaluaciones (id_nino, fecha_evaluacion, edad_al_momento_evaluacion) VALUES (%s, NOW(), %s)"
        cursor.execute(sql_eval, (id_nino, edad_anos))
        id_evaluacion = cursor.lastrowid
        
        db.commit()
        return jsonify({
            "status": "success", 
            "id_usuario": id_usuario,
            "id_nino": id_nino,
            "id_evaluacion": id_evaluacion,
            "edad_años": edad_anos
        }), 200

    except Exception as e:
        if db: db.rollback()
        print(f"ERROR en registro: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
       # if db: cursor.close()
        if cursor: cursor.close();
        if db: db.close()
        
# --- MÓDULO DE ANAMNESIS ---
#@app.route('/guardar_anamnesis', methods=['POST'])
#def guardar_anamnesis():
    # ... (Tu código de anamnesis está correcto) ...
 #   data = request.json
  #  id_nino = data.get('id_nino')
   # db = db_manager.conectar()
    #if not db: return jsonify({"status": "error", "message": "No hay conexión a BD"}), 500
    #cursor = None # Inicializamos para evitar error en finally
    #try:
     ##  query = """
       #        id_nino, herencia_familiar, otitis_frecuente, complicacion_parto, bilinguismo,
        #        uso_chupon_biberon, dificultad_masticar, respira_boca, muda_dientes, 
         #       evitacion_social, vibracion_lengua, error_escritura, error_lectura, conciencia_error
          #  ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        #"""
        #valores = (
         #   id_nino, 
          # data.get('complicacion_parto', 0), data.get('bilinguismo', 0),
           # data.get('uso_chupon_biberon', 0), data.get('dificultad_masticar', 0), 
            #data.get('respira_boca', 0), data.get('muda_dientes', 0), 
            #data.get('evitacion_social', 0), data.get('vibracion_lengua', 0),
            #data.get('error_escritura', 0), data.get('error_lectura', 0), 
            #data.get('conciencia_error', 0)
        #)
        #cursor.execute(query, valores)
        #db.commit()
        #return jsonify({"status": "success", "message": "Anamnesis guardada correctamente"}), 200
    #except Exception as e:
        # se añade
     #   if db: db.rollback()
        #return jsonify({"status": "error", "message": str(e)}), 500
    #finally:
        #if cursor: cursor.close()
        #if db: db.close() # <--- ¡Añade esto!
@app.route('/guardar_anamnesis', methods=['POST'])
def guardar_anamnesis():
    data = request.json
    id_nino = data.get('id_nino')
    hechos = data.get('hechos') # La lista que viene de Android

    print(f"DEBUG: Recibido id_nino={id_nino}, hechos={hechos}")

    db = db_manager.conectar()
    if not db: 
        print("ERROR: No se pudo conectar a la BD")
        return jsonify({"status": "error", "message": "No hay conexión a BD"}), 500
    
    cursor = None
    try:
        cursor = db.cursor(dictionary=True)
        
        # Mapeo de id_hecho a campos de la tabla anamnesis
        mapeo_anamnesis = {
            113: 'vibracion_lengua',
            114: None,  # No tiene campo específico en anamnesis
            115: 'error_lectura',
            116: 'herencia_familiar',
            117: 'otitis_frecuente',
            118: 'complicacion_parto',
            119: 'bilinguismo',
            120: 'uso_chupon_biberon',
            121: 'dificultad_masticar',
            122: 'respira_boca',
            123: 'muda_dientes',
            124: 'evitacion_social',
            125: 'error_escritura',
            126: 'conciencia_error'
        }

        # Inicializar todos los campos de anamnesis en 0
        campos_anamnesis = {
            'herencia_familiar': 0,
            'otitis_frecuente': 0,
            'complicacion_parto': 0,
            'bilinguismo': 0,
            'uso_chupon_biberon': 0,
            'dificultad_masticar': 0,
            'respira_boca': 0,
            'muda_dientes': 0,
            'evitacion_social': 0,
            'vibracion_lengua': 0,
            'error_escritura': 0,
            'error_lectura': 0,
            'conciencia_error': 0
        }

        # Procesar los hechos recibidos
        for h in hechos:
            id_hecho = h['id_hecho']
            valor_fuzzy = float(h['valor_fuzzy'])

            # Convertir valor fuzzy a booleano (1 si > 0.5, 0 si no)
            valor_booleano = 1 if valor_fuzzy > 0.5 else 0

            campo = mapeo_anamnesis.get(id_hecho)
            if campo:
                campos_anamnesis[campo] = valor_booleano
                print(f"DEBUG: Campo {campo} = {valor_booleano} (id_hecho={id_hecho}, valor_fuzzy={valor_fuzzy})")

        # Verificar si ya existe una anamnesis para este niño
        cursor.execute("SELECT id_anamnesis FROM anamnesis WHERE id_nino = %s", (id_nino,))
        anamnesis_existente = cursor.fetchone()

        if anamnesis_existente:
            # Actualizar anamnesis existente
            set_clause = ", ".join([f"{campo} = %s" for campo in campos_anamnesis.keys()])
            valores = list(campos_anamnesis.values()) + [id_nino]
            query = f"UPDATE anamnesis SET {set_clause} WHERE id_nino = %s"
            cursor.execute(query, valores)
            print(f"DEBUG: Anamnesis actualizada para id_nino={id_nino}")
        else:
            # Insertar nueva anamnesis
            columnas = ", ".join(campos_anamnesis.keys())
            placeholders = ", ".join(["%s"] * len(campos_anamnesis))
            valores = list(campos_anamnesis.values())
            query = f"INSERT INTO anamnesis (id_nino, {columnas}) VALUES (%s, {placeholders})"
            cursor.execute(query, [id_nino] + valores)
            print(f"DEBUG: Nueva anamnesis insertada para id_nino={id_nino}")

        db.commit()

        # Verificar que se guardó
        cursor.execute("SELECT * FROM anamnesis WHERE id_nino = %s", (id_nino,))
        anamnesis_guardada = cursor.fetchone()
        print(f"DEBUG: Anamnesis guardada: {anamnesis_guardada}")

        return jsonify({
            "status": "success", 
            "message": "Anamnesis guardada correctamente en la tabla anamnesis",
            "id_nino": id_nino,
            "anamnesis": anamnesis_guardada
        }), 200
    except Exception as e:
        print(f"ERROR en guardar_anamnesis: {e}")
        import traceback
        traceback.print_exc()
        if db: db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if db: db.close()

# --- MÓDULO EXPERTO: ENCADENAMIENTO HACIA ATRÁS (ACTUALIZADO) ---
@app.route('/iniciar_evaluacion', methods=['POST'])
def iniciar_evaluacion():
    data = request.json
    id_nino = data.get('id_nino')
    sospechas_raw = data.get('sospechas', [])
    sospechas_ids = [int(s) for s in sospechas_raw]
    
    if not id_nino or not sospechas_ids:
        return jsonify({"status": "error", "message": "Faltan datos"}), 400

    db = db_manager.conectar()
    cursor = db.cursor(dictionary=True)
    try:
        # 1. Crear sesión de evaluación
        cursor.execute("INSERT INTO evaluaciones (id_nino, fecha_evaluacion) VALUES (%s, NOW())", (id_nino,))
        id_evaluacion = cursor.lastrowid
        db.commit()

        # 2. MOTOR DE INFERENCIA: Cargar memoria de trabajo
        motor.memoria_trabajo = {} 
        # IMPORTANTE: Cargamos los hechos de la anamnesis que se acaban de guardar
        motor.cargar_datos_anamnesis(id_evaluacion)
        
        # También agregamos las sospechas visuales que marcó el usuario en la App
        for id_h in sospechas_ids:
            if id_h != 0:
                motor.agregar_hecho(id_h, 1.0)
        
        # 3. ESTRATEGIA DE CONTROL: Selección de Metas
        if 0 in sospechas_ids:
            # Lógica por edad para "No estoy seguro"
            cursor.execute("SELECT TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) as edad FROM perfiles_ninos WHERE id_nino = %s", (id_nino,))
            res_nino = cursor.fetchone()
            edad = res_nino['edad'] if res_nino else 5
            
            if edad <= 5:
                metas_posibles = [3] # Trastorno Fonológico
            else:
                metas_posibles = [3, 4]
        else:
            # USAMOS EL MOTOR: Priorizar metas basadas en la Anamnesis + Sospechas
            metas_posibles = motor.priorizar_metas_por_anamnesis()
        
        # --- BUSCAR PRÓXIMA SUBMETA (Siguiente Juego) ---
        if not metas_posibles:
            proxima_meta = 3 # Meta por defecto
            # Buscamos el primer hecho pendiente para esa meta
            resultado_busqueda = motor.buscar_siguiente_pregunta(proxima_meta, id_evaluacion)
        else:
            proxima_meta = metas_posibles[0] # La meta con más "coincidencias"
            resultado_busqueda = motor.buscar_siguiente_pregunta(proxima_meta, id_evaluacion)

        # Extraemos el ID del hecho (juego)
        proxima_submeta = resultado_busqueda['id_hecho'] if resultado_busqueda['status'] == 'pregunta_pendiente' else None

        return jsonify({
            "status": "success",
            "id_evaluacion": id_evaluacion, 
            "proxima_submeta_hecho": proxima_submeta,
            "meta_diagnostica_actual": proxima_meta
        }), 200

    except Exception as e:
        if db: db.rollback()
        print(f"Error en iniciar_evaluacion: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if db: db.close()

# --- MÓDULO 2: MENÚ DINÁMICO (Versión Blindada) ---
@app.route('/obtener_nivel_menu/<int:id_nino>', methods=['GET'])
def obtener_nivel_menu(id_nino):
    print(f"DEBUG: Consultando nivel para niño ID: {id_nino}") 
    db = db_manager.conectar()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT fecha_nacimiento FROM perfiles_ninos WHERE id_nino = %s"
        cursor.execute(sql, (id_nino,))
        resultado = cursor.fetchone()
        
        if resultado and resultado['fecha_nacimiento']:
            fecha_nac = resultado['fecha_nacimiento']
            
            # Si es un objeto 'date' de MySQL, Python lo maneja bien. 
            # Si es string, lo convertimos:
            if isinstance(fecha_nac, str):
                fecha_nac = datetime.strptime(fecha_nac, '%Y-%m-%d').date()
            
            hoy = datetime.now().date()
            # Cálculo de meses exacto
            meses = (hoy.year - fecha_nac.year) * 12 + (hoy.month - fecha_nac.month)
            if hoy.day < fecha_nac.day: meses -= 1
            
            # Tu lógica de niveles
            if meses < 60: nivel = 1
            elif 60 <= meses <= 96: nivel = 2
            else: nivel = 3
            
            print(f"DEBUG: Niño {id_nino} tiene {meses} meses. Nivel asignado: {nivel}")
            return jsonify({"nivel": nivel, "meses": meses}), 200
            
        return jsonify({"nivel": 1, "error": "No se halló fecha"}), 200
    except Exception as e:
        print(f"ERROR en obtener_nivel_menu: {e}")
        return jsonify({"nivel": 1, "error": str(e)}), 200
    finally:
        #cursor.close()
        #db.close()
        if cursor: cursor.close();
        if db: db.close()
# --- NUEVA RUTA: REGISTRO DE EVIDENCIA DE JUEGOS ---
@app.route('/registrar_evidencia', methods=['POST'])
def registrar_evidencia():
    data = request.json
    id_evaluacion = data.get('id_evaluacion')
    id_hecho = data.get('id_hecho') # Debe ser un entero
    valor_fuzzy = data.get('valor_fuzzy')

    db = db_manager.conectar()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO evidencia_sesion (id_evaluacion, id_hecho, valor_fuzzy) VALUES (%s, %s, %s)",
                       (id_evaluacion, id_hecho, valor_fuzzy))
        db.commit()

        # Cargamos el ID en la memoria del motor
        motor.agregar_hecho(id_hecho, valor_fuzzy)

        return jsonify({"status": "success", "message": "Evidencia guardada"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if db: db.close()

#@app.route('/analizar_audio', methods=['POST'])
#def analizar_audio():
#    if 'audio' not in request.files:
#        return jsonify({"status": "error", "message": "No se recibió audio"}), 400
    
#    id_evaluacion = request.form.get('id_evaluacion')
#    id_hecho = request.form.get('id_hecho')
#    audio_file = request.files['audio']
    
#    path_temp = f"temp_{id_evaluacion}.wav"
#    audio_file.save(path_temp)
    
#    try:
        # 1. Usamos el nuevo módulo
#        mfccs = audio_proc.extraer_mfcc(path_temp)
#        if mfccs is None:
#            return jsonify({"status": "error", "message": "Audio corrupto"}), 400
            
        # 2. Obtenemos el valor de la lógica fuzzy
#        valor_fuzzy = audio_proc.calcular_similitud_fuzzy(mfccs, id_hecho)
        
        # 3. Guardamos evidencia y buscamos qué sigue
#        motor.agregar_hecho_a_bd(id_evaluacion, id_hecho, valor_fuzzy)
#        siguiente = motor.buscar_siguiente_pregunta(3, id_evaluacion)

#        return jsonify({
#            "status": "success",
#            "valor_fuzzy": valor_fuzzy,
#            "siguiente_juego": siguiente['id_hecho'] if siguiente['status'] == 'pregunta_pendiente' else None,
#            "finalizado": siguiente['status'] == 'meta_alcanzada'
#        }), 200

#    finally:
#        if os.path.exists(path_temp): os.remove(path_temp)
@app.route('/analizar_audio', methods=['POST'])
def analizar_audio():
    if 'audio' not in request.files:
        return jsonify({"status": "error", "message": "No se recibió audio"}), 400

    id_evaluacion = request.form.get('id_evaluacion')
    id_hecho = request.form.get('id_hecho')
    audio_file = request.files['audio']

    if not id_evaluacion or not id_hecho:
        return jsonify({"status": "error", "message": "Faltan datos de evaluación o hecho"}), 400

    UPLOAD_FOLDER = 'uploads'
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    filename = secure_filename(audio_file.filename)
    extension = os.path.splitext(filename)[1] or '.wav'
    path_temp = os.path.join(UPLOAD_FOLDER, f"eval_{id_evaluacion}_hecho_{id_hecho}{extension}")
    audio_file.save(path_temp)

    try:
        mfccs = audio_proc.extraer_mfcc(path_temp)
        if mfccs is None:
            return jsonify({"status": "error", "message": "Audio corrupto o formato no soportado"}), 400

        valor_fuzzy = audio_proc.calcular_similitud_fuzzy(mfccs, id_hecho)
        motor.agregar_hecho_a_bd(id_evaluacion, id_hecho, valor_fuzzy)

        siguiente = motor.buscar_siguiente_pregunta(3, id_evaluacion)
        finalizado = siguiente.get('status') == 'meta_alcanzada'

        return jsonify({
            "status": "success",
            "valor_fuzzy": valor_fuzzy,
            "siguiente_juego": siguiente.get('id_hecho'),
            "finalizado": finalizado
        }), 200

    except Exception as e:
        print(f"Error procesando audio MFCC: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        if os.path.exists(path_temp):
            os.remove(path_temp)

# --- MÓDULO 3: DIAGNÓSTICO FINAL (UNIFICADO) ---
@app.route('/finalizar_evaluacion', methods=['POST'])
def finalizar_evaluacion():
    data = request.json
    id_evaluacion = data.get('id_evaluacion')
    nombre_nino = data.get('nombre_nino') 

    # 1. El motor ahora hace el trabajo pesado solo con el ID
    resultado = motor.calcular_diagnostico_final(id_evaluacion)
    
    if resultado:
        # 2. El motor también se encarga de persistir el resultado en la BD
        motor.guardar_reporte_final(id_evaluacion, resultado)

        # 3. Generamos el PDF usando los datos calculados
        archivo_pdf = gestor_p.crear_pdf_especialista(
            nombre_nino,
            resultado['diagnostico'],
            resultado['certeza'],
            id_evaluacion
        )
        
        return jsonify({
            "status": "success",
            "diagnostico": resultado['diagnostico'],
            "certeza": f"{resultado['certeza']}%",
            "pdf_generado": archivo_pdf,
            #"mensaje": "Inferencia completada exitosamente."
        }), 200
    
    return jsonify({"status": "error", "message": "Evidencia insuficiente"}), 400

# --- MÓDULO 4: GESTOR DE PROGRESO ---

@app.route('/verificar_progreso/<int:id_nino>', methods=['GET'])
def verificar_progreso(id_nino):
    # Cambiamos 'verificar_estancamiento' por 'verificar_reevaluacion' que sí existe en tu progreso.py
    requiere, mensaje = gestor_p.verificar_reevaluacion(id_nino)
    return jsonify({"requiere_reevaluacion": requiere, "mensaje": mensaje})

@app.route('/obtener_actividades/<int:id_nino>', methods=['GET'])
def obtener_actividades(id_nino):
    # El algoritmo mira el último diagnóstico y el progreso
    # y decide si envía: Juego de Soplo, Juego de Fonemas o Repetición.
    actividades = gestor_p.generar_ruta_personalizada(id_nino)
    return jsonify(actividades)

@app.route('/obtener_estimulaciones', methods=['POST'])
def obtener_estimulaciones():
    datos = request.get_json() or {}
    sospechas = datos.get('sospechas', [])
    palabras = obtener_palabras_por_sospechas(sospechas)
    return jsonify({
        "status": "success",
        "sospechas": sospechas,
        "estimulaciones": palabras,
        "cantidad": len(palabras)
    }), 200

@app.route('/verificar_estado_ciclo/<int:id_nino>', methods=['GET'])
def verificar_estado_ciclo(id_nino):
    """
    Endpoint que consulta si el niño debe reevaluarse (cada 30 días)
    y obtiene su ruta de actividades actual.
    """
    # 1. Verificar si ya pasaron los 30 días (Módulo 7)
    requiere_reeval, mensaje_reeval = gestor_p.verificar_reevaluacion(id_nino)
    
    # 2. Obtener la ruta de actividades adaptada (Módulo 5)
    ruta_adaptativa = gestor_p.generar_ruta_personalizada(id_nino)
    
    return jsonify({
        "id_nino": id_nino,
        "alerta_reevaluacion": requiere_reeval,
        "mensaje": mensaje_reeval,
        "configuracion_actividades": ruta_adaptativa
    }), 200
# --- REGISTRO DE HIJO ADICIONAL ---
@app.route('/registrar_nuevo_hijo', methods=['POST'])
def registrar_nuevo_hijo():
    data = request.json
    id_usuario = data.get('id_usuario')
    nombre_nino = data.get('nombre_nino')
    fecha_nac_str = data.get('fecha_nacimiento')
    genero = data.get('genero')

    db = db_manager.conectar()
    try:
        cursor = db.cursor(dictionary=True)
        
        # 1. Primero encontramos el id_padre asociado a este id_usuario
        cursor.execute("SELECT id_padre FROM datos_padres WHERE id_usuario = %s", (id_usuario,))
        resultado = cursor.fetchone()
        
        if not resultado:
            return jsonify({"status": "error", "message": "No se encontró el perfil del padre"}), 404
        
        id_padre = resultado['id_padre']

        # 2. Insertamos al nuevo niño
        sql_nino = "INSERT INTO perfiles_ninos (id_padre, nombre_nino, fecha_nacimiento, genero) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql_nino, (id_padre, nombre_nino, fecha_nac_str, genero))
        id_nino = cursor.lastrowid

        db.commit()
        return jsonify({
            "status": "success", 
            "message": "Niño registrado correctamente",
            "id_nino": id_nino
        }), 201

    except Exception as e:
        if db: db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
       # db_manager.cerrar()
        if db: db.close()

# --- RUTA PARA PRUEBAS CON REACT ---
@app.route('/inferencia', methods=['POST'])
def prueba_inferencia():
    datos = request.json
    print(f"Datos recibidos de React: {datos}")
    
    # Por ahora devolvemos una respuesta de prueba
    return jsonify({
        "status": "success",
        "resultado": "Conexión Exitosa",
        "certeza": 100
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)