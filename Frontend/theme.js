// theme.js
(function () {
  const STORAGE_KEY = 'theme';

  // ─────────────────────────────────────────────
  // Tema inicial
  // ─────────────────────────────────────────────
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}

    if (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  // ─────────────────────────────────────────────
  // Aplicar tema al <html>
  // ─────────────────────────────────────────────
  function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add('theme-' + theme);
    root.setAttribute('data-theme', theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        'content',
        theme === 'light' ? '#f5fbf6' : '#050a06'
      );
    }
  }

  // ─────────────────────────────────────────────
  // Estado + suscriptores
  // ─────────────────────────────────────────────
  let currentTheme = getInitialTheme();
  const listeners = new Set();

  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    currentTheme = theme;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    applyTheme(theme);
    listeners.forEach(function (fn) { fn(theme); });
  }

  function toggleTheme() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  function getTheme() {
    return currentTheme;
  }

  function subscribe(fn) {
    listeners.add(fn);
    return function () { listeners.delete(fn); };
  }

  applyTheme(currentTheme);

  // Escuchar cambios del sistema operativo
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = function (e) {
      let hasSaved = false;
      try { hasSaved = !!localStorage.getItem(STORAGE_KEY); } catch (err) {}
      if (!hasSaved) setTheme(e.matches ? 'light' : 'dark');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // API pública
  window.theme = {
    get: getTheme,
    set: setTheme,
    toggle: toggleTheme,
    subscribe: subscribe,
  };

  // Hook React
  window.useTheme = function () {
    const { useState, useEffect } = React;
    const [theme, setThemeState] = useState(window.theme.get());

    useEffect(function () {
      return window.theme.subscribe(setThemeState);
    }, []);

    return [theme, window.theme.toggle];
  };
})();