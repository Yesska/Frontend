import React, { useState, useEffect } from 'react';
import '../styles/FormularioReseña.css';

const FormularioReseña = ({ reseñaInicial, juegoId, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        juegoId: juegoId || '',
        puntuacion: 5,
        textoReseña: '',
        horasJugadas: 0,
        dificultad: 'Normal',
        recomendaria: true,
    });

    useEffect(() => {
        if (reseñaInicial) {
            setFormData(reseñaInicial);
        } else {
            setFormData({
                juegoId: juegoId || '',
                puntuacion: 5,
                textoReseña: '',
                horasJugadas: 0,
                dificultad: 'Normal',
                recomendaria: true,
            });
        }
    }, [reseñaInicial, juegoId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            juegoId: juegoId || '',
            puntuacion: 5,
            textoReseña: '',
            horasJugadas: 0,
            dificultad: 'Normal',
            recomendaria: true,
        });
    };

    return (
        <form className="formulario-reseña" onSubmit={handleSubmit}>
            <h2>{reseñaInicial ? 'Editar Reseña' : 'Nueva Reseña'}</h2>

            <div className="form-group">
                <label htmlFor="puntuacion">Puntuación (1-5 estrellas) *</label>
                <div className="estrellas">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`estrella ${formData.puntuacion >= star ? 'activa' : ''}`}
                            onClick={() => setFormData({ ...formData, puntuacion: star })}
                        >
                            ⭐
                        </span>
                    ))}
                </div>
                <span className="valor-puntuacion">{formData.puntuacion}/5</span>
            </div>

            <div className="form-group">
                <label htmlFor="textoReseña">Tu Reseña *</label>
                <textarea
                    id="textoReseña"
                    name="textoReseña"
                    value={formData.textoReseña}
                    onChange={handleChange}
                    required
                    placeholder="Comparte tu experiencia con este juego..."
                    rows="6"
                ></textarea>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="horasJugadas">Horas Jugadas *</label>
                    <input
                        type="number"
                        id="horasJugadas"
                        name="horasJugadas"
                        value={formData.horasJugadas}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dificultad">Dificultad *</label>
                    <select
                        id="dificultad"
                        name="dificultad"
                        value={formData.dificultad}
                        onChange={handleChange}
                        required
                    >
                        <option value="Fácil">Fácil</option>
                        <option value="Normal">Normal</option>
                        <option value="Difícil">Difícil</option>
                    </select>
                </div>
            </div>

            <div className="form-group checkbox">
                <input
                    type="checkbox"
                    id="recomendaria"
                    name="recomendaria"
                    checked={formData.recomendaria}
                    onChange={handleChange}
                />
                <label htmlFor="recomendaria">
                    👍 Recomendaría este juego
                </label>
            </div>

            <div className="form-acciones">
                <button type="submit" className="btn-guardar">
                    {reseñaInicial ? '💾 Actualizar Reseña' : '➕ Publicar Reseña'}
                </button>
                <button type="button" className="btn-cancelar" onClick={onCancel}>
                    ❌ Cancelar
                </button>
            </div>
        </form>
    );
};

export default FormularioReseña;
