// router.js  →  URLs tipo index.html#/laboratory
(function () {
  const { useState, useEffect } = React;

  // ─────────────────────────────────────────────
  // Lee la ruta actual desde el hash
  // ""  → "/"
  // "#/" → "/"
  // "#/laboratory" → "/laboratory"
  // ─────────────────────────────────────────────
  function readPath() {
    const raw = window.location.hash ? window.location.hash.slice(1) : '/';
    return raw || '/';
  }

  // ─────────────────────────────────────────────
  // Navegación: cambia el hash de la URL
  // ─────────────────────────────────────────────
  function navigate(to) {
    if (window.location.hash === '#' + to) return;
    window.location.hash = to;
  }

  // ─────────────────────────────────────────────
  // Hook: devuelve el path actual y re-renderiza
  // cuando cambia el hash
  // ─────────────────────────────────────────────
  function usePathRoute() {
    const [path, setPath] = useState(readPath());

    useEffect(() => {
      const onHash = () => setPath(readPath());
      window.addEventListener('hashchange', onHash);

      // Normaliza al arrancar: si no hay hash, pone "#/"
      if (!window.location.hash) {
        window.location.replace('#/');
      }

      return () => window.removeEventListener('hashchange', onHash);
    }, []);

    return path;
  }

  // ─────────────────────────────────────────────
  // <Link to="/laboratory">Ver Lab</Link>
  // Se renderiza como <a href="#/laboratory">
  // e intercepta el click para no recargar
  // ─────────────────────────────────────────────
  function Link(props) {
    const { to, className, children, ...rest } = props;

    const onClick = (e) => {
      // Respetar Ctrl+Click / Cmd+Click / middle-click
      // para permitir abrir en pestaña nueva
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    };

    return React.createElement(
      'a',
      { href: '#' + to, className, onClick, ...rest },
      children
    );
  }

  // Exponer al global (necesario porque no usamos módulos)
  window.navigate = navigate;
  window.usePathRoute = usePathRoute;
  window.Link = Link;
})();