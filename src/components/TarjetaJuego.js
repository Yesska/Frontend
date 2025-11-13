import React from 'react';
import '../styles/TarjetaJuego.css';

const TarjetaJuego = ({ juego, onEdit, onDelete, onViewReviews, onToggleWishlist }) => {
    return (
        <div className="tarjeta-juego">
            <div className="tarjeta-imagen">
                {juego.imagenPortada ? (
                    <img src={juego.imagenPortada} alt={juego.titulo} />
                ) : (
                    <div className="imagen-placeholder">Sin imagen</div>
                )}
                {juego.completado && <span className="badge-completado">✓ Completado</span>}
            </div>

            <div className="tarjeta-contenido">
                <h3>{juego.titulo}</h3>
                <p className="desarrollador">{juego.desarrollador}</p>

                <div className="tarjeta-info">
                    <span className="genero">{juego.genero}</span>
                    <span className="plataforma">{juego.plataforma}</span>
                    <span className="año">{juego.añoLanzamiento}</span>
                </div>

                <p className="descripcion">{juego.descripcion}</p>

                <div className="tarjeta-acciones">
                    <button className="btn-wishlist" onClick={() => onToggleWishlist(juego)}>
                        {juego.wishlist ? '💖 Deseado' : '🤍 Añadir a Wishlist'}
                    </button>
                    <button className="btn-reviews" onClick={() => onViewReviews(juego._id)}>
                        📝 Reseñas
                    </button>
                    <button className="btn-editar" onClick={() => onEdit(juego)}>
                        ✏️ Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => onDelete(juego._id)}>
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TarjetaJuego;
