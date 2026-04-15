import axios from 'axios';

// Aquí pones la URL donde corre tu servidor Python (usualmente el puerto 5000 o 8000)
const API_URL = 'http://localhost:5000'; 

export const enviarAFonoaudiologia = async (datos) => {
    try {
        const response = await axios.post(`${API_URL}/inferencia`, datos);
        return response.data;
    } catch (error) {
        console.error("Error en la conexión con Python:", error);
        throw error;
    }
};