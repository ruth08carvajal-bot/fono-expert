# Tesis_Fono

Backend de un sistema experto fonoaudiológico con Flask, lógica difusa y generación de PDF.

## Estructura principal
- `app.py`: API Flask con rutas para login, registro, anamnesis, evaluación, audio y diagnóstico.
- `conexion_db.py`: conexión a MariaDB usando credenciales por variables de entorno.
- `motor_inferencia.py`: motor experto con memoria de hechos y métodos de diagnosis.
- `procesador_audio.py`: extracción MFCC y cálculo de similitud fuzzy para audio.
- `progreso.py`: generación de rutas de ejercicios, control de reevaluación y creación de informes en PDF.
- `estimulos.py`: banco de estímulos y estímulos sugeridos.
- `modelos/nino.py`: modelo de datos para el paciente.

## Dependencias
Instala el entorno con:

```bash
pip install -r requirements.txt
```

## Variables de entorno recomendadas
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Si no se definen, se usan valores por defecto: `localhost`, `root`, `0`, `fono_expert_db`.

## Mejoras aplicadas
- conexión a BD con contexto reusable
- priorización de diagnósticos con pesos fuzzy
- cálculo de similitud de audio más realista
- corrección de generación de PDF final
- rutas con validaciones de datos y manejo de errores
