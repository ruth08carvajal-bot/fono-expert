# estimulos.py

# Diccionario que asocia cada sospecha con las palabras que el niño debe decir
# Para tu tesis, esto representa la "Base de Conocimientos" del Sistema Experto
BANCO_ESTIMULOS = {
    "VOCABULARIO": [
        {"palabra": "Pelota", "imagen": "pelota.png", "tipo": "sustantivo"},
        {"palabra": "Comer", "imagen": "comer.png", "tipo": "verbo"}
    ],
    "ROTACISMO": [
        {"palabra": "Perro", "imagen": "perro.png", "fonema": "rr"},
        {"palabra": "Rana", "imagen": "rana.png", "fonema": "r_inicial"}
    ],
    "SESEO": [
        {"palabra": "Sapo", "imagen": "sapo.png", "fonema": "s"},
        {"palabra": "Mesa", "imagen": "mesa.png", "fonema": "s_intervocalica"}
    ],
    "TARTAMUDEO": [
        {"palabra": "El gato corre rápido", "imagen": "gato_corre.png", "tipo": "frase"},
        {"palabra": "Mi mamá me ama", "imagen": "mama_ama.png", "tipo": "frase"}
    ],
    "LECTURA": [
        {"palabra": "Globo", "imagen": "globo.png", "tipo": "sinfón"},
        {"palabra": "Fruta", "imagen": "fruta.png", "tipo": "sinfón"}
    ],
    "GENERAL": [
        {"palabra": "Auto", "imagen": "auto.png", "tipo": "basico"},
        {"palabra": "Casa", "imagen": "casa.png", "tipo": "basico"}
    ]
}

def obtener_palabras_por_sospechas(lista_sospechas):
    """
    Filtra y combina las palabras según lo que el padre marcó.
    """
    resultado = []
    for sospecha in lista_sospechas:
        if sospecha in BANCO_ESTIMULOS:
            resultado.extend(BANCO_ESTIMULOS[sospecha])
    
    # Eliminamos duplicados si los hubiera y limitamos para no cansar al niño
    return resultado[:10] # Máximo 10 palabras por sesión