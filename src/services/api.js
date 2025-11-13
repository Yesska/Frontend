import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Cliente para subir archivos (usa URL raíz porque el route expone /api/upload)
const uploadClient = axios.create({
    baseURL: 'http://localhost:4000',
    headers: { 'Content-Type': 'multipart/form-data' },
});

// ===== SERVICIOS PARA JUEGOS =====
export const gamesService = {
    // Obtener todos los juegos. Acepta un objeto `options` que se convertirá en query params.
    // Ej: { search, genero, plataforma, completado, wishlist, sort, order, page, limit }
    getAllGames: (options = {}) => apiClient.get('/juegos', { params: options }),

    // Obtener un juego específico
    getGameById: (id) => apiClient.get(`/juegos/${id}`),

    // Crear un nuevo juego
    createGame: (gameData) => apiClient.post('/juegos', gameData),

    // Actualizar un juego
    updateGame: (id, gameData) => apiClient.put(`/juegos/${id}`, gameData),

    // Eliminar un juego
    deleteGame: (id) => apiClient.delete(`/juegos/${id}`),
    // Wishlist
    addToWishlist: (id) => apiClient.post(`/juegos/${id}/wishlist`),
    removeFromWishlist: (id) => apiClient.delete(`/juegos/${id}/wishlist`),
    getWishlist: () => apiClient.get('/juegos/wishlist'),
};

// ===== SERVICIOS PARA RESEÑAS =====
export const reviewsService = {
    // Obtener todas las reseñas
    getAllReviews: () => apiClient.get('/reseñas'),

    // Obtener reseñas de un juego específico
    getReviewsByGame: (gameId) => apiClient.get(`/reseñas/juego/${gameId}`),

    // Crear una nueva reseña
    createReview: (reviewData) => apiClient.post('/reseñas', reviewData),

    // Actualizar una reseña
    updateReview: (id, reviewData) => apiClient.put(`/reseñas/${id}`, reviewData),

    // Eliminar una reseña
    deleteReview: (id) => apiClient.delete(`/reseñas/${id}`),
};

// ===== SUBIDA DE IMÁGENES =====
export const uploadService = {
    uploadCover: (file) => {
        const form = new FormData();
        form.append('file', file);
        return uploadClient.post('/api/upload', form);
    },
};
