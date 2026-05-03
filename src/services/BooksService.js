// src/services/booksService.js

// Ajusta esta URL a la de tu servidor Java (normalmente puerto 8080)
const API_URL = 'http://localhost:8080/api'; 

export const booksService = {
    // Obtener lista de libros para el Home
    getAllBooks: async () => {
        try {
            const response = await fetch(`${API_URL}/books`);
            if (!response.ok) throw new Error('Error al conectar con el servidor');
            return await response.json();
        } catch (error) {
            console.error("Error en getAllBooks:", error);
            return []; // Retorna array vacío para que el Home no rompa
        }
    }
};