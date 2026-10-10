// src/component/Footer.js
(function () {
  const { Link } = window;

  function Footer() {
    return React.createElement(
      'footer',
      { className: 'site-footer' },
      React.createElement(
        'div',
        { className: 'footer-inner' },

        // Columna 1: brand
        React.createElement(
          'div',
          { className: 'footer-brand' },
          React.createElement('strong', null, 'Leonardo Guzman'),
          React.createElement('p', null, 'Full Stack Developer · Venezuela')
        ),

        // Columna 2: links rápidos
        React.createElement(
          'div',
          { className: 'footer-nav' },
          React.createElement(
            'span',
            { className: 'footer-nav-title' },
            'Navegación'
          ),
          React.createElement(
            'ul',
            { className: 'footer-nav-list' },
            React.createElement(
              'li',
              null,
              React.createElement(Link, { to: '/' }, 'Inicio')
            ),
            React.createElement(
              'li',
              null,
              React.createElement(Link, { to: '/laboratory' }, 'Lab')
            ),
            React.createElement(
              'li',
              null,
              React.createElement(Link, { to: '/projects' }, 'Proyectos')
            ),
            React.createElement(
              'li',
              null,
              React.createElement(Link, { to: '/contact' }, 'Contacto')
            )
          )
        ),

        // Columna 3: redes externas
        React.createElement(
          'div',
          { className: 'footer-social' },
          React.createElement(
            'span',
            { className: 'footer-nav-title' },
            'Social'
          ),
          React.createElement(
            'ul',
            { className: 'footer-nav-list' },
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                {
                  href: 'mailto:hola@ejemplo.com',
                  target: '_self',
                },
                'Email'
              )
            ),
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                {
                  href: 'https://github.com/',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                'GitHub'
              )
            ),
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                {
                  href: 'https://linkedin.com/',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                'LinkedIn'
              )
            )
          )
        )
      ),

      // Línea inferior: copyright
      React.createElement(
        'p',
        { className: 'footer-copy' },
        '© ' + new Date().getFullYear() + ' Leonardo Guzman. Construido con React.'
      )
    );
  }

  window.Footer = Footer;
})();