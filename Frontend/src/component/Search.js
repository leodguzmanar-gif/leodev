// src/component/Search.js
(function () {
  const { useState, useEffect, useRef, useMemo } = React;

  // ─────────────────────────────────────────────
  // Índice de búsqueda
  // Cada entrada tiene: título, categoría, ruta y palabras clave
  // Amplía este array cuando añadas páginas o proyectos
  // ─────────────────────────────────────────────
  const INDEX = [
    {
      title: 'Inicio',
      category: 'Página',
      path: '/',
      keywords: 'home portada principal hero leonardo guzman',
    },
    {
      title: 'Laboratorio',
      category: 'Página',
      path: '/laboratory',
      keywords: 'lab ideas prototipos experimentos ia pagos crypto dashboard',
    },
    {
      title: 'Proyectos',
      category: 'Página',
      path: '/projects',
      keywords: 'portafolio trabajos demos repos backend frontend fullstack',
    },
    {
      title: 'Contacto',
      category: 'Página',
      path: '/contact',
      keywords: 'email mensaje formulario escribir hola',
    },
    {
      title: 'Sobre mí',
      category: 'Sección',
      path: '/#about',
      keywords: 'perfil biografia enfoque tecnico pilares ui backend',
    },
    {
      title: 'Tech Stack',
      category: 'Sección',
      path: '/#stack',
      keywords: 'tecnologias herramientas frontend backend base datos cloud react node',
    },
    {
      title: 'Transcripción IA',
      category: 'Idea',
      path: '/laboratory',
      keywords: 'ia transcripcion resumen nlp python whisper llm',
    },
    {
      title: 'Pagos Crypto',
      category: 'Idea',
      path: '/laboratory',
      keywords: 'usdt bep20 web3 binance wallet transacciones pagos',
    },
    {
      title: 'Dashboard Métricas',
      category: 'Idea',
      path: '/laboratory',
      keywords: 'dashboard metricas tokens charts datos api mercado',
    },
    {
      title: 'Portafolio Topográfico',
      category: 'Proyecto',
      path: '/projects',
      keywords: 'react canvas simplex noise marching squares tema oscuro',
    },
    {
      title: 'API de Tareas',
      category: 'Proyecto',
      path: '/projects',
      keywords: 'node express postgresql rest jwt auth backend',
    },
    {
      title: 'Métricas Crypto',
      category: 'Proyecto',
      path: '/projects',
      keywords: 'crypto dashboard charts filtros react api',
    },
    {
      title: 'Bot Alertas Precio',
      category: 'Proyecto',
      path: '/projects',
      keywords: 'python telegram bot alertas websocket precios',
    },
  ];

  // ─────────────────────────────────────────────
  // Búsqueda: filtra por título, categoría y keywords
  // ─────────────────────────────────────────────
  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Divide la query en palabras y busca todas
    const terms = q.split(/\s+/).filter(Boolean);

    return INDEX.filter(function (item) {
      const haystack = (item.title + ' ' + item.category + ' ' + item.keywords).toLowerCase();
      return terms.every(function (t) { return haystack.indexOf(t) !== -1; });
    }).slice(0, 8);   // máximo 8 resultados
  }

  // ─────────────────────────────────────────────
  // Icono de categoría (opcional)
  // ─────────────────────────────────────────────
  function CategoryIcon(cat) {
    const map = {
      'Página': '◉',
      'Sección': '§',
      'Idea': '◆',
      'Proyecto': '▣',
    };
    return map[cat] || '•';
  }

  // ─────────────────────────────────────────────
  // Componente Search
  // ─────────────────────────────────────────────
  function Search() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Resultados memoizados
    const results = useMemo(function () {
      return search(query);
    }, [query]);

    // Cerrar al click fuera
    useEffect(function () {
      function onClickOutside(e) {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(e.target)) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', onClickOutside);
      return function () {
        document.removeEventListener('mousedown', onClickOutside);
      };
    }, []);

    // Reset activeIndex cuando cambian resultados
    useEffect(function () {
      setActiveIndex(0);
    }, [query]);

    // ─────────────────────────────────────────
    // Navegar al resultado
    // ─────────────────────────────────────────
    function goTo(item) {
      if (!item) return;

      const navigate = window.navigate;

      // Manejar rutas tipo "/#about" (Home + anchor)
      if (item.path.indexOf('#') !== -1) {
        const parts = item.path.split('#');
        const route = parts[0] || '/';
        const anchor = parts[1];

        // Navegar a la ruta primero
        if (window.location.hash !== '#' + route) {
          navigate(route);
        }

        // Después de un pequeño delay, scroll al ancla
        setTimeout(function () {
          const el = document.getElementById(anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        navigate(item.path);
      }

      // Limpiar
      setQuery('');
      setOpen(false);
      if (inputRef.current) inputRef.current.blur();
    }

    // ─────────────────────────────────────────
    // Teclado
    // ─────────────────────────────────────────
    function onKeyDown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) setOpen(true);
        setActiveIndex(function (i) {
          return Math.min(i + 1, results.length - 1);
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(function (i) {
          return Math.max(i - 1, 0);
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (open && results[activeIndex]) {
          goTo(results[activeIndex]);
        } else if (results.length > 0) {
          goTo(results[0]);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
        if (inputRef.current) inputRef.current.blur();
      }
    }

    const showDropdown = open && query.trim().length > 0;

    // ─────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────
    return React.createElement(
      'div',
      { className: 'search-wrapper', ref: wrapperRef },

      // Input
      React.createElement(
        'div',
        { className: 'search-input-wrap' },
        React.createElement(
          'svg',
          {
            className: 'search-icon',
            xmlns: 'http://www.w3.org/2000/svg',
            width: 16,
            height: 16,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            'aria-hidden': 'true',
          },
          React.createElement('circle', { cx: 11, cy: 11, r: 7 }),
          React.createElement('line', { x1: 21, y1: 21, x2: 16.65, y2: 16.65 })
        ),
        React.createElement('input', {
          ref: inputRef,
          type: 'text',
          placeholder: 'Buscar…',
          value: query,
          onChange: function (e) {
            setQuery(e.target.value);
            setOpen(true);
          },
          onFocus: function () { setOpen(true); },
          onKeyDown: onKeyDown,
          'aria-label': 'Buscar',
          'aria-expanded': showDropdown,
          'aria-autocomplete': 'list',
        }),
        query
          ? React.createElement(
              'button',
              {
                className: 'search-clear',
                type: 'button',
                onClick: function () {
                  setQuery('');
                  if (inputRef.current) inputRef.current.focus();
                },
                'aria-label': 'Limpiar búsqueda',
              },
              '×'
            )
          : null
      ),

      // Dropdown
      showDropdown
        ? React.createElement(
            'div',
            { className: 'search-dropdown', role: 'listbox' },
            results.length === 0
              ? React.createElement(
                  'div',
                  { className: 'search-empty' },
                  'Sin resultados para "', query, '"'
                )
              : results.map(function (item, i) {
                  return React.createElement(
                    'button',
                    {
                      key: i,
                      type: 'button',
                      role: 'option',
                      'aria-selected': i === activeIndex,
                      className: 'search-result' + (i === activeIndex ? ' active' : ''),
                      onMouseEnter: function () { setActiveIndex(i); },
                      onClick: function () { goTo(item); },
                    },
                    React.createElement(
                      'span',
                      { className: 'search-result-icon' },
                      CategoryIcon(item.category)
                    ),
                    React.createElement(
                      'span',
                      { className: 'search-result-body' },
                      React.createElement(
                        'span',
                        { className: 'search-result-title' },
                        item.title
                      ),
                      React.createElement(
                        'span',
                        { className: 'search-result-meta' },
                        item.category
                      )
                    ),
                    React.createElement(
                      'span',
                      { className: 'search-result-arrow' },
                      '↵'
                    )
                  );
                })
          )
        : null
    );
  }

  window.Search = Search;
})();