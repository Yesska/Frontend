import React, { useMemo } from 'react';
import '../styles/EstadisticasPersonales.css';

const EstadisticasPersonales = ({ juegos, reseñas }) => {
  const estadisticas = useMemo(() => {
    const totalJuegos = juegos.length;
    const juegoCompletados = juegos.filter((j) => j.completado).length;
    const juegosPorCompletar = totalJuegos - juegoCompletados;

    const totalHoras = reseñas.reduce((acc, r) => acc + r.horasJugadas, 0);
    const promedioHoras = totalHoras > 0 ? (totalHoras / reseñas.length).toFixed(1) : 0;

    const promedioPuntuacion =
      reseñas.length > 0 ? (reseñas.reduce((acc, r) => acc + r.puntuacion, 0) / reseñas.length).toFixed(1) : 0;

    const generos = {};
    juegos.forEach((j) => {
      generos[j.genero] = (generos[j.genero] || 0) + 1;
    });

    const plataformas = {};
    juegos.forEach((j) => {
      plataformas[j.plataforma] = (plataformas[j.plataforma] || 0) + 1;
    });

    const dificultadesPromedio = {};
    reseñas.forEach((r) => {
      if (!dificultadesPromedio[r.dificultad]) {
        dificultadesPromedio[r.dificultad] = { total: 0, count: 0 };
      }
      dificultadesPromedio[r.dificultad].total += r.puntuacion;
      dificultadesPromedio[r.dificultad].count += 1;
    });

    const dificultadesConPromedio = Object.entries(dificultadesPromedio).map(([dif, data]) => ({
      dificultad: dif,
      promedio: (data.total / data.count).toFixed(1),
    }));

    const recomendados = reseñas.filter((r) => r.recomendaria).length;

    return {
      totalJuegos,
      juegoCompletados,
      juegosPorCompletar,
      porcentajeCompletacion: ((juegoCompletados / totalJuegos) * 100).toFixed(0),
      totalHoras,
      promedioHoras,
      promedioPuntuacion,
      totalReseñas: reseñas.length,
      recomendados,
      generos: Object.entries(generos).sort((a, b) => b[1] - a[1]),
      plataformas: Object.entries(plataformas).sort((a, b) => b[1] - a[1]),
      dificultades: dificultadesConPromedio,
    };
  }, [juegos, reseñas]);

  const renderEstrellas = (puntuacion) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={i < Math.round(puntuacion) ? 'estrella-llena' : 'estrella-vacia'}>
          ⭐
        </span>
      ));
  };

  return (
    <div className="estadisticas-personales">
      <h2>📊 Mis Estadísticas</h2>

      <div className="grid-estadisticas">
        {/* Progreso de Juegos */}
        <div className="tarjeta-estadistica grande">
          <div className="stat-icon">📚</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Progreso de Biblioteca</div>
            <div className="stat-valor">{estadisticas.porcentajeCompletacion}%</div>
            <div className="barra-progreso">
              <div
                className="barra-progreso-relleno"
                style={{ width: `${estadisticas.porcentajeCompletacion}%` }}
              ></div>
            </div>
            <div className="stat-detalle">
              {estadisticas.juegoCompletados} de {estadisticas.totalJuegos} juegos completados
            </div>
          </div>
        </div>

        {/* Total de Juegos */}
        <div className="tarjeta-estadistica">
          <div className="stat-icon">🎮</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Total de Juegos</div>
            <div className="stat-valor">{estadisticas.totalJuegos}</div>
          </div>
        </div>

        {/* Por Completar */}
        <div className="tarjeta-estadistica">
          <div className="stat-icon">⏳</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Por Completar</div>
            <div className="stat-valor">{estadisticas.juegosPorCompletar}</div>
          </div>
        </div>

        {/* Total de Reseñas */}
        <div className="tarjeta-estadistica">
          <div className="stat-icon">📝</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Reseñas Escritas</div>
            <div className="stat-valor">{estadisticas.totalReseñas}</div>
          </div>
        </div>

        {/* Horas Jugadas */}
        <div className="tarjeta-estadistica">
          <div className="stat-icon">⏱️</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Total de Horas</div>
            <div className="stat-valor">{estadisticas.totalHoras}</div>
          </div>
        </div>

        {/* Promedio de Horas */}
        <div className="tarjeta-estadistica">
          <div className="stat-icon">📊</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Promedio de Horas</div>
            <div className="stat-valor">{estadisticas.promedioHoras}h</div>
          </div>
        </div>

        {/* Puntuación Promedio */}
        <div className="tarjeta-estadistica">
          <div className="stat-icon">⭐</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Puntuación Promedio</div>
            <div className="stat-estrellas">{renderEstrellas(estadisticas.promedioPuntuacion)}</div>
            <div className="stat-valor-pequeño">{estadisticas.promedioPuntuacion}/5</div>
          </div>
        </div>

        {/* Recomendados */}
        <div className="tarjeta-estadistica">
          <div className="stat-icon">👍</div>
          <div className="stat-contenido">
            <div className="stat-titulo">Recomendaría</div>
            <div className="stat-valor">{estadisticas.recomendados}</div>
            <div className="stat-detalle">{estadisticas.totalReseñas > 0 ? ((estadisticas.recomendados / estadisticas.totalReseñas) * 100).toFixed(0) : 0}%</div>
          </div>
        </div>
      </div>

      {/* Géneros Favoritos */}
      {estadisticas.generos.length > 0 && (
        <div className="seccion-estadistica">
          <h3>🎯 Géneros Favoritos</h3>
          <div className="grafico-barras">
            {estadisticas.generos.slice(0, 5).map(([genero, cantidad]) => (
              <div key={genero} className="barra-item">
                <div className="barra-label">{genero}</div>
                <div className="barra-contenedor">
                  <div
                    className="barra"
                    style={{
                      width: `${(cantidad / estadisticas.totalJuegos) * 100}%`,
                    }}
                  >
                    <span className="barra-valor">{cantidad}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plataformas */}
      {estadisticas.plataformas.length > 0 && (
        <div className="seccion-estadistica">
          <h3>🖥️ Juegos por Plataforma</h3>
          <div className="grid-plataformas">
            {estadisticas.plataformas.map(([plataforma, cantidad]) => (
              <div key={plataforma} className="tarjeta-plataforma">
                <div className="plat-titulo">{plataforma}</div>
                <div className="plat-cantidad">{cantidad}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dificultades */}
      {estadisticas.dificultades.length > 0 && (
        <div className="seccion-estadistica">
          <h3>💪 Puntuación Promedio por Dificultad</h3>
          <div className="grid-dificultades">
            {estadisticas.dificultades.map((item) => (
              <div key={item.dificultad} className="tarjeta-dificultad">
                <div className="dif-titulo">{item.dificultad}</div>
                <div className="dif-estrellas">{renderEstrellas(item.promedio)}</div>
                <div className="dif-valor">{item.promedio}/5</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadisticasPersonales;
