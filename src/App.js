import React, { useState, useEffect } from 'react';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import FormularioJuego from './components/FormularioJuego';
import ListaReseñas from './components/ListaReseñas';
import FormularioReseña from './components/FormularioReseña';
import EstadisticasPersonales from './components/EstadisticasPersonales';
import { gamesService, reviewsService } from './services/api';
import './App.css';

function App() {
    const [vista, setVista] = useState('biblioteca'); // biblioteca, formulario, estadisticas
    const [juegos, setJuegos] = useState([]);
    const [reseñas, setReseñas] = useState([]);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
    const [juegoEditando, setJuegoEditando] = useState(null);
    const [reseñaEditando, setReseñaEditando] = useState(null);
    const [reseñasJuegoActual, setReseñasJuegoActual] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        busqueda: '',
        genero: '',
        plataforma: '',
        completados: null,
        wishlist: null,
        sort: 'fecha',
        order: 'desc',
    });

    const [pageInfo, setPageInfo] = useState({ page: 1, limit: 10, total: 0 });

    // Cargar juegos al iniciar
    useEffect(() => {
        cargarJuegos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cargar reseñas cuando cambia juegoSeleccionado
    useEffect(() => {
        if (juegoSeleccionado) {
            cargarReseñasDelJuego(juegoSeleccionado);
        }
    }, [juegoSeleccionado]);

    const cargarJuegos = async (overrides = {}) => {
        try {
            setCargando(true);

            // Construir opciones a enviar al backend
            const opts = {
                search: overrides.search !== undefined ? overrides.search : filters.busqueda || undefined,
                genero: overrides.genero !== undefined ? overrides.genero : filters.genero || undefined,
                plataforma: overrides.plataforma !== undefined ? overrides.plataforma : filters.plataforma || undefined,
                completado: overrides.completado !== undefined ? overrides.completado : (filters.completados !== null ? filters.completados : undefined),
                wishlist: overrides.wishlist !== undefined ? overrides.wishlist : (filters.wishlist !== null ? filters.wishlist : undefined),
                sort: overrides.sort !== undefined ? overrides.sort : filters.sort || undefined,
                order: overrides.order !== undefined ? overrides.order : filters.order || undefined,
                page: overrides.page !== undefined ? overrides.page : pageInfo.page,
                limit: overrides.limit !== undefined ? overrides.limit : pageInfo.limit,
            };

            const response = await gamesService.getAllGames(opts);

            // Backend may return paginated object { data, page, limit, total }
            if (response.data && Array.isArray(response.data.data)) {
                setJuegos(response.data.data);
                setPageInfo((p) => ({ ...p, page: response.data.page || p.page, limit: response.data.limit || p.limit, total: response.data.total || p.total }));
            } else if (response.data && Array.isArray(response.data)) {
                setJuegos(response.data);
                setPageInfo((p) => ({ ...p, total: response.data.length }));
            } else {
                setJuegos(response.data || []);
            }

            setError(null);
        } catch (err) {
            setError('Error al cargar los juegos');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const handleToggleWishlist = async (juego) => {
        try {
            setCargando(true);
            if (juego.wishlist) {
                await gamesService.removeFromWishlist(juego._id);
            } else {
                await gamesService.addToWishlist(juego._id);
            }
            await cargarJuegos();
        } catch (err) {
            console.error('Error al actualizar wishlist:', err);
            setError('Error al actualizar wishlist');
        } finally {
            setCargando(false);
        }
    };

    const handleFiltersChange = (partial) => {
        // partial: { busqueda?, genero?, plataforma?, completados?, wishlist?, sort?, order? }
        setFilters((prev) => ({ ...prev, ...partial }));
        // reset to first page on filter change
        setPageInfo((p) => ({ ...p, page: 1 }));
        // cargar con overrides inmediatos para evitar latencia de setState
        const overrides = {
            search: partial.busqueda !== undefined ? partial.busqueda : undefined,
            genero: partial.genero !== undefined ? partial.genero : undefined,
            plataforma: partial.plataforma !== undefined ? partial.plataforma : undefined,
            completado: partial.completados !== undefined ? partial.completados : undefined,
            wishlist: partial.wishlist !== undefined ? partial.wishlist : undefined,
            sort: partial.sort !== undefined ? partial.sort : undefined,
            order: partial.order !== undefined ? partial.order : undefined,
            page: 1,
        };
        cargarJuegos(overrides);
    };

    const handlePageChange = (newPage) => {
        setPageInfo((p) => ({ ...p, page: newPage }));
        cargarJuegos({ page: newPage });
    };

    const cargarTodasLasReseñas = async () => {
        try {
            const response = await reviewsService.getAllReviews();
            setReseñas(response.data);
        } catch (err) {
            console.error('Error al cargar reseñas:', err);
        }
    };

    const cargarReseñasDelJuego = async (juegoId) => {
        try {
            const response = await reviewsService.getReviewsByGame(juegoId);
            setReseñasJuegoActual(response.data);
        } catch (err) {
            console.error('Error al cargar reseñas del juego:', err);
            setReseñasJuegoActual([]);
        }
    };

    // JUEGOS
    const handleAgregarJuego = async (formData) => {
        try {
            setCargando(true);
            if (juegoEditando) {
                await gamesService.updateGame(juegoEditando._id, formData);
                setJuegoEditando(null);
            } else {
                await gamesService.createGame(formData);
            }
            cargarJuegos();
            setVista('biblioteca');
            setError(null);
        } catch (err) {
            setError('Error al guardar el juego');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const handleEditarJuego = (juego) => {
        setJuegoEditando(juego);
        setVista('formulario');
    };

    const handleEliminarJuego = async (juegoId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este juego?')) {
            try {
                setCargando(true);
                await gamesService.deleteGame(juegoId);
                cargarJuegos();
                setError(null);
            } catch (err) {
                setError('Error al eliminar el juego');
                console.error(err);
            } finally {
                setCargando(false);
            }
        }
    };

    const handleVerReseñas = (juegoId) => {
        setJuegoSeleccionado(juegoId);
        setVista('reseñas');
        cargarTodasLasReseñas();
    };

    // RESEÑAS
    const handleAgregarReseña = async (formData) => {
        try {
            setCargando(true);
            if (reseñaEditando) {
                await reviewsService.updateReview(reseñaEditando._id, formData);
                setReseñaEditando(null);
            } else {
                await reviewsService.createReview(formData);
            }
            cargarReseñasDelJuego(juegoSeleccionado);
            cargarTodasLasReseñas();
            setError(null);
        } catch (err) {
            setError('Error al guardar la reseña');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const handleEditarReseña = (reseña) => {
        setReseñaEditando(reseña);
    };

    const handleEliminarReseña = async (reseñaId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
            try {
                setCargando(true);
                await reviewsService.deleteReview(reseñaId);
                cargarReseñasDelJuego(juegoSeleccionado);
                cargarTodasLasReseñas();
                setError(null);
            } catch (err) {
                setError('Error al eliminar la reseña');
                console.error(err);
            } finally {
                setCargando(false);
            }
        }
    };

    const handleCancelarFormulario = () => {
        setJuegoEditando(null);
        setVista('biblioteca');
    };

    const handleCancelarReseña = () => {
        setReseñaEditando(null);
    };

    const handleAgregarNuevoJuego = () => {
        setJuegoEditando(null);
        setVista('formulario');
    };

    const juegoActual = juegos.find((j) => j._id === juegoSeleccionado);

    return (
        <div className="app">
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <span className="logo-icon">🎮</span>
                        GameTracker
                    </div>
                    <div className="navbar-menu">
                        <button
                            className={`nav-link ${vista === 'biblioteca' ? 'activo' : ''}`}
                            onClick={() => setVista('biblioteca')}
                        >
                            📚 Biblioteca
                        </button>
                        <button
                            className={`nav-link ${vista === 'estadisticas' ? 'activo' : ''}`}
                            onClick={() => setVista('estadisticas')}
                        >
                            📊 Estadísticas
                        </button>
                    </div>
                </div>
            </nav>

            <main className="main-container">
                {error && <div className="error-message">{error}</div>}

                {cargando && <div className="loading">Cargando...</div>}

                {!cargando && (
                    <>
                        {vista === 'biblioteca' && (
                            <BibliotecaJuegos
                                juegos={juegos}
                                onEdit={handleEditarJuego}
                                onDelete={handleEliminarJuego}
                                onViewReviews={handleVerReseñas}
                                onAgregarNuevo={handleAgregarNuevoJuego}
                                onToggleWishlist={handleToggleWishlist}
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                pageInfo={pageInfo}
                                onPageChange={handlePageChange}
                            />
                        )}

                        {vista === 'formulario' && (
                            <FormularioJuego
                                juegoInicial={juegoEditando}
                                onSubmit={handleAgregarJuego}
                                onCancel={handleCancelarFormulario}
                            />
                        )}

                        {vista === 'reseñas' && (
                            <div className="vista-reseñas">
                                <button className="btn-volver" onClick={() => setVista('biblioteca')}>
                                    ← Volver a Biblioteca
                                </button>

                                {juegoActual && (
                                    <div className="juego-info">
                                        <h2>{juegoActual.titulo}</h2>
                                        <p>{juegoActual.desarrollador} • {juegoActual.plataforma} • {juegoActual.añoLanzamiento}</p>
                                    </div>
                                )}

                                {!reseñaEditando ? (
                                    <FormularioReseña
                                        juegoId={juegoSeleccionado}
                                        onSubmit={handleAgregarReseña}
                                        onCancel={handleCancelarReseña}
                                    />
                                ) : (
                                    <>
                                        <FormularioReseña
                                            reseñaInicial={reseñaEditando}
                                            juegoId={juegoSeleccionado}
                                            onSubmit={handleAgregarReseña}
                                            onCancel={handleCancelarReseña}
                                        />
                                    </>
                                )}

                                <ListaReseñas
                                    reseñas={reseñasJuegoActual}
                                    onEdit={handleEditarReseña}
                                    onDelete={handleEliminarReseña}
                                    gameTitle={juegoActual?.titulo}
                                />
                            </div>
                        )}

                        {vista === 'estadisticas' && (
                            <EstadisticasPersonales juegos={juegos} reseñas={reseñas} />
                        )}
                    </>
                )}
            </main>

            <footer className="footer">
                <p>GameTracker © 2025 • Tu biblioteca personal de videojuegos</p>
            </footer>
        </div>
    );
}

export default App;
