import os
import librosa
import numpy as np

class ProcesadorAudio:
    def __init__(self):
        self.patrones_mfcc = self._cargar_patrones_estaticos()

    def _cargar_patrones_estaticos(self):
        """Crea prototipos MFCC sintéticos para hechos de diagnóstico."""
        base = np.linspace(-50, 50, 13)
        return {
            1: base * 0.95,
            2: base * 0.8,
            3: base * 1.1,
            4: base * 0.6,
            5: base * 1.25,
            6: base * 0.7,
            7: base * 1.0,
        }

    def extraer_mfcc(self, ruta_archivo):
        """Extrae los coeficientes MFCC de un archivo de audio."""
        if not ruta_archivo or not os.path.exists(ruta_archivo):
            return None

        try:
            y, sr = librosa.load(ruta_archivo, sr=None, mono=True)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            return np.mean(mfccs.T, axis=0)
        except Exception as e:
            print(f"Error procesando audio MFCC: {e}")
            return None

    def calcular_similitud_fuzzy(self, mfcc_usuario, id_hecho):
        """Calcula un valor fuzzy entre 0.0 y 1.0 según similitud al patrón."""
        try:
            if mfcc_usuario is None:
                return 0.0

            id_hecho = int(id_hecho)
            patron = self.patrones_mfcc.get(id_hecho)
            if patron is None:
                patron = np.mean(list(self.patrones_mfcc.values()), axis=0)

            distancia = np.linalg.norm(mfcc_usuario - patron)
            similitud = max(0.0, 1.0 - distancia / 180.0)
            return round(float(similitud), 3)
        except Exception as e:
            print(f"Error en similitud fuzzy: {e}")
            return 0.0