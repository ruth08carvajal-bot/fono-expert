from datetime import date

class Nino:
    def __init__(self, id_nino, nombre, fecha_nacimiento, genero):
        self.id_nino = id_nino
        self.nombre = nombre
        self.fecha_nacimiento = fecha_nacimiento  # Viene como objeto date de la BD
        self.genero = genero

    def calcular_edad(self):
        hoy = date.today()
        # Restamos años y ajustamos si no ha cumplido años aún este año
        edad = hoy.year - self.fecha_nacimiento.year - (
            (hoy.month, hoy.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )
        return edad