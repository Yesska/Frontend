import React from 'react';
import TarjetaJuego from './TarjetaJuego';
import '../styles/BibliotecaJuegos.css';
import { exportElementToPdf } from '../utils/exportPdf';

const BibliotecaJuegos = ({
    juegos,
    onEdit,
    onDelete,
    onViewReviews,
    onAgregarNuevo,
    onToggleWishlist,
    filters,
    onFiltersChange,
    pageInfo,
    onPageChange,
}) => {
    const generosUnicos = [...new Set(juegos.map((j) => j.genero))];
    const plataformasUnicas = [...new Set(juegos.map((j) => j.plataforma))];

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        let val = value;
        if (name === 'completados') {
            val = value === '' ? null : value === 'true';
        }
        if (name === 'wishlist') {
            val = value === '' ? null : value === 'true';
        }
        onFiltersChange({ [name]: val });
    };

    return (
        <div className="biblioteca-juegos">
            <div className="biblioteca-actions">
                <div className="orden-export">
                    <label htmlFor="sortSelect">Ordenar:</label>
                    <select
                        id="sortSelect"
                        name="sort"
                        value={filters?.sort || 'fecha'}
                        onChange={(e) => onFiltersChange({ sort: e.target.value })}
                        className="filtro-select"
                    >
                        <option value="fecha">Fecha (más reciente)</option>
                        <option value="titulo">Título (A-Z)</option>
                        <option value="puntuacion">Puntuación (más alto)</option>
                        <option value="año">Año (más reciente)</option>
                    </select>

                    <button
                        className="btn-export"
                        onClick={async () => {
                            const el = document.querySelector('.grilla-juegos') || document.querySelector('.biblioteca-juegos');
                            try {
                                await exportElementToPdf(el, 'mi_biblioteca.pdf');
                            } catch (err) {
                                console.error('Error exportando a PDF', err);
                                alert('Error al exportar a PDF');
                            }
                        }}
                    >
                        📄 Exportar PDF
                    </button>
                </div>
            </div>
            <div className="biblioteca-header">
                <div className="biblioteca-title">
                    <h1>📚 Mi Biblioteca de Juegos</h1>
                    <span className="total-juegos">{juegos.length} juego{juegos.length !== 1 ? 's' : ''}</span>
                </div>
                <button className="btn-agregar" onClick={onAgregarNuevo}>
                    ➕ Agregar Juego
                </button>
            </div>

            <div className="filtros">
                <input
                    type="text"
                    name="busqueda"
                    placeholder="🔍 Buscar juego o desarrollador..."
                    value={filters?.busqueda || ''}
                    onChange={handleFiltroChange}
                    className="filtro-busqueda"
                />

                <select
                    name="genero"
                    value={filters?.genero || ''}
                    onChange={handleFiltroChange}
                    className="filtro-select"
                >
                    <option value="">Todos los géneros</option>
                    {generosUnicos.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>

                <select
                    name="plataforma"
                    value={filters?.plataforma || ''}
                    onChange={handleFiltroChange}
                    className="filtro-select"
                >
                    <option value="">Todas las plataformas</option>
                    {plataformasUnicas.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <select
                    name="completados"
                    value={filters?.completados === null || filters?.completados === undefined ? '' : filters.completados}
                    onChange={handleFiltroChange}
                    className="filtro-select"
                >
                    <option value="">Todos los estados</option>
                    <option value="true">Completados</option>
                    <option value="false">Por completar</option>
                </select>

                <select
                    name="wishlist"
                    value={filters?.wishlist === null || filters?.wishlist === undefined ? '' : filters.wishlist}
                    onChange={handleFiltroChange}
                    className="filtro-select"
                >
                    <option value="">Todos</option>
                    <option value="true">Wishlist</option>
                </select>
            </div>

            {juegos.length === 0 ? (
                <div className="sin-resultados">
                    <p>No se encontraron juegos con los filtros aplicados 😔</p>
                </div>
            ) : (
                <div>
                    <div className="grilla-juegos">
                        {juegos.map((juego) => (
                            <TarjetaJuego
                                key={juego._id}
                                juego={juego}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewReviews={onViewReviews}
                                onToggleWishlist={onToggleWishlist}
                            />
                        ))}
                    </div>

                    {/* Paginación simple */}
                    {pageInfo && (
                        <div className="paginacion">
                            <button
                                className="btn-page"
                                disabled={pageInfo.page <= 1}
                                onClick={() => onPageChange(pageInfo.page - 1)}
                            >
                                ← Anterior
                            </button>
                            <span className="pagina-actual">Página {pageInfo.page} / {Math.max(1, Math.ceil((pageInfo.total || juegos.length) / pageInfo.limit))}</span>
                            <button
                                className="btn-page"
                                disabled={pageInfo.page >= Math.ceil((pageInfo.total || juegos.length) / pageInfo.limit)}
                                onClick={() => onPageChange(pageInfo.page + 1)}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BibliotecaJuegos;
