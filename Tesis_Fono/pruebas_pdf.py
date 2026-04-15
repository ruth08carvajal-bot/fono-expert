from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generar_pdf_reporte(datos_nino, diagnostico, historial_certezas):
    file_name = f"Reporte_Evolucion_{datos_nino['id']}.pdf"
    c = canvas.Canvas(file_name, pagesize=letter)
    
    # Encabezado
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 750, "REPORTE CLÍNICO DE EVOLUCIÓN - FONONET")
    
    c.setFont("Helvetica", 12)
    c.drawString(100, 720, f"Nombre del Niño: {datos_nino['nombre']}")
    c.drawString(100, 705, f"Diagnóstico del Sistema: {diagnostico}")
    
    # Tabla de Progreso
    c.drawString(100, 670, "Historial de Evaluación (Factor de Certeza):")
    y = 650
    for h in historial_certezas:
        c.drawString(120, y, f"- Fecha: {h['fecha']} | Certeza: {h['valor']}%")
        y -= 20
        
    # Nota de derivación
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(100, y-40, "AVISO: El sistema experto no detecta una mejora según los parámetros AAD.")
    c.drawString(100, y-55, "Se recomienda presentar este reporte a un fonoaudiólogo colegiado.")
    
    c.save()
    return file_name