// src/component/Logo.js
(function () {
  // ─────────────────────────────────────────────
  // Logo SVG — < LG />  Leonardo / Full Stack Dev
  // Los colores usan currentColor y variables CSS
  // para adaptarse automáticamente al tema.
  // ─────────────────────────────────────────────
  function Logo() {
    return React.createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 180,
        height: 40,
        viewBox: '0 0 180 40',
        fill: 'none',
        className: 'logo-svg',
        'aria-label': 'Leonardo Guzman · Full Stack Dev',
      },

      // ── Símbolo: < LG /> ─────────────────
      React.createElement(
        'text',
        {
          x: 0,
          y: 26,
          fill: 'var(--accent)',
          fontFamily: 'monospace',
          fontSize: 22,
          fontWeight: 'bold',
        },
        '<'
      ),
      React.createElement(
        'text',
        {
          x: 18,
          y: 26,
          fill: 'var(--text)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 20,
          fontWeight: '800',
          letterSpacing: 1,
        },
        'LG'
      ),
      React.createElement(
        'text',
        {
          x: 50,
          y: 26,
          fill: 'var(--accent)',
          fontFamily: 'monospace',
          fontSize: 22,
          fontWeight: 'bold',
        },
        '/>'
      ),

      // ── Separador vertical ──────────────
      React.createElement('line', {
        x1: 82,
        y1: 10,
        x2: 82,
        y2: 28,
        stroke: 'var(--border-strong)',
        strokeWidth: 1.5,
      }),

      // ── Nombre y rol ────────────────────
      React.createElement(
        'text',
        {
          x: 94,
          y: 19,
          fill: 'var(--text)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 13,
          fontWeight: '600',
        },
        'LEONARDO'
      ),
      React.createElement(
        'text',
        {
          x: 94,
          y: 30,
          fill: 'var(--text-soft)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 9,
          fontWeight: '500',
          letterSpacing: 0.5,
        },
        'FULL STACK DEV'
      )
    );
  }

  window.Logo = Logo;
})();