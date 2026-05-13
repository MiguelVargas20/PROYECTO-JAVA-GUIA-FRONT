const API_URL = 'http://localhost:8080/api'; 

export const booksService = {
    getNewArrivals: async () => {
        try {
            const token = localStorage.getItem('token'); 

            const response = await fetch(`${API_URL}/libros`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            // Si el servidor responde 403, es probable que el token no sea válido o falte
            if (response.status === 403) {
                console.warn("Acceso denegado: Verifica el token JWT o permisos en Spring Security.");
                return []; 
            }

            if (!response.ok) throw new Error('Error al conectar con el servidor');
            
            return await response.json();
        } catch (error) {
            console.error("Error en getNewArrivals:", error);
            return [];
        }
    }
};