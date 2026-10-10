// pages/laboratory.js
(function () {
  const { Link, useVisible } = window;

  // ─────────────────────────────────────────────
  // Helper: sección animada
  // ─────────────────────────────────────────────
  function Section(props) {
    const { className, id, children } = props;
    const [ref, visible] = useVisible({ threshold: 0.15, once: true });
    return React.createElement(
      'section',
      {
        ref,
        id,
        className: (className || '') + ' reveal' + (visible ? ' visible' : ''),
      },
      children
    );
  }

  // ─────────────────────────────────────────────
  // Página Laboratorio
  // ─────────────────────────────────────────────
  function Laboratory() {
    const ideas = [
      {
        num: '01',
        title: 'Transcripción / Resumen con IA',
        text: 'Herramienta que procesa audio o texto y genera resúmenes automáticos usando modelos de lenguaje. Incluye cola de trabajos, extracción de puntos clave y exportación.',
        tags: ['IA', 'Python', 'NLP'],
        status: 'Prototipo',
        bullets: [
          'Pipeline de transcripción con Whisper',
          'Resumen jerárquico con LLMs',
          'Interfaz web minimalista',
        ],
      },
      {
        num: '02',
        title: 'Módulo de Pagos Crypto (USDT BEP20)',
        text: 'Integración de pagos con USDT en la red BSC. Manejo de wallets, confirmación on-chain, webhooks y panel de administración para conciliación.',
        tags: ['Web3', 'USDT', 'BEP20'],
        status: 'En curso',
        bullets: [
          'Conexión con Web3.js / ethers',
          'Escucha de eventos on-chain',
          'Panel de conciliación de pagos',
        ],
      },
      {
        num: '03',
        title: 'Dashboard de Métricas / Tokens',
        text: 'Panel que consume APIs de mercado para visualizar precios, volumen y tendencias. Foco en visualización de datos, filtros y rendimiento.',
        tags: ['Data', 'Charts', 'API'],
        status: 'Prototipo',
        bullets: [
          'Consumo de APIs públicas',
          'Gráficos interactivos',
          'Filtros por rango temporal',
        ],
      },
    ];

    return React.createElement(
      React.Fragment,
      null,

      // ── Hero de la página ─────────────────────
      React.createElement(
        'section',
        { className: 'page-hero' },
        React.createElement('h1', { className: 'hero-title' }, 'Laboratorio de ',
          React.createElement('span', { className: 'accent' }, 'Ideas')
        ),
        React.createElement(
          'p',
          { className: 'hero-subtitle' },
          'Prototipos técnicos, experimentos y pruebas de concepto. Cada idea explora una tecnología distinta con foco en construir cosas reales.'
        ),
        React.createElement(
          'div',
          { className: 'hero-ctas' },
          React.createElement(Link, { to: '/', className: 'btn btn-ghost' }, '← Volver al inicio'),
          React.createElement(Link, { to: '/projects', className: 'btn btn-primary' }, 'Ver proyectos')
        )
      ),

      // ── Grid de ideas ─────────────────────────
      React.createElement(
        Section,
        { className: 'section-lab', id: 'lab' },

        React.createElement(
          'div',
          { className: 'lab-grid' },
          ideas.map(function (idea, i) {
            return React.createElement(
              'article',
              { key: i, className: 'lab-card' },

              // Header: número + estado
              React.createElement(
                'div',
                { className: 'lab-card-header' },
                React.createElement('span', { className: 'lab-num' }, idea.num),
                React.createElement(
                  'span',
                  { className: 'lab-status' + (idea.status === 'En curso' ? ' active' : '') },
                  idea.status
                )
              ),

              React.createElement('h3', { className: 'lab-title' }, idea.title),
              React.createElement('p', { className: 'lab-text' }, idea.text),

              // Lista de bullets
              React.createElement(
                'ul',
                { className: 'lab-bullets' },
                idea.bullets.map(function (b, j) {
                  return React.createElement('li', { key: j }, b);
                })
              ),

              // Tags
              React.createElement(
                'div',
                { className: 'lab-tags' },
                idea.tags.map(function (t, j) {
                  return React.createElement('span', { key: j, className: 'tag' }, t);
                })
              )
            );
          })
        )
      )
    );
  }

  window.Laboratory = Laboratory;
})();