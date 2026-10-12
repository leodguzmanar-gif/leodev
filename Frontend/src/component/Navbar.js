// src/component/Navbar.js
(function () {
  const { useState, useEffect, useRef } = React;

  const NAV_ITEMS = [
    { to: '/',           label: 'Inicio' },
    { to: '/laboratory', label: 'Lab' },
    { to: '/projects',   label: 'Proyectos' },
    { to: '/contact',    label: 'Contacto' },
  ];

  function Navbar() {
    const Link = window.Link;
    const usePathRoute = window.usePathRoute;
    const ThemeToggle = window.ThemeToggle;

    const path = usePathRoute();

    const [state, setState] = useState('top');
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // ── Auto-hide por scroll ──
    useEffect(function () {
      let lastY = window.scrollY;
      let ticking = false;

      function update() {
        const y = window.scrollY;
        const dy = y - lastY;

        if (Math.abs(dy) < 5) { ticking = false; return; }

        if (y <= 10) {
          setState('top');
        } else if (dy > 0) {
          setState('hidden');
        } else {
          setState('visible');
        }

        lastY = y;
        ticking = false;
      }

      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      return function () {
        window.removeEventListener('scroll', onScroll);
      };
    }, []);

    // ── Cerrar al cambiar de ruta ──
    useEffect(function () { setMenuOpen(false); }, [path]);

    // ── Bloquear scroll del body cuando el menú está abierto ──
    useEffect(function () {
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      return function () { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // ── Cerrar al tocar fuera del menú ──
    useEffect(function () {
      if (!menuOpen) return;

      function onPointerDown(e) {
        const menu = menuRef.current;
        const btn = buttonRef.current;

        // Si el clic es dentro del menú → no cerrar
        if (menu && menu.contains(e.target)) return;

        // Si el clic es en el botón hamburguesa → no cerrar (él mismo lo togglea)
        if (btn && btn.contains(e.target)) return;

        setMenuOpen(false);
      }

      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('touchstart', onPointerDown, { passive: true });

      return function () {
        document.removeEventListener('mousedown', onPointerDown);
        document.removeEventListener('touchstart', onPointerDown);
      };
    }, [menuOpen]);

    const isActive = function (route) { return path === route; };
    const navClass = 'containerNav state-' + state + (menuOpen ? ' menu-open' : '');

    function toggleMenu() {
      setMenuOpen(function (v) { return !v; });
    }

    return React.createElement(
      'div',
      { className: navClass },

      // ── Overlay clicable (cierra al tocar fuera) ──
      React.createElement('div', {
        className: 'mobileMenu-overlay' + (menuOpen ? ' is-open' : ''),
        onClick: function () { setMenuOpen(false); },
        'aria-hidden': 'true',
      }),

      React.createElement(
        'nav',
        { className: 'navContain devNav' },

        // Zona izquierda: hamburguesa + theme toggle (móvil) + logo (desktop)
        React.createElement(
          'div',
          { className: 'nav-left' },

          React.createElement(
            'button',
            {
              ref: buttonRef,
              className: 'hamburger' + (menuOpen ? ' is-open' : ''),
              onClick: toggleMenu,
              'aria-label': menuOpen ? 'Cerrar menú' : 'Abrir menú',
              'aria-expanded': menuOpen,
              type: 'button',
            },
            React.createElement('span', { className: 'hamburger-line' }),
            React.createElement('span', { className: 'hamburger-line' }),
            React.createElement('span', { className: 'hamburger-line' })
          ),

          React.createElement(
            'div',
            { className: 'theme-toggle-mobile' },
            React.createElement(ThemeToggle, null)
          ),

          React.createElement(
            'a',
            { className: 'logo logo-desktop', href: '/leodev/' },
            React.createElement(window.Logo, null)
          )
        ),

        // Centro: items pill (desktop)
        React.createElement(
          'div',
          { className: 'itemNav itemNav-desktop' },
          React.createElement(
            'div',
            { className: 'itemNavPill' },
            NAV_ITEMS.map(function (item, i) {
              return React.createElement(
                Link,
                {
                  key: i,
                  to: item.to,
                  className: 'nav-link' + (isActive(item.to) ? ' active' : ''),
                },
                item.label
              );
            })
          )
        ),

        // Derecha: buscador + theme toggle (desktop)
        React.createElement(
          'div',
          { className: 'buscador' },
          React.createElement('div', { className: 'theme-toggle-desktop' },
            React.createElement(ThemeToggle, null)
          ),
          React.createElement(window.Search, null)
        )
      ),

      // ── Menú móvil ──
      React.createElement(
        'div',
        {
          ref: menuRef,
          className: 'mobileMenu' + (menuOpen ? ' is-open' : ''),
        },

        React.createElement(
          'a',
          {
            className: 'mobileMenu-logo',
            href: '/',
            onClick: function () { setMenuOpen(false); },
          },
          React.createElement(window.Logo, null)
        ),

        React.createElement(
          'div',
          { className: 'mobileMenu-items' },
          NAV_ITEMS.map(function (item, i) {
            return React.createElement(
              Link,
              {
                key: i,
                to: item.to,
                className: 'mobileMenu-link' + (isActive(item.to) ? ' active' : ''),
                onClick: function () { setMenuOpen(false); },
              },
              item.label
            );
          })
        )
      )
    );
  }

  window.Navbar = Navbar;
})();