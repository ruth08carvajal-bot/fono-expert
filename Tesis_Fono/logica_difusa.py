# logica_difusa.py

def calcular_fc_combinado(fc_anterior, fc_nuevo):
    """
    Fórmula de combinación de Mycin para Sistemas Expertos.
    Permite acumular certeza a medida que encontramos más evidencia.
    """
    return fc_anterior + fc_nuevo * (1 - fc_anterior)

def aplicar_valor_fuzzy(valor_respuesta, peso_regla):
    """
    Multiplica la observación (0.0 a 1.0) por la fuerza de la regla.
    Ejemplo: Si el niño omitió fonemas el 80% de las veces (0.8) 
    y la regla de Apraxia tiene peso 0.9, la certeza parcial es 0.72.
    """
    return float(valor_respuesta) * float(peso_regla)