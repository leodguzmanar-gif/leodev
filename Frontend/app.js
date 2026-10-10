// app.js
(function () {
  const { useEffect } = React;
  const TopographicCanvas = window.TopographicCanvas;
  const Navbar = window.Navbar;
  const Footer = window.Footer;
  const usePathRoute = window.usePathRoute;

  const ROUTES = {
    '/':           window.Home,
    '/laboratory': window.Laboratory,
    '/projects':   window.Projects,
    '/contact':    window.Contact,
  };

  function App() {
    const path = usePathRoute();
    const Page = ROUTES[path] || window.Home;

    useEffect(function () {
      window.scrollTo(0, 0);
    }, [path]);

    return React.createElement(
      React.Fragment,
      null,

      // Canvas de fondo
      React.createElement(TopographicCanvas, {
        lineWidth: 3,
        gridStep: 12,
        subSamples: 2,
        levels: 6,
        noiseScale: 0.004,
        speed: 0.001,
        mouseRadius: 200,
        mouseInfluence: 0.5,
      }),

      // Navbar
      React.createElement(
        'div',
        { className: 'navbar-wrapper' },
        React.createElement(Navbar, null)
      ),

      // Contenido de la página actual
      React.createElement(
        'main',
        { className: 'page' },
        React.createElement(Page, null)
      ),

      // Footer global — aparece en TODAS las páginas
      React.createElement(Footer, null)
    );
  }

  ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
  );
})();