import React, { useState, useEffect } from 'react';
import { uploadService } from '../services/api';
import '../styles/FormularioJuego.css';

const FormularioJuego = ({ juegoInicial, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        genero: '',
        plataforma: '',
        añoLanzamiento: new Date().getFullYear(),
        desarrollador: '',
        imagenPortada: '',
        descripcion: '',
        completado: false,
    });
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (juegoInicial) {
            setFormData(juegoInicial);
        }
    }, [juegoInicial]);

    useEffect(() => {
        // Ensure image URL stays in form when editing
    }, [formData.imagenPortada]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            titulo: '',
            genero: '',
            plataforma: '',
            añoLanzamiento: new Date().getFullYear(),
            desarrollador: '',
            imagenPortada: '',
            descripcion: '',
            completado: false,
        });
    };

    const handleFile = async (file) => {
        try {
            setUploading(true);
            const res = await uploadService.uploadCover(file);
            if (res && res.data && res.data.url) {
                setFormData({ ...formData, imagenPortada: res.data.url });
            }
        } catch (err) {
            console.error('Error al subir imagen:', err);
            alert('Error al subir imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    return (
        <form className="formulario-juego" onSubmit={handleSubmit}>
            <h2>{juegoInicial ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>

            <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    placeholder="Ej: The Legend of Zelda"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="genero">Género *</label>
                    <input
                        type="text"
                        id="genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        required
                        placeholder="Ej: RPG, Acción"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="plataforma">Plataforma *</label>
                    <select
                        id="plataforma"
                        name="plataforma"
                        value={formData.plataforma}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una plataforma</option>
                        <option value="PC">PC</option>
                        <option value="PlayStation">PlayStation</option>
                        <option value="Xbox">Xbox</option>
                        <option value="Nintendo">Nintendo</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Other">Otra</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="desarrollador">Desarrollador *</label>
                    <input
                        type="text"
                        id="desarrollador"
                        name="desarrollador"
                        value={formData.desarrollador}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Nintendo"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="añoLanzamiento">Año de Lanzamiento *</label>
                    <input
                        type="number"
                        id="añoLanzamiento"
                        name="añoLanzamiento"
                        value={formData.añoLanzamiento}
                        onChange={handleChange}
                        required
                        min="1970"
                        max={new Date().getFullYear()}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Portada (arrastra o haz click para subir)</label>
                <div
                    className={`dropzone ${dragOver ? 'drag-over' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('fileInput').click()}
                    role="button"
                >
                    {uploading ? (
                        <div>Cargando imagen...</div>
                    ) : formData.imagenPortada ? (
                        <img src={formData.imagenPortada} alt="Portada" className="preview-portada" />
                    ) : (
                        <div className="drop-instructions">Arrastra la imagen aquí o haz click para seleccionar</div>
                    )}
                </div>
                <input id="fileInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <small className="nota">También puedes pegar una URL en el campo debajo</small>
                <input
                    type="url"
                    id="imagenPortada"
                    name="imagenPortada"
                    value={formData.imagenPortada}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>

            <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre este juego..."
                    rows="4"
                ></textarea>
            </div>

            <div className="form-group checkbox">
                <input
                    type="checkbox"
                    id="completado"
                    name="completado"
                    checked={formData.completado}
                    onChange={handleChange}
                />
                <label htmlFor="completado">Marcar como completado</label>
            </div>

            <div className="form-acciones">
                <button type="submit" className="btn-guardar">
                    {juegoInicial ? '💾 Actualizar' : '➕ Agregar Juego'}
                </button>
                <button type="button" className="btn-cancelar" onClick={onCancel}>
                    ❌ Cancelar
                </button>
            </div>
        </form>
    );
};

export default FormularioJuego;
