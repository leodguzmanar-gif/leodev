// pages/projects.js
(function () {
  const { Link, useVisible } = window;
  const { useState, useMemo } = React;

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
  // Datos (por ahora hardcoded, mañana → JSON / API)
  // ─────────────────────────────────────────────
  const PROJECTS = [
    {
      title: 'Portafolio Topográfico',
      description:
        'Sitio personal con fondo topográfico animado usando Marching Squares + Simplex Noise. Multi-página, tema claro/oscuro y navegación SPA sin build.',
      category: 'Frontend',
      year: '2026',
      status: 'Activo',
      stack: ['React', 'Canvas', 'JS'],
      link: '#',
      repo: '#',
    },
    {
      title: 'API de Gestión de Tareas',
      description:
        'Backend REST con Node.js y Express para administrar proyectos y tareas. Autenticación con JWT, roles, y persistencia en PostgreSQL.',
      category: 'Backend',
      year: '2025',
      status: 'Completado',
      stack: ['Node.js', 'Express', 'PostgreSQL'],
      link: '#',
      repo: '#',
    },
    {
      title: 'Dashboard de Métricas Crypto',
      description:
        'Panel que consume APIs de mercado para visualizar precios, volumen y tendencias. Filtros por rango temporal y gráficos interactivos.',
      category: 'Full Stack',
      year: '2025',
      status: 'Prototipo',
      stack: ['React', 'Charts', 'API'],
      link: '#',
      repo: '#',
    },
    {
      title: 'Bot de Alertas de Precio',
      description:
        'Servicio que monitorea precios en tiempo real y envía notificaciones vía Telegram cuando se cumplen condiciones configurables.',
      category: 'Backend',
      year: '2024',
      status: 'Completado',
      stack: ['Python', 'Telegram API', 'WebSocket'],
      link: '#',
      repo: '#',
    },
  ];

  // ─────────────────────────────────────────────
  // Filtro de categorías
  // ─────────────────────────────────────────────
  function CategoryFilter(props) {
    const { categories, active, onChange } = props;

    return React.createElement(
      'div',
      { className: 'projects-filter' },
      categories.map(function (cat, i) {
        return React.createElement(
          'button',
          {
            key: i,
            type: 'button',
            className: 'filter-pill' + (active === cat ? ' active' : ''),
            onClick: function () { onChange(cat); },
          },
          cat
        );
      })
    );
  }

  // ─────────────────────────────────────────────
  // Card individual
  // ─────────────────────────────────────────────
  function ProjectCard(props) {
    const { project } = props;

    const statusClass =
      project.status === 'Activo' ? 'active' :
      project.status === 'Prototipo' ? 'proto' : 'done';

    return React.createElement(
      'article',
      { className: 'project-card' },

      // Header: categoría + año
      React.createElement(
        'div',
        { className: 'project-header' },
        React.createElement('span', { className: 'project-category' }, project.category),
        React.createElement('span', { className: 'project-year' }, project.year)
      ),

      // Título
      React.createElement('h3', { className: 'project-title' }, project.title),

      // Descripción
      React.createElement('p', { className: 'project-description' }, project.description),

      // Stack
      React.createElement(
        'div',
        { className: 'project-stack' },
        project.stack.map(function (tech, j) {
          return React.createElement('span', { key: j, className: 'tag' }, tech);
        })
      ),

      // Footer: estado + links
      React.createElement(
        'div',
        { className: 'project-footer' },
        React.createElement(
          'span',
          { className: 'project-status ' + statusClass },
          project.status
        ),
        React.createElement(
          'div',
          { className: 'project-links' },
          project.link
            ? React.createElement(
                'a',
                {
                  href: project.link,
                  className: 'project-link',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                'Demo →'
              )
            : null,
          project.repo
            ? React.createElement(
                'a',
                {
                  href: project.repo,
                  className: 'project-link',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                'Código →'
              )
            : null
        )
      )
    );
  }

  // ─────────────────────────────────────────────
  // Página Proyectos
  // ─────────────────────────────────────────────
  function Projects() {
    const [filter, setFilter] = useState('Todos');

    // Calculamos las categorías disponibles desde los datos
    const categories = useMemo(function () {
      const set = new Set(['Todos']);
      PROJECTS.forEach(function (p) { set.add(p.category); });
      return Array.from(set);
    }, []);

    // Filtramos según la categoría seleccionada
    const filtered = useMemo(function () {
      if (filter === 'Todos') return PROJECTS;
      return PROJECTS.filter(function (p) { return p.category === filter; });
    }, [filter]);

    return React.createElement(
      React.Fragment,
      null,

      // ── Hero de la página ─────────────────────
      React.createElement(
        'section',
        { className: 'page-hero' },
        React.createElement(
          'h1',
          { className: 'hero-title' },
          'Mis ',
          React.createElement('span', { className: 'accent' }, 'Proyectos')
        ),
        React.createElement(
          'p',
          { className: 'hero-subtitle' },
          'Selección de trabajos full stack. Cada proyecto explora un stack distinto y resuelve un problema real — desde APIs hasta dashboards.'
        ),
        React.createElement(
          'div',
          { className: 'hero-ctas' },
          React.createElement(Link, { to: '/', className: 'btn btn-ghost' }, '← Volver al inicio'),
          React.createElement(Link, { to: '/laboratory', className: 'btn btn-primary' }, 'Ver laboratorio')
        )
      ),

      // ── Grid de proyectos con filtro ──────────
      React.createElement(
        Section,
        { className: 'section-projects', id: 'projects' },

        // Filtro
        React.createElement(CategoryFilter, {
          categories: categories,
          active: filter,
          onChange: setFilter,
        }),

        // Grid
        filtered.length === 0
          ? React.createElement(
              'div',
              { className: 'projects-empty' },
              React.createElement('p', null, 'No hay proyectos en esta categoría todavía.')
            )
          : React.createElement(
              'div',
              { className: 'projects-grid' },
              filtered.map(function (p, i) {
                return React.createElement(ProjectCard, { key: i, project: p });
              })
            )
      ),

      // ── CTA final ─────────────────────────────
      React.createElement(
        Section,
        { className: 'section-projects-cta', id: 'projects-cta' },
        React.createElement(
          'p',
          { className: 'cta-text' },
          '¿Quieres ver el código o hablar sobre alguno? ',
          React.createElement(Link, { to: '/contact', className: 'inline-link' }, 'Contáctame'),
          '.'
        )
      )
    );
  }

  window.Projects = Projects;
})();