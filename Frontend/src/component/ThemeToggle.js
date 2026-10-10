// src/component/ThemeToggle.js
(function () {
  // ─────────────────────────────────────────────
  // Icono Sol (solo líneas) — visible en modo oscuro
  // Significa "click para ir a claro"
  // ─────────────────────────────────────────────
  function SunIcon() {
    return React.createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 18,
        height: 18,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
      React.createElement('circle', { cx: 12, cy: 12, r: 4 }),
      React.createElement('line', { x1: 12, y1: 2,  x2: 12, y2: 5 }),
      React.createElement('line', { x1: 12, y1: 19, x2: 12, y2: 22 }),
      React.createElement('line', { x1: 2,  y1: 12, x2: 5,  y2: 12 }),
      React.createElement('line', { x1: 19, y1: 12, x2: 22, y2: 12 }),
      React.createElement('line', { x1: 4.22,  y1: 4.22,  x2: 6.34,  y2: 6.34 }),
      React.createElement('line', { x1: 17.66, y1: 17.66, x2: 19.78, y2: 19.78 }),
      React.createElement('line', { x1: 4.22,  y1: 19.78, x2: 6.34,  y2: 17.66 }),
      React.createElement('line', { x1: 17.66, y1: 6.34,  x2: 19.78, y2: 4.22 })
    );
  }

  // ─────────────────────────────────────────────
  // Icono Luna (solo líneas) — visible en modo claro
  // Significa "click para ir a oscuro"
  // ─────────────────────────────────────────────
  function MoonIcon() {
    return React.createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 18,
        height: 18,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
      React.createElement('path', {
        d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
      })
    );
  }

  // ─────────────────────────────────────────────
  // Botón
  // ─────────────────────────────────────────────
  function ThemeToggle() {
    const [theme, toggle] = window.useTheme();
    const isLight = theme === 'light';

    return React.createElement(
      'button',
      {
        className: 'theme-toggle',
        onClick: toggle,
        type: 'button',
        'aria-label': isLight ? 'Activar modo oscuro' : 'Activar modo claro',
        title: isLight ? 'Modo oscuro' : 'Modo claro',
      },
      // En modo claro mostramos luna (para ir a oscuro)
      // En modo oscuro mostramos sol (para ir a claro)
      isLight
        ? React.createElement(MoonIcon, null)
        : React.createElement(SunIcon, null)
    );
  }

  window.ThemeToggle = ThemeToggle;
})();