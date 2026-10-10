// src/component/TopographicCanvas.js
(function () {
  const { useEffect, useRef } = React;

  // Lee los colores actuales desde las variables CSS
  function getThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      backgroundColor: (styles.getPropertyValue('--canvas-bg') || '').trim() || '#050a06',
      lineColor:       (styles.getPropertyValue('--canvas-line') || '').trim() || 'rgba(74, 222, 128, 0.32)',
    };
  }

  function TopographicCanvas(props) {
    const canvasRef = useRef(null);
    const optionsRef = useRef(props);
    const cleanupRef = useRef(null);
    optionsRef.current = props;

    // 1) Inicializar motor (una sola vez)
    useEffect(function () {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (typeof window.initTopographicAnimation !== 'function') {
        console.error('[TopographicCanvas] initTopographicAnimation no disponible.');
        return;
      }

      const colors = getThemeColors();
      const merged = Object.assign({}, optionsRef.current, colors);

      cleanupRef.current = window.initTopographicAnimation(canvas, merged);

      return function () {
        if (cleanupRef.current && typeof cleanupRef.current === 'function') {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    }, []);

    // 2) Reaccionar al cambio de tema sin recrear motor
    useEffect(function () {
      if (!window.theme || typeof window.theme.subscribe !== 'function') return;

      const unsubscribe = window.theme.subscribe(function () {
        const colors = getThemeColors();
        const cleanup = cleanupRef.current;
        if (cleanup && typeof cleanup.setColors === 'function') {
          cleanup.setColors(colors);
        }
      });

      return unsubscribe;
    }, []);

    return React.createElement('canvas', {
      ref: canvasRef,
      className: 'fondRef',
    });
  }

  window.TopographicCanvas = TopographicCanvas;
})();