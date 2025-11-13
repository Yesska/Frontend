import React from 'react';
import '../styles/ListaReseñas.css';

const ListaReseñas = ({ reseñas, onEdit, onDelete, gameTitle }) => {
    if (!reseñas || reseñas.length === 0) {
        return (
            <div className="lista-reseñas-vacia">
                <p>No hay reseñas aún. ¡Sé el primero en reseñar!</p>
            </div>
        );
    }

    const calcularPromedio = () => {
        if (reseñas.length === 0) return 0;
        const suma = reseñas.reduce((acc, r) => acc + r.puntuacion, 0);
        return (suma / reseñas.length).toFixed(1);
    };

    const renderEstrellas = (puntuacion) => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <span key={i} className={i < puntuacion ? 'estrella-llena' : 'estrella-vacia'}>
                    ⭐
                </span>
            ));
    };

    return (
        <div className="lista-reseñas">
            <h2>Reseñas {gameTitle && `de "${gameTitle}"`}</h2>

            {reseñas.length > 0 && (
                <div className="estadisticas-reseñas">
                    <div className="promedio">
                        <span className="promedio-valor">{calcularPromedio()}</span>
                        <span className="promedio-label">/5</span>
                    </div>
                    <div className="total-reseñas">
                        <span>{reseñas.length}</span>
                        <span>reseña{reseñas.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}

            <div className="reseñas-contenedor">
                {reseñas.map((reseña) => (
                    <div key={reseña._id} className="reseña-item">
                        <div className="reseña-header">
                            <div className="reseña-estrellas">
                                {renderEstrellas(reseña.puntuacion)}
                            </div>
                            <span className="dificultad">{reseña.dificultad}</span>
                            {reseña.recomendaria && <span className="recomendado">👍 Recomendado</span>}
                        </div>

                        <div className="reseña-contenido">
                            <p>{reseña.textoReseña}</p>
                        </div>

                        <div className="reseña-footer">
                            <div className="reseña-stats">
                                <span>⏱️ {reseña.horasJugadas}h jugadas</span>
                                <span>📅 {new Date(reseña.fechaCreacion).toLocaleDateString('es-ES')}</span>
                            </div>
                            <div className="reseña-acciones">
                                <button className="btn-editar-reseña" onClick={() => onEdit(reseña)}>
                                    ✏️ Editar
                                </button>
                                <button className="btn-eliminar-reseña" onClick={() => onDelete(reseña._id)}>
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaReseñas;
