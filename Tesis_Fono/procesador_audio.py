import os
import librosa
import numpy as np

class ProcesadorAudio:
    def __init__(self):
        # Aquí podrías cargar modelos de referencia en el futuro
        pass

    def extraer_mfcc(self, ruta_archivo):
        """Extrae los coeficientes MFCC de un archivo de audio."""
        try:
            y, sr = librosa.load(ruta_archivo, sr=None)
            # 13 es el estándar para reconocimiento de voz
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            # Retornamos el promedio para tener un vector fijo de características
            return np.mean(mfccs.T, axis=0)
        except Exception as e:
            print(f"Error procesando audio MFCC: {e}")
            return None

    def comparar_con_patron(self, mfcc_usuario, id_hecho):
        """
        Lógica de Tesis: Compara el audio del niño con el patrón esperado.
        Retorna un valor entre 0.0 y 1.0. se calcula la similitud fuzzy
        """
        # Simulación: En una fase avanzada, aquí cargarías el MFCC 
        # promedio de niños sin patologías para ese fonema (id_hecho).
        # Por ahora, retornamos un valor que simule el éxito:
        return 0.82