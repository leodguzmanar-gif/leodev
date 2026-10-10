// pages/home.js
(function () {
  const { Link, useVisible } = window;

  // ─────────────────────────────────────────────
  // Helper: sección con animación de entrada
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
  // 2) HERO
  // ─────────────────────────────────────────────
  function Hero() {
    return React.createElement(
      'section',
      { className: 'hero', id: 'hero' },
      React.createElement(
        'div',
        { className: 'hero-inner' },
        
        // Título
        React.createElement(
          'h1',
          { className: 'hero-title' },
          'Construyo ideas ',
          React.createElement('span', { className: 'accent' }, 'funcionales'),
          ' con código limpio.'
        ),
        
        // Badges
        React.createElement(
          'div',
          { className: 'hero-badges' },
          React.createElement('span', { className: 'badge' }, 'Full Stack Dev'),
          React.createElement('span', { className: 'badge' }, 'Node.js'),
          React.createElement('span', { className: 'badge' }, 'React'),
          React.createElement('span', { className: 'badge' }, 'Python')
        ),

        // Subtítulo
        React.createElement(
          'p',
          { className: 'hero-subtitle' },
          'Desarrollador Full Stack junior enfocado en crear interfaces intuitivas y backends sólidos. Explorando el cruce entre IA, pagos crypto y datos.'
        ),

        // CTAs
        React.createElement(
          'div',
          { className: 'hero-ctas' },
          React.createElement(
            Link,
            { to: '/laboratory', className: 'btn btn-primary' },
            'Explorar Lab (3 ideas)'
          ),
          React.createElement(
            'a',
            {
              href: 'https://github.com/',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'btn btn-ghost',
            },
            'Ver GitHub'
          )
        )
      ),

      // Flecha de scroll hacia abajo (opcional)
      React.createElement(
        'div',
        { className: 'hero-scroll-hint' },
        React.createElement('span', null, '↓')
      )
    );
  }

  // ─────────────────────────────────────────────
  // 3) SOBRE MÍ
  // ─────────────────────────────────────────────
  function About() {
    const pillars = [
      {
        title: 'Interfaces UI',
        text: 'Componentes accesibles y responsivos con React, HTML semántico y CSS moderno. Diseño orientado a la claridad y la velocidad de carga.',
      },
      {
        title: 'Backend & APIs',
        text: 'APIs REST con Node.js y Express. Manejo de autenticación, validación de datos y persistencia con bases relacionales y no relacionales.',
      },
      {
        title: 'Exploración Técnica',
        text: 'Prototipos con IA, integración de pagos crypto (USDT BEP20) y dashboards de métricas. Aprender construyendo cosas reales.',
      },
    ];

    return React.createElement(
      Section,
      { className: 'section-about', id: 'about' },
      React.createElement('h2', { className: 'section-title' }, 'Sobre mí & enfoque técnico'),
      React.createElement(
        'p',
        { className: 'section-lead' },
        'Desarrollador junior con base sólida en frontend y backend. Me enfoco en tres pilares que combinan lo visual con lo funcional.'
      ),
      React.createElement(
        'div',
        { className: 'pillars-grid' },
        pillars.map(function (p, i) {
          return React.createElement(
            'article',
            { key: i, className: 'pillar-card' },
            React.createElement('h3', null, p.title),
            React.createElement('p', null, p.text)
          );
        })
      )
    );
  }

  // ─────────────────────────────────────────────
  // 4) LABORATORIO DE IDEAS
  // ─────────────────────────────────────────────
  function Lab() {
    const ideas = [
      {
        num: '01',
        title: 'Transcripción / Resumen con IA',
        text: 'Herramienta que procesa audio o texto y genera resúmenes automáticos usando modelos de lenguaje. Stack experimental con Python y APIs de IA.',
        tags: ['IA', 'Python', 'NLP'],
      },
      {
        num: '02',
        title: 'Módulo de Pagos Crypto',
        text: 'Integración de pagos con USDT en la red BEP20. Manejo de wallets, confirmación de transacciones y notificaciones en tiempo real.',
        tags: ['Web3', 'USDT', 'BEP20'],
      },
      {
        num: '03',
        title: 'Dashboard de Métricas / Tokens',
        text: 'Panel que consume APIs de mercado para visualizar precios, volumen y tendencias. Foco en visualización de datos y rendimiento.',
        tags: ['Data', 'Charts', 'API'],
      },
    ];

    return React.createElement(
      Section,
      { className: 'section-lab', id: 'lab' },
      React.createElement('h2', { className: 'section-title' }, 'Laboratorio de ideas'),
      React.createElement(
        'p',
        { className: 'section-lead' },
        'Prototipos y experimentos activos. Cada idea explora una tecnología distinta.'
      ),
      React.createElement(
        'div',
        { className: 'lab-grid' },
        ideas.map(function (idea, i) {
          return React.createElement(
            'article',
            { key: i, className: 'lab-card' },
            React.createElement('span', { className: 'lab-num' }, idea.num),
            React.createElement('h3', { className: 'lab-title' }, idea.title),
            React.createElement('p', { className: 'lab-text' }, idea.text),
            React.createElement(
              'div',
              { className: 'lab-tags' },
              idea.tags.map(function (t, j) {
                return React.createElement('span', { key: j, className: 'tag' }, t);
              })
            ),
            React.createElement(
              Link,
              { to: '/laboratory', className: 'lab-link' },
              'Ver detalle →'
            )
          );
        })
      )
    );
  }

  // ─────────────────────────────────────────────
  // 5) PROYECTOS
  // ─────────────────────────────────────────────
  function Projects() {
    // Por ahora, array hardcoded. Mañana puede venir de un JSON o DB.
    const projects = [];

    return React.createElement(
      Section,
      { className: 'section-projects', id: 'projects' },
      React.createElement('h2', { className: 'section-title' }, 'Proyectos Full Stack'),
      React.createElement(
        'p',
        { className: 'section-lead' },
        'Espacio escalable. Aquí irán los proyectos reales conectados a base de datos.'
      ),

      projects.length === 0
        ? React.createElement(
            'div',
            { className: 'projects-empty' },
            React.createElement('p', null, 'Próximamente. Estoy trabajando en nuevos proyectos.'),
            React.createElement(
              Link,
              { to: '/projects', className: 'btn btn-ghost' },
              'Ir a la sección'
            )
          )
        : React.createElement(
            'div',
            { className: 'projects-grid' },
            projects.map(function (p, i) {
              return React.createElement(
                'article',
                { key: i, className: 'project-card' },
                React.createElement('h3', null, p.title),
                React.createElement('p', null, p.description)
              );
            })
          )
    );
  }

  // ─────────────────────────────────────────────
  // 6) TECH STACK
  // ─────────────────────────────────────────────
  function Stack() {
    const groups = [
      {
        title: 'Frontend',
        items: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite'],
      },
      {
        title: 'Backend',
        items: ['Node.js', 'Express', 'Python', 'REST APIs'],
      },
      {
        title: 'Base de Datos & Cloud',
        items: ['PostgreSQL', 'MongoDB', 'Firebase', 'Vercel'],
      },
    ];

    return React.createElement(
      Section,
      { className: 'section-stack', id: 'stack' },
      React.createElement('h2', { className: 'section-title' }, 'Tech Stack & Herramientas'),
      React.createElement(
        'p',
        { className: 'section-lead' },
        'Tecnologías que uso para construir, probar y desplegar.'
      ),
      React.createElement(
        'div',
        { className: 'stack-grid' },
        groups.map(function (g, i) {
          return React.createElement(
            'div',
            { key: i, className: 'stack-group' },
            React.createElement('h3', null, g.title),
            React.createElement(
              'ul',
              { className: 'stack-list' },
              g.items.map(function (item, j) {
                return React.createElement('li', { key: j, className: 'stack-item' }, item);
              })
            )
          );
        })
      )
    );
  }


  // ─────────────────────────────────────────────
  // Home completa
  // ─────────────────────────────────────────────
  function Home() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Hero, null),
      React.createElement(About, null),
      React.createElement(Lab, null),
      React.createElement(Projects, null),
      React.createElement(Stack, null)
    );
  }

  window.Home = Home;
})();